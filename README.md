# HA Theme Studio

UI-Editor für Home Assistant Themes – grafische Verwaltung aller Theme-CSS-Variablen mit Live-Preview, Persistenz in `themes/*.yaml`, modular erweiterbar für Custom Cards.

## Warum

HA hat kein UI um Theme-Variablen grafisch zu pflegen. Stattdessen: YAML editieren, Cache leeren, hoffen dass nichts kaputt geht. Studio bietet Color-Picker, Slider, Live-Preview und ein **Plugin-System**, sodass HA-Core-Variablen, Bubble Card, Mushroom und beliebige weitere Custom Cards einheitlich editierbar sind.

## Status

**v0.4 live** (Tag `v0.4.0`, 2026-05-25).

Drei Top-Level-Tabs: **Themes** / **Bubble Card Module** (wenn bubble-card aktiv) / **Vergleichen**.

Drei Plugins (HACS-gefiltert): **ha-core** (116 Vars / 17 Kategorien), **bubble-card** (107 Vars / 15 Kategorien), **mushroom** (~109 Vars / 12 Kategorien). Plus Namens-/Wert-Heuristik für unbekannte Vars.

Theme-Editor mit Plugin-Tabs, **Modes (light/dark)**, **iframe-Dashboard-Preview** (Live-Override im echten Dashboard), Spezial-Controls für Farben/Längen/Backgrounds, Variable-Hinzufügen + -Entfernen, Auto-Backup bei jedem Save.

Bubble-Card-Module-Editor: Liste aller Module aus `bubble_card/modules/`, Metadaten + grosse CSS-Textarea, Backup inklusive.

Theme-Switcher: side-by-side Diff zwischen 2 Themes mit Color-Swatches, "Nur Unterschiede"-Filter, Copy-Pfeile ← / →.

Nächste Phase: **v1.0** (Polishing, finale Doku, HACS-Release).

## Architektur in einem Satz

Lit/TypeScript Custom Panel + Python Custom Integration (Backend für File-I/O), erweiterbar via JSON-Schema-Plugins pro Card-Sammlung.

→ Details: [`ARCHITECTURE.md`](./ARCHITECTURE.md)
→ Phasen: [`ROADMAP.md`](./ROADMAP.md)
→ Festgelegte Entscheidungen: [`DECISIONS.md`](./DECISIONS.md)

## Installation (manuell, Pre-HACS)

Noch kein HACS-Repo — manueller Install auf den HA-Host:

1. **Frontend bauen:**
   ```bash
   cd frontend && npm install && npm run build
   ```
2. **Backend deployen** nach `/homeassistant/custom_components/theme_studio/` (Python-Files aus `custom_components/theme_studio/`, root:root, 644).
3. **Frontend deployen** nach `/homeassistant/frontend/dist/` (Built-JS aus `frontend/dist/`, root:root, 644).
4. In `configuration.yaml` anhängen:
   ```yaml
   theme_studio:
   ```
5. `ha_check_config` ⇒ `valid`, dann HA-Restart.
6. Sidebar → "Theme Studio" → Picker zeigt die Themes aus deinem `themes/`-Verzeichnis.

Detaillierte Tar+SSH-Befehle und Re-Deploy-Cheatsheet: [`CLAUDE.md`](./CLAUDE.md) → "Deployment auf den HA-Host".

## Nutzung

1. Theme im Picker auswählen
2. Tab wählen: **"Im Theme"** (was schon im YAML steht) oder einen **Plugin-Tab** (alle Schema-Vars, auch nicht-im-Theme — können hinzugefügt werden)
3. Bei Themes mit `modes:` → **Mode-Selector** wählt zwischen Default / Light / Dark
4. Variablen ändern — Live-Preview greift sofort auf das HA-Frontend; **"👁 Preview"-Toggle** öffnet zusätzlich ein iframe mit deinem Dashboard
5. Pro Variable: **Reset (`↺`)** oder **Entfernen (`🗑`)**. "Alles verwerfen" wirkt über alle Modes/Tabs
6. **"Speichern"** → automatisches Timestamp-Backup unter `themes/.backups/`, dann `frontend.reload_themes`

## Test-Umgebung

Live-System des Users (Produktiv-HA). Backup vor invasiven Operationen — Save macht das automatisch, manueller Restore via `themes/.backups/` möglich.
