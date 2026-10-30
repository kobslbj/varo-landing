import type { Metadata } from "next";

import { notFound } from "next/navigation";
import { lang } from "next/root-params";

import { hasLocale, localesFor, localizePath, type Locale } from "./config";

import en from "@/dictionaries/en";
import ja from "@/dictionaries/ja";
import ko from "@/dictionaries/ko";
import zhTW from "@/dictionaries/zh-TW";

export * from "./config";

const dictionaries = { "zh-TW": zhTW, en, ja, ko } satisfies Record<
  Locale,
  unknown
>;

export type Dictionary = typeof zhTW;

/** The current locale (from the `[lang]` root segment) and its dictionary. */
export async function getI18n() {
  const locale = await lang();

  if (!hasLocale(locale)) notFound();

  return {
    locale,
    t: dictionaries[locale] as Dictionary,
    href: (path: string) => localizePath(locale, path),
  };
}

/** Canonical + hreflang links for a page, e.g. `alternates("/privacy")`. */
export function alternates(
  locale: Locale,
  path: string,
  /** Extra regional hreflang codes and the locale they point at, e.g. { "en-SG": "en" }. */
  regional: Record<string, Locale> = {},
): Metadata["alternates"] {
  return {
    canonical: localizePath(locale, path),
    languages: {
      ...Object.fromEntries(
        localesFor(path).map((l) => [l, localizePath(l, path)]),
      ),
      ...Object.fromEntries(
        Object.entries(regional).map(([code, l]) => [
          code,
          localizePath(l, path),
        ]),
      ),
      "x-default": path,
    },
  };
}
