import type { Metadata } from "next";

import clsx from "clsx";
import Image from "next/image";

import { PartnerCta } from "@/components/landing/partner-cta";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";
import { Container, DemoLabel, holdColors } from "@/components/landing/ui";
import { partnerHref, siteConfig } from "@/config/site";
import { type Dictionary, getI18n } from "@/lib/i18n";
import { JsonLd, pageMetadata, webPage } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();

  return pageMetadata("/partners", t.partners.meta);
}

/** Hold colours for the three problem cards, bottom of the wall to the top. */
const PROBLEM_HOLDS = ["#E5484D", "#F5D90A", "#3E8BFF"];

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
 * Recruiting the first partner gyms. The setter tool (varo-gym) has a first
 * version and the app logs on the wall, but nothing is live at a gym yet, so
 * the page separates what exists from what's planned and asks for an email.
 */
export default async function PartnersPage() {
  const { locale, t } = await getI18n();
  const copy = t.partners;
  const mail = partnerHref(t.partnerSubject, copy.mailBody);
  const heading =
    locale === "en" ? "font-display leading-[1.06]" : "display-zh";

  return (
    <>
      <JsonLd
        graph={[
          webPage(locale, "/partners", {
            name: copy.meta.title,
            description: copy.meta.description,
          }),
        ]}
      />
      <SiteHeader path="/partners" />
      <main className="relative overflow-hidden">
        {/* Bolt-hole grid */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.25] [background-image:radial-gradient(#2c2f33_1.2px,transparent_1.2px)] [background-size:30px_30px] [mask-image:linear-gradient(to_bottom,black,transparent_70%)]"
        />

        {/* Opening */}
        <Container className="relative pb-20 pt-36 sm:pt-44">
          <p className="rise flex items-center gap-2 text-[14px] font-semibold tracking-[0.08em] text-lime sm:text-[15px]">
            <span aria-hidden className="size-2 rounded-full bg-lime" />
            {copy.eyebrow}
          </p>
          <h1
            className={clsx(
              "rise mt-6 text-[44px] sm:text-[64px] lg:text-[72px]",
              heading,
            )}
            style={{ ["--rise-delay" as string]: "60ms" }}
          >
            {copy.title[0]}
            <br />
            <span className="text-lime">{copy.title[1]}</span>
          </h1>
          <p
            className="rise mt-7 max-w-[36rem] text-[17px] leading-[1.8] text-mute [text-wrap:pretty] sm:text-[19px]"
            style={{ ["--rise-delay" as string]: "120ms" }}
          >
            {copy.intro}
          </p>
          <p
            className="rise mt-6 flex max-w-[36rem] gap-2.5 text-[15px] leading-[1.7] text-cream"
            style={{ ["--rise-delay" as string]: "140ms" }}
          >
            <span
              aria-hidden
              className="mt-[9px] size-2 shrink-0 rounded-full bg-lime"
            />
            {copy.status}
          </p>
          <div
            className="rise mt-9 flex flex-wrap items-center gap-x-7 gap-y-4"
            style={{ ["--rise-delay" as string]: "160ms" }}
          >
            {mail ? (
              <PartnerCta href={mail} place="hero">
                {copy.cta}
              </PartnerCta>
            ) : null}
            <a
              className="text-[15px] font-medium text-mute underline decoration-line underline-offset-4 transition-colors hover:text-lime hover:decoration-lime"
              href="#how"
            >
              {copy.howLink} ↓
            </a>
          </div>
        </Container>

        {/* The problem */}
        <Container className="relative py-16 sm:py-20">
          <h2 className={clsx("text-[32px] sm:text-[40px]", heading)}>
            {copy.problem.heading}
          </h2>
          <ul className="mt-10 grid gap-4 md:grid-cols-3">
            {copy.problem.items.map((item, i) => (
              <li
                key={item.title}
                className="rounded-2xl border border-line bg-ink-2 p-6 sm:p-7"
              >
                <span
                  aria-hidden
                  className="grid h-[26px] w-[32px] place-items-center rounded-[14px_18px_10px_16px]"
                  style={{ background: PROBLEM_HOLDS[i] }}
                >
                  <span className="size-[5px] rounded-full bg-black/35" />
                </span>
                <h3 className="mt-5 text-[19px] font-bold leading-snug">
                  {item.title}
                </h3>
                <p className="mt-2 text-[16px] leading-[1.7] text-mute">
                  {item.body}
                </p>
              </li>
            ))}
          </ul>
        </Container>

        {/* How it works: setter tool → app */}
        <Container className="relative py-16 sm:py-20">
          <div className="scroll-mt-24" id="how" />
          <h2 className={clsx("text-[32px] sm:text-[40px]", heading)}>
            {copy.how.heading}
          </h2>
          <p className="mt-4 max-w-[36rem] text-[17px] leading-[1.75] text-mute">
            {copy.how.intro}
          </p>
          <div className="mt-10 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <ol className="flex flex-col gap-8">
              {copy.how.steps.map((step, i) => (
                <li key={step.title} className="flex gap-5">
                  <span className="font-display text-[28px] leading-none text-lime">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <span
                      className={clsx(
                        "inline-block rounded-full px-2.5 py-0.5 text-[12px] font-semibold",
                        i < 2
                          ? "border border-line text-mute"
                          : "bg-lime text-ink",
                      )}
                    >
                      {i < 2 ? copy.how.setter : copy.how.climber}
                    </span>
                    <h3 className="mt-2.5 text-[19px] font-bold leading-snug">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-[16px] leading-[1.7] text-mute">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
            <WallMock copy={copy.how} />
          </div>
        </Container>

        {/* What the gym gets */}
        <Container className="relative py-16 sm:py-20">
          <h2 className={clsx("text-[32px] sm:text-[40px]", heading)}>
            {copy.value.heading}
          </h2>
          <p className="mt-8 text-[14px] font-semibold tracking-[0.04em] text-lime">
            {copy.value.now.label}
          </p>
          <ul className="mt-4 grid gap-4 md:grid-cols-3">
            {copy.value.now.items.map((item) => (
              <li
                key={item.title}
                className="rounded-2xl border border-line bg-ink-2 p-6 sm:p-7"
              >
                <h3 className="text-[19px] font-bold leading-snug">
                  {item.title}
                </h3>
                <p className="mt-2 text-[16px] leading-[1.7] text-mute">
                  {item.body}
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-10 text-[14px] font-semibold tracking-[0.04em] text-mute">
            {copy.value.planned.label}
          </p>
          <ul className="mt-4 grid gap-4 md:grid-cols-2">
            {copy.value.planned.items.map((item) => (
              <li
                key={item.title}
                className="rounded-2xl border border-dashed border-line p-6 sm:p-7"
              >
                <h3 className="text-[19px] font-bold leading-snug">
                  {item.title}
                </h3>
                <p className="mt-2 text-[16px] leading-[1.7] text-mute">
                  {item.body}
                </p>
              </li>
            ))}
          </ul>
        </Container>

        {/* Getting started */}
        <Container className="relative py-16 sm:py-20">
          <h2 className={clsx("text-[32px] sm:text-[40px]", heading)}>
            {copy.setup.heading}
          </h2>
          <ol className="mt-10 grid gap-4 md:grid-cols-3">
            {copy.setup.steps.map((step, i) => (
              <li key={step.title} className="border-t-2 border-line pt-5">
                <span className="font-display text-[22px] text-lime">
                  {i + 1}
                </span>
                <h3 className="mt-2 text-[19px] font-bold leading-snug">
                  {step.title}
                </h3>
                <p className="mt-2 text-[16px] leading-[1.7] text-mute">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </Container>

        {/* FAQ */}
        <Container className="relative py-16 sm:py-20">
          <h2 className={clsx("text-[32px] sm:text-[40px]", heading)}>
            {copy.faq.heading}
          </h2>
          <dl className="mt-10 grid gap-x-12 gap-y-8 md:grid-cols-2">
            {copy.faq.items.map((item) => (
              <div key={item.q}>
                <dt className="text-[18px] font-bold leading-snug">{item.q}</dt>
                <dd className="mt-2 text-[16px] leading-[1.7] text-mute">
                  {item.a}
                </dd>
              </div>
            ))}
          </dl>
        </Container>

        {/* Founding partners + contact */}
        <Container className="relative py-16 sm:py-20">
          <div className="grid gap-10 rounded-3xl border border-line bg-ink-2 p-7 sm:p-10 lg:grid-cols-2 lg:gap-16 lg:p-14">
            <div>
              <h2 className={clsx("text-[30px] sm:text-[36px]", heading)}>
                {copy.pilot.heading}
              </h2>
              <ul className="mt-7 flex flex-col gap-4">
                {copy.pilot.items.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-[17px] leading-[1.6]"
                  >
                    <span aria-hidden className="mt-[2px] text-lime">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:border-l lg:border-line lg:pl-16">
              <h2 className={clsx("text-[30px] sm:text-[36px]", heading)}>
                {copy.contact.heading}
              </h2>
              <p className="mt-5 text-[16px] leading-[1.75] text-mute">
                {copy.contact.body}
              </p>
              {mail ? (
                <div className="mt-8">
                  <PartnerCta href={mail} place="contact">
                    {copy.contact.button}
                  </PartnerCta>
                </div>
              ) : null}
              <p className="mt-5 text-[14px] text-mute">
                {copy.contact.or}{" "}
                <a
                  className="text-cream underline decoration-line underline-offset-4 transition-colors hover:text-lime hover:decoration-lime"
                  href={`mailto:${siteConfig.partnerEmail}`}
                >
                  {siteConfig.partnerEmail}
                </a>
              </p>
            </div>
          </div>
        </Container>
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
                route.selected ? "bg-lime text-ink" : "bg-ink/85 text-cream",
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
                i === 1 ? "bg-lime text-ink" : "border border-line text-cream",
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
