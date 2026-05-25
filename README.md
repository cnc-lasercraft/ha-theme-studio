# HA Theme Studio

**Grafischer Editor für Home-Assistant-Themes** — alle CSS-Variablen mit Color-Pickern, Slidern, Live-Preview im echten Dashboard, Backups bei jedem Speichern. Modular via JSON-Schema-Plugins erweiterbar (HA-Core, Bubble Card, Mushroom — eigene Cards leicht ergänzbar).

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

## Warum

HA hat kein UI um Theme-Variablen grafisch zu pflegen. Stattdessen: YAML editieren, Cache leeren, hoffen dass nichts kaputt geht. Studio bietet:

- **Color-Picker, Slider, Background-Picker, Shadow-Eingabe** statt Text-Editing
- **Live-Preview** direkt auf dem HA-Frontend UND in einem iframe mit deinem echten Dashboard
- **Modes (light/dark)** als eigene Edit-Ansicht
- **Plugin-System** — neue Custom Card hinzufügen heißt: neue `schema.json` schreiben, kein Code-Change am Core
- **HACS-Detection** — Plugins für nicht-installierte Cards sind ausgeblendet
- **Bubble-Card-Module-Editor** für CSS-Snippets aus `bubble_card/modules/`
- **Theme-Switcher** zum Alignieren mehrerer Themes (side-by-side Diff mit Copy-Pfeilen)
- **Auto-Backup** bei jeder Schreib-Operation unter `themes/.backups/` bzw. `bubble_card/.backups/`

## Features (v1.0)

| Bereich | Inhalt |
|---|---|
| **Theme-Editor** | 116 ha-core Vars (17 Kategorien) + 107 bubble-card Vars (15 Kat.) + ~109 mushroom Vars (12 Kat.) — alle typisiert mit Beschreibungen. Plus Namens-/Wert-Heuristik für unbekannte Variablen. |
| **Mode-Selector** | Default / Light / Dark als Tabs, separate Edits pro Mode, Save preserves `modes:`-Struktur |
| **Live-Preview** | Edits greifen sofort via `:root.style.setProperty` aufs HA-Frontend |
| **iframe-Preview** | Toggle öffnet dein echtes Dashboard rechts daneben, Overrides werden ins iframe gespiegelt |
| **Spezial-Controls** | `<ts-color-picker>`, `<ts-length-slider>`, `<ts-background-picker>` (mit Thumbnail + URL-Conversion `/homeassistant/www/...` → `/local/...`) |
| **Variable-Workflow** | Hinzufügen (Plugin-Tabs zeigen alle Schema-Vars, auch nicht-im-Theme), Ändern, Entfernen (Trash-Button) |
| **Module-Editor** | Browser über `bubble_card/modules/*.yaml` mit Metadaten-Form + grosse Monospace-CSS-Textarea |
| **Theme-Switcher** | Side-by-side Diff zweier Themes, Color-Swatches, "Nur Unterschiede"-Filter, Copy-Pfeile ← / → mit Direct-Write-Save |
| **HACS-Detection** | Backend liest `.storage/hacs.repositories`, Frontend lädt Plugins mit `detect.method: hacs-repo` nur wenn passendes Repo installiert |

## Installation

### Via HACS (empfohlen)

1. HACS → Integrations → ⋮ → **Custom repositories**
2. Repo-URL: `https://github.com/cnc-lasercraft/ha-theme-studio`, Category: **Integration**
3. **Theme Studio** in der Liste suchen → **Download**
4. In `configuration.yaml` ergänzen:
   ```yaml
   theme_studio:
   ```
5. **Home Assistant neu starten**
6. Sidebar → **Theme Studio**

### Manuell (ohne HACS)

1. Repo clonen oder Release-ZIP herunterladen
2. Ordner `custom_components/theme_studio/` (inkl. `dist/`-Unterverzeichnis!) nach `<config>/custom_components/theme_studio/` kopieren
3. In `configuration.yaml`:
   ```yaml
   theme_studio:
   ```
4. HA neu starten
5. Sidebar → **Theme Studio**

> Das Frontend-Bundle (`dist/theme-studio-panel.js`) wird mit dem Release ausgeliefert — keine npm-Toolchain auf der HA-Maschine nötig.

## Nutzung

### Themes editieren

1. **Theme im Picker** auswählen (Liste aller `themes/*.yaml`, inkl. Subdirs und Spaces im Filename)
2. Tab wählen:
   - **"Im Theme"** — was schon im YAML steht
   - **`<Plugin-Name>`** (ha-core / Bubble Card / Mushroom) — alle Schema-Vars, auch nicht-im-Theme
3. Bei Themes mit `modes:` → **Mode-Selector** (Default / Light / Dark)
4. Variablen ändern — Live-Preview greift sofort. **"👁 Preview"-Toggle** öffnet zusätzlich ein iframe mit deinem Dashboard
5. Pro Row: **Reset (↺)** oder **Entfernen (🗑)**. Toolbar: "Alles verwerfen" / "Speichern"
6. **Save** → automatisches Timestamp-Backup unter `themes/.backups/<file>.<ts>.yaml`, dann `frontend.reload_themes`

### Bubble-Card-Module bearbeiten

Tab **"Bubble Card Module"** (sichtbar wenn Bubble Card via HACS installiert):

1. Modul aus dem Picker wählen
2. Metadaten (Name, Description, Version, Supported-Card-Types, is_global) + CSS-Code in der grossen Monospace-Textarea editieren
3. Save → Backup unter `bubble_card/.backups/`
4. **Dashboard neu laden (Cmd+R)** — Bubble Card lädt Module beim Card-Render

### Themes vergleichen / alignieren

Tab **"Vergleichen"**:

1. Zwei Themes per Dropdown wählen (erste 2 sind auto-selektiert)
2. Diff-Tabelle zeigt Variablen-Werte side-by-side mit Color-Swatches
3. "Nur Unterschiede"-Filter (default an)
4. Copy-Pfeile **← / →** pro Row → Wert wird direkt ins Ziel-Theme geschrieben (mit Backup)

## Plugin-System

Neue Custom Card unterstützen = neuer Ordner unter `frontend/src/plugins/<id>/` mit zwei Dateien:

- `manifest.json` (id, name, version, detect: `always` oder `hacs-repo`)
- `schema.json` (categories + variables mit type/default/description/unit/min/max)

Beim nächsten `npm run build` wird das Plugin automatisch eingelesen (Vite `import.meta.glob`). Kein Code-Change am Core nötig.

Variable-Types: `color`, `length`, `shadow`, `background`, `raw` (+ später `font-family`, `enum`, `var-ref`).

→ Beispiele: [`frontend/src/plugins/ha-core/`](./frontend/src/plugins/ha-core/), [`frontend/src/plugins/bubble-card/`](./frontend/src/plugins/bubble-card/), [`frontend/src/plugins/mushroom/`](./frontend/src/plugins/mushroom/)

## Entwicklung

```bash
git clone https://github.com/cnc-lasercraft/ha-theme-studio
cd ha-theme-studio/frontend
npm install
npm run build  # → custom_components/theme_studio/dist/
```

Backend lebt unter `custom_components/theme_studio/` (Python). WS-Commands: siehe [`ARCHITECTURE.md`](./ARCHITECTURE.md).

Re-Deploy-Cheatsheet (für Tests auf einer Live-HA): [`CLAUDE.md`](./CLAUDE.md) → "Deployment auf den HA-Host".

## Architektur

Lit/TypeScript Custom Panel + Python Custom Integration (Backend für File-I/O + HACS-Detection), erweiterbar via JSON-Schema-Plugins pro Card-Sammlung.

- [`ARCHITECTURE.md`](./ARCHITECTURE.md) — Detail
- [`ROADMAP.md`](./ROADMAP.md) — Phasen v0.1 → v1.0
- [`DECISIONS.md`](./DECISIONS.md) — Festgelegte Design-Entscheidungen

## Lizenz

[MIT](./LICENSE)
