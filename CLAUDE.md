# Instructions for Claude (Project: HA Theme Studio)

## Was dieses Projekt ist

Ein UI-Editor für Home-Assistant-Themes. Grafische Verwaltung aller CSS-Variablen mit Live-Preview und Persistenz in `themes/*.yaml`. Modular via JSON-Schema-Plugins erweiterbar (HA-Core, Bubble Card, Mushroom, …).

Lies zwingend zuerst:
1. [`README.md`](./README.md) – Projekt-Überblick
2. [`ARCHITECTURE.md`](./ARCHITECTURE.md) – Architektur-Details
3. [`ROADMAP.md`](./ROADMAP.md) – Phasen v0.1 → v1.0
4. [`DECISIONS.md`](./DECISIONS.md) – Festgelegte Entscheidungen, NICHT ohne Rücksprache ändern

## Arbeitsweise

**Keine Änderungen ohne Absprache.** Erst diskutieren, dann ändern. Der User hat lange Erfahrung mit HA und weiß was er will – Vorschläge ja, eigenmächtige Refactorings nein.

**Erst einen Schritt komplett, dann den nächsten.** Die ROADMAP gibt die Reihenfolge vor. Schritte nicht vermischen, nicht vorgreifen.

**Live-System** – Tests laufen gegen die Produktiv-HA des Users. Vor invasiven Schreiboperationen: Backup vorschlagen, User fragen, reversible Schritte bevorzugen.

**Sauberes Git** – ein Commit pro abgeschlossenem ROADMAP-Schritt. Commit-Messages auf Deutsch oder Englisch, konsistent bleiben.

## HA-Spezifika

Globale HA-Wissensbasis: `/Volumes/Daten/ClaudeCode/ha_quirks.md` – konsultieren bei HA-Themen (WebSocket-API, Integration-Setup, Frontend-Panels).

Best-Practice-Skill (über MCP verfügbar): `home-assistant-best-practices` – konsultieren bei Automation/Helper/Dashboard-Themen.

## Aktueller Stand (Stand: 2026-05-25)

**v1.0 live.** Tag `v1.0.0`, HACS-tauglich. Läuft auf der Produktiv-HA des Users:
- Custom-Panel "Theme Studio" in der Sidebar (`/theme-studio`)
- **Drei Top-Level-Tabs:** Themes / Bubble Card Module (wenn bubble-card aktiv) / Vergleichen
- **Drei Plugins** (HACS-gefiltert): ha-core (116 Vars / 17 Kategorien), bubble-card (107 Vars / 15 Kategorien, nur wenn `Clooos/Bubble-Card`), mushroom (~109 Vars / 12 Kategorien, nur wenn `piitaya/lovelace-mushroom`) — plus Namens-/Wert-Heuristik
- Picker listet alle Themes aus `<config>/themes/` (Subdirs + Spaces ok)
- Theme-Editor mit Tab-Layout (Im Theme + pro Plugin), Mode-Selector (light/dark), Live-Preview auf `:root`, iframe-Dashboard-Preview (sticky 2-Spalten), Spezial-Controls (Color/Length/Background), Variable-Hinzufügen + -Entfernen, Save mit Timestamp-Backup
- Module-Editor (v0.4): liest/schreibt `/homeassistant/bubble_card/modules/*.yaml`, Metadaten-Form + grosse Monospace-CSS-Textarea, Backup nach `bubble_card/.backups/`
- Theme-Switcher (v0.4): side-by-side Diff zwischen 2 Themes mit Color-Swatches, "Nur Unterschiede"-Filter, Copy-Pfeile ← / → mit Direct-Write-Save inkl. Backup
- HACS-Packaging (v1.0): hacs.json + LICENSE im Repo-Root, Bundle wandert von `frontend/dist/` nach `custom_components/theme_studio/dist/` (single-tree für HACS-Install ohne npm-Toolchain), manifest.json `version: 1.0.0`, README mit HACS-Install-Anleitung

v1.0 ist der erste vollständige Release. Künftige Arbeit (v1.0.x / v1.1+): Variable-Extraction im Module-Editor, Modes-Vergleich im Theme-Switcher, Aufnahme in HACS-Default-Katalog, eventuelle UX-Polishs auf User-Feedback hin.

## Deployment auf den HA-Host

Seit v1.0 wohnt alles in einem Tree: `custom_components/theme_studio/` enthält Python-Backend + gebautes Frontend-Bundle unter `dist/`. Auf dem HA-Host landet das unter `/homeassistant/custom_components/theme_studio/`.

**Files-Push** via tar+ssh (SSH-Multiplexing-Problem ⇒ kein scp):
```bash
COPYFILE_DISABLE=1 tar -cz -C custom_components/theme_studio \
    --exclude='__pycache__' --exclude='._*' --exclude='.DS_Store' . \
  | ssh has 'sudo tar -xz -C /homeassistant/custom_components/theme_studio \
             && sudo chown -R root:root /homeassistant/custom_components/theme_studio \
             && sudo find /homeassistant/custom_components/theme_studio -type f -exec chmod 644 {} \; \
             && sudo find /homeassistant/custom_components/theme_studio -type d -exec chmod 755 {} \; \
             && sudo rm -rf /homeassistant/custom_components/theme_studio/__pycache__'
```

**Re-Deploy Frontend-only** (TypeScript/Lit-Änderungen):
1. `cd frontend && npm run build` (schreibt direkt nach `../custom_components/theme_studio/dist/`)
2. Push wie oben — landet automatisch im richtigen Pfad
3. Browser **Cmd+Shift+R** (Hard-Refresh) — kein HA-Restart nötig

**Re-Deploy Backend** (Python-Änderungen):
1. Push (siehe oben — `__pycache__` wird im selben Command gelöscht, ha_quirks Pflicht)
2. `ha_check_config` ⇒ `valid`
3. `ha_restart(confirm=True)` — Config-Entry-Reload reicht NICHT (Python-Module bleiben in `sys.modules`)

**Konfiguration:** `theme_studio:` muss in `configuration.yaml` stehen (YAML-Trigger, kein config_flow). Backup-Datei auf dem Host: `configuration.yaml.bak.pre-theme-studio.<ts>`.

**Hinweis:** Das alte `frontend/dist/`-Layout (mit `/homeassistant/frontend/dist/` als Geschwister von `custom_components/`) ist mit v1.0 weggefallen. `__init__.py` sucht das Bundle jetzt unter `Path(__file__).parent / "dist"`.

## Was NICHT tun

- Keine Custom Cards, kein WYSIWYG-Designer, keine Theme-Marktplatz-Features (Scope-Creep)
- Keine Implementation in HA selbst (z.B. core-Patches) – nur Custom Integration + Frontend
- Keine "Frameworks" für Theme-Inheritance erfinden – CSS-Custom-Properties machen das schon
- Keine eigenen Build-Tools / Plugin-Manager – Vite reicht, JSON-Schemas reichen
- Niemals an User-Themes/Dashboards schreiben ohne explizite Bestätigung
