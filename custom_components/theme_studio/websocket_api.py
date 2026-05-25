"""WebSocket-Commands für Theme Studio.

v0.1 Schritt 2: `list_themes`, `get_theme`, `save_theme`.

- API arbeitet pro Theme-Name (`file` + `theme_name`); default-Layout 1:1.
- Vor jedem Schreibvorgang wird ein Timestamp-Backup unter
  `themes/.backups/<file>.<YYYYMMDD-HHMMSS>.yaml` angelegt (D5).
- Nach erfolgreichem Save wird `frontend.reload_themes` gefeuert.
- Alle Commands sind admin-only.
"""
from __future__ import annotations

import logging
import os
import re
import shutil
from datetime import datetime
from pathlib import Path
from typing import Any

import voluptuous as vol
import yaml

from homeassistant.components import websocket_api
from homeassistant.components.websocket_api import ActiveConnection
from homeassistant.core import HomeAssistant, callback

from .const import (
    BACKUPS_DIR,
    THEMES_DIR,
    WS_GET_THEME,
    WS_LIST_THEMES,
    WS_SAVE_THEME,
)

_LOGGER = logging.getLogger(__name__)

# Filename: nur ASCII, Bindestrich/Unterstrich, .yaml-Endung. Kein "/", kein "..".
_FILENAME_RE = re.compile(r"^[A-Za-z0-9_\-]+\.yaml$")


def _validate_filename(name: str) -> str:
    if not isinstance(name, str) or not _FILENAME_RE.match(name):
        raise vol.Invalid(f"invalid filename: {name!r}")
    return name


def _themes_root(hass: HomeAssistant) -> Path:
    return Path(hass.config.path(THEMES_DIR))


def _safe_join(root: Path, filename: str) -> Path:
    """Join root + filename, verifiziert dass das Resultat innerhalb von root bleibt."""
    root_resolved = root.resolve()
    candidate = (root / filename).resolve()
    if candidate != root_resolved and root_resolved not in candidate.parents:
        raise ValueError(f"path escape: {filename!r}")
    return candidate


def _scan_themes(root: Path) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    """Walk themes-dir, liefert (themes, errors). Backups-Dir wird übersprungen."""
    found: list[dict[str, Any]] = []
    errors: list[dict[str, Any]] = []
    if not root.exists():
        return found, errors

    for path in sorted(root.rglob("*.yaml")):
        try:
            rel = path.relative_to(root)
        except ValueError:
            continue
        if rel.parts and rel.parts[0] == BACKUPS_DIR:
            continue

        try:
            with path.open("r", encoding="utf-8") as fh:
                data = yaml.safe_load(fh) or {}
        except (OSError, yaml.YAMLError) as exc:
            errors.append({"file": str(rel), "error": str(exc)})
            continue

        if not isinstance(data, dict):
            errors.append({"file": str(rel), "error": "top-level is not a mapping"})
            continue

        for theme_name, theme_data in data.items():
            if not isinstance(theme_data, dict):
                continue
            found.append(
                {
                    "file": str(rel),
                    "theme_name": theme_name,
                    "variable_count": len(theme_data),
                }
            )

    return found, errors


def _load_file(path: Path) -> dict[str, Any]:
    if not path.exists():
        return {}
    with path.open("r", encoding="utf-8") as fh:
        data = yaml.safe_load(fh) or {}
    if not isinstance(data, dict):
        raise ValueError(f"top-level of {path.name} is not a mapping")
    return data


def _dump_file(path: Path, data: dict[str, Any]) -> None:
    """Atomar schreiben: tmp-File + rename."""
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix(path.suffix + ".tmp")
    with tmp.open("w", encoding="utf-8") as fh:
        yaml.safe_dump(
            data,
            fh,
            default_flow_style=False,
            sort_keys=False,
            allow_unicode=True,
        )
    os.replace(tmp, path)


def _backup(root: Path, filename: str) -> str | None:
    """Kopiert die Datei nach .backups/<filename>.<ts>.yaml. None wenn Quelle fehlt."""
    src = root / filename
    if not src.exists():
        return None
    backup_dir = root / BACKUPS_DIR
    backup_dir.mkdir(parents=True, exist_ok=True)
    ts = datetime.now().strftime("%Y%m%d-%H%M%S")
    dst = backup_dir / f"{filename}.{ts}.yaml"
    counter = 1
    # Bei mehreren Saves in derselben Sekunde: Counter anhängen.
    while dst.exists():
        dst = backup_dir / f"{filename}.{ts}-{counter}.yaml"
        counter += 1
    shutil.copy2(src, dst)
    return str(dst.relative_to(root))


@websocket_api.websocket_command({vol.Required("type"): WS_LIST_THEMES})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_list_themes(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    root = _themes_root(hass)
    themes, errors = await hass.async_add_executor_job(_scan_themes, root)
    connection.send_result(msg["id"], {"themes": themes, "errors": errors})


@websocket_api.websocket_command(
    {
        vol.Required("type"): WS_GET_THEME,
        vol.Required("file"): vol.All(str, _validate_filename),
        vol.Required("theme_name"): str,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_get_theme(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    root = _themes_root(hass)
    try:
        path = _safe_join(root, msg["file"])
        data = await hass.async_add_executor_job(_load_file, path)
    except (OSError, ValueError, yaml.YAMLError) as exc:
        connection.send_error(msg["id"], "load_failed", str(exc))
        return

    theme = data.get(msg["theme_name"])
    if not isinstance(theme, dict):
        connection.send_error(
            msg["id"],
            "not_found",
            f"theme {msg['theme_name']!r} not in {msg['file']!r}",
        )
        return

    connection.send_result(
        msg["id"],
        {
            "file": msg["file"],
            "theme_name": msg["theme_name"],
            "variables": theme,
        },
    )


@websocket_api.websocket_command(
    {
        vol.Required("type"): WS_SAVE_THEME,
        vol.Required("file"): vol.All(str, _validate_filename),
        vol.Required("theme_name"): str,
        # Variablen-Werte sind frei (string, dict für modes:, etc.) — Validierung
        # ist Aufgabe des Frontends/Plugins.
        vol.Required("variables"): dict,
        vol.Optional("create", default=False): bool,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_save_theme(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    root = _themes_root(hass)
    try:
        path = _safe_join(root, msg["file"])
    except ValueError as exc:
        connection.send_error(msg["id"], "invalid_path", str(exc))
        return

    create = msg["create"]
    theme_name: str = msg["theme_name"]
    variables: dict[str, Any] = msg["variables"]
    filename: str = msg["file"]

    def _do_save() -> str | None:
        existed = path.exists()
        if not existed and not create:
            raise FileNotFoundError(
                f"{filename!r} does not exist (pass create=true to create it)"
            )
        # Themes-Root sicherstellen (bei reinem 'create' falls noch nicht vorhanden).
        root.mkdir(parents=True, exist_ok=True)
        backup_rel = _backup(root, filename) if existed else None
        data = _load_file(path) if existed else {}
        data[theme_name] = dict(variables)
        _dump_file(path, data)
        return backup_rel

    try:
        backup_rel = await hass.async_add_executor_job(_do_save)
    except FileNotFoundError as exc:
        connection.send_error(msg["id"], "not_found", str(exc))
        return
    except (OSError, ValueError, yaml.YAMLError) as exc:
        _LOGGER.exception("save_theme failed for %s / %s", filename, theme_name)
        connection.send_error(msg["id"], "save_failed", str(exc))
        return

    # Theme-Reload anstossen, damit HA die Änderung übernimmt.
    try:
        await hass.services.async_call("frontend", "reload_themes", blocking=False)
    except Exception:  # noqa: BLE001 — Reload-Fehler darf den Save nicht versenken
        _LOGGER.exception("frontend.reload_themes failed after save")

    connection.send_result(
        msg["id"],
        {
            "file": filename,
            "theme_name": theme_name,
            "backup": backup_rel,
        },
    )


@callback
def async_register_websocket_api(hass: HomeAssistant) -> None:
    """Registriert alle Theme-Studio-WS-Commands."""
    websocket_api.async_register_command(hass, ws_list_themes)
    websocket_api.async_register_command(hass, ws_get_theme)
    websocket_api.async_register_command(hass, ws_save_theme)
