import type { ExplorerCopy } from "./gym-explorer";
import type { Gym } from "@/lib/gyms/types";

import clsx from "clsx";

import { GymExplorer } from "./gym-explorer";

import { DownloadCta } from "@/components/landing/download-cta";
import { Container } from "@/components/landing/ui";
import { siteConfig } from "@/config/site";
import { cityOrder as allCities, cityPath } from "@/lib/gyms/cities";
import { checkedAt } from "@/lib/gyms/data";
import { getI18n } from "@/lib/i18n";

/** Russo One for English headings; Chinese gets the heavy sans. */
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
  const { t, href } = await getI18n();
  const c = t.gyms;
  // Only plain strings cross to the client component.
  const copy: ExplorerCopy = {
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
      gyms={gyms}
    />
  );
}

/** How sure the data is, and where to send corrections. */
export async function GymsCaveat() {
  const { t } = await getI18n();
  const copy = t.gyms;

  return (
    <Container className="relative pb-16">
      <aside className="grid gap-3 border-t border-line pt-8 sm:grid-cols-[13rem_1fr] sm:gap-10">
        <h2 className="text-[20px] font-bold">{copy.caveat.title}</h2>
        <div>
          <p className="max-w-[44rem] text-[16px] leading-[1.75] text-mute">
            {copy.caveat.body(copy.date(checkedAt))}
          </p>
          <p className="mt-4 text-[15px] text-mute">
            {copy.caveat.report}{" "}
            <a
              className="font-semibold text-cream underline decoration-line underline-offset-4 transition-colors hover:text-lime hover:decoration-lime"
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
        <span className="text-lime">{copy.closing.title[1]}</span>
      </h2>
      <div className="mt-9 flex w-full justify-center">
        <DownloadCta className="text-left" source="gyms" />
      </div>
    </Container>
  );
}
