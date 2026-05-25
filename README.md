# HA Theme Studio

UI-Editor für Home Assistant Themes – grafische Verwaltung aller Theme-CSS-Variablen mit Live-Preview, Persistenz in `themes/*.yaml`, modular erweiterbar für Custom Cards.

## Warum

HA hat kein UI um Theme-Variablen grafisch zu pflegen. Stattdessen: YAML editieren, Cache leeren, hoffen dass nichts kaputt geht. Studio bietet Color-Picker, Slider, Live-Preview und ein **Plugin-System**, sodass HA-Core-Variablen, Bubble Card, Mushroom und beliebige weitere Custom Cards einheitlich editierbar sind.

## Status

**Greenfield / Pre-v0.1.** Architektur ist festgelegt (siehe `ARCHITECTURE.md`), Implementierung noch nicht gestartet.

## Architektur in einem Satz

Lit/TypeScript Custom Panel + Python Custom Integration (Backend für File-I/O), erweiterbar via JSON-Schema-Plugins pro Card-Sammlung.

→ Details: [`ARCHITECTURE.md`](./ARCHITECTURE.md)
→ Phasen: [`ROADMAP.md`](./ROADMAP.md)
→ Festgelegte Entscheidungen: [`DECISIONS.md`](./DECISIONS.md)

## Test-Umgebung

Live-System des Users (Produktiv-HA). Vorsichtig vorgehen, Backup vor invasiven Operationen.
