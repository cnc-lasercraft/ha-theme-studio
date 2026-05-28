# Roadmap

## Phasen-Übersicht

| Version | Inhalt | Aufwand | Status |
|---|---|---|---|
| **v0.1** | Core + ha-core-Plugin + Backend + Live-Preview lokal | ~1 Woche | ✓ **fertig** (2026-05-25, Tag `v0.1.0`) |
| **v0.2** | Bubble-Card-Plugin + Mushroom-Plugin + Plugin-Tabs + HACS-Detection | ~3 Tage | ✓ **fertig** (2026-05-25) |
| **v0.3** | iframe-Dashboard-Preview + Modes (light/dark) + Background-Picker + Variable-Remove + Tag v0.3.0 | ~3 Tage | ✓ **fertig** (2026-05-25, Tag `v0.3.0`) |
| **v0.4** | Bubble-Card-Module-Editor + Theme-Switcher (side-by-side Diff mit Copy-Pfeilen) | ~4 Tage | ✓ **fertig** (2026-05-25, Tag `v0.4.0`) |
| **v1.0** | HACS-Packaging (Bundle ins custom_components, hacs.json, LICENSE), Doku-Pass, manifest version-bump | ~3 Tage | ✓ **fertig** (2026-05-25, Tag `v1.0.0`) |

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

## v1.0 – Release-tauglich (✓ abgeschlossen)

| Feature | Status | Commit |
|---|---|---|
| Vite-Build-Output wandert nach `custom_components/theme_studio/dist/`, Backend-Pfad-Lookup vereinfacht, single-tree Deploy | ✓ | `b30a711` |
| `.gitignore`-Exception für das Bundle (HACS-User brauchen kein npm) | ✓ | `b30a711` |
| `hacs.json` (content_in_root: false, render_readme, min HA 2024.1) | ✓ | `0ff0a50` |
| `LICENSE` (MIT, 2026 Urs Landis) | ✓ | `0ff0a50` |
| `manifest.json` version bump `0.1.0` → `1.0.0` | ✓ | `0ff0a50` |
| README für HACS-Audience: Install via Custom Repository + manuelle Variante, Feature-Tabelle, Nutzungs-Guide, Plugin-Erweiterungs-Hinweis | ✓ | dieser Commit |
| CLAUDE.md Deployment-Cheatsheet auf single-tree umgestellt | ✓ | dieser Commit |

**Verschoben auf v1.0.x / v1.1+:**
- ~~Variable-Extraction im Module-Editor (Sidebar mit erkannten `var(--xxx)`)~~ → v1.0.1
- ~~Modes-Vergleich im Theme-Switcher~~ → v1.0.2
- ~~Sauberes Error-Handling-Audit~~ → v1.0.3 (Quick-Wins; vollständiges Audit dokumentiert)
- ~~i18n (DE/EN) vorbereiten~~ → v1.0.4
- Aufnahme in HACS-Default-Katalog (PR an HACS-Repo)

## v1.0.1 – Post-Release-Polish

| Feature | Status | Commit |
|---|---|---|
| Variable-Extraction im Module-Editor: Sidebar listet alle `var(--xxx)` aus dem CSS, mit Dedup + Count, Plugin-Badge (ha-core/bubble-card/mushroom/heuristik), Typ-/Kategorie-Chips, Description, Fallback-Parser für `var(--name, fallback)` inkl. nested vars, Color-Swatch bei Farben. Layout 2-Spalten (Textarea links flex, Sidebar 300px sticky rechts; <900px untereinander). Klick = nur Info, kein Cross-Tab-Spring. | ✓ | `48b7aab` |

## v1.0.2 – Modes im Theme-Switcher

| Feature | Status | Commit |
|---|---|---|
| Mode-Selector im Compare-View: Pill-Buttons "Default / Light / Dark / …" oberhalb der Diff-Tabelle. Verfügbare Modes = Union aus A und B. Diff-Filter wirkt pro Mode. Bei nur "default" wird der Selector ausgeblendet. | ✓ | `5e7daba` |
| Mode-aware Copy: `_mergeValue()` schreibt bei Default in Top-Level, bei Light/Dark in `modes.<mode>.<key>`. Fehlende `modes:`-/Sub-Mode-Struktur wird automatisch angelegt. Backup wie zuvor. | ✓ | `5e7daba` |
| Badge "A"/"B" am Mode-Button wenn Mode nur in einem Theme existiert, plus Hint in der Summary "Copy würde sie anlegen". | ✓ | `5e7daba` |

## v1.0.3 – Error-Handling-Quick-Wins

| Feature | Status | Commit |
|---|---|---|
| `beforeunload`-Handler in `editor-view` + `module-editor`: bei dirty state Browser-Bestätigungs-Dialog vor Tab-Close / Reload. Schutz gegen Datenverlust. | ✓ | (dieser Commit) |
| Sichtbarer HACS-Detection-Fehler: `panel-main` zeigt Hinweis-Banner am Panel-Top wenn `list_hacs_repos` fehlschlägt (statt nur `console.warn`). Banner ist dismissable. | ✓ | (dieser Commit) |
| Backend-Logging-Symmetrie: `ws_get_theme` + `ws_get_module` loggen jetzt auch mit `_LOGGER.exception` bei Load-Fehlern, analog zu den Save-Handlern. | ✓ | (dieser Commit) |
| Compare-View `_copyStatus` auf typisierte `CopyStatus`-Union (idle/copying/success/error) hochgezogen, analog zu `SaveStatus` in den anderen Views. Separate success/error-Banner-Styles. | ✓ | (dieser Commit) |

**Audit-Befunde, die NICHT in v1.0.3 sind** (für spätere Releases / Doku):
- Keine YAML-/Schema-Validierung der `variables: dict` vor Schreiben — Client trust
- Backup-Race bei concurrent Saves (Timestamp+Counter fängt, Filenames werden unsauber)
- Race-Condition: Save → View-Wechsel → State-Update auf disconnected Component (silent, kein Crash)
- Native `confirm()`-Dialoge statt Custom-Modal (funktional, nicht designed)
- Kein Retry-Button bei `list_themes`-Load-Fehler (User muss Page reloaden)

## v1.0.4 – i18n (DE + EN)

| Feature | Status | Commit |
|---|---|---|
| i18n-Infrastruktur: `frontend/src/core/i18n.ts` mit `t(key, fallback?, vars?)` und `setLocale()`. Translation-Dictionaries als TS-Module (`frontend/src/i18n/de.ts` + `en.ts`), kein Runtime-JSON-Fetch. Locale-Detection beim Mount aus `hass.language`, Region-Strip (`de-CH` → `de`), EN als Fallback. | ✓ | (dieser Commit) |
| Alle UI-Strings in `panel-main`, `theme-picker`, `module-picker`, `editor-view`, `module-editor`, `compare-view`, `preview-pane`, `controls/background-picker` durch `t()`-Calls ersetzt. Platzhalter-Syntax `{name}` für variable Texte. Pluralisierung über separate `*_one`/`*_many`-Keys. | ✓ | (dieser Commit) |
| Schema-i18n: `VariableDef.description_en?` + `Category.label_en?` als optionale Felder im Type. Plugin-Schemas (ha-core, bubble-card, mushroom) um englische Übersetzungen für alle Variable-Descriptions und Kategorie-Labels erweitert (~332 description_en + ~44 label_en). | ✓ | (dieser Commit) |
| Schema-Registry `getVariableMeta()` + neuer `getCategoryLabel()` Helper sind locale-aware: bei locale=en wird `*_en` zurückgegeben, sonst Deutsch (Fallback). | ✓ | (dieser Commit) |

**Nicht in v1.0.4:**
- Weitere Sprachen (FR/IT/ES/…). Architektur ist offen — neue Sprache = neue `frontend/src/i18n/<lang>.ts` + Catalog-Eintrag in `i18n.ts`. Schema-Felder bekommen `*_<lang>`-Variante.
- User-Sprach-Override im Panel-Header (nur `hass.language`-Auto-Detection).
- Live-Switching der Locale ohne Reload (Locale wird beim Mount fixiert).
