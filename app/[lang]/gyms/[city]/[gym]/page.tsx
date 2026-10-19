import type { Metadata } from "next";
import type { ReactNode } from "react";

import Link from "next/link";
import { notFound } from "next/navigation";

import { GymsClosing, gymsHeading } from "@/components/gyms/sections";
import { SiteHeader } from "@/components/landing/site-header";
import { SiteFooter } from "@/components/landing/site-footer";
import { Container } from "@/components/landing/ui";
import { siteConfig } from "@/config/site";
import {
  cities,
  cityBySlug,
  cityPath,
  gymPath,
  gymsIn,
} from "@/lib/gyms/cities";
import { checkedAt } from "@/lib/gyms/data";
import { getI18n } from "@/lib/i18n";
import { absoluteUrl, JsonLd, pageMetadata, webPage } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return cities.flatMap((city) =>
    gymsIn(city.name).map((gym) => ({ city: city.slug, gym: gym.id })),
  );
}

type Props = { params: Promise<{ city: string; gym: string }> };

async function load(params: Props["params"]) {
  const { city: slug, gym: id } = await params;
  const city = cityBySlug(slug);
  const gym = city && gymsIn(city.name).find((g) => g.id === id);

  if (!gym) notFound();
  const i18n = await getI18n();
  const g = i18n.t.gymPage;
  const cityName = i18n.t.gyms.cities[gym.city] ?? gym.city;

  return {
    ...i18n,
    gym,
    path: gymPath(gym),
    title: g.title(gym.name, cityName),
    description: g.description({
      name: gym.name,
      city: cityName,
      cityZh: gym.city,
      district: gym.district,
      priced: Boolean(gym.price),
    }),
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { path, title, description } = await load(params);

  return pageMetadata(path, { title, description });
}

export default async function GymPage({ params }: Props) {
  const {
    gym: g,
    locale,
    t,
    href,
    path,
    title,
    description,
  } = await load(params);
  const c = t.gyms;
  const p = t.gymPage;
  const missing = p.missing;
  const official = Array.from(
    new Set(
      [g.website, g.instagram, g.facebook].filter((url): url is string =>
        Boolean(url),
      ),
    ),
  );
  const rows: { label: string; body: ReactNode }[] = [
    { label: c.address, body: g.address ?? missing },
    {
      label: c.hours,
      body: (
        <>
          <ul>
            {g.hours?.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
          {!g.hours?.length && <p>{missing}</p>}
          {g.hoursNote && (
            <p className="mt-3 text-[14px] text-mute">{g.hoursNote}</p>
          )}
        </>
      ),
    },
    {
      label: p.prices,
      body: g.price ? (
        <>
          <ul>
            {(
              [
                [c.weekday, g.price.weekday],
                [c.weekend, g.price.weekend],
                [c.shoes, g.price.shoes],
              ] as const
            ).map(([label, amount]) =>
              amount != null ? (
                <li key={label}>
                  {label}：NT$ {amount}
                </li>
              ) : null,
            )}
          </ul>
          {g.price.notes && <p>{g.price.notes}</p>}
          <p className="mt-3 text-[14px] text-mute">
            {p.sourceNote}
            {g.price.source}
          </p>
        </>
      ) : (
        missing
      ),
    },
    { label: c.courses, body: g.courses ?? missing },
    { label: c.facilities, body: g.facilities ?? missing },
    { label: c.booking, body: g.booking ?? missing },
    ...(g.notes ? [{ label: c.notes, body: g.notes }] : []),
  ];

  return (
    <>
      <JsonLd
        graph={[
          webPage(locale, path, {
            name: title,
            description,
            about: { "@id": `${absoluteUrl(href(path))}#gym` },
            mainEntity: { "@id": `${absoluteUrl(href(path))}#gym` },
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: c.title,
                  item: absoluteUrl(href("/gyms")),
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: c.cities[g.city] ?? g.city,
                  item: absoluteUrl(href(cityPath(g.city))),
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: g.name,
                  item: absoluteUrl(href(path)),
                },
              ],
            },
          }),
          {
            "@type": "ExerciseGym",
            "@id": `${absoluteUrl(href(path))}#gym`,
            name: g.name,
            url: absoluteUrl(href(path)),
            sameAs: official,
            ...(g.address
              ? {
                  address: {
                    "@type": "PostalAddress",
                    streetAddress: g.address,
                    addressLocality: g.city,
                    addressCountry: "TW",
                  },
                }
              : {}),
            ...(g.phone ? { telephone: g.phone } : {}),
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
        ]}
      />
      <SiteHeader path={path} />
      <main>
        <Container className="pb-16 pt-32 sm:pt-40">
          <nav
            aria-label={c.breadcrumb}
            className="flex flex-wrap gap-2 text-[15px] text-mute"
          >
            <Link
              className="underline underline-offset-4 hover:text-lime"
              href={href("/gyms")}
            >
              {c.title}
            </Link>
            <span aria-hidden>/</span>
            <Link
              className="underline underline-offset-4 hover:text-lime"
              href={href(cityPath(g.city))}
            >
              {c.cities[g.city] ?? g.city}
            </Link>
          </nav>
          <h1
            className={`mt-6 max-w-[52rem] text-[36px] sm:text-[52px] ${gymsHeading(locale)}`}
            lang="zh-Hant"
          >
            {g.name}
          </h1>
          <p className="mt-5 text-[17px] text-mute">
            {c.kinds[g.kind]} ·{" "}
            <span lang="zh-Hant">
              {g.city}
              {g.district}
            </span>
          </p>
          {!g.confirmed && (
            <p className="mt-4 font-semibold text-hold-orange">
              {c.unconfirmed}
            </p>
          )}
          <div className="mt-8 flex flex-wrap gap-3">
            {g.mapsUrl && (
              <a
                className="rounded-lg bg-cream px-5 py-3 font-semibold text-ink hover:bg-white"
                href={g.mapsUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                {c.directions}
              </a>
            )}
            {g.phone && (
              <a
                className="rounded-lg border border-line px-5 py-3 hover:border-lime"
                href={`tel:${g.phone.replace(/[^\d+]/g, "")}`}
              >
                {c.call} {g.phone}
              </a>
            )}
          </div>
          <div className="mt-12 grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_20rem]">
            <dl className="divide-y divide-line border-y border-line">
              {rows.map(({ label, body }) => (
                <div
                  key={label}
                  className="grid gap-3 py-6 sm:grid-cols-[10rem_1fr] sm:gap-6"
                >
                  <dt className="font-semibold">{label}</dt>
                  <dd
                    className="min-w-0 text-[16px] leading-[1.85] text-cream/90"
                    lang="zh-Hant"
                  >
                    {body}
                  </dd>
                </div>
              ))}
            </dl>
            <aside className="border-t-2 border-lime pt-5">
              <h2 className="text-[21px] font-bold">{p.sourcesTitle}</h2>
              <p className="mt-4 text-[14px] text-mute">
                {p.checked}
                <time dateTime={checkedAt}>{c.date(checkedAt)}</time>
              </p>
              <p className="mt-4 text-[15px] leading-[1.8] text-mute">
                {p.sourcesBody}
              </p>
              <h3 className="mt-6 font-semibold">{p.officialLinks}</h3>
              <ul className="mt-3 space-y-3 text-[14px]">
                {official.map((url) => (
                  <li key={url}>
                    <a
                      className="break-all underline decoration-line underline-offset-4 hover:text-lime"
                      href={url}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {url.replace(/^https?:\/\//, "")}
                    </a>
                  </li>
                ))}
              </ul>
              {!official.length && (
                <p className="mt-3 text-[14px] text-mute">{missing}</p>
              )}
              <p className="mt-4 text-[14px] leading-relaxed text-mute">
                {p.officialNote}
              </p>
              <a
                className="mt-6 inline-block text-[15px] font-semibold underline underline-offset-4 hover:text-lime"
                href={`mailto:${siteConfig.contactEmail}?subject=${encodeURIComponent(`${c.caveat.reportSubject}：${g.name}`)}`}
              >
                {c.caveat.reportLink}
              </a>
            </aside>
          </div>
          <Link
            className="mt-10 inline-block underline underline-offset-4 hover:text-lime"
            href={href(cityPath(g.city))}
          >
            {p.moreInArea}
          </Link>
        </Container>
        <GymsClosing />
      </main>
      <SiteFooter />
    </>
  );
}
