import type { Metadata } from "next";

import clsx from "clsx";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  GymsCaveat,
  GymsClosing,
  GymsMap,
  gymsHeading,
} from "@/components/gyms/sections";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";
import { Container } from "@/components/landing/ui";
import {
  cities,
  cityBySlug,
  cityPath,
  gymsIn,
  gymPath,
  shortName,
} from "@/lib/gyms/cities";
import { cityFacts } from "@/lib/gyms/city-facts";
import { localizeGym } from "@/lib/gyms/localize";
import { checkedAt } from "@/lib/gyms/data";
import { getI18n, type Dictionary } from "@/lib/i18n";
import {
  absoluteUrl,
  faqQuestions,
  JsonLd,
  pageMetadata,
  webPage,
} from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return cities.map((c) => ({ city: c.slug }));
}

type Props = { params: Promise<{ city: string }> };

async function load(params: Props["params"]) {
  const { city: slug } = await params;
  const city = cityBySlug(slug);

  if (!city) notFound();
  const i18n = await getI18n();
  // Chinese headings use the searched-for short name (台北), English the city's name.
  const name =
    i18n.locale === "zh-TW"
      ? shortName(city.name)
      : (i18n.t.gyms.cities[city.name] ?? city.name);
  const list = gymsIn(city.name);

  return {
    ...i18n,
    city,
    list,
    path: `/gyms/${city.slug}`,
    facts: cityFacts(name, list, checkedAt, (g) => localizeGym(g, i18n.locale)),
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { t, path, facts } = await load(params);

  return pageMetadata(path, {
    title: t.gymsCity.meta.title(facts),
    description: t.gymsCity.meta.description(facts),
  });
}

/** Only the questions the data can answer. */
function faqFor(
  copy: Dictionary["gymsCity"],
  facts: ReturnType<typeof cityFacts>,
) {
  return [
    copy.faq.count(facts),
    copy.faq.price(facts),
    ...(facts.beginners.length ? [copy.faq.beginners(facts)] : []),
    ...(facts.kids.length ? [copy.faq.kids(facts)] : []),
  ];
}

export default async function CityGymsPage({ params }: Props) {
  const { locale, t, href, city, list, path, facts } = await load(params);
  const copy = t.gymsCity;
  const faq = faqFor(copy, facts);
  const heading = gymsHeading(locale);
  const others = cities.filter((c) => c.name !== city.name);

  return (
    <>
      <JsonLd
        graph={[
          webPage(locale, path, {
            name: copy.meta.title(facts),
            description: copy.meta.description(facts),
            dateModified: checkedAt,
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: t.gyms.title,
                  item: absoluteUrl(href("/gyms")),
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: facts.city,
                  item: absoluteUrl(href(path)),
                },
              ],
            },
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: list.length,
              itemListElement: list.map((g, i) => ({
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
                          addressLocality: city.name,
                          addressCountry: "TW",
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
                  ...(g.phone ? { telephone: g.phone } : {}),
                  ...(g.website ? { sameAs: [g.website] } : {}),
                },
              })),
            },
          }),
          {
            "@type": "FAQPage",
            "@id": `${absoluteUrl(href(path))}#faq`,
            // Structured data gets the same answer as one paragraph.
            mainEntity: faqQuestions(
              faq.map(({ q, a, items }) => ({
                q,
                a: items ? `${a}${items.join(copy.listSep)}${copy.listEnd}` : a,
              })),
            ),
          },
        ]}
      />
      <SiteHeader path={path} />
      <main className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[900px] opacity-[0.25] [background-image:radial-gradient(#2c2f33_1.2px,transparent_1.2px)] [background-size:30px_30px] [mask-image:linear-gradient(to_bottom,black,transparent)]"
        />

        <Container className="relative pb-10 pt-32 sm:pt-40">
          <nav aria-label="Breadcrumb" className="text-[15px] text-mute">
            <Link
              className="underline decoration-line underline-offset-4 transition-colors hover:text-lime hover:decoration-lime"
              href={href("/gyms")}
            >
              {t.gyms.title}
            </Link>
            <span aria-hidden className="mx-2">
              /
            </span>
            <span aria-current="page">{facts.city}</span>
          </nav>
          <h1 className={clsx("rise mt-5 text-[40px] sm:text-[60px]", heading)}>
            {copy.title(facts.city)}
          </h1>
          <p
            className="rise mt-6 max-w-[40rem] text-[17px] leading-[1.8] text-mute [text-wrap:pretty] sm:text-[19px]"
            style={{ ["--rise-delay" as string]: "80ms" }}
          >
            {copy.lead(facts, (k) => t.gyms.kinds[k])}
          </p>
        </Container>

        <Container className="relative pb-20">
          <GymsMap cityOrder={[city.name]} gyms={list} />
        </Container>

        {/* Questions people search for, answered from the list above */}
        <Container className="relative pb-20">
          <h2 className={clsx("text-[30px] sm:text-[38px]", heading)}>
            {copy.faqTitle}
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
                            className="mt-[11px] size-[5px] shrink-0 rounded-full bg-lime"
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

        {/* Every other city, so each page links to the rest */}
        <Container className="relative pb-20">
          <h2 className="text-[20px] font-bold">{copy.otherCities}</h2>
          <ul className="mt-5 flex flex-wrap gap-2">
            {others.map((c) => (
              <li key={c.slug}>
                <Link
                  className="flex h-10 items-center gap-2 rounded-full border border-line px-4 text-[15px] font-medium transition-colors hover:border-lime hover:text-lime"
                  href={href(cityPath(c.name))}
                >
                  {t.gyms.cities[c.name] ?? c.name}
                  <span className="text-[13px] text-mute tabular">
                    {gymsIn(c.name).length}
                  </span>
                </Link>
              </li>
            ))}
            <li>
              <Link
                className="flex h-10 items-center rounded-full bg-cream px-4 text-[15px] font-semibold text-ink transition-colors hover:bg-white"
                href={href("/gyms")}
              >
                {copy.allGyms}
              </Link>
            </li>
          </ul>
        </Container>

        <GymsCaveat />
        <GymsClosing />
      </main>
      <SiteFooter />
    </>
  );
}
