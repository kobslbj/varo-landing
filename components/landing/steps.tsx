import clsx from "clsx";
import Link from "next/link";

import { Card, Container, Tag } from "./ui";

import { getI18n } from "@/lib/i18n";

/**
 * How it works, one letter of the name per step. The word is the brand's
 * (see /philosophy); the line under it is what you do in the app.
 */
const STEPS = [
  {
    letter: "V",
    word: "Venture.",
    zh: "打開岩館地圖，挑一間館、一條想爬的線。",
    en: "Open the gym map. Pick a gym, and a line that scares you a little.",
  },
  {
    letter: "A",
    word: "Attempt.",
    zh: "每一次嘗試點一下就記好：Flash、完攀，或還在努力。",
    en: "Every go is one tap: flash, send, or still working it.",
  },
  {
    letter: "R",
    word: "Resilience.",
    zh: "卡關的線設成 Project，每一天、每一次都留在歷程裡。",
    en: "Stuck? Make it a project. Every day and every go stays on the timeline.",
  },
  {
    letter: "O",
    word: "Overcome.",
    zh: "完攀那天，產生難度貼紙，直接分享到限動。",
    en: "The day it goes, get a grade sticker and share the send.",
  },
] as const;

export async function Steps() {
  const { locale, t, href } = await getI18n();
  const en = locale === "en";

  return (
    <section>
      <Container className="pt-6 sm:pt-10">
        <div className="reveal flex flex-wrap items-end justify-between gap-6">
          <div>
            <Tag>{en ? "How it works" : "怎麼用"}</Tag>
            <h2 className="mt-5 font-display text-[44px] leading-[0.98] sm:text-[72px]">
              {en ? (
                <>
                  Four letters.
                  <br />
                  <span className="text-mute">One route.</span>
                </>
              ) : (
                <span className="display-zh">
                  四個字母，
                  <br />
                  <span className="text-mute">一條路線。</span>
                </span>
              )}
            </h2>
          </div>
          <Link
            className="text-[15px] font-medium text-mute underline decoration-line underline-offset-4 transition-colors hover:text-lime-ink hover:decoration-lime"
            href={href("/philosophy")}
          >
            {en ? "Why VARO is called VARO →" : "VARO 名字的由來 →"}
          </Link>
        </div>

        <ol className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => {
            const last = i === STEPS.length - 1;

            return (
              <li key={step.letter}>
                <Card
                  className="reveal lift group flex h-full min-h-[300px] flex-col p-6 sm:min-h-[340px] sm:p-7"
                  style={{ ["--i" as string]: i }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <span
                      aria-hidden
                      className={clsx(
                        "font-display text-[96px] leading-[0.8] tracking-[-0.06em] sm:text-[120px]",
                        last
                          ? "text-cream"
                          : "text-cream/15 transition-colors duration-300 group-hover:text-cream",
                      )}
                    >
                      {step.letter}
                    </span>
                    <span className="label-wide text-[11px] text-mute tabular">
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="mt-auto pt-10 font-display text-[28px] leading-none sm:text-[30px]">
                    {step.word}
                    {!en && (
                      <span className="ml-2 align-middle text-[15px] font-semibold tracking-normal text-mute">
                        {t.philosophy.steps[i]?.label}
                      </span>
                    )}
                  </h3>
                  <p className="mt-3 text-[15px] leading-[1.75] text-mute [text-wrap:pretty]">
                    {en ? step.en : step.zh}
                  </p>
                </Card>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
