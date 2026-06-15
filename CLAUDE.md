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

## Aktueller Stand (Stand: 2026-06-15)

**v1.3.1 live** auf Prod-HA. Tag `v1.3.1`. **HACS-Default-PR `hacs/default#8473` eingereicht** (alle Checks grün, Maintainer-Review pending). Submission-Playbook: [`docs/HACS_DEFAULT_SUBMISSION.md`](./docs/HACS_DEFAULT_SUBMISSION.md).

**Seit v1.1 dazugekommen:** v1.2.0 Auto-Snapshot (Δ-Vergleich „was hat das Update geändert") + Audit-Politur (Custom-Modal statt confirm/prompt, Retry-Buttons, Backend-`variables`-Validierung); v1.3.0 i18n Sprach-Override im Header + Live-Switching (LocaleController); v1.3.1 Dark-Default-Button + Post-Fork-„Als Default?"-Hinweis. Details: ROADMAP.md (Bausteine B10–B15).

**v1.0 Basis-Featureset:**
- Custom-Panel "Theme Studio" in der Sidebar (`/theme-studio`)
- **Drei Top-Level-Tabs:** Themes / Bubble Card Module (wenn bubble-card aktiv) / Vergleichen
- **Drei Plugins** (HACS-gefiltert): ha-core (116 Vars / 17 Kategorien), bubble-card (107 Vars / 15 Kategorien, nur wenn `Clooos/Bubble-Card`), mushroom (~109 Vars / 12 Kategorien, nur wenn `piitaya/lovelace-mushroom`) — plus Namens-/Wert-Heuristik
- Picker listet alle Themes aus `<config>/themes/` (Subdirs + Spaces ok)
- Theme-Editor mit Tab-Layout, Mode-Selector (light/dark), Live-Preview auf `:root`, iframe-Dashboard-Preview, Spezial-Controls (Color/Length/Background), Variable-Hinzufügen + -Entfernen, Save mit Timestamp-Backup
- Module-Editor: liest/schreibt `/homeassistant/bubble_card/modules/*.yaml`, Metadaten-Form + Monospace-CSS-Textarea, Backup nach `bubble_card/.backups/`
- Theme-Switcher: side-by-side Diff zwischen 2 Themes mit Color-Swatches, "Nur Unterschiede"-Filter, Copy-Pfeile mit Direct-Write-Save inkl. Backup
- HACS-Packaging: hacs.json + LICENSE im Repo-Root, single-tree Bundle in `custom_components/theme_studio/dist/`

**Post-v1.0-Patches (alle live):**
- **v1.0.1** — Variable-Extraction-Sidebar im Module-Editor (listet `var(--xxx)` mit Schema-Metadaten + Fallback-Parser + Color-Swatch)
- **v1.0.2** — Modes-Vergleich im Theme-Switcher (Mode-Selector + Mode-aware Copy in `modes.<mode>.<key>`)
- **v1.0.3** — Error-Handling Quick-Wins (`beforeunload`-Schutz, HACS-Detection-Fehler im UI sichtbar, Backend-Logging-Symmetrie, typisierte Compare-Status-Union)
- **v1.0.4** — i18n DE+EN: `frontend/src/core/i18n.ts` + `frontend/src/i18n/{de,en}.ts`, Locale-Detection aus `hass.language`. Alle UI-Strings + alle Plugin-Schema-Descriptions + Category-Labels über `*_en`-Felder übersetzt (44 label_en + 332 description_en). `getVariableMeta()` + neuer `getCategoryLabel()` locale-aware.

**v1.1 — Fork-Guard / Copy-on-write (Bausteine 4–9, alle live):**
- **B4** Picker-Badges HACS / Eigen / Default
- **B5** Fork-on-Save + Proaktiv-Fork — HACS-Themes werden nie still zurückgeschrieben (Update würde überschreiben), sondern in ein eigenes Top-Level-Theme abgeleitet (`themes/<slug>.yaml`, update-sicher). `ws_fork_theme` nimmt `new_name` + `variables` (Frontend-Merge)
- **B6** Fork löschen via Sidecar-Registry `themes/.theme_studio.json` (nur echte Forks, reversibel nach `.backups/`) — siehe DECISIONS D11
- **B7** Default-Theme aus dem Panel setzen (`frontend.set_theme`, HA hat dafür keine eigene UI)
- **B8** HG-Bild File-Picker aus `www/` (`list_www_images`-WS, Thumbnail-Grid) + var()-Guard
- **B9** Upstream-Merge: ⇄-Button → Compare-View A=Fork/B=Upstream + Mode-Diff-Badges + Cross-Mode-Hinweis

**Packaging-Patches v1.1.1–v1.1.4** (für HACS-Default): Brand-Assets lokal in `custom_components/theme_studio/brand/`, Plugin-Metadaten `manifest.json`→**`plugin.json`** (HACS verlangt repoweit genau 1 `manifest.json`), `http` in dependencies, `CONFIG_SCHEMA`, manifest-Keys sortiert, `validate.yml`.

**Offen:** HACS-PR #8473 verfolgen (Maintainer-Review); weitere Sprachen FR/IT/ES (große Übersetzung, bei Bedarf/Native-Review — Infra steht); optional `home-assistant/brands`-PR (Icon im HA-Core-UI, für HACS nicht nötig). Audit-Items #2/#3 (Backup-Race, View-Switch-Race) bewusst wontfix. Siehe ROADMAP.md.

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
