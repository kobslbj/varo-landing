import type { Metadata } from "next";

import { notFound } from "next/navigation";
import { lang } from "next/root-params";

import { hasLocale, localizePath, locales, type Locale } from "./config";

import en from "@/dictionaries/en";
import zhTW from "@/dictionaries/zh-TW";

export * from "./config";

const dictionaries = { "zh-TW": zhTW, en } satisfies Record<Locale, unknown>;

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
): Metadata["alternates"] {
  return {
    canonical: localizePath(locale, path),
    languages: {
      ...Object.fromEntries(locales.map((l) => [l, localizePath(l, path)])),
      "x-default": path,
    },
  };
}
