import type { ReactNode } from "react";
import type { OverviewClip, OverviewGym } from "@/lib/beta/overview";
import type { HomeCopy } from "@/lib/home-copy";
import type { BetaCopy } from "@/lib/beta/copy";

import clsx from "clsx";
import Link from "next/link";

import {
  FeedCard,
  InviteCard,
  timeAgo,
  type FeedItem,
} from "@/components/beta/feed-card";
import { GradeChip } from "@/components/beta/grade-chip";

/** A section heading: small eyebrow, title, and an optional link on the right. */
export function SectionHead({
  eyebrow,
  title,
  link,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  link?: { href: string; label: string };
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "flex flex-wrap items-end justify-between gap-x-6 gap-y-3",
        className,
      )}
    >
      <div>
        {eyebrow ? (
          <p className="text-[13px] font-bold text-lime-ink">{eyebrow}</p>
        ) : null}
        <h2 className="mt-1.5 text-[26px] font-extrabold leading-tight tracking-tight sm:text-[32px]">
          {title}
        </h2>
      </div>
      {link ? (
        <Link
          className="group flex items-center gap-1 text-[15px] font-semibold text-cream hover:text-lime-ink"
          href={link.href}
        >
          {link.label}
          <span
            aria-hidden
            className="transition-transform group-hover:translate-x-0.5"
          >
            →
          </span>
        </Link>
      ) : null}
    </div>
  );
}

/** A clip from the overview, as the feed card wants it. */
export function feedItem(
  o: OverviewClip,
  href: (path: string) => string,
  c: BetaCopy,
): FeedItem {
  const { clip, route, gym } = o;

  return {
    id: clip.id,
    href: href(o.path),
    posterUrl: clip.posterUrl,
    durationMs: clip.durationMs,
    grade: route.gradeLabel,
    color: route.holdColor,
    wall: route.wall,
    gymName: gym.name,
    who: clip.owner
      ? { name: clip.owner.name || c.gymDemo, avatarUrl: clip.owner.avatarUrl }
      : null,
    result: clip.result,
    flash: clip.flash,
    bumps: clip.bumps,
    helped: clip.helped,
    createdAt: clip.createdAt,
  };
}

/**
 * The newest beta across gyms, topped up with routes that have none yet so
 * the row never looks empty while beta is scarce.
 */
export function BetaFeed({
  clips,
  gyms,
  href,
  c,
  h,
  zh,
  now,
  max = 8,
  grid = false,
}: {
  clips: OverviewClip[];
  gyms: OverviewGym[];
  href: (path: string) => string;
  c: BetaCopy;
  h: HomeCopy;
  zh: boolean;
  now: number;
  max?: number;
  /** A wrapping grid instead of a swipeable row. */
  grid?: boolean;
}) {
  const shown = clips.slice(0, max);
  const withBeta = new Set(clips.map((x) => x.route.id));
  const invites = gyms
    .flatMap((g) =>
      g.sample.filter((r) => !withBeta.has(r.id)).map((r) => ({ g, r })),
    )
    .slice(0, Math.max(0, Math.min(max, 4) - shown.length));

  const cells = [
    ...shown.map((o) => (
      <FeedCard
        key={o.clip.id}
        ago={timeAgo(o.clip.createdAt, now, zh)}
        c={c}
        item={feedItem(o, href, c)}
        zh={zh}
      />
    )),
    ...invites.map(({ g, r }) => (
      <InviteCard
        key={r.id}
        body={h.inviteBody}
        color={r.holdColor}
        grade={r.gradeLabel}
        gymName={g.gym.name}
        href={href(`${g.betaPath}/${r.id}/upload`)}
        title={h.inviteTitle}
        wall={r.wall}
        zh={zh}
      />
    )),
  ];

  if (grid)
    return (
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {cells.map((cell, i) => (
          <li key={i}>{cell}</li>
        ))}
      </ul>
    );

  return (
    <ul className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:-mx-6 sm:gap-4 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden">
      {cells.map((cell, i) => (
        <li
          key={i}
          className="w-[60vw] max-w-[260px] shrink-0 snap-start lg:w-auto lg:max-w-none"
        >
          {cell}
        </li>
      ))}
    </ul>
  );
}

/** One gym with route data: counts, a few grade chips, and the way in. */
export function GymCard({
  g,
  href,
  h,
  place,
}: {
  g: OverviewGym;
  href: (path: string) => string;
  h: HomeCopy;
  place: string;
}) {
  return (
    <Link
      className="lift group flex flex-col rounded-2xl border border-line bg-ink-2 p-5 sm:p-6"
      href={href(g.betaPath)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[18px] font-extrabold tracking-tight">
            {g.gym.name}
          </p>
          <p className="mt-0.5 text-[13px] text-mute">{place}</p>
        </div>
        {g.fresh ? (
          <span className="shrink-0 rounded-full bg-lime px-2.5 py-1 text-[12px] font-bold text-night">
            {h.gymFresh(g.fresh)}
          </span>
        ) : null}
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {g.sample.slice(0, 6).map((r) => (
          <GradeChip
            key={r.id}
            color={r.holdColor}
            grade={r.gradeLabel}
            size="sm"
          />
        ))}
      </div>
      <div className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-4 text-[13px]">
        <span className="font-semibold text-mute tabular">
          {h.gymRoutes(g.routes)} · {h.gymBeta(g.withBeta)}
        </span>
        <span className="flex items-center gap-1 font-bold group-hover:text-lime-ink">
          {h.gymOpen}
          <span
            aria-hidden
            className="transition-transform group-hover:translate-x-0.5"
          >
            →
          </span>
        </span>
      </div>
    </Link>
  );
}

/** Short points as a plain list, each under a hairline. */
export function Points({ items }: { items: string[] }) {
  return (
    <ul className="mt-6 max-w-[30rem] border-t border-line">
      {items.map((p) => (
        <li
          key={p}
          className="border-b border-line py-3 text-[15px] font-semibold leading-[1.5]"
        >
          {p}
        </li>
      ))}
    </ul>
  );
}
