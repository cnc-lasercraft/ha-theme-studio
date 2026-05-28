// Lightweight i18n für das Theme-Studio-Frontend.
//
// Locale wird beim Mount aus `hass.language` ermittelt und ist danach
// effektiv konstant (HA-User-Locale wechselt zur Laufzeit selten).
// Live-Switching wäre möglich (subscribe-Pattern) — bewusst weggelassen
// für v1.0.4, lässt sich nachrüsten falls es Bedarf gibt.
//
// Translations sind als TS-Module gebundlet (de.ts + en.ts), kein
// Runtime-JSON-Fetch. Bundle-Aufschlag ist minimal (~2 kB pro Sprache).

import { messages as de } from "../i18n/de";
import { messages as en } from "../i18n/en";

export type Locale = "de" | "en";

const CATALOGS: Record<Locale, Record<string, string>> = { de, en };

const DEFAULT_LOCALE: Locale = "en";

let _currentLocale: Locale = DEFAULT_LOCALE;

/**
 * Setzt die aktive Locale. Akzeptiert auch HA-Format wie `"de"`, `"en-US"`,
 * `"de-CH"` — Region wird gestrippt, unbekannte Sprachen fallen auf EN zurück.
 */
export function setLocale(raw: string | null | undefined): Locale {
  if (!raw) {
    _currentLocale = DEFAULT_LOCALE;
    return _currentLocale;
  }
  const prefix = raw.toLowerCase().split(/[-_]/, 1)[0];
  _currentLocale = prefix in CATALOGS ? (prefix as Locale) : DEFAULT_LOCALE;
  return _currentLocale;
}

export function getLocale(): Locale {
  return _currentLocale;
}

/**
 * Übersetzt einen Key. Lookup-Reihenfolge:
 * 1. Aktive Locale
 * 2. EN als Fallback (kanonischer Quelltext)
 * 3. DE als zweiter Fallback
 * 4. Wenn `fallback` angegeben → der; sonst der Key selbst (sichtbar als
 *    "missing key marker" beim Debuggen)
 *
 * Optionale Platzhalter via `{name}` werden aus `vars` ersetzt.
 */
export function t(
  key: string,
  fallback?: string,
  vars?: Record<string, string | number>,
): string {
  const tpl =
    CATALOGS[_currentLocale][key] ??
    CATALOGS.en[key] ??
    CATALOGS.de[key] ??
    fallback ??
    key;
  if (!vars) return tpl;
  return tpl.replace(/\{(\w+)\}/g, (_, name) =>
    name in vars ? String(vars[name]) : `{${name}}`,
  );
}
