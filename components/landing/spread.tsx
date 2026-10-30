import Image from "next/image";
import Link from "next/link";

import { getI18n } from "@/lib/i18n";

/**
 * A magazine spread: the photo runs off the left edge, the brand line sits
 * beside it as a pull quote, with a running head and a caption. Square photo
 * corners on purpose: this is print, not a card.
 */
export async function Spread() {
  const { locale, href } = await getI18n();
  const en = locale === "en";

  return (
    <section className="reveal py-20 sm:py-28">
      <div className="grid items-stretch lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <figure className="relative m-0 min-h-[420px] border-y-2 border-night sm:min-h-[560px] lg:border-r-2">
          <Image
            fill
            alt={en ? "A climber on a bouldering wall" : "在抱石牆上的攀岩者"}
            className="object-cover"
            sizes="(min-width: 1024px) 58vw, 100vw"
            src="/shots/climb-3.jpg"
          />
          <figcaption className="label-wide absolute bottom-4 left-4 rounded-[6px] bg-night px-2.5 py-1.5 text-[11px] text-white">
            Fig. 01 — Attempt
          </figcaption>
        </figure>

        <div className="flex flex-col border-b-2 border-night px-4 py-10 sm:px-10 lg:border-t-2 lg:py-12 lg:pl-14 lg:pr-[max(2rem,calc((100vw-1240px)/2+2rem))]">
          {/* Running head, like the top of a magazine page */}
          <div className="label-wide flex items-center justify-between gap-4 border-b-2 border-night pb-3 text-[11px]">
            <span>VARO — No. 01</span>
            <span>{en ? "The idea" : "理念"}</span>
          </div>

          <blockquote className="m-0 mt-10 lg:mt-auto">
            <p
              className={
                en
                  ? "font-display text-[44px] leading-[0.95] tracking-[-0.04em] sm:text-[60px]"
                  : "display-zh text-[40px] sm:text-[54px]"
              }
            >
              {en ? (
                <>
                  The send lasts a second.{" "}
                  <span className="hl hl-scroll px-[0.06em]">
                    Every attempt
                  </span>{" "}
                  got you there.
                </>
              ) : (
                <>
                  完攀只是一瞬間。
                  <br />
                  <span className="hl hl-scroll px-[0.06em]">每一次嘗試</span>
                  ，才是讓它發生的原因。
                </>
              )}
            </p>
          </blockquote>

          <div className="mt-10 grid grid-cols-[auto_1fr] gap-x-4 border-t-2 border-night pt-4 text-[14px] leading-[1.7]">
            <span className="label-wide pt-[3px] text-[11px]">Note</span>
            <p className="text-mute">
              {en
                ? "VARO is named for the four steps of every route: Venture, Attempt, Resilience, Overcome."
                : "VARO 的名字來自每條路線的四個階段：Venture、Attempt、Resilience、Overcome。"}{" "}
              <Link
                className="font-semibold text-cream underline decoration-lime decoration-2 underline-offset-4"
                href={href("/philosophy")}
              >
                {en ? "Read more" : "讀理念"} →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
