# HA Theme Studio

UI-Editor für Home Assistant Themes – grafische Verwaltung aller Theme-CSS-Variablen mit Live-Preview, Persistenz in `themes/*.yaml`, modular erweiterbar für Custom Cards.

## Warum

HA hat kein UI um Theme-Variablen grafisch zu pflegen. Stattdessen: YAML editieren, Cache leeren, hoffen dass nichts kaputt geht. Studio bietet Color-Picker, Slider, Live-Preview und ein **Plugin-System**, sodass HA-Core-Variablen, Bubble Card, Mushroom und beliebige weitere Custom Cards einheitlich editierbar sind.

## Status

**v0.1 live** (Tag `v0.1.0`, 2026-05-25). Editor für jedes HA-Theme im `themes/`-Verzeichnis, mit ha-core-Plugin-Schema + Namens-Heuristik-Fallback, Live-Preview auf `:root`, Save mit Auto-Backup. Nächste Phase: v0.2 (Bubble-Card- + Mushroom-Plugins, Plugin-Tabs).

## Architektur in einem Satz

Lit/TypeScript Custom Panel + Python Custom Integration (Backend für File-I/O), erweiterbar via JSON-Schema-Plugins pro Card-Sammlung.

→ Details: [`ARCHITECTURE.md`](./ARCHITECTURE.md)
→ Phasen: [`ROADMAP.md`](./ROADMAP.md)
→ Festgelegte Entscheidungen: [`DECISIONS.md`](./DECISIONS.md)

## Installation (v0.1, manuell)

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
2. Variablen ändern — Live-Preview greift sofort auf das ganze HA-Frontend
3. Reset-Button (`↺`) pro Variable, oder "Alles verwerfen" oben
4. "Speichern" → automatisches Timestamp-Backup unter `themes/.backups/` + `frontend.reload_themes`

## Test-Umgebung

Live-System des Users (Produktiv-HA). Backup vor invasiven Operationen — Save macht das automatisch, manueller Restore via `themes/.backups/` möglich.
