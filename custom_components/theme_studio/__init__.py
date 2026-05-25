"""HA Theme Studio integration."""
from __future__ import annotations

import logging
from pathlib import Path

from homeassistant.components.frontend import async_register_built_in_panel
from homeassistant.components.http import StaticPathConfig
from homeassistant.core import HomeAssistant
from homeassistant.helpers.typing import ConfigType

from .const import (
    DOMAIN,  # noqa: F401 — re-exportiert
    PANEL_CUSTOM_NAME,
    PANEL_ICON,
    PANEL_TITLE,
    PANEL_URL_PATH,
    STATIC_JS_FILE,
    STATIC_URL_PATH,
)
from .websocket_api import async_register_websocket_api

_LOGGER = logging.getLogger(__name__)

# Repo-Layout: <root>/custom_components/theme_studio/ + <root>/frontend/dist/.
# Beim Deploy auf den HA-Host muss das ganze Repo (oder mindestens diese
# beiden Pfade) erhalten bleiben, sonst findet das Static-Hosting nichts.
_DIST_DIR = Path(__file__).resolve().parent.parent.parent / "frontend" / "dist"


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Set up Theme Studio: WS-Commands + Custom-Panel."""
    async_register_websocket_api(hass)

    if not _DIST_DIR.exists():
        _LOGGER.warning(
            "Theme-Studio: Frontend-Build (%s) fehlt. "
            "Bitte im frontend/-Verzeichnis 'npm install && npm run build' "
            "ausführen. Panel wird nicht registriert.",
            _DIST_DIR,
        )
        return True

    await hass.http.async_register_static_paths(
        [StaticPathConfig(STATIC_URL_PATH, str(_DIST_DIR), cache_headers=False)]
    )

    async_register_built_in_panel(
        hass,
        component_name="custom",
        sidebar_title=PANEL_TITLE,
        sidebar_icon=PANEL_ICON,
        frontend_url_path=PANEL_URL_PATH,
        config={
            "_panel_custom": {
                "name": PANEL_CUSTOM_NAME,
                "embed_iframe": False,
                "trust_external": False,
                "module_url": f"{STATIC_URL_PATH}/{STATIC_JS_FILE}",
            },
        },
        require_admin=True,
    )

    _LOGGER.info("Theme Studio panel registered at /%s", PANEL_URL_PATH)
    return True
