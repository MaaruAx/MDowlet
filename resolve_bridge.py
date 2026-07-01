"""
resolve_bridge.py — Lógica de conexión con DaVinci Resolve (extraída de main.py).

Este módulo NO está conectado a la interfaz actual de MDowlet (el indicador de
conexión y los botones "Enviar a Resolve" fueron retirados de la UI). Se deja
aquí toda la matemática/lógica intacta para poder re-conectarla fácilmente en
el futuro si se decide reintroducir la integración en la interfaz.

Uso esperado desde main.py:

    import resolve_bridge

    resolve_bridge.add_resolve_script_paths()   # al iniciar la app

    status = resolve_bridge.check_resolve_connection()
    # -> {"ok": True, "project": "Mi Proyecto"} o {"ok": False}

    result = resolve_bridge.send_path_to_resolve("/ruta/al/archivo.mp4")
    # -> {"ok": True} o {"ok": False, "error": "..."}
"""
from __future__ import annotations
import os
import sys


def add_resolve_script_paths() -> None:
    """Agrega las rutas del Scripting API de DaVinci Resolve a sys.path.

    Debe llamarse una sola vez, idealmente al arrancar la aplicación, antes
    de cualquier intento de `import DaVinciResolveScript`.
    """
    for base in [
        os.environ.get("RESOLVE_SCRIPT_API", ""),
        r"C:\ProgramData\Blackmagic Design\DaVinci Resolve\Support\Developer\Scripting",
        "/Library/Application Support/Blackmagic Design/DaVinci Resolve/Developer/Scripting",
        "/opt/resolve/Developer/Scripting",
    ]:
        if not base:
            continue
        m = os.path.join(base, "Modules")
        if os.path.isdir(m) and m not in sys.path:
            sys.path.insert(0, m)


def check_resolve_connection() -> dict:
    """Intenta conectar con una instancia abierta de DaVinci Resolve.

    Devuelve {"ok": True, "project": <nombre o None>} si hay conexión,
    o {"ok": False} si Resolve no está abierto / la API no está disponible.
    """
    try:
        import DaVinciResolveScript as dvr
        resolve = dvr.scriptapp("Resolve")
        if resolve:
            proj = resolve.GetProjectManager().GetCurrentProject()
            return {"ok": True, "project": proj.GetName() if proj else None}
    except Exception:
        pass
    return {"ok": False}


def send_path_to_resolve(path: str) -> dict:
    """Importa un archivo al Media Pool del proyecto activo en Resolve.

    Devuelve {"ok": True} en éxito, o {"ok": False, "error": "..."} si algo
    falla (Resolve cerrado, sin proyecto activo, API no disponible, etc).
    """
    path = os.path.abspath(path)
    if not os.path.exists(path):
        return {"ok": False, "error": "Archivo no encontrado en disco"}
    try:
        import DaVinciResolveScript as dvr
        resolve = dvr.scriptapp("Resolve")
        if not resolve:
            return {"ok": False, "error": "Resolve no está abierto"}
        proj = resolve.GetProjectManager().GetCurrentProject()
        if not proj:
            return {"ok": False, "error": "Sin proyecto activo"}
        result = proj.GetMediaPool().ImportMedia([path])
        return {"ok": bool(result)}
    except ImportError:
        return {"ok": False, "error": "API de Resolve no disponible"}
    except Exception as e:
        return {"ok": False, "error": str(e)}


def send_many_to_resolve(paths: list[str]) -> dict:
    """Envía varias rutas a Resolve de una vez. Devuelve un resumen.

    {"ok": True, "sent": N, "total": M}
    """
    sent = 0
    for p in paths:
        r = send_path_to_resolve(p)
        if r.get("ok"):
            sent += 1
    return {"ok": True, "sent": sent, "total": len(paths)}
