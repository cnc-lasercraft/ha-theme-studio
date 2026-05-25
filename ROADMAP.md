# Roadmap

## Phasen-Übersicht

| Version | Inhalt | Aufwand | Status |
|---|---|---|---|
| **v0.1** | Core + ha-core-Plugin + Backend + Live-Preview lokal | ~1 Woche | ✓ **fertig** (2026-05-25, Tag `v0.1.0`) |
| **v0.2** | Bubble-Card-Plugin (Variablen) + Mushroom-Plugin | ~3 Tage | offen |
| **v0.3** | Iframe-Dashboard-Preview + Theme-Switcher | ~3 Tage | offen |
| **v0.4** | Bubble-Card-Module-Verwaltung (CRUD auf YAML-Module) | ~4 Tage | offen |
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

## v0.2 – Plugins ausbauen

- `plugins/bubble-card/schema.json` mit globalen Variablen + pro Card-Typ
- `plugins/mushroom/schema.json` mit `--mush-*`-Variablen
- UI: Plugin-Tabs / Kategorien-Navigation
- Detection: Welche Custom Cards sind via HACS installiert? (Optional zu diesem Zeitpunkt)

## v0.3 – Echte Vorschau

- iframe lädt eines der Dashboards des Users
- `postMessage`-Kanal: Editor pusht Theme-Overrides ins iframe
- Theme-Switcher: Mehrere Themes parallel laden, vergleichen, kopieren

## v0.4 – Bubble-Card-Module

Bubble-Card-Module sind YAML-Snippets mit `code:`-CSS-Blöcken. Studio bekommt einen Modul-Verwaltungs-Layer:

- Liste vorhandener Module (lesen aus Bubble-Card-Storage)
- Editor mit Syntax-Highlighting für das CSS
- Variablen-Extraktion: Im Modul-CSS erkannte `var(--xxx)` werden zur Plugin-Variablen-Liste hinzugefügt
- Speichern zurück über Backend

Damit sind die 3 visionOS-Module (Default/Title/Separator) im Studio integriert.

## v1.0 – Release-tauglich

- README, Installationsanleitung, Screenshots
- `hacs.json` für HACS-Repository
- Sauberes Error-Handling
- i18n vorbereiten (DE/EN)
- Versions-Tag, Release-Notes
