/** Locale config shared by the proxy, server components and client components. */
export const locales = ["zh-TW", "en"] as const;

export type Locale = (typeof locales)[number];

/** Served at the unprefixed URLs (`/`, `/privacy`); other locales live under `/{locale}`. */
export const defaultLocale: Locale = "zh-TW";

export const hasLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

/** `localizePath("en", "/privacy")` → `/en/privacy`; the default locale stays unprefixed. */
export function localizePath(locale: Locale, path: string) {
  if (locale === defaultLocale) return path;

  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}
