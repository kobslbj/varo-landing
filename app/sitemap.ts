import type { MetadataRoute } from "next";

import { localesFor, localizePath } from "@/lib/i18n/config";
import { absoluteUrl, sitePages } from "@/lib/seo";

/** Every page in every locale, each listing its translations (hreflang). */
export default function sitemap(): MetadataRoute.Sitemap {
  return sitePages.flatMap(
    ({ path, priority, locales: only = localesFor(path) }) =>
      only.map((locale) => ({
        url: absoluteUrl(localizePath(locale, path)),
        changeFrequency: "monthly" as const,
        priority,
        alternates: {
          languages: Object.fromEntries(
            only.map((l) => [l, absoluteUrl(localizePath(l, path))]),
          ),
        },
      })),
  );
}
