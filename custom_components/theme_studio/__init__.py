"""HA Theme Studio integration."""
from __future__ import annotations

from homeassistant.core import HomeAssistant
from homeassistant.helpers.typing import ConfigType

from .const import DOMAIN  # noqa: F401 — re-exportiert für eventuelle YAML-Configs
from .websocket_api import async_register_websocket_api


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Set up Theme Studio: registriert WebSocket-Commands.

    v0.1 Schritt 2 — Backend-Integration. Frontend-Panel-Registrierung
    folgt in einem späteren ROADMAP-Schritt.
    """
    async_register_websocket_api(hass)
    return True
