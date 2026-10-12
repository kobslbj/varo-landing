import type { Metadata } from "next";
import type { ReactNode } from "react";

import { isValidElement } from "react";

import { alt, size } from "@/app/[lang]/opengraph-image";
import { siteConfig } from "@/config/site";
import { cities } from "@/lib/gyms/cities";
import { alternates, getI18n, localizePath, type Locale } from "@/lib/i18n";

// Setting `openGraph` on a page drops the inherited opengraph-image, so it's re-attached here.
const ogImage = { width: size.width, height: size.height, alt };

/**
 * Title, description, canonical/hreflang and matching og/twitter tags for a
 * page. Next merges `openGraph` shallowly, so a page that only sets `title`
 * would keep the home page's og:title and og:url; this sets them per page.
 */
export async function pageMetadata(
  path: string,
  { title, description }: { title: string; description: string },
): Promise<Metadata> {
  const { locale, t } = await getI18n();

  return {
    title,
    description,
    alternates: alternates(locale, path),
    openGraph: {
      type: "website",
      locale: t.ogLocale,
      siteName: siteConfig.name,
      title,
      description,
      url: localizePath(locale, path),
      images: [{ url: `/${locale}/opengraph-image`, ...ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: `/${locale}/twitter-image`, ...ogImage }],
    },
  };
}

/** Indexable pages (unprefixed paths), for the sitemap. */
export const sitePages = [
  { path: "/", priority: 1 },
  { path: "/gyms", priority: 0.8 },
  ...cities.map((c) => ({ path: `/gyms/${c.slug}`, priority: 0.7 })),
  { path: "/philosophy", priority: 0.6 },
  { path: "/partners", priority: 0.5 },
  { path: "/support", priority: 0.5 },
  { path: "/privacy", priority: 0.3 },
];

/** Absolute URL on the canonical origin. */
export const absoluteUrl = (path: string) =>
  new URL(path, siteConfig.siteUrl).toString();

export const organizationId = absoluteUrl("/#organization");
const websiteId = absoluteUrl("/#website");
const appId = absoluteUrl("/#app");

/** Organization + WebSite, the entities every page belongs to. */
export function siteGraph(locale: Locale, description: string) {
  return [
    {
      "@type": "Organization",
      "@id": organizationId,
      name: siteConfig.name,
      alternateName: "Varo",
      url: absoluteUrl("/"),
      logo: absoluteUrl("/icon.png"),
      slogan: "Every attempt counts.",
      email: siteConfig.contactEmail ?? undefined,
      foundingLocation: { "@type": "Country", name: "Taiwan" },
      founder: {
        "@type": "Person",
        name: "Justin Li",
        url: "https://www.justinli.blog/",
      },
    },
    {
      "@type": "WebSite",
      "@id": websiteId,
      name: siteConfig.name,
      url: absoluteUrl("/"),
      description,
      inLanguage: ["zh-Hant-TW", "en"],
      publisher: { "@id": organizationId },
    },
  ];
}

const htmlLang: Record<Locale, string> = { "zh-TW": "zh-Hant-TW", en: "en" };

/**
 * The page being viewed, one node per locale (its `@id` is its canonical URL).
 * Pass `type: "FAQPage"` and `mainEntity` for a page made of questions.
 */
export function webPage(
  locale: Locale,
  path: string,
  {
    name,
    description,
    type = "WebPage",
    ...rest
  }: { name: string; description: string; type?: string } & Record<
    string,
    unknown
  >,
) {
  const url = absoluteUrl(localizePath(locale, path));

  return {
    "@type": type,
    "@id": url,
    url,
    name,
    description,
    inLanguage: htmlLang[locale],
    isPartOf: { "@id": websiteId },
    about: { "@id": appId },
    publisher: { "@id": organizationId },
    ...rest,
  };
}

/** The iOS app itself. Ratings/price are left out until the listing is live. */
export function appEntity(locale: Locale, description: string) {
  return {
    "@type": "MobileApplication",
    "@id": appId,
    name: siteConfig.name,
    alternateName: "Varo",
    description,
    applicationCategory: "SportsApplication",
    applicationSubCategory: locale === "en" ? "Bouldering log" : "抱石紀錄",
    operatingSystem: "iOS",
    inLanguage: ["zh-Hant-TW", "en"],
    countriesSupported: "TW",
    image: absoluteUrl("/icon.png"),
    url: absoluteUrl(localizePath(locale, "/")),
    publisher: { "@id": organizationId },
    ...(siteConfig.appStoreUrl
      ? { installUrl: siteConfig.appStoreUrl, sameAs: [siteConfig.appStoreUrl] }
      : {}),
  };
}

/** Questions for a FAQPage's `mainEntity`. */
export const faqQuestions = (items: { q: string; a: ReactNode }[]) =>
  items.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: nodeText(a) },
  }));

const BLOCK = new Set(["p", "li", "ul", "ol", "div", "section", "h2", "h3"]);

/** Plain text of a JSX tree, so structured data reuses the copy on the page. */
export function nodeText(node: ReactNode): string {
  return rawText(node)
    .replace(/[ \t]*\n[ \t\n]*/g, "\n")
    .replace(/[ \t]+/g, " ")
    .trim();
}

/** Text with inline whitespace kept and a newline around blocks and `<br>`. */
function rawText(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return `${node}`;
  if (Array.isArray(node)) return node.map(rawText).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) {
    if (node.type === "br") return "\n";
    const text = rawText(node.props.children);

    return typeof node.type === "string" && BLOCK.has(node.type)
      ? `\n${text}\n`
      : text;
  }

  return "";
}

/** Renders a schema.org graph as a JSON-LD script tag. */
export function JsonLd({ graph }: { graph: object[] }) {
  const json = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": graph,
  });

  return (
    <script
      // `<` is escaped so copy can never close the script tag.
      dangerouslySetInnerHTML={{ __html: json.replace(/</g, "\\u003c") }}
      type="application/ld+json"
    />
  );
}
