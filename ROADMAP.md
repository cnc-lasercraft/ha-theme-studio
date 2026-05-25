# Roadmap

## Phasen-Übersicht

| Version | Inhalt | Aufwand | Status |
|---|---|---|---|
| **v0.1** | Core + ha-core-Plugin + Backend + Live-Preview lokal | ~1 Woche | ✓ **fertig** (2026-05-25, Tag `v0.1.0`) |
| **v0.2** | Bubble-Card-Plugin + Mushroom-Plugin + Plugin-Tabs + HACS-Detection | ~3 Tage | ✓ **fertig** (2026-05-25) |
| **v0.3** | iframe-Dashboard-Preview + Modes (light/dark) + Background-Picker + Variable-Remove + Tag v0.3.0 | ~3 Tage | ✓ **fertig** (2026-05-25, Tag `v0.3.0`) |
| **v0.4** | Bubble-Card-Module-Editor + Theme-Switcher (side-by-side Diff mit Copy-Pfeilen) | ~4 Tage | ✓ **fertig** (2026-05-25, Tag `v0.4.0`) |
| **v1.0** | Polishing, Doku, HACS-Release | ~3 Tage | offen |

## v0.1 – Schritte im Detail

Tatsächliche Implementierungs-Reihenfolge: 1 → 2 → 3 → 6 (vorgezogen) → 4 → 5 → 7 → 8. Step 6 wurde nach D10 ([`DECISIONS.md`](./DECISIONS.md)) vor 4/5 gezogen, um früh ein sichtbares Erfolgserlebnis zu haben.

| # | Schritt | Status | Commit |
|---|---|---|---|
| 1 | Repo-Skelett | ✓ | `197a038` |
| 2 | Backend-Integration (WS-Commands `list_themes`, `get_theme`, `save_theme`) | ✓ | `61a8aba` |
| 3 | ha-core `schema.json` (30 Variablen, 8 Kategorien, typisiert) | ✓ | `b21a5fa` |
| 4 | Plugin-Loader + Namens-Heuristik für unbekannte Variablen | ✓ | `27b05e7` |
| 5 | UI-Controls (`ts-color-picker`, `ts-length-slider`, `ts-raw-input`) + Demo unter `#demo` | ✓ | `9d58dd7` |
| 6 | Theme-Picker (Start-Screen) — Liste aller `themes/*.yaml` mit Subdir-/Spaces-Support | ✓ | `a216db3` (+ Fix `3b2b74f`) |
| 7 | Editor-Panel mit Live-Preview auf `:root`, Kategorien-Gruppierung, Reset pro Variable | ✓ | `c4a9f96` |
| 8 | Save-Flow mit Timestamp-Backup + `frontend.reload_themes` | ✓ | `8318621` |

**Nach Schritt 8:** Funktionsfähiger Minimal-Editor für **jedes** Theme im Verzeichnis. Plugin-Schemas decken bekannte Variablen ab, Heuristik fängt unbekannte ab. Live-Preview auf `:root`, persistenter Save mit Auto-Backup, sauberes Cleanup beim Verlassen. Noch ohne Bubble-Card-Plugin und ohne iframe-Preview, aber Theme-agnostisch.

## v0.2 – Plugins ausbauen (✓ abgeschlossen)

| Feature | Status | Commit |
|---|---|---|
| ha-core-Schema von 30 auf 116 Variablen erweitert (alle user-aktiven Vars + neue Kategorien: state-colors, switches, tables, polymer-legacy, mdc, rgb, form-inputs, dialogs, label-badge) | ✓ | `888db45` + `63e2051` + `936b9c9` |
| Value-basierte Heuristik (`rgba(...)` → color, `12px` → length) + erweiterte Prefix-Map | ✓ | `2175d1f` |
| `plugins/bubble-card/schema.json` mit 107 Vars über 15 Kategorien | ✓ | `9f9d9e5` |
| `plugins/mushroom/schema.json` mit ~109 Vars über 12 Kategorien (inkl. Material- und State-RGB-Paletten) | ✓ | `939fe61` |
| Plugin-Tabs im Editor: "Im Theme" + pro Plugin, lazy-loaded Vars mit "default"/"+ wird ergänzt"-Tags | ✓ | `2912df1` |
| HACS-Detection: Backend liest `.storage/hacs.repositories`, Frontend filtert Plugins mit `detect.method: hacs-repo` | ✓ | `5eb22ca` |
| Plugin-Sortierung: ha-core zuerst, andere alphabetisch | ✓ | `5eb22ca` |

## v0.3 – Echte Vorschau + UX-Reife (✓ abgeschlossen)

| Feature | Status | Commit |
|---|---|---|
| Modes (light/dark) editierbar — Mode-Selector, separate Edits pro Mode, Save preserves modes-Struktur | ✓ | `34f56d0` |
| iframe-Dashboard-Preview mit Live-Theme-Overrides via Same-Origin-CSS — 2-Spalten-Layout, Sticky-Pane | ✓ | `d9db358` |
| Background-Picker für CSS-`url(...)`-Werte (Thumbnail + URL + Modifier + Presets) | ✓ | `a2a3d5a` |
| Background-Picker: Auto-Conversion `/homeassistant/www/...` → `/local/...` | ✓ | `ee945d5` |
| Variable-Entfernen-Button (Trash-Icon, markedForRemoval-Workflow) | ✓ | `931645f` |

**Verschoben aus v0.3:** Theme-Switcher (mehrere Themes parallel) — kommt in v0.4.

## v0.4 – Bubble-Card-Module + Theme-Switcher (✓ abgeschlossen)

| Feature | Status | Commit |
|---|---|---|
| Backend: 3 WS-Commands für Module (`list_modules`, `get_module`, `save_module`). Pfad `<config>/bubble_card/modules/*.yaml`, Backup nach `bubble_card/.backups/` | ✓ | `19d141e` |
| Frontend: Top-Level-Tab "Bubble Card Module" (sichtbar wenn bubble-card-Plugin aktiv) | ✓ | `19d141e` |
| `<ts-module-picker>`: Listet Module mit Metadaten (Name, Description, Supported-Chips, Global/no-code Badges) | ✓ | `19d141e` |
| `<ts-module-editor>`: Metadaten-Fields (name, description, version, supported, is_global) + grosse Monospace-CSS-Textarea. Unbekannte YAML-Felder werden 1:1 erhalten | ✓ | `19d141e` |
| `<ts-compare-view>` — Theme-Switcher als 3. Top-Tab: 2 Dropdowns, tabularer Diff mit Color-Swatches, "Nur Unterschiede"-Filter, Copy-Pfeile ← / → mit Direct-Write-Save inkl. Backup | ✓ | `a95148c` |

**Verschoben aus v0.4:** Variable-Extraction im Module-Editor (Sidebar mit erkannten `var(--xxx)`) — Polish für v0.5 / v1.0.

## v1.0 – Release-tauglich

- README, Installationsanleitung, Screenshots
- `hacs.json` für HACS-Repository
- Sauberes Error-Handling
- i18n vorbereiten (DE/EN)
- Versions-Tag, Release-Notes
