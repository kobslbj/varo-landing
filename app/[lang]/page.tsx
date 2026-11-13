import type { ReactNode } from "react";
import type { Country } from "@/lib/gyms/types";

import clsx from "clsx";

import { GymSearch, type SearchGym } from "@/components/home/gym-search";
import { MemoriesScreen } from "@/components/home/memories-screen";
import {
  HandShot,
  MockScreen,
  NotifyCard,
  OrangeFrame,
  PhoneShot,
} from "@/components/home/phone-shot";
import {
  BetaFeed,
  GymCard,
  Points,
  SectionHead,
} from "@/components/home/sections";
import { Discover } from "@/components/landing/discover";
import { DownloadCta } from "@/components/landing/download-cta";
import { PartnerGyms } from "@/components/landing/partner-gyms";
import { LogScreen, ShareScreen } from "@/components/landing/screens";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";
import { Container, DemoLabel } from "@/components/landing/ui";
import { partnerHref, siteConfig } from "@/config/site";
import { betaCopy } from "@/lib/beta/copy";
import { betaOverview } from "@/lib/beta/overview";
import { allGyms, gymPath } from "@/lib/gyms/cities";
import { localizeDistrict } from "@/lib/gyms/localize";
import { homeCopy } from "@/lib/home-copy";
import { getI18n, siteLocale } from "@/lib/i18n";
import { productFaq } from "@/lib/product-faq";
import {
  absoluteUrl,
  appEntity,
  faqQuestions,
  JsonLd,
  webPage,
} from "@/lib/seo";

// The beta row and gym counts refresh at most every 5 minutes.
export const revalidate = 300;

/**
 * Strava for bouldering: the log and the community up top, then the tools
 * (beta, gyms), what the app does before, at and after the wall, stickers
 * and memories. The brand story lives on /philosophy.
 */
export default async function Home() {
  const { locale, t, href } = await getI18n();
  const zh = siteLocale(locale) === "zh-TW";
  const h = homeCopy[zh ? "zh-TW" : "en"];
  const c = betaCopy[zh ? "zh-TW" : "en"];
  const { gyms, clips } = await betaOverview();
  const now = Date.now();
  const cities = t.gyms.cities as Record<string, string>;
  const placeOf = (city: string, district: string, country?: Country) =>
    [cities[city] ?? city, localizeDistrict(district, locale, country)]
      .filter(Boolean)
      .join(" · ");

  const withRoutes = new Set(gyms.map((g) => g.path));
  const search: SearchGym[] = allGyms.map((g) => {
    const path = gymPath(g);

    return {
      name: g.name,
      place: placeOf(g.city, g.district, g.country),
      href: href(withRoutes.has(path) ? `${path}/beta` : path),
      routes: withRoutes.has(path),
    };
  });
  const app = siteConfig.appStoreUrl;
  const mail = partnerHref(t.partnerSubject);

  return (
    <>
      <JsonLd
        graph={[
          webPage(locale, "/", {
            name: t.meta.title,
            description: t.meta.description,
          }),
          appEntity(locale, t.meta.description),
          {
            "@type": "FAQPage",
            "@id": `${absoluteUrl(href("/"))}#faq`,
            mainEntity: faqQuestions(productFaq(locale)),
          },
        ]}
      />
      <SiteHeader path="/" />
      <main>
        {/* ------------------------------------------- Hero: two columns */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_60%_at_80%_20%,rgb(198_255_0/0.22),transparent_70%)]"
          />
          <Container className="relative grid items-center gap-12 pb-12 pt-24 sm:pt-32 lg:min-h-[760px] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-8 lg:pb-16">
            <div>
              <p className="rise inline-block rounded-full border border-line bg-ink-2 px-3 py-1 text-[13px] font-bold tracking-wide">
                {h.eyebrow}
              </p>
              <h1
                className="rise mt-5 text-[40px] font-black leading-[1.1] tracking-[-0.03em] sm:text-[60px] sm:leading-[1.05]"
                style={{ "--rise-delay": "60ms" } as React.CSSProperties}
              >
                {h.title[0]}
                <br />
                <span className="text-mute">{h.title[1]}</span>
              </h1>
              <p
                className="rise mt-5 max-w-[32rem] text-[16px] leading-[1.75] text-mute sm:text-[18px]"
                style={{ "--rise-delay": "120ms" } as React.CSSProperties}
              >
                {h.lead}
              </p>
              <div
                className="rise mt-8 flex flex-wrap items-center gap-3"
                style={{ "--rise-delay": "180ms" } as React.CSSProperties}
              >
                <DownloadCta source="hero" />
                <a
                  className="inline-flex h-13 items-center rounded-full border border-line bg-ink-2 px-6 text-[16px] font-bold transition-colors hover:bg-ink-3"
                  href={href("/beta")}
                >
                  {h.quick.beta}
                </a>
              </div>
              <div
                className="rise relative z-20 mt-10 max-w-[30rem]"
                style={{ "--rise-delay": "240ms" } as React.CSSProperties}
              >
                <p className="mb-2.5 text-[13px] font-semibold text-mute">
                  {h.searchLabel}
                </p>
                <GymSearch
                  allHref={href("/gyms")}
                  gyms={search}
                  labels={{
                    label: h.searchLabel,
                    placeholder: h.searchPlaceholder,
                    empty: h.searchEmpty,
                    routes: h.searchHasRoutes,
                  }}
                />
              </div>
            </div>

            {/* The phone, with what VARO tells you around it. */}
            <div className="relative mx-auto h-[560px] w-full max-w-[560px] sm:h-[720px]">
              <div className="absolute left-1/2 top-0 w-[520px] -translate-x-[31%] sm:w-[660px]">
                <HandShot
                  alt={
                    zh
                      ? "VARO 首頁：好友的完攀與碰拳"
                      : "VARO home: friends' sends and fist bumps"
                  }
                  src="/shots/app/home.jpg"
                />
              </div>
              {h.notes.slice(0, 3).map((n, i) => (
                <NotifyCard
                  key={n.title}
                  body={n.body}
                  className={clsx(
                    "ping-pop absolute",
                    i === 0 && "left-0 top-[16%] max-sm:left-[-8px]",
                    i === 1 && "right-0 top-[42%] max-sm:right-[-8px]",
                    i === 2 && "bottom-[14%] left-[4%] max-sm:left-0",
                  )}
                  style={
                    {
                      "--pop-delay": `${500 + i * 180}ms`,
                    } as React.CSSProperties
                  }
                  title={n.title}
                />
              ))}
              <div className="absolute inset-x-0 bottom-0 flex justify-center">
                <DemoLabel>{h.demo}</DemoLabel>
              </div>
            </div>
          </Container>
        </section>

        {/* ------------------------------------------------ Partner gyms */}
        <section className="border-y border-line bg-ink-2">
          <Container className="py-7 sm:py-8">
            <PartnerGyms
              betaPaths={withRoutes}
              href={href}
              label={h.partnersLabel}
            />
          </Container>
        </section>

        {/* ---------------------------------------- Community: latest beta */}
        <section>
          <Container className="py-14 sm:py-20">
            <SectionHead
              eyebrow={h.liveEyebrow}
              link={{ href: href("/beta"), label: h.liveAll }}
              title={h.liveTitle}
            />
            <div className="mt-7">
              <BetaFeed
                c={c}
                clips={clips}
                gyms={gyms}
                h={h}
                href={href}
                now={now}
                zh={zh}
              />
            </div>
          </Container>
        </section>

        {/* -------------------------------------------- Gyms with routes */}
        {gyms.length ? (
          <section>
            <Container className="pb-14 sm:pb-20">
              <SectionHead
                eyebrow={h.gymsEyebrow}
                link={{ href: href("/gyms"), label: h.gymsMore }}
                title={h.gymsTitle}
              />
              <div className="mt-7 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
                {gyms.map((g) => (
                  <GymCard
                    key={g.path}
                    g={g}
                    h={h}
                    href={href}
                    place={placeOf(g.gym.city, g.gym.district, g.gym.country)}
                  />
                ))}
              </div>
            </Container>
          </section>
        ) : null}

        {/* ------------------------------- Before, at and after the wall */}
        <section className="border-y border-line bg-ink-2">
          <Container className="space-y-16 py-16 sm:space-y-24 sm:py-24">
            {h.moments.map((m, i) => (
              <div
                key={m.key}
                className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
              >
                <div className={clsx(i % 2 === 1 && "lg:order-2")}>
                  <p className="text-[13px] font-bold text-mute tabular">
                    {String(i + 1).padStart(2, "0")}
                    <span className="mx-2 text-line">/</span>
                    <span className="text-lime-ink">{m.eyebrow}</span>
                  </p>
                  <h2 className="mt-3 text-[28px] font-extrabold leading-tight tracking-tight sm:text-[38px]">
                    {m.title}
                  </h2>
                  <p className="mt-4 max-w-[34rem] text-[16px] leading-[1.8] text-mute">
                    {m.body}
                  </p>
                  <Points items={m.points} />
                  <div className="mt-7">
                    {m.key === "before" ? (
                      <ArrowLink href={href("/beta")}>{m.link}</ArrowLink>
                    ) : app ? (
                      <ArrowLink external href={app}>
                        {m.link}
                      </ArrowLink>
                    ) : null}
                  </div>
                </div>
                <Stage className={clsx(i % 2 === 1 && "lg:order-1")}>
                  {m.key === "wall" ? (
                    <OrangeFrame
                      className="w-[250px] sm:w-[280px]"
                      label={t.features.log.label}
                      tilt={i % 2 === 1 ? "right" : "left"}
                    >
                      <MockScreen>
                        <LogScreen />
                      </MockScreen>
                    </OrangeFrame>
                  ) : (
                    <PhoneShot
                      alt={
                        m.key === "before"
                          ? zh
                            ? "VARO 岩館頁：搜尋岩館與我的岩館"
                            : "VARO gyms: search and your gyms"
                          : zh
                            ? "VARO 我的頁面：好友、近 30 天與 10 月回顧"
                            : "VARO profile: friends, last 30 days and monthly recap"
                      }
                      className="w-[250px] sm:w-[280px]"
                      src={
                        m.key === "before"
                          ? "/shots/app/gyms.jpg"
                          : "/shots/app/me.jpg"
                      }
                      tilt={i % 2 === 1 ? "right" : "left"}
                      tone="orange"
                    />
                  )}
                </Stage>
              </div>
            ))}
          </Container>
        </section>

        {/* ------------------------------------- Share stickers, memories */}
        <section>
          <Container className="py-16 sm:py-24">
            <div className="grid gap-4 lg:grid-cols-2">
              <Tile
                body={h.shareBody}
                eyebrow={h.shareEyebrow}
                points={h.sharePoints}
                title={h.shareTitle}
              >
                <OrangeFrame label={t.features.share.label} tilt="left">
                  <MockScreen>
                    <ShareScreen />
                  </MockScreen>
                </OrangeFrame>
              </Tile>
              <Tile
                body={h.memBody}
                eyebrow={h.memEyebrow}
                points={h.memPoints}
                title={h.memTitle}
              >
                <OrangeFrame
                  label={
                    zh
                      ? "VARO 回憶：攀爬相簿與月曆"
                      : "VARO memories: album and calendar"
                  }
                  tilt="right"
                >
                  <MockScreen>
                    <MemoriesScreen h={h} />
                  </MockScreen>
                </OrangeFrame>
              </Tile>
            </div>
            <div className="mt-4 flex justify-center">
              <DemoLabel>{h.shareDemo}</DemoLabel>
            </div>
          </Container>
        </section>

        {/* --------------------------------------------------- For gyms */}
        {/* Owners already have a system for members and payments; the pitch is
            the layer it lacks, and less work at each reset. */}
        <section className="theme-dark bg-night">
          <Container className="grid gap-10 py-16 sm:py-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
            <div>
              <p className="text-[13px] font-bold text-lime">
                {h.gymsB2bEyebrow}
              </p>
              <h2 className="mt-3 text-[32px] font-black leading-[1.12] tracking-[-0.03em] text-cream sm:text-[48px]">
                {h.gymsB2bTitle[0]}
                <br />
                <span className="text-mute">{h.gymsB2bTitle[1]}</span>
              </h2>
              <p className="mt-5 max-w-[32rem] text-[16px] leading-[1.8] text-mute">
                {h.gymsB2bBody}
              </p>
              <p className="mt-5 text-[14px] font-semibold text-cream/80">
                {h.gymsB2bNot}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  className="inline-flex h-12 items-center rounded-full bg-lime px-6 text-[15px] font-bold text-night transition-transform active:translate-y-px"
                  href={href("/partners")}
                >
                  {h.gymsB2bCta} →
                </a>
                {mail ? (
                  <a
                    className="inline-flex h-12 items-center rounded-full border border-line px-6 text-[15px] font-bold text-cream transition-colors hover:bg-ink-2"
                    href={mail}
                  >
                    {h.gymsB2bMail}
                  </a>
                ) : null}
              </div>
            </div>
            <ul className="grid gap-px self-start overflow-hidden rounded-[24px] border border-line bg-line">
              {h.gymsB2bPoints.map((p, i) => (
                <li key={p.title} className="bg-ink-2 p-6 sm:p-7">
                  <p className="text-[13px] font-bold text-mute tabular">
                    0{i + 1}
                  </p>
                  <p className="mt-2 text-[19px] font-extrabold text-cream">
                    {p.title}
                  </p>
                  <p className="mt-1.5 text-[15px] leading-[1.75] text-mute">
                    {p.body}
                  </p>
                </li>
              ))}
            </ul>
          </Container>
        </section>

        {/* ------------------------------------------------ Why trust it */}
        <section className="pt-14 sm:pt-20">
          <Container className="pb-14 sm:pb-20">
            <ul className="grid gap-3 sm:grid-cols-3 sm:gap-4">
              {h.trust.map((x) => (
                <li
                  key={x.title}
                  className="rounded-2xl border border-line bg-ink-2 p-5 sm:p-6"
                >
                  <p className="text-[17px] font-extrabold">{x.title}</p>
                  <p className="mt-1.5 text-[14px] leading-[1.7] text-mute">
                    {x.body}
                  </p>
                </li>
              ))}
            </ul>
          </Container>
        </section>

        {/* Gym map by region, and the FAQ. */}
        <Discover />

        {/* ------------------------------------------------------ Closing */}
        <section>
          <Container className="pb-16 pt-4 sm:pb-24">
            <div className="theme-dark relative overflow-hidden rounded-[28px] bg-night px-6 py-12 text-center sm:px-12 sm:py-16">
              <div
                aria-hidden
                className="bolt-grid absolute inset-0 opacity-50"
              />
              <div
                aria-hidden
                className="absolute left-1/2 top-0 h-48 w-[36rem] -translate-x-1/2 rounded-full bg-lime/25 blur-3xl"
              />
              <div className="relative">
                <h2 className="text-[28px] font-black tracking-tight text-cream sm:text-[44px]">
                  {h.closingTitle}
                </h2>
                <p className="mt-3 text-[16px] text-mute sm:text-[17px]">
                  {h.closingBody}
                </p>
                <div className="mt-8 flex justify-center">
                  <DownloadCta source="closing" />
                </div>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

/** Where a feature's phone stands: no backdrop, just room for the tilt. */
function Stage({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={clsx("flex justify-center py-4 sm:py-8", className)}>
      {children}
    </div>
  );
}

/** A feature tile: copy on top, the phone rising from the bottom edge. */
function Tile({
  eyebrow,
  title,
  body,
  points,
  children,
}: {
  eyebrow: string;
  title: string;
  body: string;
  points: string[];
  children: ReactNode;
}) {
  return (
    <article className="flex flex-col overflow-hidden rounded-[28px] border border-line bg-ink-2">
      <div className="p-6 sm:p-9">
        <p className="text-[13px] font-bold text-lime-ink">{eyebrow}</p>
        <h2 className="mt-2 text-[26px] font-extrabold leading-tight tracking-tight sm:text-[34px]">
          {title}
        </h2>
        <p className="mt-3 text-[15px] leading-[1.8] text-mute sm:text-[16px]">
          {body}
        </p>
        <Points items={points} />
      </div>
      {/* The whole phone shows: the sticker sits near the bottom of the screen. */}
      <div className="mt-auto flex justify-center px-6 pb-10 pt-2 sm:pb-12">
        <div className="w-[250px] sm:w-[280px]">{children}</div>
      </div>
    </article>
  );
}

function ArrowLink({
  href,
  external,
  children,
}: {
  href: string;
  external?: boolean;
  children: ReactNode;
}) {
  return (
    <a
      className="group inline-flex h-12 items-center gap-2 rounded-full bg-night px-6 text-[15px] font-bold text-day transition-colors hover:bg-night/85"
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
      <span
        aria-hidden
        className="transition-transform group-hover:translate-x-0.5"
      >
        →
      </span>
    </a>
  );
}
