# Roadmap

## Phasen-Übersicht

| Version | Inhalt | Aufwand | Status |
|---|---|---|---|
| **v0.1** | Core + ha-core-Plugin + Backend + Live-Preview lokal | ~1 Woche | offen |
| **v0.2** | Bubble-Card-Plugin (Variablen) + Mushroom-Plugin | ~3 Tage | offen |
| **v0.3** | Iframe-Dashboard-Preview + Theme-Switcher | ~3 Tage | offen |
| **v0.4** | Bubble-Card-Module-Verwaltung (CRUD auf YAML-Module) | ~4 Tage | offen |
| **v1.0** | Polishing, Doku, HACS-Release | ~3 Tage | offen |

## v0.1 – Schritte im Detail

| # | Schritt | Was entsteht | Testbar? |
|---|---|---|---|
| 1 | Repo-Skelett | Verzeichnisstruktur, `frontend/package.json`, Vite-Config, `custom_components/theme_studio/manifest.json` | nein |
| 2 | Backend-Integration | `custom_components/theme_studio/` mit WS-Commands `list_themes`, `get_theme`, `save_theme` | ja, via Browser DevTools / `ha_call_service` |
| 3 | ha-core schema.json | ~30 wichtigste HA-Variablen (nicht alle 150 sofort), typisiert | ja, JSON-Validierung |
| 4 | Plugin-Loader | Core lädt Schemas dynamisch aus `plugins/` | ja, im Browser |
| 5 | Erste UI-Controls | Color-Picker + Length-Slider als Lit-Komponenten | ja, isoliert |
| 6 | Editor-Panel (minimal) | Variablen-Liste, Werte ändern, lokale Live-Preview auf `:root` | **erstes echtes Erfolgserlebnis** |
| 7 | Save-Flow | Editor → Backend → `themes/xxx.yaml` → `frontend.reload_themes` | ja, mit visionos-Theme |

**Nach Schritt 7:** Funktionsfähiger Minimal-Editor für HA-Core-Variablen, ohne Bubble Card, ohne iframe-Preview. visionOS-Theme über das UI editierbar und persistierbar.

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
