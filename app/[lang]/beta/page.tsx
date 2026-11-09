import type { Metadata } from "next";
import type { Country } from "@/lib/gyms/types";

import Link from "next/link";

import { GymDirectory, type OpenGym } from "@/components/beta/gym-directory";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";
import { Container } from "@/components/landing/ui";
import { siteConfig } from "@/config/site";
import { betaCopy } from "@/lib/beta/copy";
import { betaOverview } from "@/lib/beta/overview";
import { allCities } from "@/lib/gyms/cities";
import { localizeDistrict } from "@/lib/gyms/localize";
import { homeCopy } from "@/lib/home-copy";
import { getI18n, siteLocale } from "@/lib/i18n";
import { absoluteUrl, JsonLd, pageMetadata, webPage } from "@/lib/seo";

// Route counts refresh within 5 minutes.
export const revalidate = 300;

async function words() {
  const i18n = await getI18n();
  const zh = siteLocale(i18n.locale) === "zh-TW";

  return {
    ...i18n,
    zh,
    h: homeCopy[zh ? "zh-TW" : "en"],
    c: betaCopy[zh ? "zh-TW" : "en"],
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const { h } = await words();
  const meta = await pageMetadata("/beta", {
    title: h.betaMetaTitle,
    description: h.betaMetaDescription,
  });

  return {
    ...meta,
    itunes: { appId: siteConfig.appStoreId, appArgument: absoluteUrl("/beta") },
  };
}

/**
 * The Beta tab: pick a gym on VARO to open its beta. Beta itself is only
 * inside a gym's page (/gyms/…/beta).
 */
export default async function BetaIndex() {
  const { locale, t, href, c, h, zh } = await words();
  const { gyms } = await betaOverview();
  const cityNames = t.gyms.cities as Record<string, string>;
  const placeOf = (city: string, district: string, country?: Country) =>
    [cityNames[city] ?? city, localizeDistrict(district, locale, country)]
      .filter(Boolean)
      .join(" · ");
  const open: OpenGym[] = gyms.map((g) => ({
    id: g.gym.id,
    href: href(g.betaPath),
    name: g.gym.name,
    place: placeOf(g.gym.city, g.gym.district, g.gym.country),
    city: g.gym.city,
    lat: g.gym.lat ?? null,
    lng: g.gym.lng ?? null,
    cover: g.cover,
    routes: g.routes,
    withBeta: g.withBeta,
    fresh: g.fresh,
  }));
  const present = new Set(open.map((g) => g.city));
  const cities = allCities
    .filter((x) => x.country === "TW" && present.has(x.name))
    .map((x) => ({ key: x.name, label: cityNames[x.name] ?? x.name }));
  const routes = gyms.reduce((n, g) => n + g.routes, 0);

  return (
    <>
      <JsonLd
        graph={[
          webPage(locale, "/beta", {
            name: h.betaMetaTitle,
            description: h.betaMetaDescription,
          }),
        ]}
      />
      <SiteHeader path="/beta" />
      <main>
        <Container className="pb-20 pt-20 sm:pt-28">
          <header className="max-w-[46rem]">
            <p className="inline-flex items-center gap-2 rounded-full border border-line bg-ink-2 px-3 py-1 text-[13px] font-bold tabular">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-lime opacity-70 motion-reduce:hidden" />
                <span className="relative inline-flex size-2 rounded-full bg-lime-deep" />
              </span>
              {c.dirLive(gyms.length, routes)}
            </p>
            <h1 className="mt-5 font-wide text-[38px] font-black leading-[1.05] tracking-[-0.03em] sm:text-[64px]">
              {c.dirTitle[0]}
              <br />
              <span className="relative inline-block">
                <span className="relative z-10">{c.dirTitle[1]}</span>
                <span
                  aria-hidden
                  className="absolute inset-x-[-0.08em] bottom-[0.08em] z-0 h-[0.32em] -skew-x-6 rounded-sm bg-lime"
                />
              </span>
            </h1>
            <p className="mt-5 max-w-[36rem] text-[15px] leading-[1.75] text-mute sm:text-[17px]">
              {c.dirLead}
            </p>
          </header>

          <div className="mt-10">
            <GymDirectory cities={cities} open={open} zh={zh} />
          </div>

          <Link
            className="group mt-16 flex flex-col gap-4 rounded-[24px] bg-night px-6 py-6 text-day sm:flex-row sm:items-center sm:justify-between sm:px-8"
            href={href("/partners")}
          >
            <span className="text-[17px] font-extrabold sm:text-[19px]">
              {c.dirGymCta}
            </span>
            <span className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-full bg-lime px-5 py-2.5 text-[14px] font-black text-night transition-transform group-hover:translate-x-0.5 sm:self-auto">
              {c.dirGymLink} →
            </span>
          </Link>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
