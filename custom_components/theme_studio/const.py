"""Konstanten für die Theme-Studio-Integration."""
from __future__ import annotations

from typing import Final

DOMAIN: Final = "theme_studio"

THEMES_DIR: Final = "themes"
BACKUPS_DIR: Final = ".backups"

WS_LIST_THEMES: Final = "theme_studio/list_themes"
WS_GET_THEME: Final = "theme_studio/get_theme"
WS_SAVE_THEME: Final = "theme_studio/save_theme"
WS_LIST_HACS_REPOS: Final = "theme_studio/list_hacs_repos"

# Pfad zur HACS-Storage-Datei (relativ zu hass.config.path()).
HACS_STORAGE_PATH: Final = ".storage/hacs.repositories"

# Panel-Registrierung
PANEL_URL_PATH: Final = "theme-studio"
PANEL_TITLE: Final = "Theme Studio"
PANEL_ICON: Final = "mdi:palette"
PANEL_CUSTOM_NAME: Final = "theme-studio-panel"

# Static-Hosting des gebauten Frontends
STATIC_URL_PATH: Final = "/theme_studio_static"
STATIC_JS_FILE: Final = "theme-studio-panel.js"
