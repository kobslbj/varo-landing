import type { Metadata } from "next";

import Image from "next/image";

import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";
import { Container } from "@/components/landing/ui";

export const metadata: Metadata = {
  title: "VARO 的理念：Venture · Attempt · Resilience · Overcome",
  description:
    "每一條路線都是一場冒險。不斷嘗試、帶著韌性再上去，直到突破。完攀只是一瞬間，VARO 記住的是讓那一刻發生的每一次嘗試。",
};

/** One letter per hold on the route, bottom of the wall to the top. */
const STEPS = [
  {
    letter: "V",
    word: "Venture",
    zh: "探索",
    line: "每一條新路線，都是一次未知。",
    sub: "站在牆下，讀線，然後決定出發。",
    color: "#E5484D",
    radius: "46% 54% 38% 62% / 52% 44% 56% 48%",
  },
  {
    letter: "A",
    word: "Attempt",
    zh: "嘗試",
    line: "伸手、起攀，換一種解法，再伸一次手。",
    sub: "沒有白費的嘗試，每一次都讓下一次更近。",
    color: "#F5D90A",
    radius: "58% 42% 50% 50% / 40% 58% 42% 60%",
  },
  {
    letter: "R",
    word: "Resilience",
    zh: "韌性",
    line: "掉下來，拍掉止滑粉，再上去。",
    sub: "調整呼吸、調整腳點，調整自己。",
    color: "#3E8BFF",
    radius: "40% 60% 56% 44% / 56% 46% 54% 44%",
  },
  {
    letter: "O",
    word: "Overcome",
    zh: "突破",
    line: "終於，完成那個曾經做不到的動作。",
    sub: "站上頂點的那一刻，屬於前面的每一次。",
    color: "#D4FF5A",
    radius: "52% 48% 44% 56% / 46% 54% 46% 54%",
  },
];

export default function PhilosophyPage() {
  return (
    <>
      <SiteHeader />
      <main className="relative overflow-hidden">
        {/* Bolt-hole grid */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.25] [background-image:radial-gradient(#2c2f33_1.2px,transparent_1.2px)] [background-size:30px_30px] [mask-image:linear-gradient(to_bottom,black,transparent_90%)]"
        />

        {/* Opening */}
        <Container className="relative pb-20 pt-36 sm:pt-44">
          <p className="rise text-[14px] font-semibold tracking-[0.12em] text-lime">
            THE NAME · 名字的由來
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
            每一條路線，都是一場{" "}
            <em className="not-italic text-lime">Venture</em>。
            <br />
            我們不斷 <em className="not-italic text-lime">
              Attempt
            </em>，帶著 <em className="not-italic text-lime">Resilience</em>{" "}
            再上去，
            <br className="hidden sm:block" />
            直到 <em className="not-italic text-lime">Overcome</em>。
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
                    <span className="text-[17px] font-bold text-mute sm:text-[19px]">
                      {s.zh}
                    </span>
                  </p>
                  <p className="mt-3 text-[20px] font-bold leading-[1.5] text-cream [text-wrap:pretty] sm:text-[26px]">
                    {s.line}
                  </p>
                  <p className="mt-2 text-[16px] leading-[1.7] text-mute sm:text-[18px]">
                    {s.sub}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Container>

        {/* Closing */}
        <Container className="relative pb-28 text-center">
          <p className="mx-auto max-w-[34rem] text-[19px] leading-[1.85] text-mute [text-wrap:balance] sm:text-[22px]">
            完攀只是一瞬間。
            <br />
            VARO 想記住的，是讓那一刻發生的每一次嘗試。
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
