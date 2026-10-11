import type { Metadata } from "next";

import Image from "next/image";

import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";
import { Container } from "@/components/landing/ui";
import { getI18n } from "@/lib/i18n";
import { JsonLd, pageMetadata, webPage } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();

  return pageMetadata("/philosophy", t.philosophy.meta);
}

/** One letter per hold on the route, bottom of the wall to the top. Copy lives in the dictionary. */
const STEPS = [
  {
    letter: "V",
    word: "Venture",
    color: "#E5484D",
    radius: "46% 54% 38% 62% / 52% 44% 56% 48%",
  },
  {
    letter: "A",
    word: "Attempt",
    color: "#F5D90A",
    radius: "58% 42% 50% 50% / 40% 58% 42% 60%",
  },
  {
    letter: "R",
    word: "Resilience",
    color: "#3E8BFF",
    radius: "40% 60% 56% 44% / 56% 46% 54% 44%",
  },
  {
    letter: "O",
    word: "Overcome",
    color: "#D4FF5A",
    radius: "52% 48% 44% 56% / 46% 54% 46% 54%",
  },
];

const keyword = (word: string) => (
  <em className="not-italic text-lime">{word}</em>
);

export default async function PhilosophyPage() {
  const { locale, t } = await getI18n();
  const copy = t.philosophy;

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
      <SiteHeader path="/philosophy" />
      <main className="relative overflow-hidden">
        {/* Bolt-hole grid */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.25] [background-image:radial-gradient(#2c2f33_1.2px,transparent_1.2px)] [background-size:30px_30px] [mask-image:linear-gradient(to_bottom,black,transparent_90%)]"
        />

        {/* Opening */}
        <Container className="relative pb-20 pt-36 sm:pt-44">
          <p className="rise text-[14px] font-semibold tracking-[0.12em] text-lime">
            {copy.eyebrow}
          </p>
          <h1
            aria-label="VARO"
            className="rise mt-6 font-display text-[88px] leading-none tracking-[0.02em] sm:text-[140px] lg:text-[180px]"
            style={{ ["--rise-delay" as string]: "60ms" }}
          >
            {STEPS.map((s) => (
              <span
                key={s.letter}
                aria-hidden
                style={{ color: s.letter === "O" ? s.color : undefined }}
              >
                {s.letter}
              </span>
            ))}
          </h1>
          <p
            className="rise mt-8 max-w-[38rem] text-[19px] leading-[1.85] text-cream [text-wrap:pretty] sm:text-[22px]"
            style={{ ["--rise-delay" as string]: "140ms" }}
          >
            {copy.opening(keyword)}
          </p>
        </Container>

        {/* The route: four holds, four letters */}
        <Container className="relative pb-24">
          <ol className="relative">
            {/* the line of the route */}
            <span
              aria-hidden
              className="absolute bottom-10 left-[38px] top-10 w-px bg-gradient-to-b from-[#E5484D]/60 via-[#3E8BFF]/50 to-lime/80 sm:left-[52px]"
            />
            {STEPS.map((s, i) => (
              <li
                key={s.letter}
                className="rise relative grid grid-cols-[76px_1fr] items-start gap-6 py-10 sm:grid-cols-[104px_1fr] sm:gap-10 sm:py-14"
                style={{ ["--rise-delay" as string]: `${200 + i * 90}ms` }}
              >
                {/* the hold, with its letter */}
                <div className="relative">
                  <div
                    className="relative grid size-[76px] place-items-center sm:size-[104px]"
                    style={{ background: s.color, borderRadius: s.radius }}
                  >
                    <span className="font-display text-[40px] leading-none text-ink sm:text-[56px]">
                      {s.letter}
                    </span>
                    <span
                      aria-hidden
                      className="absolute right-[18%] top-[20%] size-2 rounded-full bg-black/35"
                    />
                  </div>
                  {s.letter === "O" ? (
                    <Image
                      aria-hidden
                      alt=""
                      className="bob absolute -top-[62%] left-1/2 w-[70%] -translate-x-1/2"
                      height={512}
                      sizes="80px"
                      src="/mascot/jug-lime.png"
                      width={512}
                    />
                  ) : null}
                </div>

                <div className="pt-1">
                  <p className="flex flex-wrap items-baseline gap-x-3">
                    <span className="font-display text-[34px] leading-tight sm:text-[48px]">
                      {s.word}
                    </span>
                    {copy.steps[i].label ? (
                      <span className="text-[17px] font-bold text-mute sm:text-[19px]">
                        {copy.steps[i].label}
                      </span>
                    ) : null}
                  </p>
                  <p className="mt-3 text-[20px] font-bold leading-[1.5] text-cream [text-wrap:pretty] sm:text-[26px]">
                    {copy.steps[i].line}
                  </p>
                  <p className="mt-2 text-[16px] leading-[1.7] text-mute sm:text-[18px]">
                    {copy.steps[i].sub}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Container>

        {/* Closing */}
        <Container className="relative pb-28 text-center">
          <p className="mx-auto max-w-[34rem] text-[19px] leading-[1.85] text-mute [text-wrap:balance] sm:text-[22px]">
            {copy.closing}
          </p>
          <p className="mt-10 font-display text-[44px] leading-[1.05] sm:text-[72px]">
            Every attempt <span className="text-lime">counts.</span>
          </p>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
