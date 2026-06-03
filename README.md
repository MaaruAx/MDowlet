# MDowlet

Descargador y recodificador de video para editores de video.  
Integración con DaVinci Resolve, historial persistente, presets, y gestión de dependencias sin bundling.

---

## Requisitos del sistema

- Python 3.10+
- yt-dlp y ffmpeg (MDowlet puede instalarlos automáticamente en el primer uso)

## Instalación del entorno de desarrollo

```bash
git clone https://github.com/MaaruAx/MDowlet
cd MDowlet
pip install -r requirements.txt
python main.py
```

## Dependencias externas

MDowlet **no bundlea** yt-dlp ni ffmpeg.  
En el primer inicio, el asistente de configuración ofrece instalarlos automáticamente desde sus repositorios oficiales.  
Desde **Ajustes → Dependencias** se pueden actualizar con un botón.

| Herramienta | Fuente de descarga automática |
|---|---|
| yt-dlp | GitHub Releases (yt-dlp/yt-dlp) |
| ffmpeg (Windows) | BtbN GitHub Releases |
| ffmpeg (Linux) | johnvansickle.com (static build) |
| ffmpeg (macOS) | Homebrew (`brew install ffmpeg`) |

---

## Build

### Windows

Requiere Inno Setup 6 instalado.

```bash
pip install pyinstaller
python build/build_win.py
# → dist/installer/MDowlet_Setup_1.0.0.exe
```

### Linux

Requiere `linuxdeploy` en `build/` o en PATH.

```bash
pip install pyinstaller
python build/build_linux.py
# → dist/MDowlet-x86_64.AppImage
```

### macOS

```bash
pip install pyinstaller
brew install create-dmg   # opcional, para el .dmg
python build/build_mac.py
# → dist/MDowlet-1.0.0.dmg
```

Para firmar con un Developer ID real:
```bash
MDOWLET_IDENTITY="Developer ID Application: Tu Nombre (TEAMID)" python build/build_mac.py
```

Sin firma, los usuarios deben hacer right-click → Abrir la primera vez.

---

## Arquitectura

```
MDowlet/
├── core/
│   ├── prefs.py       # config con platformdirs (JSON)
│   ├── deps.py        # detección e instalación de yt-dlp/ffmpeg
│   ├── queue.py       # cola en memoria
│   ├── library.py     # historial SQLite
│   ├── downloader.py  # wrapper yt-dlp (subprocess)
│   ├── encoder.py     # wrapper ffmpeg (subprocess)
│   ├── resolve.py     # integración DaVinci Resolve
│   └── presets.py     # presets guardables
├── bridge.py          # QWebChannel — puente JS ↔ Python
├── main.py            # arranque PySide6
├── ui/
│   ├── index.html
│   ├── style.css
│   └── app.js
└── build/             # scripts de empaquetado por plataforma
```

## Paths de datos

| Plataforma | Config | Datos |
|---|---|---|
| Windows | `%APPDATA%\MDowlet\prefs.json` | `%APPDATA%\MDowlet\` |
| macOS | `~/Library/Preferences/MDowlet/prefs.json` | `~/Library/Application Support/MDowlet/` |
| Linux | `~/.config/MDowlet/prefs.json` | `~/.local/share/MDowlet/` |

Los binarios de yt-dlp/ffmpeg instalados por MDowlet van en `<data>/bin/`.  
La base de datos de historial va en `<data>/library.db`.
