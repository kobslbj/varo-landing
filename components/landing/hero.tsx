import Image from "next/image";

import { FloatingRoute } from "./holds";
import { Phone3D } from "./phone-3d";
import { FinishScreen, SessionScreen } from "./screens";
import { SiteFooter } from "./site-footer";
import { Container, CtaLink, DemoLabel } from "./ui";
import { session } from "./data";

import { partnerHref, siteConfig } from "@/config/site";
import { getI18n } from "@/lib/i18n";

export async function Hero() {
  const { t } = await getI18n();
  const partner = partnerHref(t.partnerSubject);

  return (
    <section className="relative flex min-h-dvh flex-col overflow-hidden">
      {/* Bolt-hole grid, like a climbing wall */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.3] [background-image:radial-gradient(#2c2f33_1.2px,transparent_1.2px)] [background-size:30px_30px] [mask-image:radial-gradient(ellipse_at_70%_45%,black,transparent_75%)]"
      />
      {/* Lime glow behind the phones */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-10%] top-[18%] h-[520px] w-[520px] rounded-full bg-lime/10 blur-[120px]"
      />

      <Container className="relative grid flex-1 content-center items-center gap-6 pb-10 pt-28 lg:grid-cols-12 lg:gap-6 lg:pt-24">
        {/* Copy */}
        <div className="lg:col-span-6">
          <p className="rise text-[14px] font-semibold tracking-[0.04em] text-lime sm:text-[15px]">
            {t.hero.eyebrow}
          </p>
          <h1
            className="rise mt-5 font-display text-[46px] leading-[1.04] tracking-[-0.01em] sm:text-[64px] lg:text-[68px] xl:text-[76px]"
            style={{ ["--rise-delay" as string]: "60ms" }}
          >
            Every attempt
            <br />
            <span className="text-lime">counts.</span>
          </h1>
          <p
            className="rise mt-7 max-w-[32rem] text-[17px] leading-[1.8] text-mute [text-wrap:pretty] sm:text-[19px]"
            style={{ ["--rise-delay" as string]: "120ms" }}
          >
            <span className="font-semibold text-cream">{t.hero.lead}</span>
            <br />
            {t.hero.body}
          </p>

          <div
            className="rise mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
            style={{ ["--rise-delay" as string]: "160ms" }}
          >
            {siteConfig.appStoreUrl ? (
              <CtaLink href={siteConfig.appStoreUrl}>
                <AppleIcon />
                {t.hero.download}
              </CtaLink>
            ) : (
              <span className="inline-flex h-13 items-center gap-2 self-start rounded-lg bg-cream px-6 text-[16px] font-semibold text-ink">
                <AppleIcon />
                {t.hero.comingSoon}
              </span>
            )}
            {partner ? (
              <CtaLink href={partner} variant="outline">
                {t.nav.partner}
              </CtaLink>
            ) : null}
          </div>
        </div>

        {/* Phones */}
        <div className="relative mx-auto h-[560px] w-full max-w-[520px] sm:h-[640px] lg:col-span-6 lg:max-w-none">
          <FloatingRoute />

          <Phone3D
            className="absolute right-0 top-[2%] w-[44%] opacity-95"
            label={t.hero.finishLabel}
            tilt="right"
          >
            <FinishScreen />
          </Phone3D>

          <div className="absolute left-[2%] top-[11%] w-[52%] sm:left-[6%] sm:w-[50%]">
            <Image
              aria-hidden
              priority
              alt=""
              className="bob absolute -left-[12%] -top-[13%] z-30 w-[34%]"
              height={512}
              sizes="120px"
              src="/mascot/jug-lime.png"
              width={512}
            />
            <Phone3D
              className="relative z-20"
              label={t.hero.sessionLabel(t.screens.gym, session.climbs.length)}
            >
              <SessionScreen />
            </Phone3D>
          </div>

          <div className="absolute bottom-[-2%] right-[2%]">
            <DemoLabel>{t.hero.demo}</DemoLabel>
          </div>
        </div>
      </Container>

      <SiteFooter />
    </section>
  );
}

function AppleIcon() {
  return (
    <svg
      aria-hidden
      className="size-[18px]"
      fill="currentColor"
      viewBox="0 0 17 20"
    >
      <path d="M14.1 10.6c0-2.6 2.1-3.8 2.2-3.9-1.2-1.8-3.1-2-3.7-2-1.6-.2-3.1.9-3.9.9-.8 0-2.1-.9-3.4-.9-1.7 0-3.3 1-4.2 2.6-1.8 3.1-.5 7.7 1.3 10.2.8 1.2 1.8 2.6 3.1 2.6 1.3-.1 1.7-.8 3.3-.8 1.5 0 1.9.8 3.3.8 1.4 0 2.2-1.2 3-2.5 1-1.4 1.3-2.8 1.4-2.9-.1 0-2.6-1-2.4-4.1ZM11.6 3c.7-.8 1.2-2 1-3.1-1 0-2.2.7-2.9 1.5-.6.7-1.2 1.9-1 3 1.1.1 2.2-.6 2.9-1.4Z" />
    </svg>
  );
}
