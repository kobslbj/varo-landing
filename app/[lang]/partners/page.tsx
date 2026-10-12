import type { Metadata } from "next";

import clsx from "clsx";

import { PartnerCta } from "@/components/landing/partner-cta";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";
import { Container } from "@/components/landing/ui";
import { partnerHref, siteConfig } from "@/config/site";
import { getI18n } from "@/lib/i18n";
import { JsonLd, pageMetadata, webPage } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();

  return pageMetadata("/partners", t.partners.meta);
}

/** Hold colours for the three problem cards, bottom of the wall to the top. */
const PROBLEM_HOLDS = ["#E5484D", "#F5D90A", "#3E8BFF"];

/**
 * Recruiting the first partner gyms. Nothing gym-side exists in the app yet,
 * so the page says so and asks for an email instead of selling a feature.
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
          {mail ? (
            <div
              className="rise mt-9"
              style={{ ["--rise-delay" as string]: "160ms" }}
            >
              <PartnerCta href={mail} place="hero">
                {copy.cta}
              </PartnerCta>
            </div>
          ) : null}
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

        {/* What we want to build */}
        <Container className="relative py-16 sm:py-20">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className={clsx("text-[32px] sm:text-[40px]", heading)}>
              {copy.plan.heading}
            </h2>
            <span className="rounded-full border border-lime/40 px-2.5 py-1 text-[13px] font-semibold text-lime">
              {copy.plan.badge}
            </span>
          </div>
          <ul className="mt-10 grid gap-4 md:grid-cols-2">
            {copy.plan.items.map((item) => (
              <li
                key={item.title}
                className="rounded-2xl border border-dashed border-line p-6 sm:p-7"
              >
                <h3 className="text-[21px] font-bold leading-snug">
                  {item.title}
                </h3>
                <p className="mt-2 text-[16px] leading-[1.7] text-mute">
                  {item.body}
                </p>
              </li>
            ))}
          </ul>
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
