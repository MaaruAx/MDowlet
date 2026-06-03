"""
MDowlet — main.py
Original MDLD API class ported from pywebview → PySide6 + QWebChannel.
All business logic is unchanged. Only the window/dialog layer is replaced.
"""
from __future__ import annotations
import glob, json, logging, os, platform, queue as pyqueue, re, shutil, subprocess
import sys, threading, traceback, uuid, webbrowser
from pathlib import Path
from urllib.parse import urlparse

import os as _os_early
_os_early.environ["QTWEBENGINE_CHROMIUM_FLAGS"] = "--disable-gpu --disable-gpu-compositing"
from platformdirs import user_data_dir, user_config_dir
from PySide6.QtCore import QFile, QObject, QTimer, Signal, Slot
from PySide6.QtGui import QIcon
from PySide6.QtWebChannel import QWebChannel
from PySide6.QtWebEngineCore import QWebEngineSettings, QWebEnginePage
from PySide6.QtWebEngineWidgets import QWebEngineView
from PySide6.QtWidgets import QApplication, QFileDialog, QMainWindow, QMessageBox

# ── Logging setup ─────────────────────────────────────────────────────────────
def _setup_logging() -> Path:
    data_dir = Path(user_data_dir("MDowlet", "MDowlet"))
    data_dir.mkdir(parents=True, exist_ok=True)
    log_file = data_dir / "mdowlet.log"
    fmt = logging.Formatter("%(asctime)s [%(levelname)-8s] %(name)s: %(message)s",
                            datefmt="%Y-%m-%d %H:%M:%S")
    fh = logging.FileHandler(log_file, encoding="utf-8", mode="a")
    fh.setFormatter(fmt)
    sh = logging.StreamHandler(sys.stderr)
    sh.setFormatter(fmt)
    root = logging.getLogger()
    root.setLevel(logging.DEBUG)
    root.addHandler(fh)
    root.addHandler(sh)
    print(f"[MDowlet] Log → {log_file}", file=sys.stderr, flush=True)
    return log_file

LOG_FILE = _setup_logging()
log = logging.getLogger("main")

# ── Constants ─────────────────────────────────────────────────────────────────
VERSION    = "1.0.0"
SYSTEM     = platform.system()
IMAGE_EXTS = {".jpg",".jpeg",".png",".gif",".webp",".bmp",".tiff",".tif",".svg",".avif"}
VIDEO_EXTS = {".mp4",".mkv",".mov",".avi",".webm",".ts",".m4v",".flv",".wmv",".m2v",".3gp"}

UI_DIR     = Path(__file__).parent / "ui"
PREFS_PATH = Path(user_config_dir("MDowlet", "MDowlet")) / "prefs.json"

_ANSI_RE = re.compile(r'\x1b\[[0-9;]*[a-zA-Z]|\x1b\][^\x07]*\x07|\x1b[()][0-9A-Z]|\r')
def _strip_ansi(text):
    return _ANSI_RE.sub('', text or '').replace('\r\n','\n').strip()

# ── Resolve paths ─────────────────────────────────────────────────────────────
def _add_resolve_paths():
    for base in [
        os.environ.get("RESOLVE_SCRIPT_API",""),
        r"C:\ProgramData\Blackmagic Design\DaVinci Resolve\Support\Developer\Scripting",
        "/Library/Application Support/Blackmagic Design/DaVinci Resolve/Developer/Scripting",
        "/opt/resolve/Developer/Scripting",
    ]:
        if not base: continue
        m = os.path.join(base,"Modules")
        if os.path.isdir(m) and m not in sys.path: sys.path.insert(0,m)
_add_resolve_paths()

# ── ffmpeg environment (original logic preserved) ─────────────────────────────
def _build_ffmpeg_env():
    env = os.environ.copy()
    extra = [r"C:\ffmpeg\bin", r"C:\ffmpeg-full\bin",
             r"C:\Program Files\ffmpeg\bin", r"C:\Program Files (x86)\ffmpeg\bin",
             r"C:\ProgramData\chocolatey\bin"]
    local = os.environ.get("LOCALAPPDATA","")
    if local:
        for p in glob.glob(os.path.join(local,"Microsoft","WinGet","Packages",
                                        "Gyan.FFmpeg*","**","bin"), recursive=True):
            extra.append(p)
    scoop = os.environ.get("SCOOP", os.path.join(os.environ.get("USERPROFILE",""),"scoop"))
    extra.append(os.path.join(scoop,"shims"))
    valid = [p for p in extra if os.path.isdir(p)]
    env["PATH"] = os.pathsep.join(valid + [env.get("PATH","")])
    return env

FFMPEG_ENV = _build_ffmpeg_env()

def _popen_kwargs():
    kw = {}
    if SYSTEM == 'Windows':
        kw['creationflags'] = 0x08000000
        si = subprocess.STARTUPINFO()
        si.dwFlags |= subprocess.STARTF_USESHOWWINDOW
        si.wShowWindow = 0
        kw['startupinfo'] = si
    return kw

def _ff(): return shutil.which("ffmpeg",  path=FFMPEG_ENV.get("PATH")) or "ffmpeg"
def _fp(): return shutil.which("ffprobe", path=FFMPEG_ENV.get("PATH")) or "ffprobe"

# ── Prefs ─────────────────────────────────────────────────────────────────────
def _load_prefs():
    try:
        if PREFS_PATH.exists():
            return json.loads(PREFS_PATH.read_text(encoding="utf-8"))
    except Exception: pass
    return {}

def _save_prefs(data):
    try:
        PREFS_PATH.parent.mkdir(parents=True, exist_ok=True)
        PREFS_PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
    except Exception: pass

# ── JS console page ───────────────────────────────────────────────────────────
class _LoggingPage(QWebEnginePage):
    _js_log = logging.getLogger("js")
    _lvl_map = None
    def javaScriptConsoleMessage(self, level, message, line_number, source_id):
        if self._lvl_map is None:
            _LoggingPage._lvl_map = {
                QWebEnginePage.JavaScriptConsoleMessageLevel.InfoMessageLevel:    logging.INFO,
                QWebEnginePage.JavaScriptConsoleMessageLevel.WarningMessageLevel: logging.WARNING,
                QWebEnginePage.JavaScriptConsoleMessageLevel.ErrorMessageLevel:   logging.ERROR,
            }
        lvl = self._lvl_map.get(level, logging.DEBUG)
        src = (source_id or "app.js").replace("\\","/").split("/")[-1]
        self._js_log.log(lvl, "[%s:%s] %s", src, line_number, message)

# ── Settings helper ───────────────────────────────────────────────────────────
def _set_attr(settings, name: str, value: bool) -> None:
    try:
        attr = getattr(QWebEngineSettings.WebAttribute, name)
        settings.setAttribute(attr, value)
        log.debug("WebAttr %-44s = %s", name, value)
    except AttributeError:
        log.debug("WebAttr %-44s   skipped", name)

# ── safe_slot decorator ───────────────────────────────────────────────────────
import functools
def safe_slot(func):
    @functools.wraps(func)
    def wrapper(self, *args, **kwargs):
        try:
            return func(self, *args, **kwargs)
        except Exception as exc:
            log.error("Slot '%s' raised:\n%s", func.__name__, traceback.format_exc())
            return json.dumps({"ok": False, "error": str(exc)})
    return wrapper

# ═════════════════════════════════════════════════════════════════════════════
# API — original MDLD logic, pywebview calls replaced with QObject/Signal/Slot
# ═════════════════════════════════════════════════════════════════════════════
class API(QObject):
    # Python → JS event bus (replaces window.evaluate_js)
    onEvent = Signal(str)

    def __init__(self):
        super().__init__()
        self.queue        = {}
        self.queue_order  = []
        self._lock        = threading.Lock()
        self._processing  = False
        self._window      = None   # set to QMainWindow after creation
        self._resolve_cache   = {"ok": False}
        self._resolve_lock    = threading.Lock()
        self._resolve_updating = False
        self._prefs       = _load_prefs()
        self.output_dir   = self._prefs.get("output_dir", str(Path.home()/"Downloads"/"MDowlet"))
        self.re_out_dir   = self._prefs.get("re_out_dir", self.output_dir)

        # Thread-safe emit queue — drained on main thread by QTimer
        self._emit_q = pyqueue.Queue()
        self._timer  = QTimer(self)
        self._timer.timeout.connect(self._drain)
        self._timer.start(40)
        self._deps_cache = {"yt_dlp": False, "ffmpeg": False, "ffprobe": False}
        self._deps_lock  = threading.Lock()
        # Note: dep check is triggered by JS calling check_deps() on init
        log.info("API initialised (v%s, %s)", VERSION, SYSTEM)

    def set_window(self, w):
        self._window = w

    # ── Thread-safe emit ──────────────────────────────────────────────────────
    def _emit(self, event, data):
        try:
            payload = json.dumps({"event": event, "data": data}, ensure_ascii=False)
            self._emit_q.put_nowait(payload)
        except Exception:
            pass

    def _drain(self):
        while True:
            try:
                payload = self._emit_q.get_nowait()
                self.onEvent.emit(payload)
            except pyqueue.Empty:
                break

    # ── Queries ───────────────────────────────────────────────────────────────
    @safe_slot
    @Slot(result=str)
    def get_queue_json(self):
        with self._lock:
            return json.dumps([self._pub(self.queue[i]) for i in self.queue_order if i in self.queue])

    @safe_slot
    @Slot(result=str)
    def get_settings_json(self):
        p = self._prefs
        return json.dumps({
            "output_dir":    self.output_dir,
            "re_out_dir":    self.re_out_dir,
            "version":       VERSION,
            "lang":          p.get("lang","auto"),
            "theme":         p.get("theme","default"),
            "custom_theme":  p.get("custom_theme",{}),
            "dot_visible":   p.get("dot_visible",True),
            "dot_color":     p.get("dot_color","#ffffff"),
            "dot_opacity":   p.get("dot_opacity",6),
            "bg_img":        p.get("bg_img",""),
            "bg_opacity":    p.get("bg_opacity",18),
            "bg_blur":       p.get("bg_blur",0),
            "bg_zoom":       p.get("bg_zoom",100),
            "bg_pos_x":      p.get("bg_pos_x",50),
            "bg_pos_y":      p.get("bg_pos_y",50),
            "glass_blur":    p.get("glass_blur",0),
            "glass_opacity": p.get("glass_opacity",100),
            "border_radius": p.get("border_radius",8),
            "first_run":     p.get("first_run",True),
            "cookies_file":  p.get("cookies_file",""),
            "auto_updates":  p.get("auto_updates",None),
            "path_history":  p.get("path_history",[]),
            "advanced_reencode": p.get("advanced_reencode",False),
        })

    @safe_slot
    @Slot(result=str)
    def get_all_prefs_json(self):
        return json.dumps(self._prefs)

    @safe_slot
    @Slot(result=str)
    def get_path_history(self):
        return json.dumps(self._prefs.get("path_history",[]))

    # ── Prefs ─────────────────────────────────────────────────────────────────
    @safe_slot
    @Slot(str, str, result=str)
    def save_pref(self, key, value_json):
        if isinstance(value_json, str):
            v = value_json.strip()
            if not v: val = v
            else:
                try: val = json.loads(v)
                except (json.JSONDecodeError, ValueError): val = v
        else:
            val = value_json
        self._prefs[key] = val
        _save_prefs(self._prefs)
        if key == "output_dir": self.output_dir = val
        if key == "re_out_dir": self.re_out_dir = val
        return json.dumps({"ok": True})

    @safe_slot
    @Slot(str, str, result=str)
    def save_window_size(self, w, h):
        self._prefs['win_w'] = int(float(w))
        self._prefs['win_h'] = int(float(h))
        _save_prefs(self._prefs)
        return json.dumps({"ok": True})

    @safe_slot
    @Slot(str, result=str)
    def add_path_history(self, path):
        hist = self._prefs.get("path_history",[])
        if path and path not in hist:
            hist.insert(0, path)
            hist = hist[:10]
            self._prefs["path_history"] = hist
            _save_prefs(self._prefs)
        return json.dumps({"ok": True})

    # ── Deps ──────────────────────────────────────────────────────────────────
    def _async_check_deps(self):
        """Run in background thread — never blocks the Qt main thread."""
        try: import yt_dlp; ytdlp_ok = True
        except ImportError: ytdlp_ok = False
        ff_ok = fp_ok = False
        try:
            r = subprocess.run([_ff(), "-version"], capture_output=True,
                               timeout=8, env=FFMPEG_ENV, **_popen_kwargs())
            ff_ok = (r.returncode == 0)
        except Exception: pass
        try:
            r = subprocess.run([_fp(), "-version"], capture_output=True,
                               timeout=8, env=FFMPEG_ENV, **_popen_kwargs())
            fp_ok = (r.returncode == 0)
        except Exception: pass
        with self._deps_lock:
            self._deps_cache = {"yt_dlp": ytdlp_ok, "ffmpeg": ff_ok, "ffprobe": fp_ok}
        log.debug("dep_status: %s", self._deps_cache)
        self._emit("dep_status", self._deps_cache)

    @safe_slot
    @Slot(result=str)
    def check_deps(self):
        """Returns cached result instantly; background thread keeps it fresh."""
        with self._deps_lock:
            cached = dict(self._deps_cache)
        # Refresh asynchronously every time the JS asks
        threading.Thread(target=self._async_check_deps, daemon=True).start()
        return json.dumps(cached)

    @safe_slot
    @Slot(result=str)
    def check_ffmpeg_version(self):
        result = {}
        for cmd, exe in [("ffmpeg",_ff()), ("ffprobe",_fp())]:
            try:
                r = subprocess.run([exe,"-version"], stdout=subprocess.PIPE,
                                   stderr=subprocess.STDOUT, timeout=8,
                                   text=True, env=FFMPEG_ENV, **_popen_kwargs())
                first = r.stdout.splitlines()[0] if r.stdout else "sin salida"
                result[cmd] = first; result[cmd+"_ok"] = (r.returncode==0)
            except FileNotFoundError:
                result[cmd] = f"{cmd}: no encontrado"; result[cmd+"_ok"] = False
            except Exception as e:
                result[cmd] = f"{cmd}: {e}"; result[cmd+"_ok"] = False
        return json.dumps(result)

    @safe_slot
    @Slot(result=str)
    def update_ytdlp(self):
        """Install/update yt-dlp via pip in a background thread with live log feedback."""
        def _run():
            self._emit("log", {"target": "ytdlp-log", "text": "Ejecutando: pip install -U yt-dlp", "cls": "l-inf"})
            try:
                proc = subprocess.Popen(
                    [sys.executable, "-m", "pip", "install", "-U", "yt-dlp"],
                    stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
                    text=True, **_popen_kwargs()
                )
                for line in proc.stdout:
                    line = line.strip()
                    if line:
                        self._emit("log", {"target": "ytdlp-log", "text": line, "cls": "l-inf"})
                proc.wait()
                if proc.returncode == 0:
                    self._emit("log", {"target": "ytdlp-log", "text": "✓ yt-dlp instalado correctamente.", "cls": "l-ok"})
                else:
                    self._emit("log", {"target": "ytdlp-log", "text": f"Error (código {proc.returncode}).", "cls": "l-err"})
            except Exception as e:
                self._emit("log", {"target": "ytdlp-log", "text": f"Error: {e}", "cls": "l-err"})
            # Refresh dep status — this will trigger dep_status event → JS hides spinner
            threading.Thread(target=self._async_check_deps, daemon=True).start()

        threading.Thread(target=_run, daemon=True).start()
        return json.dumps({"ok": True, "output": "Instalación iniciada. Ver salida abajo..."})

    @safe_slot
    @Slot(result=str)
    def install_ffmpeg_winget(self):
        """
        Download ffmpeg static binary from BtbN GitHub releases into
        a local MDowlet/bin directory.  Runs entirely in a background
        thread — zero blocking on the Qt main thread.
        """
        if SYSTEM == "Darwin":
            return json.dumps({"ok": False, "manual": True,
                "instructions": "En macOS instala ffmpeg con Homebrew:\n\n  brew install ffmpeg\n\nhttps://brew.sh"})

        def _run():
            import urllib.request, zipfile, tarfile, tempfile, stat as _stat
            from platformdirs import user_data_dir
            bin_dir = Path(user_data_dir("MDowlet", "MDowlet")) / "bin"
            bin_dir.mkdir(parents=True, exist_ok=True)

            def _log(msg, cls="l-inf"):
                self._emit("log", {"target": "ffmpeg-log", "text": msg, "cls": cls})

            def _dl(url, dest, label=""):
                """Stream-download with progress logged every 10%."""
                req = urllib.request.Request(url, headers={"User-Agent": "MDowlet/1.0"})
                last_pct = -1
                with urllib.request.urlopen(req, timeout=60) as r, open(dest, "wb") as f:
                    total = int(r.headers.get("Content-Length", 0))
                    done  = 0
                    chunk = 65536
                    while True:
                        data = r.read(chunk)
                        if not data: break
                        f.write(data); done += len(data)
                        if total > 0:
                            pct = int(done / total * 100)
                            if pct // 10 != last_pct // 10:
                                last_pct = pct
                                mb = done / 1_048_576
                                _log(f"{label} {pct}%  ({mb:.1f} MB)")

            try:
                if SYSTEM == "Windows":
                    _log("Obteniendo información de la última versión de ffmpeg...")
                    import json as _json, urllib.request as _req
                    api_url = "https://api.github.com/repos/BtbN/FFmpeg-Builds/releases/latest"
                    gh_req  = urllib.request.Request(api_url,
                        headers={"Accept": "application/vnd.github+json", "User-Agent": "MDowlet/1.0"})
                    with urllib.request.urlopen(gh_req, timeout=15) as r:
                        release = _json.loads(r.read())
                    asset = next(
                        (a for a in release["assets"]
                         if "win64-gpl" in a["name"]
                         and "shared" not in a["name"]
                         and a["name"].endswith(".zip")),
                        None)
                    if not asset:
                        _log("No se encontró el build de ffmpeg para Windows.", "l-err"); return
                    _log(f"Descargando {asset['name']}...")
                    with tempfile.TemporaryDirectory() as tmp:
                        archive = Path(tmp) / "ffmpeg.zip"
                        _dl(asset["browser_download_url"], archive, "ffmpeg")
                        _log("Extrayendo...")
                        with zipfile.ZipFile(archive) as z:
                            z.extractall(Path(tmp))
                        exes = list(Path(tmp).rglob("ffmpeg.exe"))
                        if not exes:
                            _log("ffmpeg.exe no encontrado en el archivo.", "l-err"); return
                        src_dir = exes[0].parent
                        for name in ("ffmpeg.exe", "ffprobe.exe"):
                            src = src_dir / name
                            if src.exists():
                                import shutil as _sh
                                _sh.copy2(src, bin_dir / name)
                                _log(f"  Copiado: {name}")
                    # Add bin_dir to the process PATH so future calls find it
                    cur = FFMPEG_ENV.get("PATH", "")
                    if str(bin_dir) not in cur:
                        FFMPEG_ENV["PATH"] = str(bin_dir) + os.pathsep + cur
                        os.environ["PATH"] = FFMPEG_ENV["PATH"]
                else:  # Linux
                    _log("Descargando ffmpeg estático para Linux...")
                    url = "https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz"
                    with tempfile.TemporaryDirectory() as tmp:
                        archive = Path(tmp) / "ffmpeg.tar.xz"
                        _dl(url, archive, "ffmpeg")
                        _log("Extrayendo...")
                        with tarfile.open(archive) as t: t.extractall(Path(tmp))
                        import stat as _stat
                        for name in ("ffmpeg", "ffprobe"):
                            found = [f for f in Path(tmp).rglob(name)
                                     if f.is_file() and not f.name.endswith(".txt")]
                            if found:
                                import shutil as _sh
                                dest = bin_dir / name
                                _sh.copy2(found[0], dest)
                                dest.chmod(dest.stat().st_mode | _stat.S_IEXEC | _stat.S_IXGRP)
                                _log(f"  Copiado: {name}")
                # Verify the binary actually runs
                try:
                    r = subprocess.run([str(bin_dir / ("ffmpeg.exe" if SYSTEM=="Windows" else "ffmpeg")),
                                       "-version"], capture_output=True, timeout=8, **_popen_kwargs())
                    if r.returncode == 0:
                        _log("✓ ffmpeg instalado y verificado correctamente.", "l-ok")
                    else:
                        _log("ffmpeg descargado pero falló al ejecutarse.", "l-err")
                except Exception as ve:
                    _log(f"Advertencia al verificar: {ve}", "l-inf")
            except Exception as e:
                log.error("install_ffmpeg_winget thread: %s", e, exc_info=True)
                _log(f"Error: {e}", "l-err")
            # Refresh dep status → triggers dep_status event → JS hides spinner
            threading.Thread(target=self._async_check_deps, daemon=True).start()

        threading.Thread(target=_run, daemon=True).start()
        return json.dumps({"ok": True, "output": "Descarga iniciada. Ver progreso abajo..."})

    @safe_slot
    @Slot(result=str)
    def open_ffmpeg_web(self):
        webbrowser.open("https://ffmpeg.org/download.html")
        return json.dumps({"ok": True})

    # ── Resolve ───────────────────────────────────────────────────────────────
    @safe_slot
    @Slot(result=str)
    def check_resolve(self):
        with self._resolve_lock: cached = dict(self._resolve_cache)
        if not self._resolve_updating:
            threading.Thread(target=self._update_resolve_cache, daemon=True).start()
        return json.dumps(cached)

    def _update_resolve_cache(self):
        self._resolve_updating = True
        result = {"ok": False}
        try:
            import DaVinciResolveScript as dvr
            resolve = dvr.scriptapp("Resolve")
            if resolve:
                proj = resolve.GetProjectManager().GetCurrentProject()
                result = {"ok": True, "project": proj.GetName() if proj else None}
        except Exception: pass
        finally: self._resolve_updating = False
        with self._resolve_lock: self._resolve_cache = result
        self._emit("resolve_update", result)

    @safe_slot
    @Slot(str, result=str)
    def send_to_resolve(self, item_id):
        item = self.queue.get(item_id)
        if not item or not item.get("output_path"):
            return json.dumps({"ok": False, "error": "Archivo no disponible"})
        path = os.path.abspath(item["output_path"])
        if not os.path.exists(path):
            return json.dumps({"ok": False, "error": "Archivo no encontrado en disco"})
        try:
            import DaVinciResolveScript as dvr
            resolve = dvr.scriptapp("Resolve")
            if not resolve: return json.dumps({"ok": False, "error": "Resolve no está abierto"})
            proj = resolve.GetProjectManager().GetCurrentProject()
            if not proj: return json.dumps({"ok": False, "error": "Sin proyecto activo"})
            result = proj.GetMediaPool().ImportMedia([path])
            return json.dumps({"ok": bool(result)})
        except ImportError:
            return json.dumps({"ok": False, "error": "API de Resolve no disponible"})
        except Exception as e:
            return json.dumps({"ok": False, "error": str(e)})

    @safe_slot
    @Slot(result=str)
    def send_all_to_resolve(self):
        with self._lock:
            targets = [self.queue[i] for i in self.queue_order
                       if self.queue[i]["status"]=="done" and self.queue[i].get("output_path")]
        sent = 0
        for item in targets:
            r = json.loads(self.send_to_resolve(item["id"]))
            if r.get("ok"): sent += 1
        return json.dumps({"ok": True, "sent": sent, "total": len(targets)})

    # ── Formats ───────────────────────────────────────────────────────────────
    @safe_slot
    @Slot(str, result=str)
    def fetch_formats(self, url):
        try: import yt_dlp
        except ImportError:
            return json.dumps({"ok": False, "error": "yt-dlp no instalado"})
        try:
            opts = {"quiet": True, "no_warnings": True, "skip_download": True}
            with yt_dlp.YoutubeDL(opts) as ydl:
                info = ydl.extract_info(url, download=False)
            formats = info.get("formats") or []
            heights = sorted({int(f["height"]) for f in formats
                              if f.get("height") and f.get("vcodec","none")!="none"}, reverse=True)
            return json.dumps({"ok": True, "heights": heights,
                               "title": info.get("title",""), "thumb": info.get("thumbnail",""),
                               "duration": info.get("duration")})
        except Exception as e:
            return json.dumps({"ok": False, "error": str(e)})

    # ── Queue ─────────────────────────────────────────────────────────────────
    @safe_slot
    @Slot(str, str, result=str)
    def add_to_queue(self, url_raw, settings_json):
        urls = [u.strip() for u in (url_raw or "").splitlines() if u.strip()]
        if not urls: return json.dumps({"ok": False, "error": "URL vacía"})
        settings = json.loads(settings_json) if isinstance(settings_json, str) else settings_json
        added = []
        for url in urls:
            item_id = uuid.uuid4().hex[:8]
            item = {"id":item_id,"url":url,"title":url,"thumb":None,"status":"pending",
                    "progress":0.0,"speed":"","eta":"","output_path":None,"error":None,
                    "settings":settings,"_last_pct":-1.0,"_type":"download"}
            with self._lock:
                self.queue[item_id] = item
                self.queue_order.append(item_id)
            added.append(item_id)
        self._emit("queue_updated", self._pub_all())
        if not self._processing:
            threading.Thread(target=self._run_queue, daemon=True).start()
        return json.dumps({"ok": True, "ids": added})

    @safe_slot
    @Slot(str, str, result=str)
    def add_local_file(self, path, settings_json):
        path = path.strip().strip('"')
        if not os.path.isfile(path):
            return json.dumps({"ok": False, "error": "Archivo no encontrado: "+path})
        settings = json.loads(settings_json) if isinstance(settings_json, str) else settings_json
        settings["local_file"] = True
        item_id = uuid.uuid4().hex[:8]
        fname = os.path.basename(path)
        item = {"id":item_id,"url":path,"title":fname,"thumb":None,"status":"pending",
                "progress":0.0,"speed":"","eta":"","output_path":path,"error":None,
                "settings":settings,"_last_pct":-1.0,"_type":"reencode"}
        with self._lock:
            self.queue[item_id] = item
            self.queue_order.append(item_id)
        self._emit("queue_updated", self._pub_all())
        if not self._processing:
            threading.Thread(target=self._run_queue, daemon=True).start()
        return json.dumps({"ok": True, "ids": [item_id]})

    @safe_slot
    @Slot(str, result=str)
    def remove_item(self, item_id):
        with self._lock:
            item = self.queue.get(item_id)
            if item and item["status"] not in ("downloading","reencoding"):
                del self.queue[item_id]
                if item_id in self.queue_order: self.queue_order.remove(item_id)
        self._emit("queue_updated", self._pub_all())
        return json.dumps({"ok": True})

    @safe_slot
    @Slot(result=str)
    def clear_done(self):
        with self._lock:
            ids = [i for i in self.queue_order if self.queue[i]["status"] in ("done","error")]
            for i in ids:
                del self.queue[i]; self.queue_order.remove(i)
        self._emit("queue_updated", self._pub_all())
        return json.dumps({"ok": True})

    @safe_slot
    @Slot(str, result=str)
    def retry_item(self, item_id):
        with self._lock:
            item = self.queue.get(item_id)
            if item and item["status"] == "error":
                item["status"]="pending"; item["error"]=None
                item["progress"]=0.0; item["_last_pct"]=-1.0
                if item["settings"].get("local_file"):
                    item["output_path"] = item["url"]
        self._emit("queue_updated", self._pub_all())
        if not self._processing:
            threading.Thread(target=self._run_queue, daemon=True).start()
        return json.dumps({"ok": True})

    # ── File dialogs (all run on main thread via @Slot) ───────────────────────
    @safe_slot
    @Slot(result=str)
    def browse_output_dir(self):
        path = QFileDialog.getExistingDirectory(self._window, "Carpeta de salida", self.output_dir)
        if path:
            self.output_dir = path
            self.save_pref("output_dir", path)
            self.add_path_history(path)
            return json.dumps({"ok": True, "path": path})
        return json.dumps({"ok": False})

    @safe_slot
    @Slot(result=str)
    def browse_re_output_dir(self):
        path = QFileDialog.getExistingDirectory(self._window, "Carpeta de salida (recodificación)", self.re_out_dir)
        if path:
            self.re_out_dir = path
            self.save_pref("re_out_dir", path)
            return json.dumps({"ok": True, "path": path})
        return json.dumps({"ok": False})

    @safe_slot
    @Slot(result=str)
    def browse_cookies_file(self):
        path, _ = QFileDialog.getOpenFileName(
            self._window, "Archivo de cookies", "",
            "Cookies (*.txt);;Todos los archivos (*.*)")
        if path:
            self._prefs['cookies_file'] = path; _save_prefs(self._prefs)
            return json.dumps({"ok": True, "path": path})
        return json.dumps({"ok": False})

    @safe_slot
    @Slot(result=str)
    def browse_file_to_reencode(self):
        files, _ = QFileDialog.getOpenFileNames(
            self._window, "Seleccionar archivos", "",
            "Video y Audio (*.mp4 *.mkv *.mov *.avi *.webm *.ts *.mp3 *.m4a *.flac *.wav *.ogg);;"
            "Imágenes (*.jpg *.jpeg *.png *.gif *.webp *.bmp *.avif);;"
            "Todos los archivos (*.*)")
        if files: return json.dumps({"ok": True, "paths": files})
        return json.dumps({"ok": False})

    @safe_slot
    @Slot(str, result=str)
    def export_theme_file(self, json_content):
        path, _ = QFileDialog.getSaveFileName(
            self._window, "Guardar tema", "mdld-theme.mmtheme",
            "MdLd Theme (*.mmtheme);;JSON (*.json);;Todos (*.*)")
        if path:
            with open(path, 'w', encoding='utf-8') as f: f.write(json_content)
            return json.dumps({"ok": True, "path": path})
        return json.dumps({"ok": False, "error": "Cancelled"})

    @safe_slot
    @Slot(result=str)
    def import_theme_file(self):
        path, _ = QFileDialog.getOpenFileName(
            self._window, "Importar tema", "",
            "MdLd Theme (*.mmtheme *.json);;Todos (*.*)")
        if path:
            with open(path, 'r', encoding='utf-8') as f: content = f.read()
            return json.dumps({"ok": True, "content": content})
        return json.dumps({"ok": False})

    # ── Misc ──────────────────────────────────────────────────────────────────
    @safe_slot
    @Slot(str, result=str)
    def open_in_explorer(self, path):
        if path and os.path.exists(path):
            try:
                if SYSTEM == 'Windows':
                    subprocess.Popen(["explorer", "/select,", os.path.abspath(path)])
                elif SYSTEM == 'Darwin':
                    subprocess.Popen(["open", "-R", path])
                else:
                    subprocess.Popen(["xdg-open", os.path.dirname(path)])
            except Exception: pass
        return json.dumps({"ok": True})

    @safe_slot
    @Slot(str, str, result=str)
    def resize_window(self, w, h):
        try:
            if self._window: self._window.resize(int(float(w)), int(float(h)))
            return json.dumps({"ok": True})
        except Exception as e:
            return json.dumps({"ok": False, "error": str(e)})

    @safe_slot
    @Slot(str, str, result=str)
    def download_thumbnail(self, url, out_dir):
        try: import yt_dlp
        except ImportError:
            return json.dumps({"ok": False, "error": "yt-dlp no instalado"})
        if not out_dir: out_dir = self.output_dir
        try:
            os.makedirs(out_dir, exist_ok=True)
            opts = {"quiet":True,"no_warnings":True,"skip_download":True,
                    "writethumbnail":True,"outtmpl":os.path.join(out_dir,"%(title)s.%(ext)s")}
            with yt_dlp.YoutubeDL(opts) as ydl:
                info = ydl.extract_info(url, download=True)
            title = info.get("title","thumb")
            for ext in ["jpg","jpeg","png","webp"]:
                path = os.path.join(out_dir, f"{title}.{ext}")
                if os.path.exists(path): return json.dumps({"ok":True,"path":path})
            return json.dumps({"ok":True,"path":out_dir})
        except Exception as e:
            return json.dumps({"ok":False,"error":str(e)})

    # ── Queue runner (identical to original) ──────────────────────────────────
    def _run_queue(self):
        self._processing = True
        try:
            while True:
                with self._lock:
                    nxt = next((i for i in self.queue_order if self.queue[i]["status"]=="pending"), None)
                if nxt is None: break
                self._process(nxt)
        finally:
            self._processing = False

    def _process(self, item_id):
        item = self.queue[item_id]; s = item["settings"]
        os.makedirs(self.output_dir, exist_ok=True)
        if s.get("local_file"):
            if s.get("reencode") and item.get("output_path"):
                self._reencode(item)
            else:
                item["status"]="done"; item["progress"]=100.0; self._push(item)
            return
        suffix = Path(urlparse(item["url"]).path).suffix.lower()
        if suffix in IMAGE_EXTS: self._download_image(item)
        else: self._download_video(item)
        if item["status"] == "error": return
        if s.get("reencode") and item.get("output_path"): self._reencode(item)
        if item["status"] != "error":
            item["status"]="done"; item["progress"]=100.0; self._push(item)
        if s.get("auto_resolve") and item["status"]=="done":
            self.send_to_resolve(item_id)

    def _download_image(self, item):
        import urllib.request
        item["status"]="downloading"; self._push(item)
        try:
            fname = Path(urlparse(item["url"]).path).name or "image.jpg"
            out = os.path.join(self.output_dir, fname)
            urllib.request.urlretrieve(item["url"], out)
            item["title"]=fname; item["output_path"]=out
            item["thumb"]=item["url"]; item["progress"]=100.0
        except Exception as e: self._fail(item, str(e))

    def _download_video(self, item):
        try: import yt_dlp
        except ImportError:
            self._fail(item, "yt-dlp no instalado — ve a Ajustes"); return
        item["status"]="downloading"; item["progress"]=0.0; self._push(item)
        s = item["settings"]
        dl_format = s.get("dl_format") or "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best"
        if dl_format == "custom": dl_format = s.get("custom_format") or "best"
        if s.get("audio_only"):
            afmt = s.get("audio_format","m4a")
            dl_format = f"bestaudio[ext={afmt}]/bestaudio"
        custom_title = s.get("custom_title","").strip()
        tmpl_name = custom_title if custom_title else "%(title)s"
        out_tmpl = os.path.join(self.output_dir, f"{tmpl_name}.%(ext)s")
        final_path = [None]
        def hook(d):
            if d["status"] == "downloading":
                try: pct = float(d.get("_percent_str","0%").strip().rstrip("%"))
                except:
                    total = d.get("total_bytes") or d.get("total_bytes_estimate") or 0
                    dl = d.get("downloaded_bytes",0)
                    pct = (dl/total*100) if total > 0 else 0.0
                if abs(pct - item["_last_pct"]) >= 0.5 or pct >= 99.0:
                    item["progress"]=pct; item["speed"]=d.get("_speed_str","")
                    item["eta"]=d.get("_eta_str",""); item["_last_pct"]=pct; self._push(item)
            elif d["status"] == "finished": final_path[0] = d.get("filename")
        opts = {"format":dl_format,"outtmpl":out_tmpl,"progress_hooks":[hook],
                "quiet":True,"no_warnings":True,"merge_output_format":"mp4"}
        cookies_file = self._prefs.get('cookies_file','')
        if cookies_file and os.path.isfile(cookies_file): opts["cookiefile"] = cookies_file
        if s.get("audio_only"):
            abr = s.get("audio_bitrate","")
            if abr:
                opts["postprocessors"] = [{"key":"FFmpegExtractAudio",
                    "preferredcodec":s.get("audio_format","mp3"),
                    "preferredquality":abr.replace("k","")}]
        try:
            with yt_dlp.YoutubeDL(opts) as ydl:
                info = ydl.extract_info(item["url"], download=True)
            item["title"] = custom_title or info.get("title", item["url"])
            item["thumb"] = info.get("thumbnail")
            path = None
            if info.get("requested_downloads"): path = info["requested_downloads"][0].get("filepath")
            if not path or not os.path.exists(str(path)): path = final_path[0]
            if not path or not os.path.exists(str(path)):
                files = sorted([f for f in Path(self.output_dir).iterdir() if f.is_file()],
                               key=lambda f: f.stat().st_mtime, reverse=True)
                path = str(files[0]) if files else None
            item["output_path"] = str(path) if path else None
        except Exception as e: self._fail(item, str(e))

    def _reencode(self, item):
        s = item["settings"]; input_file = item["output_path"]
        if not input_file or not os.path.exists(input_file):
            self._fail(item, "Archivo de entrada no encontrado"); return
        out_folder = s.get("re_out_dir") or self.re_out_dir or self.output_dir
        os.makedirs(out_folder, exist_ok=True)
        out_ext = (s.get("out_ext") or "mp4").strip().lstrip(".")
        stem = Path(input_file).stem
        out_file = os.path.join(out_folder, f"{stem}_conv.{out_ext}")
        c = 1; base = out_file
        while os.path.exists(out_file):
            out_file = base.replace(f"_conv.{out_ext}", f"_conv{c}.{out_ext}"); c += 1
        item["status"]="reencoding"; item["progress"]=0.0; item["_last_pct"]=0.0; self._push(item)
        cmd = [_ff(), "-y"]
        if s.get("trim_start"): cmd += ["-ss", s["trim_start"]]
        cmd += ["-i", input_file]
        if s.get("trim_end"): cmd += ["-to", s["trim_end"]]
        in_ext = Path(input_file).suffix.lower()
        if in_ext in IMAGE_EXTS:
            res = s.get("resolution")
            if res and res not in ("","original"): cmd += ["-vf", f"scale={res}:-2"]
            v_codec = s.get("v_codec","")
            if v_codec and v_codec not in ("copy","none",""): cmd += ["-c:v", v_codec]
        else:
            v_codec = s.get("v_codec") or "copy"
            if v_codec == "none": cmd += ["-vn"]
            else:
                cmd += ["-c:v", v_codec]
                if v_codec not in ("copy","prores_ks","dnxhd"):
                    crf = s.get("crf")
                    if crf is not None: cmd += ["-crf", str(int(float(crf)))]
                    res = s.get("resolution")
                    if res and res not in ("","original"): cmd += ["-vf", f"scale={res}:-2"]
            a_codec = s.get("a_codec") or "copy"
            if a_codec == "none": cmd += ["-an"]
            else:
                cmd += ["-c:a", a_codec]
                if a_codec != "copy" and s.get("a_bitrate"): cmd += ["-b:a", s["a_bitrate"]]
        if s.get("extra_args") and s["extra_args"].strip():
            cmd += s["extra_args"].split()
        cmd.append(out_file)
        duration = self._duration(input_file)
        try:
            proc = subprocess.Popen(cmd, stderr=subprocess.PIPE, stdout=subprocess.PIPE,
                                    text=True, env=FFMPEG_ENV, **_popen_kwargs())
            for line in proc.stderr:
                m = re.search(r"time=(\d{2}):(\d{2}):([\d.]+)", line)
                if m and duration > 0:
                    t = int(m.group(1))*3600 + int(m.group(2))*60 + float(m.group(3))
                    pct = min(99.0, t/duration*100)
                    if pct - item["_last_pct"] >= 0.5:
                        item["progress"]=pct; item["_last_pct"]=pct; self._push(item)
            proc.wait()
            if proc.returncode != 0: raise RuntimeError(f"FFmpeg terminó con código {proc.returncode}")
            item["output_path"] = out_file
        except Exception as e: self._fail(item, f"Recodificación: {e}")

    def _push(self, item): self._emit("item_updated", self._pub(item))
    def _fail(self, item, error):
        item["status"]="error"; item["error"]=error; item["progress"]=0.0; self._push(item)
        log.error("Queue item %s failed: %s", item.get("id"), error)
    def _pub(self, item): return {k:v for k,v in item.items() if not k.startswith("_") and k!="settings"}
    def _pub_all(self):
        with self._lock: return [self._pub(self.queue[i]) for i in self.queue_order if i in self.queue]
    @staticmethod
    def _duration(filepath):
        try:
            r = subprocess.run([_fp(),"-v","error","-show_entries","format=duration",
                                "-of","default=noprint_wrappers=1:nokey=1",filepath],
                               stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                               timeout=15, env=FFMPEG_ENV, **_popen_kwargs())
            return float(r.stdout.strip())
        except Exception: return 0.0

# ═════════════════════════════════════════════════════════════════════════════
# Qt window + app
# ═════════════════════════════════════════════════════════════════════════════
def _install_excepthook():
    def _hook(exc_type, exc_value, exc_tb):
        tb = "".join(traceback.format_exception(exc_type, exc_value, exc_tb))
        log.critical("Unhandled exception:\n%s", tb)
        try:
            app = QApplication.instance()
            if app:
                dlg = QMessageBox(); dlg.setWindowTitle("MDowlet — Error")
                dlg.setIcon(QMessageBox.Icon.Critical)
                dlg.setText(f"<b>Error no manejado.</b><br>Log: <code>{LOG_FILE}</code>")
                dlg.setDetailedText(tb); dlg.exec()
        except Exception: pass
        sys.__excepthook__(exc_type, exc_value, exc_tb)
    sys.excepthook = _hook

def _ensure_qwebchannel_js():
    dest = UI_DIR / "qwebchannel.js"
    if not dest.exists():
        f = QFile(":/qtwebchannel/qwebchannel.js")
        if f.open(QFile.OpenModeFlag.ReadOnly):
            dest.write_bytes(bytes(f.readAll())); f.close()
            log.debug("qwebchannel.js extracted to %s", dest)
        else:
            log.error("Failed to extract qwebchannel.js")

class MainWindow(QMainWindow):
    def __init__(self, prefs, api: API):
        super().__init__()
        self._prefs = prefs; self._api = api
        self.setWindowTitle("MDowlet")
        self.setMinimumSize(340, 500)
        w = prefs.get('win_w', 1140); h = prefs.get('win_h', 720)
        self.resize(w, h)
        log.debug("Window size: %dx%d", w, h)

        self._view = QWebEngineView(self)
        self._view.setPage(_LoggingPage(self._view))

        s = self._view.page().settings()
        _set_attr(s, "LocalContentCanAccessLocalUrls", True)
        _set_attr(s, "LocalContentCanAccessRemoteUrls", True)
        _set_attr(s, "JavascriptCanAccessClipboard", True)

        self._channel = QWebChannel(self)
        self._channel.registerObject("api", api)
        self._view.page().setWebChannel(self._channel)

        idx = UI_DIR / "ui.html"
        if not idx.exists(): raise FileNotFoundError(f"UI not found: {idx}")
        log.debug("Loading UI from: %s", idx)
        from PySide6.QtCore import QUrl
        self._view.load(QUrl.fromLocalFile(str(idx)))
        self.setCentralWidget(self._view)
        api.set_window(self)

        icon = UI_DIR / "icon.png"
        if icon.exists(): self.setWindowIcon(QIcon(str(icon)))

    def closeEvent(self, event):
        self._prefs['win_w'] = self.width(); self._prefs['win_h'] = self.height()
        _save_prefs(self._prefs); event.accept()

def main():
    _install_excepthook()
    # Disable GPU compositing — reduces rendering stutter on many Windows setups
    os.environ.setdefault("QTWEBENGINE_CHROMIUM_FLAGS",
                          "--disable-gpu --disable-gpu-compositing")
    log.info("═══ MDowlet starting ═══")
    log.info("Python %s | %s", sys.version.split()[0], SYSTEM)
    try:
        app = QApplication(sys.argv)
        app.setApplicationName("MDowlet"); app.setApplicationVersion(VERSION)
        _ensure_qwebchannel_js()
        api    = API()
        prefs  = _load_prefs()
        window = MainWindow(prefs, api)
        window.show()
        log.info("Event loop starting.")
        sys.exit(app.exec())
    except Exception:
        log.critical("Fatal:\n%s", traceback.format_exc()); raise

if __name__ == "__main__":
    main()
