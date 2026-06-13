# Festgelegte Entscheidungen

Diese Entscheidungen sind nach Diskussion mit dem User getroffen und gelten als Baseline. Änderungen NUR nach erneuter Absprache.

## D1 – Backend ja
Eigene Custom Integration (Python) für File-I/O statt Shell-Hacks oder AppDaemon. Sauber, HACS-tauglich, kontrollierbar.

## D2 – HACS später
Erstmal als Privat-Tool entwickeln, HACS-Veröffentlichung in v1.0. Spart Versions-Disziplin-Aufwand in der frühen Phase.

## D3 – Generisch
Studio editiert **jedes** Theme im `themes/`-Verzeichnis, nicht nur visionOS. Ermöglicht später Community-Nutzung.

## D4 – Bubble-Card-Module in v0.4
Module-Verwaltung kommt nicht in v0.1. Erst der Variablen-Editor stabilisieren, dann den komplexeren Modul-Layer.

## D5 – Test auf Live-System
Entwicklung und Tests laufen gegen die produktive HA-Instanz des Users. **Konsequenzen:**
- Backup vor invasiven Operationen
- Keine destruktiven Defaults
- Reversibilität bei allen Schreiboperationen sicherstellen
- Bei Unsicherheit: User fragen, nicht handeln

## D6 – Git von Anfang an
Repository initialisiert ab Tag 1. Saubere Commit-Historie als Doku-Ersatz.

## D7 – Form-Faktor: Custom Panel
Nicht Custom Card. Voller Screen, eigene Routes.

## D8 – Tech Stack
Lit + TypeScript (Frontend), Python (Backend), Vite (Build). HA-Standard-Stack, kein React/Vue.

## D9 – Plugin-System ist Pflicht
Modularität ab v0.1 eingebaut, nicht nachgerüstet. Der Core kennt nur Schemas, nie konkrete Card-Sammlungen.

## D10 – Theme-Picker als Start-Flow + Heuristik-Fallback
Studio öffnet auf einer Theme-Auswahl, nicht einem leeren Editor. Editor funktioniert ab v0.1 für **jedes** Theme im `themes/`-Verzeichnis. Variablen ohne Plugin-Schema bekommen über Namens-Heuristik (`-color`, `-radius`, `-family`, `-shadow`, …) den passenden Control, im Notfall einen Raw-Text-Input. So ist Studio nicht auf visionOS oder bekannte Themes beschränkt.

## D11 – Theme-Löschen: nur echte Forks, via Sidecar-Registry (v1.1, Baustein 6)
Studio kann abgeleitete Themes löschen — aber **nur per Theme Studio erzeugte Forks**, nie HACS-Themes (Unterordner) und nie handgemachte Top-Level-Themes.
- **Erkennung über Sidecar-Registry** `themes/.theme_studio.json` (`{forks: {<datei>: {source_file, source_theme, new_name, created}}}`), **nicht** über einen Marker-Key im Theme-YAML. Begründung: HA macht aus jedem Theme-Key automatisch eine CSS-Variable — ein In-YAML-Marker (`_theme_studio_fork`) würde zu `--_theme_studio_fork` und müsste überall ausgeblendet werden. Die Registry hält das Theme-YAML 100 % sauber und speichert zusätzlich die Herkunft → Voraussetzung für den späteren Upstream-Merge (Fork ↔ HACS-Quelle).
- **Reversibel + doppelt abgesichert** (D5): `delete_theme` verlangt Top-Level **und** Registry-Eintrag, sichert die Datei nach `.backups/` und entfernt erst dann das Original + den Registry-Eintrag. HACS-Quellen werden nie angefasst.
- **Selbstheilend:** Registry-Einträge ohne existierende Datei werden ignoriert (Scan markiert nur vorhandene Dateien als `is_fork`).
