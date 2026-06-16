# HACS-Default-Submission — Playbook

So bekommt man eine **Custom Integration** in den HACS-Default-Katalog (sodass
User sie ohne „Custom repository" finden). Diese Anleitung entstand aus einer
echten, ~2 h langen Submission von Theme Studio — **alle Stolperfallen sind
hier dokumentiert, in der richtigen Reihenfolge.** Beim nächsten Mal:
Checkliste abarbeiten, fertig.

> **Kernprinzip, das fast alles erklärt:** Die `hacs/default`-PR-Validierung
> prüft **nicht den `main`-Branch, sondern das neueste GitHub-Release**. Jeder
> Fix am Repo wirkt erst, nachdem ein **neues Release** erstellt wurde. Lokal
> grünes CI ≠ grüne PR-Validierung. Darum: **erst alles fixen, Release ganz am
> Schluss, dann erst der PR.**

---

## 0. Voraussetzungen am Repo (einmalig)

- [ ] Repo ist **public**, nicht archiviert, **Issues aktiviert**
- [ ] **Description** + **Topics** gesetzt (z. B. `home-assistant`, `hacs`)
- [ ] **LICENSE** vorhanden (z. B. MIT)
- [ ] **README.md** vorhanden
- [ ] `hacs.json` im Repo-Root mit mindestens `{ "name": "..." }`

## 1. `manifest.json` — exakt korrekt

Pfad: `custom_components/<domain>/manifest.json`.

**Keys müssen sortiert sein: `domain`, `name`, dann ALLE übrigen alphabetisch.**
Sonst: `hassfest [ERROR] [MANIFEST] Manifest keys are not sorted correctly`.

```json
{
  "domain": "theme_studio",
  "name": "Theme Studio",
  "codeowners": ["@cnc-lasercraft"],
  "config_flow": false,
  "dependencies": ["frontend", "http", "websocket_api"],
  "documentation": "https://github.com/<owner>/<repo>",
  "iot_class": "local_push",
  "issue_tracker": "https://github.com/<owner>/<repo>/issues",
  "requirements": [],
  "version": "1.0.0"
}
```

- [ ] **Jede genutzte HA-Komponente in `dependencies`.** Wer `StaticPathConfig`
      / `hass.http` nutzt, braucht `"http"` — auch wenn es transitiv über
      `frontend` lädt. Sonst: `hassfest [ERROR] [DEPENDENCIES] Using component
      http but it's not in 'dependencies'`.
- [ ] `version` vorhanden (HACS-Pflicht für Custom-Integrationen).
- [ ] `codeowners`, `documentation`, `issue_tracker`, `iot_class` gesetzt.

## 2. `CONFIG_SCHEMA` (falls YAML-Setup)

Wenn `__init__.py` ein `async_setup(hass, config)` hat (YAML-getriggert, kein
config_flow), verlangt hassfest ein `CONFIG_SCHEMA`. Ohne Parameter:

```python
import homeassistant.helpers.config_validation as cv
CONFIG_SCHEMA = cv.empty_config_schema(DOMAIN)
```

Sonst: `hassfest [WARNING] [CONFIG_SCHEMA] ... must define CONFIG_SCHEMA ...`
(eskaliert in der Default-Validierung zum Fail).

## 3. Genau EINE `*manifest.json` im ganzen Repo

> ⚠️ **Größte versteckte Falle.** Der hacs/default-Helper
> `scripts/helpers/integration_path.py` macht `glob("**/*manifest.json")` über
> das **gesamte heruntergeladene Repo** und bricht ab, wenn es **nicht genau
> eine** gibt (`print("No manifest"); exit(1)` → Hassfest-Job failt nach ~3 s).

Bei uns hießen drei Frontend-Plugin-Schemas ebenfalls `manifest.json` →
**4 Treffer** → Fail. Lösung: **alles außer der Integration-manifest umbenennen**
(z. B. `plugin.json`) und die Loader-Glob anpassen.

- [ ] `git ls-files | grep -iE 'manifest\.json$'` → **darf nur die eine
      Integration-manifest listen.**

## 4. Brand-Assets (Icon) — Pflicht für Integrationen

**Lokal im Repo — der einzige relevante Weg (kein externer PR):**
- [ ] `custom_components/<domain>/brand/icon.png` (256×256, transparent)
- [ ] `custom_components/<domain>/brand/icon@2x.png` (512×512)
- optional: `dark_icon.png`, `logo.png` / `@2x`-Varianten

HACS akzeptiert diese als Fallback → brands-Check grün **ohne**
`home-assistant/brands`-PR.

> ✅ **Seit HA 2026.3 (Brands Proxy API)** werden Icons von Custom-Integrationen
> **ausschließlich** über den lokalen `brand/`-Ordner geliefert (serviert via
> `/api/brands/integration/<domain>/<image>`, lokal gecacht). **PRs an
> `home-assistant/brands` für Custom-Components werden NICHT mehr akzeptiert**
> (das PR-Template lehnt sie explizit ab, kein `custom_integrations/`-Pfad mehr).
> Der `brand/`-Ordner deckt damit sowohl HACS-Validierung als auch HA-Core-UI ab —
> ein brands-PR entfällt komplett.

> ⚠️ Die Assets müssen **im Release** liegen (siehe Kernprinzip). Wer sie nach
> dem letzten Tag committet, bekommt trotzdem: `<Validation brands> failed: ...
> not listed in the Home Assistant brands repository`.

Icon-PNGs ohne SVG-Renderer erzeugen (nur Pillow vorhanden): Farbrad/Logo bei
hoher Auflösung zeichnen, mit `Image.LANCZOS` auf 512/256 downscalen.

## 5. Validierungs-Workflow im Repo (`.github/workflows/validate.yml`)

Das PR-Template verlangt **bestandene HACS- UND hassfest-Action im eigenen
Repo** (ohne `ignore`-Key) und **Links zu den Runs**.

```yaml
name: Validate
on:
  push: { branches: [main] }
  pull_request:
  schedule: [{ cron: "0 6 * * 1" }]
  workflow_dispatch:
jobs:
  hacs:
    name: HACS
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: hacs/action@main
        with: { category: integration }
  hassfest:
    name: hassfest
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: home-assistant/actions/hassfest@master
```

- [ ] Beide Jobs **grün** auf `main` (Schritte 1–4 müssen sitzen). Run-URL
      merken — die kommt in den PR.

## 6. Neues Release — NACH grüner Validierung

- [ ] `manifest.json` `version` bumpen.
- [ ] Tag + GitHub-Release erstellen **nachdem** der Validate-Workflow grün war
      (PR-Template-Pflicht: „created a new release **after** the validation
      actions were run successfully").

## 7. Der PR an `hacs/default`

> ⚠️ **Format-Falle.** Der `hacs-bot` **schließt PRs automatisch**, die nicht
> dem Template entsprechen (Titel/Body/`tid`). Falsche → `CHANGES_REQUESTED` +
> sofort `closed`, **ohne Kommentar**. Reopen geht nicht — **neuer PR nötig**.

- [ ] **Titel exakt:** `Adds new integration [<owner>/<repo>]`
      (NICHT „Add <owner>/<repo>").
- [ ] **Datei `integration`** (JSON-Array) editieren: `"<owner>/<repo>",` an der
      **case-insensitiv alphabetisch korrekten** Position einfügen (CI-Check
      `Sorted` schlägt sonst fehl).
- [ ] **Body = das PR-Template des Repos**, alle Boxen `[x]`, Links-Sektion
      gefüllt, **inkl. des `<!-- tid:... -->`-Markers** (Bot prüft ihn). Das
      Template liegt unter `.github/PULL_REQUEST_TEMPLATE.md` in `hacs/default`
      — von dort die aktuelle `tid` kopieren.

Body-Vorlage (Links anpassen):

```markdown
## Checklist

- [x] I've read the publishing documentation.
- [x] I've added the HACS action to my repository.
- [x] (For integrations only) I've added the hassfest action to my repository.
- [x] The actions are passing without any disabled checks in my repository.
- [x] I've added a link to the action run on my repository below in the links section.
- [x] I've created a new release of the repository after the validation actions were run successfully.

## Links

Link to current release: <https://github.com/<owner>/<repo>/releases/tag/<vX.Y.Z>>
Link to successful HACS action (without the `ignore` key): <https://github.com/<owner>/<repo>/actions/runs/<RUN_ID>>
Link to successful hassfest action (if integration): <https://github.com/<owner>/<repo>/actions/runs/<RUN_ID>>

<!-- tid:<aus dem aktuellen Template kopieren> -->
```

- [ ] Nach dem Öffnen: **alle ~11 Checks grün** + PR bleibt **OPEN** mit
      `REVIEW_REQUIRED` → korrekt eingereicht. Dann nur noch Maintainer-Review
      abwarten (Tage–Wochen).

---

## Ablauf in einem Rutsch (Reihenfolge ist entscheidend)

1. Repo-Basics (0) + manifest (1) + CONFIG_SCHEMA (2) + Single-manifest (3) +
   Brand-Assets (4) + Workflow (5) committen → `main`.
2. Warten bis Validate-Workflow **grün** (HACS **und** hassfest). Run-URL notieren.
3. **Erst jetzt** Release erstellen (6).
4. PR im korrekten Format öffnen (7).
5. Bleibt der PR offen + grün → fertig eingereicht. Wird er sofort geschlossen
   → Format/Inhalt gegen Template prüfen, **neuen** PR öffnen (nicht reopen).

## Häufige Fehlersignaturen → Ursache

| Signatur | Ursache | Fix |
|---|---|---|
| `<Validation brands> failed ... not listed` | Brand-Assets nicht **im Release** | Assets committen, **neues Release** |
| Hassfest-Job failt nach ~3 s, „No manifest" | mehrere `*manifest.json` im Repo | alle außer Integration umbenennen |
| `[MANIFEST] keys are not sorted` | manifest-Reihenfolge | `domain, name, dann alphabetisch` |
| `[DEPENDENCIES] Using component X` | Dependency fehlt in manifest | in `dependencies` ergänzen |
| `[CONFIG_SCHEMA] must define ...` | `async_setup` ohne Schema | `cv.empty_config_schema(DOMAIN)` |
| PR sofort `closed`, kein Kommentar | falscher Titel/Body/`tid` | Template exakt befolgen, neuer PR |
| CI-Check `Sorted` fail | Zeile an falscher Position | case-insensitiv alphabetisch einsortieren |
