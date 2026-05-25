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

**Pre-v0.1.** Architektur ist festgelegt, Code noch nicht geschrieben. Nächster Schritt: ROADMAP Schritt 1 (Repo-Skelett).

## Nächster konkreter Auftrag (wenn User "los geht" sagt)

1. Verzeichnisstruktur anlegen gemäß `ARCHITECTURE.md`:
   - `frontend/src/{core,plugins,ui}/`
   - `custom_components/theme_studio/`
2. `frontend/package.json` mit Lit + TypeScript + Vite
3. `frontend/vite.config.ts` mit Custom-Element-Build
4. `frontend/tsconfig.json`
5. `custom_components/theme_studio/manifest.json` (HA-Integration-Manifest)
6. `custom_components/theme_studio/__init__.py` (minimaler Setup, noch keine Logik)
7. `.gitignore` (node_modules, dist, .DS_Store, __pycache__)
8. Commit: "scaffold: v0.1 step 1 — repo skeleton"

Erst **danach** mit Schritt 2 (Backend-WS-Commands) beginnen, und auch das erst nach Bestätigung des Users.

## Was NICHT tun

- Keine Custom Cards, kein WYSIWYG-Designer, keine Theme-Marktplatz-Features (Scope-Creep)
- Keine Implementation in HA selbst (z.B. core-Patches) – nur Custom Integration + Frontend
- Keine "Frameworks" für Theme-Inheritance erfinden – CSS-Custom-Properties machen das schon
- Keine eigenen Build-Tools / Plugin-Manager – Vite reicht, JSON-Schemas reichen
- Niemals an User-Themes/Dashboards schreiben ohne explizite Bestätigung
