"""
cookies_manager.py — Manejo del archivo de cookies para yt-dlp (extraído de main.py).

Este módulo NO está conectado a la interfaz actual de MDowlet (el indicador
de cookies y el selector de archivo fueron retirados de la UI). Se deja aquí
toda la lógica intacta para poder re-conectarla fácilmente en el futuro si se
decide reintroducir la opción en la interfaz.

Uso esperado desde main.py:

    import cookies_manager

    # Diálogo de selección (requiere una ventana padre Qt)
    result = cookies_manager.pick_cookies_file(self._window)
    # -> {"ok": True, "path": "..."} o {"ok": False}

    # Al construir las opciones de descarga de yt-dlp:
    cookies_manager.apply_cookies_to_opts(opts, self._prefs)
"""
from __future__ import annotations
import os

from PySide6.QtWidgets import QFileDialog


def pick_cookies_file(parent_window) -> dict:
    """Abre un diálogo para elegir un archivo de cookies (.txt, formato Netscape).

    No persiste nada por sí mismo: quien llame debe guardar `path` en
    prefs (clave 'cookies_file') si quiere que sobreviva entre sesiones.
    """
    path, _ = QFileDialog.getOpenFileName(
        parent_window, "Archivo de cookies", "",
        "Cookies (*.txt);;Todos los archivos (*.*)")
    if path:
        return {"ok": True, "path": path}
    return {"ok": False}


def get_cookies_file(prefs: dict) -> str:
    """Devuelve la ruta del archivo de cookies guardado en prefs, si es válida."""
    cookies_file = prefs.get("cookies_file", "")
    if cookies_file and os.path.isfile(cookies_file):
        return cookies_file
    return ""


def apply_cookies_to_opts(opts: dict, prefs: dict) -> dict:
    """Si hay un archivo de cookies configurado y válido, lo agrega a las
    opciones de yt-dlp bajo la clave 'cookiefile'. Modifica `opts` in-place
    y también lo devuelve por conveniencia.
    """
    cookies_file = get_cookies_file(prefs)
    if cookies_file:
        opts["cookiefile"] = cookies_file
    return opts
