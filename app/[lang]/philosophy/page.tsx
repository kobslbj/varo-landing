import type { Metadata } from "next";

import clsx from "clsx";
import Image from "next/image";

import { CampaignLine } from "@/components/landing/campaign-line";
import { DownloadCta } from "@/components/landing/download-cta";
import { Marquee } from "@/components/landing/marquee";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";
import { Container } from "@/components/landing/ui";
import { getI18n } from "@/lib/i18n";
import { JsonLd, pageMetadata, webPage } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();

  return pageMetadata("/philosophy", t.philosophy.meta);
}

/**
 * The name, told like a campaign: a full-bleed photo, then one chapter per
 * letter of the route, then the line. Copy lives in the dictionary; the
 * route colours are the holds' colours in the app.
 */
const CHAPTERS: {
  letter: string;
  word: string;
  color: string;
  tone: "black" | "white" | "lime";
  /** Null means type only. */
  photo: string | null;
}[] = [
  {
    letter: "V",
    word: "Venture",
    color: "#E5484D",
    tone: "black",
    photo: "/shots/partners-wall.jpg",
  },
  {
    letter: "A",
    word: "Attempt",
    color: "#F5D90A",
    tone: "white",
    photo: "/shots/climb-5.jpg",
  },
  {
    letter: "R",
    word: "Resilience",
    color: "#3E8BFF",
    tone: "black",
    photo: "/shots/climb-3.jpg",
  },
  {
    letter: "O",
    word: "Overcome",
    color: "#C6FF00",
    tone: "lime",
    photo: null,
  },
];

const keyword = (word: string) => (
  <em className="not-italic text-lime">{word}</em>
);

export default async function PhilosophyPage() {
  const { locale, t } = await getI18n();
  const copy = t.philosophy;
  const zh = locale === "zh-TW";

  return (
    <>
      <JsonLd
        graph={[
          webPage(locale, "/philosophy", {
            name: copy.meta.title,
            description: copy.meta.description,
          }),
        ]}
      />
      <SiteHeader overPhoto path="/philosophy" />
      <main>
        {/* ---------------------------------------------------------- Hero */}
        <section className="theme-dark relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-night text-day">
          <Image
            fill
            priority
            alt={t.images.climbPhoto}
            className="settle object-cover brightness-[0.55] contrast-125 grayscale"
            sizes="100vw"
            src="/shots/climb-1.jpg"
          />
          <Container className="relative pb-10 pt-32 sm:pb-14">
            <p className="label-wide flex items-center gap-3 text-[12px] text-white/80 sm:text-[13px]">
              <span className="block h-[2px] w-8 bg-lime" />
              {copy.eyebrow}
            </p>
            <h1 className="campaign mt-6 text-[clamp(72px,19vw,300px)]">
              <span className="sr-only">VARO — </span>
              <CampaignLine delay={120}>Made to</CampaignLine>
              <CampaignLine delay={240}>
                <span className="text-lime">Overcome.</span>
              </CampaignLine>
            </h1>
            <div className="mt-8 flex flex-wrap items-end justify-between gap-6 border-t-2 border-white/80 pt-5">
              {zh ? (
                <p className="display-zh text-[24px] sm:text-[34px]">
                  生來就是為了突破。
                </p>
              ) : (
                <p className="text-[18px] font-semibold sm:text-[22px]">
                  Venture. Attempt. Resilience. Overcome.
                </p>
              )}
              <p className="label-wide text-[11px] text-white/70">
                V — A — R — O
              </p>
            </div>
          </Container>
        </section>

        {/* --------------------------------------------------- Manifesto */}
        <section className="theme-dark bg-night py-24 text-day sm:py-36">
          <Container>
            <p
              className={clsx(
                "brighten max-w-[60rem] [text-wrap:balance]",
                zh
                  ? "display-zh text-[34px] sm:text-[60px]"
                  : "font-display text-[38px] leading-[1.02] sm:text-[68px]",
              )}
            >
              {copy.opening(keyword)}
            </p>
          </Container>
        </section>

        <div className="bg-night">
          <Marquee />
        </div>

        {/* ---------------------------------------------------- Chapters */}
        {CHAPTERS.map((c, i) => (
          <Chapter
            key={c.letter}
            index={i}
            label={copy.steps[i].label}
            line={copy.steps[i].line}
            sub={copy.steps[i].sub}
            {...c}
          />
        ))}

        {/* ------------------------------------------------------ Closing */}
        <section className="theme-dark bg-night py-24 text-day sm:py-36">
          <Container>
            <p
              className={clsx(
                "brighten max-w-[56rem] [text-wrap:balance]",
                zh
                  ? "display-zh text-[32px] sm:text-[54px]"
                  : "font-display text-[34px] leading-[1.05] sm:text-[60px]",
              )}
            >
              {copy.closing}
            </p>
          </Container>
        </section>

        <section className="on-paper border-y-2 border-night bg-lime text-night">
          <Container className="py-20 sm:py-28">
            <p className="campaign text-[clamp(64px,15vw,240px)]">
              Made to
              <br />
              <span className="inline-block bg-night px-[0.06em] text-lime">
                Overcome.
              </span>
            </p>
            <div className="mt-12 flex flex-wrap items-center justify-between gap-6 border-t-2 border-night pt-6">
              <span className="inline-grid size-[84px] place-items-center rounded-[20px] bg-night">
                <Image
                  aria-hidden
                  alt={t.images.mascot}
                  className="bob w-[58px]"
                  height={512}
                  sizes="58px"
                  src="/mascot/jug-lime.png"
                  width={512}
                />
              </span>
              <DownloadCta source="closing" variant="dark" />
            </div>
          </Container>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

/**
 * A chapter of the route: number, the word huge, the line, and a photo.
 * A giant outlined letter drifts behind it as you scroll.
 */
function Chapter({
  index,
  letter,
  word,
  color,
  tone,
  photo,
  label,
  line,
  sub,
}: {
  index: number;
  letter: string;
  word: string;
  color: string;
  tone: "black" | "white" | "lime";
  photo: string | null;
  label?: string;
  line: string;
  sub: string;
}) {
  const flip = index % 2 === 1;

  return (
    <section
      className={clsx(
        "relative overflow-hidden border-b-2 border-night",
        tone === "black" && "theme-dark bg-night text-day",
        tone === "white" && "bg-ink-2 text-night",
        tone === "lime" && "on-paper bg-lime text-night",
      )}
    >
      {/* The giant letter, outlined, drifting behind */}
      <span
        aria-hidden
        className={clsx(
          "campaign outline-letter drift pointer-events-none absolute -bottom-[8%] select-none text-[70vw] leading-none lg:text-[48vw]",
          flip ? "-left-[4%]" : "-right-[4%]",
          tone === "black" ? "text-white/15" : "text-night/15",
        )}
      >
        {letter}
      </span>

      <div
        className={clsx(
          "relative grid min-h-[88svh] items-stretch",
          photo && "lg:grid-cols-2",
        )}
      >
        <Container
          className={clsx(
            "reveal flex flex-col justify-center py-20 sm:py-28",
            photo && "lg:max-w-none lg:px-14 xl:px-20",
            photo && flip && "lg:order-2",
          )}
        >
          <p className="label-wide flex items-center gap-3 text-[12px] sm:text-[13px]">
            <span className="tabular">0{index + 1}</span>
            <span className="h-[2px] w-8 bg-current opacity-60" />
            <span>{label ?? word}</span>
            {/* The route's hold colour for this step */}
            <span
              className="ml-1 block size-3 rotate-12 rounded-[40%_55%_45%_50%] border border-black/30"
              style={{ background: color }}
            />
          </p>
          <h2 className="campaign mt-6 text-[clamp(64px,15vw,200px)] lg:text-[clamp(72px,9vw,168px)]">
            {word}.
          </h2>
          <p className="mt-8 max-w-[34rem] text-[24px] font-bold leading-[1.35] [text-wrap:pretty] sm:text-[32px]">
            {line}
          </p>
          <p
            className={clsx(
              "mt-4 max-w-[30rem] text-[16px] leading-[1.75] sm:text-[18px]",
              tone === "black" ? "text-white/65" : "opacity-70",
            )}
          >
            {sub}
          </p>
        </Container>

        {photo ? (
          <figure
            className={clsx(
              "relative m-0 min-h-[60svh] border-t-2 border-night lg:min-h-full lg:border-t-0",
              flip ? "lg:order-1 lg:border-r-2" : "lg:border-l-2",
            )}
          >
            <Image
              fill
              alt=""
              className="object-cover contrast-125 grayscale"
              sizes="(min-width: 1024px) 50vw, 100vw"
              src={photo}
            />
            <figcaption className="label-wide absolute bottom-4 left-4 rounded-[6px] bg-night px-2.5 py-1.5 text-[11px] text-white">
              {letter} — {word}
            </figcaption>
          </figure>
        ) : null}
      </div>
    </section>
  );
}
