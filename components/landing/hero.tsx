import Image from "next/image";

import { DownloadCta } from "./download-cta";
import { FloatingRoute } from "./holds";
import { Phone3D } from "./phone-3d";
import { FinishScreen, SessionScreen } from "./screens";
import { Container, DemoLabel } from "./ui";
import { session } from "./data";

import { getI18n } from "@/lib/i18n";

export async function Hero() {
  const { t, href } = await getI18n();

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
            className="rise mt-9"
            style={{ ["--rise-delay" as string]: "160ms" }}
          >
            <DownloadCta source="hero" />
            <a
              className="mt-5 inline-flex items-center gap-1.5 text-[15px] font-medium text-mute underline decoration-line underline-offset-4 transition-colors hover:text-lime hover:decoration-lime"
              href={href("/partners")}
            >
              {t.hero.partnerLink}
            </a>
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
              alt={t.images.mascot}
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
    </section>
  );
}
