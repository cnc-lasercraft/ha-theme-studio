"""WebSocket-Commands für Theme Studio.

v0.1 Schritt 2: `list_themes`, `get_theme`, `save_theme`.

- API arbeitet pro Theme-Name (`file` + `theme_name`); default-Layout 1:1.
- Vor jedem Schreibvorgang wird ein Timestamp-Backup unter
  `themes/.backups/<file>.<YYYYMMDD-HHMMSS>.yaml` angelegt (D5).
- Nach erfolgreichem Save wird `frontend.reload_themes` gefeuert.
- Alle Commands sind admin-only.
"""
from __future__ import annotations

import json
import logging
import os
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
    HACS_STORAGE_PATH,
    MODULES_BACKUPS_DIR,
    MODULES_DIR,
    THEMES_DIR,
    WS_FORK_THEME,
    WS_GET_MODULE,
    WS_GET_THEME,
    WS_LIST_HACS_REPOS,
    WS_LIST_MODULES,
    WS_LIST_THEMES,
    WS_SAVE_MODULE,
    WS_SAVE_THEME,
)

_LOGGER = logging.getLogger(__name__)


def _validate_path(name: str) -> str:
    """Pfad-Validator: erlaubt subdirs + Leerzeichen, lehnt Traversal & Hidden ab.

    Akzeptiert z.B. `visionos/visionos.yaml`, `Liquid Glass.yaml`,
    `dir/sub/file.yaml`. Lehnt ab: absolute Pfade, `..`, leere Segmente,
    `.`-prefixed Segmente (würde u.a. den Zugriff auf `.backups/` verhindern),
    Backslashes, alles ohne `.yaml`-Endung.
    """
    if not isinstance(name, str) or not name:
        raise vol.Invalid("path must be non-empty string")
    if "\\" in name:
        raise vol.Invalid(f"backslashes not allowed: {name!r}")
    if name.startswith("/"):
        raise vol.Invalid(f"path must be relative: {name!r}")
    if not name.endswith(".yaml"):
        raise vol.Invalid(f"path must end in .yaml: {name!r}")
    for segment in name.split("/"):
        if not segment or segment in (".", ".."):
            raise vol.Invalid(f"invalid segment {segment!r} in {name!r}")
        if segment.startswith("."):
            raise vol.Invalid(f"hidden segment {segment!r} not allowed in {name!r}")
    return name


def _slugify(name: str) -> str:
    """Macht aus einem freien Theme-Namen einen dateisystem-sicheren Slug.

    `"visionOS Custom"` → `"visionos-custom"`. Kleinbuchstaben, jede Folge von
    Nicht-[a-z0-9] wird zu einem einzelnen `-`, führende/abschliessende `-`
    entfernt. Liefert `""` wenn nichts Verwertbares übrigbleibt (Caller behandelt
    das als Fehler).
    """
    out: list[str] = []
    prev_dash = False
    for ch in name.lower():
        if "a" <= ch <= "z" or "0" <= ch <= "9":
            out.append(ch)
            prev_dash = False
        elif not prev_dash:
            out.append("-")
            prev_dash = True
    return "".join(out).strip("-")


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

        # HACS installiert Themes immer in einen Unterordner von themes/
        # (nie direkt als themes/x.yaml). Eine Datei in einem Subdir gilt
        # daher als potenziell HACS-verwaltet → Frontend zeigt Badge +
        # Fork-Guard. Eigene/abgeleitete Themes leben top-level.
        hacs_managed = len(rel.parts) > 1

        for theme_name, theme_data in data.items():
            if not isinstance(theme_data, dict):
                continue
            found.append(
                {
                    "file": str(rel),
                    "theme_name": theme_name,
                    "variable_count": len(theme_data),
                    "hacs_managed": hacs_managed,
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
    """Kopiert die Datei nach .backups/<flat>.<ts>.yaml. None wenn Quelle fehlt.

    Subdir-Trenner werden zu `__` flattened, damit das Backup-Verzeichnis flach
    bleibt (z.B. `visionos/visionos.yaml` → `visionos__visionos.yaml.<ts>.yaml`).
    """
    src = root / filename
    if not src.exists():
        return None
    backup_dir = root / BACKUPS_DIR
    backup_dir.mkdir(parents=True, exist_ok=True)
    flat = filename.replace("/", "__")
    ts = datetime.now().strftime("%Y%m%d-%H%M%S")
    dst = backup_dir / f"{flat}.{ts}.yaml"
    counter = 1
    while dst.exists():
        dst = backup_dir / f"{flat}.{ts}-{counter}.yaml"
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
        vol.Required("file"): vol.All(str, _validate_path),
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
        _LOGGER.exception(
            "get_theme failed for %s / %s", msg["file"], msg["theme_name"]
        )
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
        vol.Required("file"): vol.All(str, _validate_path),
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


@websocket_api.websocket_command(
    {
        vol.Required("type"): WS_FORK_THEME,
        vol.Required("new_name"): str,
        # Vollständiger Theme-Inhalt der in die neue Datei geschrieben wird
        # (vom Frontend gemergter Editier-Stand). Werte frei wie bei save_theme.
        vol.Required("variables"): dict,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_fork_theme(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    """Leitet ein (HACS-verwaltetes) Theme in eine eigene Top-Level-Datei ab.

    Schreibt den mitgelieferten `variables`-Stand (= aktueller Editier-Merge,
    inkl. evtl. Änderungen) nach `themes/<slug>.yaml` mit `new_name` als
    Top-Level-Key. Fasst die HACS-Quelle nie an, überschreibt keine bestehende
    Datei und lehnt Namens-Kollisionen ab — vollständig reversibel (nur ein
    neues File). Deckt Proaktiv-Fork (Stand = Original) und Fork-on-Save
    (Stand = mit Edits) mit demselben Contract ab.
    """
    root = _themes_root(hass)
    new_name: str = msg["new_name"].strip()
    variables: dict[str, Any] = msg["variables"]

    slug = _slugify(new_name)
    if not new_name or not slug:
        connection.send_error(
            msg["id"], "invalid_name", f"cannot derive a slug from {new_name!r}"
        )
        return

    target_rel = f"{slug}.yaml"

    try:
        target_path = _safe_join(root, target_rel)
    except ValueError as exc:
        connection.send_error(msg["id"], "invalid_path", str(exc))
        return

    def _do_fork() -> None:
        existing, _ = _scan_themes(root)
        # Namens-Kollision gegen alle bestehenden Theme-Keys (HA-weit eindeutig).
        if any(e["theme_name"] == new_name for e in existing):
            raise FileExistsError(f"theme name {new_name!r} already exists")
        if target_path.exists():
            raise FileExistsError(f"file {target_rel!r} already exists")
        root.mkdir(parents=True, exist_ok=True)
        _dump_file(target_path, {new_name: dict(variables)})

    try:
        await hass.async_add_executor_job(_do_fork)
    except FileExistsError as exc:
        connection.send_error(msg["id"], "name_collision", str(exc))
        return
    except (OSError, ValueError, yaml.YAMLError) as exc:
        _LOGGER.exception("fork_theme failed: → %s", target_rel)
        connection.send_error(msg["id"], "fork_failed", str(exc))
        return

    # Neues Theme HA bekanntmachen.
    try:
        await hass.services.async_call("frontend", "reload_themes", blocking=False)
    except Exception:  # noqa: BLE001 — Reload-Fehler darf den Fork nicht versenken
        _LOGGER.exception("frontend.reload_themes failed after fork")

    connection.send_result(
        msg["id"],
        {"file": target_rel, "theme_name": new_name},
    )


# ─── Bubble-Card-Modules ───────────────────────────────────────────────


def _modules_root(hass: HomeAssistant) -> Path:
    return Path(hass.config.path(MODULES_DIR))


def _modules_backup_root(hass: HomeAssistant) -> Path:
    return Path(hass.config.path(MODULES_BACKUPS_DIR))


def _scan_modules(
    root: Path,
) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    """Walk modules-dir, liefert (modules, errors). Backups-Dir wird übersprungen."""
    found: list[dict[str, Any]] = []
    errors: list[dict[str, Any]] = []
    if not root.exists():
        return found, errors
    for path in sorted(root.glob("*.yaml")):
        try:
            with path.open("r", encoding="utf-8") as fh:
                data = yaml.safe_load(fh) or {}
        except (OSError, yaml.YAMLError) as exc:
            errors.append({"file": path.name, "error": str(exc)})
            continue
        if not isinstance(data, dict):
            errors.append(
                {"file": path.name, "error": "top-level is not a mapping"}
            )
            continue
        for module_id, module_data in data.items():
            if not isinstance(module_data, dict):
                continue
            supported = module_data.get("supported", [])
            if not isinstance(supported, list):
                supported = []
            found.append(
                {
                    "file": path.name,
                    "module_id": module_id,
                    "name": module_data.get("name", module_id),
                    "version": module_data.get("version", ""),
                    "description": module_data.get("description", ""),
                    "supported": supported,
                    "is_global": bool(module_data.get("is_global", False)),
                    "has_code": bool(module_data.get("code")),
                }
            )
    return found, errors


def _module_backup(
    root: Path, backups_root: Path, filename: str
) -> str | None:
    """Backup nach <config>/bubble_card/.backups/<filename>.<ts>.yaml."""
    src = root / filename
    if not src.exists():
        return None
    backups_root.mkdir(parents=True, exist_ok=True)
    ts = datetime.now().strftime("%Y%m%d-%H%M%S")
    dst = backups_root / f"{filename}.{ts}.yaml"
    counter = 1
    while dst.exists():
        dst = backups_root / f"{filename}.{ts}-{counter}.yaml"
        counter += 1
    shutil.copy2(src, dst)
    # Display path relative to config dir (.../bubble_card/.backups/...).
    try:
        return str(dst.relative_to(src.parent.parent.parent))
    except ValueError:
        return str(dst)


@websocket_api.websocket_command({vol.Required("type"): WS_LIST_MODULES})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_list_modules(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    root = _modules_root(hass)
    modules, errors = await hass.async_add_executor_job(_scan_modules, root)
    connection.send_result(
        msg["id"],
        {"modules": modules, "errors": errors, "root_exists": root.exists()},
    )


@websocket_api.websocket_command(
    {
        vol.Required("type"): WS_GET_MODULE,
        vol.Required("file"): vol.All(str, _validate_path),
        vol.Required("module_id"): str,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_get_module(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    root = _modules_root(hass)
    try:
        path = _safe_join(root, msg["file"])
        data = await hass.async_add_executor_job(_load_file, path)
    except (OSError, ValueError, yaml.YAMLError) as exc:
        _LOGGER.exception(
            "get_module failed for %s / %s", msg["file"], msg["module_id"]
        )
        connection.send_error(msg["id"], "load_failed", str(exc))
        return

    module = data.get(msg["module_id"])
    if not isinstance(module, dict):
        connection.send_error(
            msg["id"],
            "not_found",
            f"module {msg['module_id']!r} not in {msg['file']!r}",
        )
        return

    connection.send_result(
        msg["id"],
        {
            "file": msg["file"],
            "module_id": msg["module_id"],
            "content": module,
        },
    )


@websocket_api.websocket_command(
    {
        vol.Required("type"): WS_SAVE_MODULE,
        vol.Required("file"): vol.All(str, _validate_path),
        vol.Required("module_id"): str,
        vol.Required("content"): dict,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_save_module(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    root = _modules_root(hass)
    backups_root = _modules_backup_root(hass)
    try:
        path = _safe_join(root, msg["file"])
    except ValueError as exc:
        connection.send_error(msg["id"], "invalid_path", str(exc))
        return

    filename: str = msg["file"]
    module_id: str = msg["module_id"]
    content: dict[str, Any] = msg["content"]

    def _do_save() -> str | None:
        if not path.exists():
            raise FileNotFoundError(f"{filename!r} does not exist")
        root.mkdir(parents=True, exist_ok=True)
        backup_rel = _module_backup(root, backups_root, filename)
        data = _load_file(path)
        data[module_id] = dict(content)
        _dump_file(path, data)
        return backup_rel

    try:
        backup_rel = await hass.async_add_executor_job(_do_save)
    except FileNotFoundError as exc:
        connection.send_error(msg["id"], "not_found", str(exc))
        return
    except (OSError, ValueError, yaml.YAMLError) as exc:
        _LOGGER.exception("save_module failed for %s / %s", filename, module_id)
        connection.send_error(msg["id"], "save_failed", str(exc))
        return

    # Bubble-Card-Module werden von Bubble Card selbst beim Card-Render
    # geladen — wir können keine pauschale "reload"-API rufen. Der User
    # muss seine Dashboards neu laden um die Änderung zu sehen.
    connection.send_result(
        msg["id"],
        {
            "file": filename,
            "module_id": module_id,
            "backup": backup_rel,
        },
    )


# ─── HACS-Detection ────────────────────────────────────────────────────


def _scan_hacs_repos(path: Path) -> list[str]:
    """Liest die HACS-Storage-Datei, gibt full_names der installierten Repos zurück.

    HACS-Format: `{ "data": { "<id>": { "full_name": "...", "installed": true, ... } } }`.
    Returns [] wenn Datei fehlt oder unlesbar (kein HACS oder defektes Format) —
    Frontend interpretiert das als "kein Filter anwenden".
    """
    if not path.exists():
        return []
    try:
        with path.open("r", encoding="utf-8") as fh:
            data = json.load(fh)
    except (OSError, json.JSONDecodeError):
        return []
    repos_dict = data.get("data", {})
    if not isinstance(repos_dict, dict):
        return []
    out: list[str] = []
    for v in repos_dict.values():
        if not isinstance(v, dict):
            continue
        if v.get("installed") is True:
            fn = v.get("full_name")
            if isinstance(fn, str) and fn:
                out.append(fn)
    return out


@websocket_api.websocket_command({vol.Required("type"): WS_LIST_HACS_REPOS})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_list_hacs_repos(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    path = Path(hass.config.path(HACS_STORAGE_PATH))
    try:
        repos = await hass.async_add_executor_job(_scan_hacs_repos, path)
    except Exception as exc:  # noqa: BLE001 — robust gegen unerwartete Errors
        _LOGGER.exception("list_hacs_repos failed")
        connection.send_error(msg["id"], "hacs_read_failed", str(exc))
        return
    connection.send_result(
        msg["id"],
        {"repos": repos, "found": path.exists()},
    )


@callback
def async_register_websocket_api(hass: HomeAssistant) -> None:
    """Registriert alle Theme-Studio-WS-Commands."""
    websocket_api.async_register_command(hass, ws_list_themes)
    websocket_api.async_register_command(hass, ws_get_theme)
    websocket_api.async_register_command(hass, ws_save_theme)
    websocket_api.async_register_command(hass, ws_fork_theme)
    websocket_api.async_register_command(hass, ws_list_hacs_repos)
    websocket_api.async_register_command(hass, ws_list_modules)
    websocket_api.async_register_command(hass, ws_get_module)
    websocket_api.async_register_command(hass, ws_save_module)
