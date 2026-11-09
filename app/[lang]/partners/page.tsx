import type { Metadata } from "next";

import clsx from "clsx";
import Image from "next/image";

import { NeedsBoard } from "@/components/partners/needs-board";
import { RevenueCalc } from "@/components/partners/revenue-calc";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";
import { Container, DemoLabel, holdColors } from "@/components/landing/ui";
import { siteConfig } from "@/config/site";
import { type Dictionary, getI18n, siteLocale } from "@/lib/i18n";
import { partnersCopy } from "@/lib/partners-copy";
import { JsonLd, pageMetadata, webPage } from "@/lib/seo";

async function words() {
  const i18n = await getI18n();

  return { ...i18n, p: partnersCopy[siteLocale(i18n.locale)] };
}

export async function generateMetadata(): Promise<Metadata> {
  const { p } = await words();

  return pageMetadata("/partners", {
    title: p.metaTitle,
    description: p.metaDescription,
  });
}

/**
 * Routes on the mock wall, each pinned on a real hold of its color in
 * /shots/partners-wall.jpg (x/y in % of the photo).
 */
const MOCK_ROUTES = [
  { color: holdColors.purple, grade: "V5", x: 25, y: 17.5 },
  { color: holdColors.orange, grade: "V4", x: 48.8, y: 37.5, tagLeft: true },
  { color: holdColors.blue, grade: "V3", x: 61.5, y: 43.5, selected: true },
  { color: holdColors.green, grade: "V0", x: 68.8, y: 67.5 },
  { color: holdColors.yellow, grade: "V1", x: 90.6, y: 74.8, tagLeft: true },
];

/**
 * For climbing gyms, from the owner's side: what they deal with, what they
 * need (each item marked live, in progress or planned, the planned ones open
 * to votes), how VARO sits beside their current system, and a 30-day pilot.
 * The votes and the form are how we learn what to build next.
 */
export default async function PartnersPage() {
  const { locale, t, p } = await words();
  const email = siteConfig.partnerEmail;

  return (
    <>
      <JsonLd
        graph={[
          webPage(locale, "/partners", {
            name: p.metaTitle,
            description: p.metaDescription,
          }),
        ]}
      />
      <SiteHeader path="/partners" />
      <main>
        {/* ------------------------------------------------------- Hero */}
        <section className="relative overflow-hidden border-b border-line">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_60%_at_85%_10%,rgb(198_255_0/0.22),transparent_70%)]"
          />
          <Container className="relative grid items-center gap-12 pb-16 pt-24 sm:pt-32 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:pb-20">
            <div>
              <p className="inline-block rounded-full border border-line bg-ink-2 px-3 py-1 text-[13px] font-bold">
                {p.eyebrow}
              </p>
              <h1 className="mt-5 text-[38px] font-black leading-[1.1] tracking-[-0.03em] sm:text-[58px]">
                {p.title[0]}
                <br />
                <span className="text-mute">{p.title[1]}</span>
              </h1>
              <p className="mt-5 max-w-[34rem] text-[16px] leading-[1.8] text-mute sm:text-[18px]">
                {p.lead}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  className="inline-flex h-13 items-center rounded-full bg-lime px-7 text-[16px] font-bold text-night transition-transform active:translate-y-px"
                  href="#contact"
                >
                  {p.ctaPrimary}
                </a>
                <a
                  className="inline-flex h-13 items-center rounded-full border border-line bg-ink-2 px-7 text-[16px] font-bold transition-colors hover:bg-ink-3"
                  href="#needs"
                >
                  {p.ctaSecondary}
                </a>
              </div>
              <p className="mt-4 text-[14px] text-mute">{p.pilotNote}</p>
              <dl className="mt-10 grid max-w-[34rem] grid-cols-3 gap-px overflow-hidden rounded-2xl border border-line bg-line">
                {p.heroStats.map((x) => (
                  <div key={x.label} className="bg-ink-2 px-4 py-4">
                    <dd className="text-[28px] font-black leading-none tabular">
                      {x.n}
                    </dd>
                    <dt className="mt-1.5 text-[12px] font-semibold leading-snug text-mute">
                      {x.label}
                    </dt>
                  </div>
                ))}
              </dl>
            </div>
            <WallMock copy={t.partners.how} />
          </Container>
        </section>

        {/* ------------------------------------------------ What we hear */}
        <section>
          <Container className="py-16 sm:py-20">
            <h2 className="text-[26px] font-black tracking-tight sm:text-[36px]">
              {p.painTitle}
            </h2>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {p.pains.map((x, i) => (
                <li
                  key={x.title}
                  className="rounded-2xl border border-line bg-ink-2 p-5"
                >
                  <p className="text-[13px] font-bold text-mute tabular">
                    0{i + 1}
                  </p>
                  <p className="mt-2 text-[17px] font-extrabold leading-snug">
                    {x.title}
                  </p>
                  <p className="mt-2 text-[14px] leading-[1.7] text-mute">
                    {x.body}
                  </p>
                </li>
              ))}
            </ul>
          </Container>
        </section>

        {/* ------------------------------------- How VARO makes money */}
        <section className="theme-dark bg-night">
          <Container className="py-16 sm:py-24">
            <h2 className="text-[28px] font-black tracking-tight text-cream sm:text-[40px]">
              {p.modelTitle}
            </h2>
            <p className="mt-3 max-w-[42rem] text-[16px] leading-[1.8] text-mute">
              {p.modelLead}
            </p>
            <ol className="mt-10 grid gap-3 sm:grid-cols-3 sm:gap-4">
              {p.model.map((x, i) => (
                <li
                  key={x.k}
                  className="rounded-2xl border border-line bg-ink-2 p-6"
                >
                  <p className="flex items-baseline gap-2">
                    <span className="text-[13px] font-bold text-mute tabular">
                      0{i + 1}
                    </span>
                    <span className="text-[26px] font-black text-lime">
                      {x.k}
                    </span>
                  </p>
                  <p className="mt-3 text-[18px] font-extrabold text-cream">
                    {x.title}
                  </p>
                  <p className="mt-2 text-[14px] leading-[1.75] text-mute">
                    {x.body}
                  </p>
                </li>
              ))}
            </ol>
          </Container>
        </section>

        {/* -------------------------------------------- Revenue estimate */}
        <section>
          <Container className="py-16 sm:py-24">
            <h2 className="text-[26px] font-black tracking-tight sm:text-[36px]">
              {p.calcTitle}
            </h2>
            <p className="mt-3 max-w-[40rem] text-[16px] leading-[1.8] text-mute">
              {p.calcLead}
            </p>
            <div className="mt-8">
              <RevenueCalc
                labels={{
                  visits: p.calcVisits,
                  price: p.calcPrice,
                  lift: p.calcLift,
                  monthly: p.calcMonthly,
                  yearly: p.calcYearly,
                  note: p.calcNote,
                }}
              />
            </div>
          </Container>
        </section>

        {/* ------------------------------------ Needs, with honest status */}
        <section
          className="scroll-mt-20 border-y border-line bg-ink-3/40"
          id="needs"
        >
          <Container className="py-16 sm:py-24">
            <h2 className="max-w-[24ch] text-[28px] font-black tracking-tight sm:text-[40px]">
              {p.needsTitle}
            </h2>
            <p className="mt-3 max-w-[40rem] text-[16px] leading-[1.8] text-mute">
              {p.needsLead}
            </p>
            <div className="mt-10">
              <NeedsBoard
                email={email}
                groups={p.groups}
                labels={{
                  status: p.status,
                  vote: p.vote,
                  voted: p.voted,
                  formTitle: p.formTitle,
                  formLead: p.formLead,
                  formGym: p.formGym,
                  formGymPlaceholder: p.formGymPlaceholder,
                  formRole: p.formRole,
                  roles: p.roles,
                  formContact: p.formContact,
                  formNote: p.formNote,
                  formNotePlaceholder: p.formNotePlaceholder,
                  formPicked: p.formPicked,
                  formNone: p.formNone,
                  formSend: p.formSend,
                  mailSubject: p.mailSubject,
                  mail: p.mail,
                }}
              />
            </div>
          </Container>
        </section>

        {/* ------------------------------------------ Beside your system */}
        <section>
          <Container className="grid gap-10 py-16 sm:py-24 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="text-[26px] font-black tracking-tight sm:text-[36px]">
                {p.fitTitle}
              </h2>
              <p className="mt-3 max-w-[32rem] text-[16px] leading-[1.8] text-mute">
                {p.fitLead}
              </p>
              <h3 className="mt-10 text-[20px] font-extrabold">
                {p.promiseTitle}
              </h3>
              <ul className="mt-3 max-w-[30rem] border-t border-line">
                {p.promises.map((x) => (
                  <li
                    key={x}
                    className="border-b border-line py-3 text-[15px] font-semibold"
                  >
                    {x}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid content-start gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-line bg-ink-2 p-6">
                <p className="text-[13px] font-bold text-mute">{p.fitYours}</p>
                <ul className="mt-3 space-y-2">
                  {p.fitYoursItems.map((x) => (
                    <li key={x} className="text-[16px] font-semibold">
                      {x}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="theme-dark rounded-2xl bg-night p-6">
                <p className="text-[13px] font-bold text-lime">{p.fitVaro}</p>
                <ul className="mt-3 space-y-2">
                  {p.fitVaroItems.map((x) => (
                    <li
                      key={x}
                      className="text-[16px] font-semibold text-cream"
                    >
                      {x}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Container>
        </section>

        {/* ------------------------------------------------- 30-day pilot */}
        <section className="border-t border-line bg-ink-2">
          <Container className="py-16 sm:py-24">
            <h2 className="text-[26px] font-black tracking-tight sm:text-[36px]">
              {p.pilotTitle}
            </h2>
            <ol className="mt-8 grid gap-3 sm:grid-cols-3 sm:gap-4">
              {p.pilot.map((x, i) => (
                <li
                  key={x.title}
                  className="rounded-2xl border border-line bg-ink p-6"
                >
                  <p className="text-[13px] font-bold text-mute tabular">
                    0{i + 1}
                  </p>
                  <p className="mt-2 text-[18px] font-extrabold">{x.title}</p>
                  <p className="mt-2 text-[14px] leading-[1.75] text-mute">
                    {x.body}
                  </p>
                </li>
              ))}
            </ol>
            <a
              className="mt-8 inline-flex h-12 items-center rounded-full bg-night px-6 text-[15px] font-bold text-day"
              href="#contact"
            >
              {p.ctaPrimary} →
            </a>
          </Container>
        </section>

        {/* ---------------------------------------------------------- FAQ */}
        <section>
          <Container className="grid gap-8 py-16 sm:py-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
            <h2 className="text-[26px] font-black tracking-tight sm:text-[36px]">
              {p.faqTitle}
            </h2>
            <dl className="divide-y divide-line border-y border-line">
              {p.faq.map((x) => (
                <div key={x.q} className="py-5">
                  <dt className="text-[17px] font-extrabold">{x.q}</dt>
                  <dd className="mt-2 text-[15px] leading-[1.8] text-mute">
                    {x.a}
                  </dd>
                </div>
              ))}
            </dl>
          </Container>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

/**
 * The climber's side of a reset: the zone's wall photo with a dot per route,
 * one picked, and the log buttons. Drawn, not a screenshot, and labelled so.
 */
function WallMock({ copy }: { copy: Dictionary["partners"]["how"] }) {
  return (
    <figure className="mx-auto w-full max-w-[420px] rounded-[28px] border border-line bg-ink-2 p-4 shadow-2xl shadow-black/40">
      <figcaption className="flex items-center justify-between px-1 pb-3">
        <span className="text-[15px] font-semibold">{copy.mock.zone}</span>
        <DemoLabel>{copy.demo}</DemoLabel>
      </figcaption>
      <div
        aria-hidden
        className="relative aspect-square overflow-hidden rounded-2xl"
      >
        <Image
          fill
          alt=""
          className="object-cover"
          sizes="(min-width: 1024px) 400px, 90vw"
          src="/shots/partners-wall.jpg"
        />
        {MOCK_ROUTES.map((route) => (
          <span
            key={route.grade}
            className="absolute"
            style={{ left: `${route.x}%`, top: `${route.y}%` }}
          >
            <span
              className={clsx(
                "absolute size-[22px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white shadow-[0_2px_8px_rgba(0,0,0,0.45)]",
                route.selected &&
                  "ring-[3px] ring-lime ring-offset-[3px] ring-offset-transparent",
              )}
              style={{ backgroundColor: route.color }}
            />
            <span
              className={clsx(
                "absolute top-0 -translate-y-1/2 whitespace-nowrap rounded-full px-2 py-0.5 text-[12px] font-bold shadow-[0_2px_8px_rgba(0,0,0,0.35)]",
                route.selected ? "bg-lime text-night" : "bg-ink/85 text-cream",
                route.tagLeft
                  ? "right-[18px]"
                  : route.selected
                    ? "left-[24px]"
                    : "left-[18px]",
              )}
            >
              {route.grade}
            </span>
          </span>
        ))}
      </div>
      <div className="mt-3 rounded-2xl bg-ink p-4">
        <p className="flex items-center gap-2 text-[15px] font-semibold">
          <span
            aria-hidden
            className="size-3.5 rounded-full"
            style={{ backgroundColor: holdColors.blue }}
          />
          {copy.mock.route}
        </p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {copy.mock.buttons.map((label, i) => (
            <span
              key={label}
              className={clsx(
                "rounded-xl py-2.5 text-center text-[13px] font-semibold",
                i === 1
                  ? "bg-lime text-night"
                  : "border border-line text-cream",
              )}
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </figure>
  );
}
