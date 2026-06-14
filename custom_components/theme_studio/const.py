"""Konstanten für die Theme-Studio-Integration."""
from __future__ import annotations

from typing import Final

DOMAIN: Final = "theme_studio"

THEMES_DIR: Final = "themes"
BACKUPS_DIR: Final = ".backups"
# Sidecar-Registry: hält pro abgeleitetem Theme {source, created}. Nur hier
# verzeichnete Top-Level-Themes gelten als echte Forks und sind löschbar.
# Theme-YAMLs bleiben dadurch unangetastet sauber.
REGISTRY_FILE: Final = ".theme_studio.json"

WS_LIST_THEMES: Final = "theme_studio/list_themes"
WS_GET_THEME: Final = "theme_studio/get_theme"
WS_SAVE_THEME: Final = "theme_studio/save_theme"
WS_FORK_THEME: Final = "theme_studio/fork_theme"
WS_DELETE_THEME: Final = "theme_studio/delete_theme"
WS_GET_SNAPSHOT: Final = "theme_studio/get_snapshot"
WS_LIST_WWW_IMAGES: Final = "theme_studio/list_www_images"
WS_LIST_HACS_REPOS: Final = "theme_studio/list_hacs_repos"
WS_LIST_MODULES: Final = "theme_studio/list_modules"
WS_GET_MODULE: Final = "theme_studio/get_module"
WS_SAVE_MODULE: Final = "theme_studio/save_module"

# www/-Verzeichnis (von HA unter /local/ serviert) für den HG-Bild-Picker.
WWW_DIR: Final = "www"
WWW_IMAGE_EXTS: Final = frozenset(
    {".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".avif"}
)
WWW_IMAGE_LIMIT: Final = 500

# Pfad zur HACS-Storage-Datei (relativ zu hass.config.path()).
HACS_STORAGE_PATH: Final = ".storage/hacs.repositories"

# Bubble-Card-Module-Verzeichnis (relativ zu hass.config.path()).
MODULES_DIR: Final = "bubble_card/modules"
MODULES_BACKUPS_DIR: Final = "bubble_card/.backups"

# Panel-Registrierung
PANEL_URL_PATH: Final = "theme-studio"
PANEL_TITLE: Final = "Theme Studio"
PANEL_ICON: Final = "mdi:palette"
PANEL_CUSTOM_NAME: Final = "theme-studio-panel"

# Static-Hosting des gebauten Frontends
STATIC_URL_PATH: Final = "/theme_studio_static"
STATIC_JS_FILE: Final = "theme-studio-panel.js"
