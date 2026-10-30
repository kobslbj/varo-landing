import type { Metadata } from "next";

import clsx from "clsx";
import Link from "next/link";

import { GymsCaveat, GymsClosing, gymsHeading } from "./sections";

import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";
import { Card, Container } from "@/components/landing/ui";
import {
  abroadHubs,
  cityPath,
  gymPath,
  gymsIn,
  regionalFor,
} from "@/lib/gyms/cities";
import { cityFacts } from "@/lib/gyms/city-facts";
import { abroadCheckedAt } from "@/lib/gyms/data-abroad";
import { localizeGym } from "@/lib/gyms/localize";
import { getI18n } from "@/lib/i18n";
import {
  absoluteUrl,
  faqQuestions,
  JsonLd,
  pageMetadata,
  webPage,
} from "@/lib/seo";

type Hub = (typeof abroadHubs)[number];

/**
 * A country page for a region with several cities (Malaysia): every gym,
 * grouped by city, each city linking to its own map page. This is the page
 * for searches like "bouldering gyms in Malaysia".
 */
async function load(hub: Hub) {
  const i18n = await getI18n();
  const { t, locale } = i18n;
  const country = t.gyms.countries[hub.country];
  const cityName = (name: string) => t.gyms.cities[name] ?? name;
  const groups = hub.cities.map((c) => ({
    ...c,
    label: cityName(c.name),
    gyms: gymsIn(c.name).map((g) => localizeGym(g, locale)),
  }));
  const all = groups.flatMap((g) => g.gyms);
  const year = Number(abroadCheckedAt.slice(0, 4));
  const copy = t.gymsAbroad.hub;

  return {
    ...i18n,
    country,
    groups,
    all,
    year,
    path: `/gyms/${hub.slug}`,
    title: copy.metaTitle(
      country,
      all.length,
      groups.map((g) => g.label),
      year,
    ),
    description: copy.description(
      country,
      all.length,
      groups.map((g) => g.label),
    ),
    facts: cityFacts(country, all, abroadCheckedAt, (g) => g, country),
  };
}

export async function hubMetadata(hub: Hub): Promise<Metadata> {
  const { path, title, description } = await load(hub);

  return pageMetadata(path, {
    title,
    description,
    regional: regionalFor(hub.country),
  });
}

export async function HubPage({ hub }: { hub: Hub }) {
  const {
    locale,
    t,
    href,
    country,
    groups,
    all,
    path,
    title,
    description,
    facts,
  } = await load(hub);
  const copy = t.gymsAbroad;
  const heading = gymsHeading(locale);
  const faq = [
    {
      ...copy.hub.where(country),
      items: groups.map((g) =>
        copy.hub.cityLine(
          g.label,
          g.gyms.length,
          g.gyms.map((x) => x.name),
        ),
      ),
    },
    ...(facts.ropes.length ? [copy.faq.ropes(facts)] : []),
    copy.faq.hours(facts),
  ];

  return (
    <>
      <JsonLd
        graph={[
          webPage(locale, path, {
            name: title,
            description,
            dateModified: abroadCheckedAt,
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: t.gyms.nav,
                  item: absoluteUrl(href("/gyms")),
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: country,
                  item: absoluteUrl(href(path)),
                },
              ],
            },
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: all.length,
              itemListElement: all.map((g, i) => ({
                "@type": "ListItem",
                position: i + 1,
                item: {
                  "@type": "ExerciseGym",
                  "@id": `${absoluteUrl(href(gymPath(g)))}#gym`,
                  url: absoluteUrl(href(gymPath(g))),
                  name: g.name,
                  ...(g.address
                    ? {
                        address: {
                          "@type": "PostalAddress",
                          streetAddress: g.address,
                          addressLocality: t.gyms.cities[g.city] ?? g.city,
                          addressCountry: hub.country,
                        },
                      }
                    : {}),
                  ...(g.lat != null && g.lng != null
                    ? {
                        geo: {
                          "@type": "GeoCoordinates",
                          latitude: g.lat,
                          longitude: g.lng,
                        },
                      }
                    : {}),
                },
              })),
            },
          }),
          {
            "@type": "FAQPage",
            "@id": `${absoluteUrl(href(path))}#faq`,
            mainEntity: faqQuestions(
              faq.map(({ q, a, items }) => ({
                q,
                a: items
                  ? `${a}${items.join(t.gymsCity.listSep)}${t.gymsCity.listEnd}`
                  : a,
              })),
            ),
          },
        ]}
      />
      <SiteHeader path={path} />
      <main className="relative">
        <Container className="relative pb-10 pt-32 sm:pt-40">
          <nav aria-label="Breadcrumb" className="text-[15px] text-mute">
            <Link
              className="underline decoration-line underline-offset-4 transition-colors hover:text-lime-ink hover:decoration-lime"
              href={href("/gyms")}
            >
              {t.gyms.nav}
            </Link>
            <span aria-hidden className="mx-2">
              /
            </span>
            <span aria-current="page">{country}</span>
          </nav>
          <h1 className={clsx("rise mt-5 text-[40px] sm:text-[60px]", heading)}>
            {copy.hub.title(country)}
          </h1>
          <p
            className="rise mt-6 max-w-[40rem] text-[17px] leading-[1.8] text-mute [text-wrap:pretty] sm:text-[19px]"
            style={{ ["--rise-delay" as string]: "80ms" }}
          >
            {copy.hub.lead(
              all.length,
              groups.map((g) => ({ name: g.label, n: g.gyms.length })),
            )}
          </p>
        </Container>

        {/* One card per city, its gyms listed and linked */}
        <Container className="relative grid gap-3 pb-20 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((g, i) => (
            <Card
              key={g.slug}
              className="reveal flex flex-col p-6 sm:p-7"
              style={{ ["--i" as string]: i % 3 }}
            >
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="text-[24px] font-bold leading-tight">
                  <Link
                    className="underline decoration-lime decoration-2 underline-offset-4 hover:text-lime-ink"
                    href={href(cityPath(g.name))}
                  >
                    {g.label}
                  </Link>
                </h2>
                <span className="shrink-0 text-[13px] text-mute tabular">
                  {g.gyms.length} {t.gyms.abroad.unit(g.gyms.length)}
                </span>
              </div>
              <ul className="mt-5 border-t border-line">
                {g.gyms.map((gym) => (
                  <li key={gym.id} className="border-b border-line">
                    <Link
                      className="flex items-center justify-between gap-3 py-2.5 text-[15px] transition-colors hover:text-lime-ink"
                      href={href(gymPath(gym))}
                    >
                      <span className="min-w-0 truncate" lang="zh-Hant">
                        {gym.name}
                      </span>
                      <span className="shrink-0 text-[12px] text-mute">
                        {gym.district}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                className="mt-5 text-[14px] font-semibold text-mute transition-colors hover:text-cream"
                href={href(cityPath(g.name))}
              >
                {copy.hub.seeCity(g.label)}
              </Link>
            </Card>
          ))}
        </Container>

        <Container className="relative pb-20">
          <h2 className={clsx("text-[30px] sm:text-[38px]", heading)}>
            {t.gymsCity.faqTitle}
          </h2>
          <dl className="mt-8 max-w-[48rem] divide-y divide-line border-y border-line">
            {faq.map(({ q, a, items }) => (
              <div key={q} className="py-6">
                <dt className="text-[18px] font-bold">{q}</dt>
                <dd className="mt-2 text-[16px] leading-[1.8] text-mute">
                  <p>{a}</p>
                  {items ? (
                    <ul className="mt-2 flex flex-col gap-1.5">
                      {items.map((item) => (
                        <li key={item} className="flex gap-2.5">
                          <span
                            aria-hidden
                            className="mt-[11px] size-[5px] shrink-0 rounded-full bg-night"
                          />
                          <span className="text-cream/90">{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </dd>
              </div>
            ))}
          </dl>
        </Container>

        <GymsCaveat checked={abroadCheckedAt} />
        <GymsClosing />
      </main>
      <SiteFooter />
    </>
  );
}
