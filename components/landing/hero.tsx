import Image from "next/image";
import Link from "next/link";

import { CampaignLine } from "./campaign-line";
import { DownloadCta } from "./download-cta";
import { FloatingRoute } from "./holds";
import { Phone3D } from "./phone-3d";
import { SessionScreen } from "./screens";
import { Card, Chip, Container, Tag } from "./ui";
import { session } from "./data";

import { getI18n } from "@/lib/i18n";
import { siteConfig } from "@/config/site";

/**
 * A campaign opener (full-bleed photo, giant condensed line, the pitch and
 * the download button), then a bento row: a climbing photo and the app.
 */
export async function Hero() {
  const { locale, t, href } = await getI18n();
  const en = locale === "en";
  // The same illustrative session the phone shows.
  const climb = session.climbs[0];
  const flash = session.climbs.find((c) => c.result === "flash")!;

  return (
    <>
      {/* Campaign opener: full-bleed photo, the line in giant condensed caps */}
      <section className="theme-dark relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-night text-day">
        <Image
          fill
          priority
          alt={t.images.climbPhoto}
          className="settle object-cover brightness-[0.5] contrast-125 grayscale"
          sizes="100vw"
          src="/shots/climb-1.jpg"
        />
        <Container className="relative pb-8 pt-28 sm:pb-12">
          <p className="label-wide flex items-center gap-3 text-[12px] text-white/80 sm:text-[13px]">
            <span className="block h-[2px] w-8 bg-lime" />
            {en ? "Bouldering" : "抱石 · Bouldering"}
          </p>
          <h1 className="campaign mt-5 text-[clamp(72px,18vw,280px)]">
            <CampaignLine delay={120}>Made to</CampaignLine>
            <CampaignLine delay={240}>
              <span className="text-lime">Overcome.</span>
            </CampaignLine>
          </h1>

          <div className="mt-8 grid gap-6 border-t-2 border-white/80 pt-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              {!en && (
                <p className="display-zh text-[24px] sm:text-[32px]">
                  生來就是為了突破。
                </p>
              )}
              <p className="mt-2 max-w-[34rem] text-[16px] leading-[1.7] text-white/75 [text-wrap:pretty] sm:text-[17px]">
                <span className="font-semibold text-white">{t.hero.lead}</span>{" "}
                {t.hero.body}
              </p>
            </div>
            <div className="flex flex-col gap-4 lg:items-end">
              {!siteConfig.appStoreUrl && (
                <p className="text-[14px] text-white/70">{t.hero.comingSoon}</p>
              )}
              <DownloadCta source="hero" />
              <div className="flex flex-wrap gap-2">
                <Chip>
                  {en ? "iOS · 中文 / English" : "iOS · 繁中 / English"}
                </Chip>
                <Chip outline>
                  {en ? "Logs are private by default" : "紀錄預設不公開"}
                </Chip>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="relative">
        <Container className="pb-3 pt-6 sm:pt-8">
          <div className="grid gap-3 lg:grid-cols-12">
            {/* The photo: the climb is the hero, not the UI */}
            <Card className="reveal theme-dark min-h-[440px] sm:min-h-[560px] lg:col-span-7">
              <Image
                fill
                priority
                alt={t.images.climbPhoto}
                className="object-cover"
                sizes="(min-width: 1024px) 400px, 100vw"
                src={session.photos[1]}
              />
              <div className="absolute inset-x-4 top-4 flex items-center justify-between gap-3">
                <span className="label-wide rounded-[6px] bg-night px-2.5 py-1.5 text-[11px] text-white">
                  Attempt
                </span>
              </div>

              {/* In-world label on the wall, like a pin on a game map */}
              <div
                aria-hidden
                className="ping-pop absolute left-[30%] top-[36%] flex items-center gap-2"
                style={{ ["--pop-delay" as string]: "700ms" }}
              >
                <span className="grid size-7 place-items-center rounded-full border-[3px] border-white bg-night">
                  <span className="size-2 rounded-full bg-white" />
                </span>
                <span className="flex items-center gap-2 rounded-[4px] border-2 border-night bg-white px-2.5 py-1 text-[13px] text-night">
                  <b className="label-wide text-hold-red">{climb.grade}</b>
                  <span className="font-medium text-night/60">
                    {en
                      ? `Go ${climb.attempts} · Sent`
                      : `第 ${climb.attempts} 次 · 完攀`}
                  </span>
                </span>
              </div>

              <Link
                className="group absolute inset-x-4 bottom-4 block rounded-[16px] bg-night p-5"
                href={href("/philosophy")}
              >
                <span className="block font-display text-[32px] leading-[0.98] text-white sm:text-[38px]">
                  {en ? (
                    <>
                      Six goes.
                      <br />
                      <span className="text-lime">One send.</span>
                    </>
                  ) : (
                    <>
                      這條，
                      <br />
                      <span className="text-lime">爬了六次。</span>
                    </>
                  )}
                </span>
                <span className="mt-3 inline-flex items-center gap-1.5 text-[14px] font-medium text-white/75 transition-colors group-hover:text-lime">
                  {t.nav.philosophy} →
                </span>
              </Link>
            </Card>

            {/* The app */}
            <Card
              className="reveal flex min-h-[560px] flex-col lg:col-span-5"
              style={{ ["--i" as string]: 1 }}
              tone="raised"
            >
              <div aria-hidden className="bolt-grid absolute inset-0" />
              <div className="absolute inset-x-0 bottom-0 top-20">
                <FloatingRoute />
              </div>
              <div className="relative flex items-center justify-between p-6">
                <Tag>App</Tag>
              </div>

              {/* A notification, the way the game talks to you */}
              <div
                aria-hidden
                className="ping-pop relative z-40 mx-4 flex items-start gap-3 rounded-[16px] border-2 border-night bg-white p-3 text-night"
                style={{ ["--pop-delay" as string]: "1100ms" }}
              >
                <span className="label-wide grid size-9 shrink-0 place-items-center rounded-[10px] bg-night text-[13px] text-lime">
                  V
                </span>
                <span className="min-w-0 flex-1 text-[13px] leading-snug">
                  <span className="flex justify-between gap-2 text-[11px] text-night/50">
                    <span>VARO</span>
                    <span>{en ? "now" : "現在"}</span>
                  </span>
                  <b className="block text-[14px]">Flash!</b>
                  {en
                    ? `${flash.grade} on the first go.`
                    : `${flash.grade} 一次就上。`}
                </span>
              </div>
              <div className="relative mx-auto mt-auto w-[62%] max-w-[260px] sm:w-[50%] lg:w-[78%] translate-y-[14%]">
                <Image
                  aria-hidden
                  priority
                  alt={t.images.mascot}
                  className="bob absolute -left-[16%] -top-[10%] z-30 w-[38%]"
                  height={512}
                  sizes="100px"
                  src="/mascot/jug-lime.png"
                  width={512}
                />
                <Phone3D
                  className="relative z-20"
                  label={t.hero.sessionLabel(
                    t.screens.gym,
                    session.climbs.length,
                  )}
                  tilt="flat"
                >
                  <SessionScreen />
                </Phone3D>
              </div>
            </Card>
          </div>
        </Container>
      </section>
    </>
  );
}
