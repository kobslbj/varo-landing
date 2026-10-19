/** Locale config shared by the proxy, server components and client components. */
export const locales = ["zh-TW", "en", "ja", "ko"] as const;

export type Locale = (typeof locales)[number];

/** Served at the unprefixed URLs (`/`, `/privacy`); other locales live under `/{locale}`. */
export const defaultLocale: Locale = "zh-TW";

/** Locales with the whole site. Japanese and Korean only have the gym directory. */
export const siteLocales: Locale[] = ["zh-TW", "en"];

/** Where a locale has no page of its own, links go to this one. */
export const fallbackLocale = "en" satisfies Locale;

/** The full-site locale to show content in: Japanese and Korean read English. */
export const siteLocale = (locale: Locale): "zh-TW" | "en" =>
  locale === "zh-TW" ? locale : fallbackLocale;

export const hasLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

/** The locales a page exists in, from its unprefixed path. */
export const localesFor = (path: string): readonly Locale[] =>
  path === "/gyms" || path.startsWith("/gyms/") ? locales : siteLocales;

/**
 * `localizePath("en", "/privacy")` → `/en/privacy`; the default locale stays
 * unprefixed. A page missing in `locale` links to its English version.
 */
export function localizePath(locale: Locale, path: string) {
  const l = localesFor(path).includes(locale) ? locale : fallbackLocale;

  if (l === defaultLocale) return path;

  return path === "/" ? `/${l}` : `/${l}${path}`;
}
