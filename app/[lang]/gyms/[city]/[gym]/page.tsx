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
  const en = i18n.locale === "en";

  return {
    ...i18n,
    gym,
    en,
    path: gymPath(gym),
    title: `${gym.name}｜${en ? "Hours, prices & visitor information" : "營業時間、價格與場館資訊"}｜VARO`,
    description: en
      ? `Visitor information for ${gym.name} in ${gym.city}: address, published hours, prices and official contact links. Confirm current details with the gym before visiting.`
      : `${gym.name}位於${gym.city}${gym.district}。查看地址、已收錄的營業時間與價格、課程及官方聯絡入口；出發前請向場館確認最新資訊。`,
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { path, title, description } = await load(params);

  return pageMetadata(path, { title, description });
}

export default async function GymPage({ params }: Props) {
  const {
    gym: g,
    en,
    locale,
    t,
    href,
    path,
    title,
    description,
  } = await load(params);
  const c = t.gyms;
  const missing = en
    ? "Not recorded. Please contact the gym."
    : "尚未收錄，請向場館確認。";
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
      label: en ? "Published prices (TWD)" : "已收錄價格（新台幣）",
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
            {en ? "Source note: " : "來源說明："}
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
            aria-label={en ? "Breadcrumb" : "麵包屑導覽"}
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
              <h2 className="text-[21px] font-bold">
                {en ? "Sources & freshness" : "資料來源與更新狀態"}
              </h2>
              <p className="mt-4 text-[14px] text-mute">
                {en ? "Dataset checked: " : "資料集查核日期："}
                <time dateTime={checkedAt}>{c.date(checkedAt)}</time>
              </p>
              <p className="mt-4 text-[15px] leading-[1.8] text-mute">
                {en
                  ? "This is the directory’s review date, not confirmation of every detail by this gym. Hours and prices may change; source notes above describe what is known. Missing information does not mean a service is unavailable."
                  : "這是整份名錄的查核日期，不代表本館每項資料都已獲官方確認。營業時間與價格可能變動，各欄附有已知的來源說明；未收錄不代表場館沒有提供。"}
              </p>
              <h3 className="mt-6 font-semibold">
                {en ? "Official contact links" : "官方聯絡入口"}
              </h3>
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
                {en
                  ? "These links are for checking current announcements; they are not a claim that every detail above came from these pages."
                  : "以上供查詢最新公告，不表示每項資料都取自這些頁面。"}
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
            {en ? "More gyms in this area" : "查看同縣市其他岩館"}
          </Link>
        </Container>
        <GymsClosing />
      </main>
      <SiteFooter />
    </>
  );
}
