import type { ExplorerCopy } from "./gym-explorer";
import type { Gym } from "@/lib/gyms/types";
import type { VisitorQuestion } from "@/lib/gyms/visitor-faq";

import clsx from "clsx";
import Link from "next/link";

import { GymExplorer } from "./gym-explorer";

import { DownloadCta } from "@/components/landing/download-cta";
import { Card, Container, Tag } from "@/components/landing/ui";
import { siteConfig } from "@/config/site";
import {
  abroadCountries,
  abroadHubs,
  cityOrder as allCities,
  cityPath,
  gymsIn,
  gymPath,
} from "@/lib/gyms/cities";
import { checkedAt } from "@/lib/gyms/data";
import { gymTextLang, localizeGym } from "@/lib/gyms/localize";
import { getI18n } from "@/lib/i18n";

/** Space Grotesk (Latin only) for English headings; CJK gets the heavy sans. */
export const gymsHeading = (locale: string) =>
  locale === "en" ? "font-display leading-[1.04]" : "display-zh";

/** The map + list, with every city linked to its own page. */
export async function GymsMap({
  gyms,
  cityOrder,
}: {
  gyms: Gym[];
  cityOrder: string[];
}) {
  const { locale, t, href } = await getI18n();
  const c = t.gyms;
  // Only plain strings cross to the client component.
  const copy: ExplorerCopy = {
    textLang: gymTextLang(locale),
    all: c.all,
    mapLabel: c.mapLabel,
    kinds: c.kinds,
    unconfirmed: c.unconfirmed,
    unconfirmedHint: c.unconfirmedHint,
    weekday: c.weekday,
    weekend: c.weekend,
    shoes: c.shoes,
    currency: c.currency,
    directions: c.directions,
    website: c.website,
    call: c.call,
    more: c.more,
    hours: c.hours,
    courses: c.courses,
    facilities: c.facilities,
    booking: c.booking,
    address: c.address,
    notes: c.notes,
    showAll: c.showAll,
    cities: c.cities,
  };

  return (
    <GymExplorer
      cityHrefs={Object.fromEntries(
        allCities.map((city) => [city, href(cityPath(city))]),
      )}
      cityOrder={cityOrder}
      copy={copy}
      gymHrefs={Object.fromEntries(
        gyms.map((gym) => [gym.id, href(gymPath(gym))]),
      )}
      gyms={gyms.map((g) => localizeGym(g, locale))}
    />
  );
}

/**
 * Hong Kong, Singapore and Malaysia, under Taiwan's map: one card per
 * country with its gym count and city pages.
 */
export async function GymsAbroad() {
  const { locale, t, href } = await getI18n();
  const copy = t.gyms;
  const total = abroadCountries.reduce((n, c) => n + c.n, 0);

  return (
    <Container className="relative pb-20">
      <section aria-labelledby="abroad-title" id="abroad">
        <Tag>{copy.abroad.eyebrow}</Tag>
        <h2
          className={clsx(
            "mt-4 text-[30px] sm:text-[38px]",
            gymsHeading(locale),
          )}
          id="abroad-title"
        >
          {copy.abroad.title}
        </h2>
        <p className="mt-4 max-w-[40rem] text-[16px] leading-[1.8] text-mute">
          {copy.abroad.lead(total)}
        </p>

        <div className="mt-8 grid gap-3 md:grid-cols-3">
          {abroadCountries.map(({ country, cities, n }) => {
            const single = cities.length === 1 ? cities[0] : null;
            const hub = abroadHubs.find((h) => h.country === country);

            return (
              <Card key={country} className="flex flex-col p-6 sm:p-7">
                <p className="label-wide text-[12px] text-mute">
                  {hub ? (
                    <Link
                      className="underline decoration-lime decoration-2 underline-offset-4 hover:text-cream"
                      href={href(`/gyms/${hub.slug}`)}
                    >
                      {copy.countries[country]}
                    </Link>
                  ) : (
                    copy.countries[country]
                  )}
                </p>
                <p className="mt-4 font-display text-[64px] leading-[0.85] tabular">
                  {n}
                </p>
                <p className="mt-2 text-[14px] text-mute">
                  {copy.abroad.unit(n)}
                </p>
                {single ? (
                  <Link
                    className="mt-6 inline-flex w-fit text-[15px] font-semibold underline decoration-lime decoration-2 underline-offset-4 hover:text-lime-ink"
                    href={href(cityPath(single.name))}
                  >
                    {copy.cities[single.name] ?? single.name} →
                  </Link>
                ) : (
                  <ul className="mt-6 grid grid-cols-2 gap-x-4 border-t border-line">
                    {cities.map((c) => (
                      <li key={c.slug} className="border-b border-line">
                        <Link
                          className="flex items-center justify-between gap-2 py-2.5 text-[14px] transition-colors hover:text-lime-ink"
                          href={href(cityPath(c.name))}
                        >
                          <span>{copy.cities[c.name] ?? c.name}</span>
                          <span className="text-[12px] text-mute tabular">
                            {gymsIn(c.name).length}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
            );
          })}
        </div>
      </section>
    </Container>
  );
}

/** How sure the data is, and where to send corrections. */
export async function GymsCaveat({
  checked = checkedAt,
}: {
  checked?: string;
}) {
  const { t } = await getI18n();
  const copy = t.gyms;

  return (
    <Container className="relative pb-16">
      <aside className="grid gap-3 border-t border-line pt-8 sm:grid-cols-[13rem_1fr] sm:gap-10">
        <h2 className="text-[20px] font-bold">{copy.caveat.title}</h2>
        <div>
          <p className="max-w-[44rem] text-[16px] leading-[1.75] text-mute">
            {copy.caveat.body(copy.date(checked))}
          </p>
          <p className="mt-4 text-[15px] text-mute">
            {copy.caveat.report}{" "}
            <a
              className="font-semibold text-cream underline decoration-line underline-offset-4 transition-colors hover:text-lime-ink hover:decoration-lime"
              href={`mailto:${siteConfig.contactEmail}?subject=${encodeURIComponent(copy.caveat.reportSubject)}`}
            >
              {copy.caveat.reportLink}
            </a>
          </p>
        </div>
      </aside>
    </Container>
  );
}

/** "Found a gym to try? Log every attempt." with the waitlist. */
export async function GymsClosing() {
  const { locale, t } = await getI18n();
  const copy = t.gyms;

  return (
    <Container className="relative flex flex-col items-center pb-28 pt-8 text-center">
      <h2 className={clsx("text-[34px] sm:text-[48px]", gymsHeading(locale))}>
        {copy.closing.title[0]}
        <br />
        <span className="text-lime-ink">{copy.closing.title[1]}</span>
      </h2>
      <div className="mt-9 flex w-full justify-center">
        <DownloadCta className="text-left" source="gyms" />
      </div>
      {/* The guides are Chinese only. */}
      {locale === "zh-TW" && (
        <p className="mt-10 text-[15px] text-mute">
          第一次去岩館？先看{" "}
          <Link
            className="font-semibold text-cream underline decoration-lime underline-offset-4 hover:text-lime-ink"
            href="/articles/first-time-bouldering-guide"
          >
            第一次抱石新手指南
          </Link>
        </p>
      )}
    </Container>
  );
}

/** Travellers' questions, English pages only. */
export async function VisitorFaq({ items }: { items: VisitorQuestion[] }) {
  const { locale, t, href } = await getI18n();

  return (
    <Container className="relative pb-20">
      <h2 className={clsx("text-[30px] sm:text-[38px]", gymsHeading(locale))}>
        {t.gyms.visitorTitle}
      </h2>
      <dl className="mt-8 max-w-[48rem] divide-y divide-line border-y border-line">
        {items.map(({ q, a, links }) => (
          <div key={q} className="py-6">
            <dt className="text-[18px] font-bold">{q}</dt>
            <dd className="mt-2 text-[16px] leading-[1.8] text-mute">
              <p>{a}</p>
              {links ? (
                <ul className="mt-4 flex flex-wrap gap-2">
                  {links.map((l) => (
                    <li key={l.path}>
                      <Link
                        className="flex h-9 items-center rounded-full border border-line px-4 text-[14px] font-medium text-cream transition-colors hover:border-lime hover:text-lime-ink"
                        href={href(l.path)}
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </dd>
          </div>
        ))}
      </dl>
    </Container>
  );
}
