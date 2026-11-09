import type { Metadata } from "next";
import type { Country } from "@/lib/gyms/types";

import Link from "next/link";

import { GymPicker } from "@/components/beta/gym-picker";
import { BetaFeed, SectionHead } from "@/components/home/sections";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";
import { Container } from "@/components/landing/ui";
import { siteConfig } from "@/config/site";
import { betaCopy } from "@/lib/beta/copy";
import { betaOverview } from "@/lib/beta/overview";
import { localizeDistrict } from "@/lib/gyms/localize";
import { homeCopy } from "@/lib/home-copy";
import { getI18n, siteLocale } from "@/lib/i18n";
import { absoluteUrl, JsonLd, pageMetadata, webPage } from "@/lib/seo";

// New beta shows up within 5 minutes (uploads also revalidate their pages).
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
 * The Beta tab: every gym with route data, the newest beta across them, and
 * how to share yours. Each gym's own page (/gyms/…/beta) has the full list.
 */
export default async function BetaIndex() {
  const { locale, t, href, zh, h, c } = await words();
  const { gyms, clips, totals } = await betaOverview();
  const now = Date.now();
  const cities = t.gyms.cities as Record<string, string>;
  const placeOf = (city: string, district: string, country?: Country) =>
    [cities[city] ?? city, localizeDistrict(district, locale, country)]
      .filter(Boolean)
      .join(" · ");
  const stats = [
    { n: totals.routes, label: h.statRoutes },
    { n: totals.withBeta, label: h.statWithBeta },
    { n: totals.climbers, label: h.statClimbers },
    // Until someone has sent after watching, the clip count reads better than 0.
    totals.helped
      ? { n: totals.helped, label: h.statHelped }
      : { n: totals.clips, label: h.statClips },
  ];
  const firstGym = gyms[0];

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
        {/* First thing: which gym you're at. Climbers land here mid-session. */}
        <section className="relative overflow-hidden border-b border-line">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(55%_60%_at_15%_0%,rgb(198_255_0/0.25),transparent_70%)]"
          />
          <Container className="relative grid gap-8 pb-12 pt-20 sm:pt-28 lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] lg:items-start lg:gap-16 lg:pb-16">
            <div>
              <h1 className="text-[32px] font-black leading-[1.12] tracking-[-0.03em] sm:text-[52px]">
                {h.betaTitle[0]}
                <br />
                <span className="text-mute">{h.betaTitle[1]}</span>
              </h1>
              <p className="mt-4 max-w-[34rem] text-[15px] leading-[1.75] text-mute sm:text-[17px]">
                {h.betaLead}
              </p>
              <dl className="mt-6 hidden flex-wrap gap-x-6 gap-y-2 lg:flex">
                {stats.map((s) => (
                  <div key={s.label} className="flex items-baseline gap-1.5">
                    <dd className="text-[22px] font-black tabular">{s.n}</dd>
                    <dt className="text-[13px] font-semibold text-mute">
                      {s.label}
                    </dt>
                  </div>
                ))}
              </dl>
            </div>
            <div>
              <GymPicker
                gyms={gyms.map((g) => ({
                  href: href(g.betaPath),
                  name: g.gym.name,
                  place: placeOf(g.gym.city, g.gym.district, g.gym.country),
                  routes: g.routes,
                  withBeta: g.withBeta,
                  lat: g.gym.lat ?? null,
                  lng: g.gym.lng ?? null,
                }))}
                labels={{
                  title: h.pickerTitle,
                  last: h.pickerLast,
                  near: h.pickerNear,
                  locating: h.pickerLocating,
                  denied: h.pickerDenied,
                  routes: h.pickerRoutes,
                  km: h.pickerKm,
                }}
              />
              <Link
                className="mt-3 block text-[13px] text-mute underline-offset-4 hover:text-cream hover:underline"
                href={href("/partners")}
              >
                {h.wantMore} {h.wantMoreCta} →
              </Link>
            </div>
          </Container>
        </section>

        <section>
          <Container className="pb-14 sm:pb-20">
            <SectionHead eyebrow={h.liveEyebrow} title={h.liveTitle} />
            <div className="mt-6">
              {clips.length || gyms.length ? (
                <BetaFeed
                  grid
                  c={c}
                  clips={clips}
                  gyms={gyms}
                  h={h}
                  href={href}
                  max={24}
                  now={now}
                  zh={zh}
                />
              ) : (
                <p className="rounded-2xl border border-dashed border-line px-6 py-12 text-center text-mute">
                  {h.noClips}
                </p>
              )}
            </div>
          </Container>
        </section>

        <section className="border-t border-line bg-ink-2">
          <Container className="py-14 sm:py-20">
            <SectionHead title={h.howTitle} />
            <ol className="mt-8 grid gap-3 sm:grid-cols-3 sm:gap-4">
              {h.how.map((step, i) => (
                <li
                  key={step.title}
                  className="rounded-2xl border border-line bg-ink p-5 sm:p-6"
                >
                  <span className="grid size-8 place-items-center rounded-full bg-night text-[14px] font-black text-lime tabular">
                    {i + 1}
                  </span>
                  <p className="mt-4 text-[17px] font-extrabold">
                    {step.title}
                  </p>
                  <p className="mt-1.5 text-[14px] leading-[1.7] text-mute">
                    {step.body}
                  </p>
                </li>
              ))}
            </ol>
            {firstGym ? (
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  className="inline-flex h-12 items-center gap-2 rounded-full bg-lime px-6 text-[15px] font-bold text-night shadow-sm transition-transform active:translate-y-px"
                  href={href(firstGym.betaPath)}
                >
                  {h.howCta} →
                </Link>
                <span className="text-[14px] text-mute">{c.orApp}</span>
              </div>
            ) : null}
          </Container>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
