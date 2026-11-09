import type { BetaCopy } from "@/lib/beta/copy";

import Link from "next/link";

import { GradeChip } from "./grade-chip";

import { clipLength } from "@/lib/beta/holds";

export interface StripItem {
  id: string;
  href: string;
  posterUrl: string | null;
  grade: string | null;
  color: string | null;
  wall: string | null;
  who: string;
  gym: boolean;
  durationMs: number | null;
}

/** The newest beta at a gym, as a row of upright cards that open the route. */
export function LatestStrip({ items, c }: { items: StripItem[]; c: BetaCopy }) {
  return (
    <ul className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-4 [scrollbar-width:none] sm:-mx-6 sm:gap-4 sm:px-6 lg:-mx-8 lg:px-8 [&::-webkit-scrollbar]:hidden">
      {items.map((it, i) => (
        <li
          key={it.id}
          className="pop w-[44vw] max-w-[200px] shrink-0 snap-start sm:w-[200px]"
          style={{ "--rise-delay": `${i * 60}ms` } as React.CSSProperties}
        >
          <Link
            className="lift theme-dark group relative block aspect-[9/14] overflow-hidden rounded-[20px] bg-night"
            href={it.href}
          >
            {it.posterUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- a clip's poster, from storage
              <img
                alt=""
                className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
                src={it.posterUrl}
              />
            ) : (
              <span className="bolt-grid absolute inset-0" />
            )}
            <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/30" />
            <span className="absolute left-2.5 top-2.5 flex items-center gap-1.5">
              <GradeChip color={it.color} grade={it.grade} size="sm" />
            </span>
            {it.durationMs ? (
              <span className="absolute right-2.5 top-3 rounded-full bg-black/60 px-2 py-0.5 font-mono text-[11px] font-semibold text-white tabular">
                {clipLength(it.durationMs)}
              </span>
            ) : null}
            <span className="absolute inset-x-0 bottom-0 p-3">
              {it.gym ? (
                <span className="mb-1.5 inline-block rounded-full bg-lime px-2 py-0.5 text-[11px] font-extrabold text-night">
                  {c.gymDemo}
                </span>
              ) : null}
              <span className="block truncate text-[14px] font-bold text-white">
                {it.wall}
              </span>
              {!it.gym ? (
                <span className="block truncate text-[12px] text-white/70">
                  {it.who}
                </span>
              ) : null}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
