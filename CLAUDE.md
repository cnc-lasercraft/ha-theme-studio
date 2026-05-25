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

**v0.4 live.** Tag `v0.4.0`. Läuft auf der Produktiv-HA des Users:
- Custom-Panel "Theme Studio" in der Sidebar (`/theme-studio`)
- **Drei Top-Level-Tabs:** Themes / Bubble Card Module (wenn bubble-card aktiv) / Vergleichen
- **Drei Plugins** (HACS-gefiltert): ha-core (116 Vars / 17 Kategorien), bubble-card (107 Vars / 15 Kategorien, nur wenn `Clooos/Bubble-Card`), mushroom (~109 Vars / 12 Kategorien, nur wenn `piitaya/lovelace-mushroom`) — plus Namens-/Wert-Heuristik
- Picker listet alle Themes aus `<config>/themes/` (Subdirs + Spaces ok)
- Theme-Editor mit Tab-Layout (Im Theme + pro Plugin), Mode-Selector (light/dark), Live-Preview auf `:root`, iframe-Dashboard-Preview (sticky 2-Spalten), Spezial-Controls (Color/Length/Background), Variable-Hinzufügen + -Entfernen, Save mit Timestamp-Backup
- Module-Editor (v0.4): liest/schreibt `/homeassistant/bubble_card/modules/*.yaml`, Metadaten-Form + grosse Monospace-CSS-Textarea, Backup nach `bubble_card/.backups/`
- Theme-Switcher (v0.4): side-by-side Diff zwischen 2 Themes mit Color-Swatches, "Nur Unterschiede"-Filter, Copy-Pfeile ← / → mit Direct-Write-Save inkl. Backup

Nächste Phase: **v1.0** — Polishing, finale Doku, HACS-Release (hacs.json, Repository-Struktur, Release-Notes). Siehe [`ROADMAP.md`](./ROADMAP.md).

## Deployment auf den HA-Host

Repo-Layout auf dem Host: `/homeassistant/custom_components/theme_studio/` (Backend) + `/homeassistant/frontend/dist/` (Built Frontend). Der Backend-Pfad-Trick (`Path(__file__).parent.parent.parent / "frontend" / "dist"`) braucht beide Pfade als Geschwister unter `/homeassistant/`.

**Files-Push** via tar+ssh (SSH-Multiplexing-Problem ⇒ kein scp):
```bash
COPYFILE_DISABLE=1 tar -cz -C <local> --exclude='__pycache__' --exclude='._*' --exclude='.DS_Store' . \
  | ssh has 'sudo tar -xz -C <remote> && sudo chown -R root:root <remote> && sudo chmod 644 <remote>/*'
```

**Re-Deploy Frontend-only** (TypeScript/Lit-Änderungen):
1. `cd frontend && npm run build`
2. tar+ssh push nach `/homeassistant/frontend/dist/`
3. Browser **Cmd+Shift+R** (Hard-Refresh) — kein HA-Restart nötig

**Re-Deploy Backend** (Python-Änderungen):
1. tar+ssh push nach `/homeassistant/custom_components/theme_studio/`
2. `__pycache__` löschen (ha_quirks Pflicht)
3. `ha_check_config` ⇒ `valid`
4. `ha_restart(confirm=True)` — Config-Entry-Reload reicht NICHT (Python-Module bleiben in `sys.modules`)

**Konfiguration:** `theme_studio:` muss in `configuration.yaml` stehen (YAML-Trigger, kein config_flow in v0.1). Backup-Datei auf dem Host: `configuration.yaml.bak.pre-theme-studio.<ts>`.

## Was NICHT tun

- Keine Custom Cards, kein WYSIWYG-Designer, keine Theme-Marktplatz-Features (Scope-Creep)
- Keine Implementation in HA selbst (z.B. core-Patches) – nur Custom Integration + Frontend
- Keine "Frameworks" für Theme-Inheritance erfinden – CSS-Custom-Properties machen das schon
- Keine eigenen Build-Tools / Plugin-Manager – Vite reicht, JSON-Schemas reichen
- Niemals an User-Themes/Dashboards schreiben ohne explizite Bestätigung
