import type { MetadataRoute } from "next";

import { activeRoutes, gymsWithRoutes } from "@/lib/beta/data";
import { allGyms, gymPath } from "@/lib/gyms/cities";
import { localesFor, localizePath, type Locale } from "@/lib/i18n/config";
import { absoluteUrl, sitePages } from "@/lib/seo";

// Gym beta pages come and go with the gyms' routes.
export const revalidate = 3600;

function entry(
  path: string,
  priority: number,
  changeFrequency: "daily" | "weekly" | "monthly",
  only: readonly Locale[] = localesFor(path),
) {
  return only.map((locale) => ({
    url: absoluteUrl(localizePath(locale, path)),
    changeFrequency,
    priority,
    alternates: {
      languages: Object.fromEntries(
        only.map((l) => [l, absoluteUrl(localizePath(l, path))]),
      ),
    },
  }));
}

/**
 * Every page in every locale, each listing its translations (hreflang), plus
 * each gym's beta page and its routes on the wall now. A retired route
 * leaves the sitemap.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = sitePages.flatMap(({ path, priority, locales: only }) =>
    entry(path, priority, "monthly", only),
  );
  const beta = await Promise.all(
    (await gymsWithRoutes()).map(async ({ externalId, id }) => {
      const [country, slug] = externalId.split(":");
      const gym = allGyms.find(
        (g) => g.id === slug && (g.country ?? "TW").toLowerCase() === country,
      );

      if (!gym) return [];
      const base = `${gymPath(gym)}/beta`;
      const routes = await activeRoutes(id);

      if (!routes.length) return [];

      return [
        ...entry(base, 0.7, "daily"),
        ...routes.flatMap((r) => entry(`${base}/${r.id}`, 0.5, "weekly")),
      ];
    }),
  );

  return [...pages, ...beta.flat()];
}
