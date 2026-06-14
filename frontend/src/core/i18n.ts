// Lightweight i18n für das Theme-Studio-Frontend.
//
// Locale wird beim Mount aus einem localStorage-Override (vom Sprach-Selector
// im Panel-Header) ODER `hass.language` ermittelt. Sprachwechsel zur Laufzeit
// ist live: `setLocale` benachrichtigt Subscriber (siehe locale-controller.ts),
// alle Views re-rendern ohne Reload.
//
// Translations sind als TS-Module gebundlet (de.ts + en.ts), kein
// Runtime-JSON-Fetch. Bundle-Aufschlag ist minimal (~2 kB pro Sprache).

import { messages as de } from "../i18n/de";
import { messages as en } from "../i18n/en";

export type Locale = "de" | "en";

const CATALOGS: Record<Locale, Record<string, string>> = { de, en };

const DEFAULT_LOCALE: Locale = "en";

// Reihenfolge + Anzeige-Namen für den Sprach-Selector.
export const LOCALE_NAMES: Record<Locale, string> = {
  de: "Deutsch",
  en: "English",
};

export function availableLocales(): Locale[] {
  return Object.keys(CATALOGS) as Locale[];
}

const STORAGE_KEY = "theme_studio_locale";

let _currentLocale: Locale = DEFAULT_LOCALE;
const _listeners = new Set<() => void>();

function _resolve(raw: string | null | undefined): Locale {
  if (!raw) return DEFAULT_LOCALE;
  const prefix = raw.toLowerCase().split(/[-_]/, 1)[0];
  return prefix in CATALOGS ? (prefix as Locale) : DEFAULT_LOCALE;
}

/**
 * Setzt die aktive Locale. Akzeptiert auch HA-Format wie `"de"`, `"en-US"`,
 * `"de-CH"` — Region wird gestrippt, unbekannte Sprachen fallen auf EN zurück.
 * Benachrichtigt Subscriber, wenn sich die Locale ändert (Live-Switching).
 */
export function setLocale(raw: string | null | undefined): Locale {
  const next = _resolve(raw);
  if (next !== _currentLocale) {
    _currentLocale = next;
    for (const cb of [..._listeners]) {
      try {
        cb();
      } catch {
        /* ein kaputter Listener darf die anderen nicht blockieren */
      }
    }
  }
  return _currentLocale;
}

export function getLocale(): Locale {
  return _currentLocale;
}

/** Abonniert Locale-Änderungen. Liefert eine Unsubscribe-Funktion. */
export function subscribeLocale(cb: () => void): () => void {
  _listeners.add(cb);
  return () => _listeners.delete(cb);
}

/** Persistierter User-Override (localStorage) oder null. */
export function getLocaleOverride(): Locale | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v && v in CATALOGS ? (v as Locale) : null;
  } catch {
    return null;
  }
}

/** Setzt den User-Override (persistiert) + aktiviert ihn live. */
export function setLocaleOverride(locale: Locale): void {
  try {
    localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    /* localStorage evtl. blockiert — Override gilt dann nur diese Session */
  }
  setLocale(locale);
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
