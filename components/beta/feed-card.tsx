import type { BetaCopy } from "@/lib/beta/copy";

import clsx from "clsx";
import Link from "next/link";

import { GradeChip } from "./grade-chip";

import { clipLength, holdName } from "@/lib/beta/holds";

export interface FeedItem {
  id: string;
  href: string;
  posterUrl: string | null;
  durationMs: number | null;
  grade: string | null;
  color: string | null;
  wall: string | null;
  gymName: string;
  /** Null for the gym's own demo. */
  who: { name: string; avatarUrl: string | null } | null;
  result: "sent" | "attempted" | null;
  flash: boolean;
  bumps: number;
  helped: number;
  createdAt: string;
}

/**
 * One shared beta in a feed: the poster (nothing plays here), who shared it
 * and how it went, and the bumps and sends it earned. Opens the route page.
 */
export function FeedCard({
  item,
  c,
  zh,
  ago,
}: {
  item: FeedItem;
  c: BetaCopy;
  zh: boolean;
  /** "2 小時前", from the caller (server time). */
  ago: string;
}) {
  const color = holdName(item.color, zh);

  return (
    <Link
      className="lift group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-ink-2"
      href={item.href}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-night">
        {item.posterUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- a clip's poster, from storage
          <img
            alt=""
            className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            loading="lazy"
            src={item.posterUrl}
          />
        ) : null}
        <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/25" />
        <span className="absolute left-3 top-3">
          <GradeChip color={item.color} grade={item.grade} size="sm" />
        </span>
        {item.durationMs ? (
          <span className="absolute right-3 top-3.5 rounded-full bg-black/55 px-2 py-0.5 text-[11px] font-semibold text-white tabular backdrop-blur">
            {clipLength(item.durationMs)}
          </span>
        ) : null}
        <span
          aria-hidden
          className="absolute left-1/2 top-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-night shadow-lg transition-transform group-hover:scale-110"
        >
          <svg
            className="ml-0.5 size-5"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 5.5v13a1 1 0 0 0 1.5.86l11-6.5a1 1 0 0 0 0-1.72l-11-6.5A1 1 0 0 0 8 5.5Z" />
          </svg>
        </span>
        <span className="absolute inset-x-3 bottom-3 truncate text-[13px] font-semibold text-white">
          {[color, item.wall].filter(Boolean).join(" · ")}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3.5">
        <div className="flex items-center gap-2.5">
          <Avatar who={item.who} />
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1.5 text-[14px] font-bold">
              <span className="truncate">{item.who?.name || c.gymDemo}</span>
              {item.who ? <Result c={c} item={item} /> : null}
            </p>
            <p className="truncate text-[12px] text-mute">
              {item.gymName} · {ago}
            </p>
          </div>
        </div>
        {item.bumps || item.helped ? (
          <p className="mt-auto flex flex-wrap gap-x-3 gap-y-1 text-[12px] font-semibold text-mute tabular">
            {item.bumps ? (
              <span>{zh ? `碰拳 ${item.bumps}` : `${item.bumps} bumps`}</span>
            ) : null}
            {item.helped ? (
              <span className="text-lime-ink">
                {zh ? `幫 ${item.helped} 人完攀` : `Helped ${item.helped} send`}
              </span>
            ) : null}
          </p>
        ) : null}
      </div>
    </Link>
  );
}

function Avatar({ who }: { who: FeedItem["who"] }) {
  if (!who)
    return (
      <span
        aria-hidden
        className="grid size-8 shrink-0 place-items-center rounded-full bg-lime text-[13px] font-black text-night"
      >
        V
      </span>
    );
  if (who.avatarUrl)
    return (
      // eslint-disable-next-line @next/next/no-img-element -- a climber's photo, from storage
      <img
        alt=""
        className="size-8 shrink-0 rounded-full object-cover ring-1 ring-line"
        height={32}
        loading="lazy"
        referrerPolicy="no-referrer"
        src={who.avatarUrl}
        width={32}
      />
    );

  return (
    <span
      aria-hidden
      className="grid size-8 shrink-0 place-items-center rounded-full bg-ink-3 text-[13px] font-bold"
    >
      {who.name.slice(0, 1) || "?"}
    </span>
  );
}

function Result({ item, c }: { item: FeedItem; c: BetaCopy }) {
  const label = item.flash
    ? c.flash
    : item.result === "sent"
      ? c.sent
      : item.result === "attempted"
        ? c.attempted
        : null;

  if (!label) return null;

  return (
    <span
      className={clsx(
        "shrink-0 rounded-full px-1.5 py-px text-[10px] font-extrabold",
        item.flash
          ? "bg-lime text-night"
          : item.result === "sent"
            ? "bg-night text-day"
            : "border border-line text-mute",
      )}
    >
      {label}
    </span>
  );
}

/** A route with no beta yet, inviting the first upload. */
export function InviteCard({
  href,
  grade,
  color,
  wall,
  gymName,
  title,
  body,
  zh,
}: {
  href: string;
  grade: string | null;
  color: string | null;
  wall: string | null;
  gymName: string;
  title: string;
  body: string;
  zh: boolean;
}) {
  return (
    <Link
      className="lift group flex h-full flex-col overflow-hidden rounded-2xl border border-dashed border-mute/40 bg-ink-2/60"
      href={href}
    >
      <div className="bolt-grid relative grid aspect-[4/5] place-items-center bg-ink-3/60">
        <div className="text-center">
          <GradeChip color={color} grade={grade} size="lg" />
          <p className="mt-3 text-[13px] font-semibold text-mute">
            {[holdName(color, zh), wall].filter(Boolean).join(" · ")}
          </p>
        </div>
        <span className="absolute inset-x-3 bottom-3 flex items-center justify-center gap-1.5 rounded-full bg-night py-2 text-[12px] font-bold text-day transition-colors group-hover:bg-lime group-hover:text-night">
          {body}
        </span>
      </div>
      <div className="p-3.5">
        <p className="text-[14px] font-bold">{title}</p>
        <p className="truncate text-[12px] text-mute">{gymName}</p>
      </div>
    </Link>
  );
}

/** "3 分鐘前" / "2 days ago", from server time; past a week, the date. */
export function timeAgo(iso: string, now: number, zh: boolean) {
  const s = Math.max(0, (now - Date.parse(iso)) / 1000);

  if (s < 3600) {
    const m = Math.max(1, Math.round(s / 60));

    return zh ? `${m} 分鐘前` : `${m}m ago`;
  }
  if (s < 86400) {
    const h = Math.round(s / 3600);

    return zh ? `${h} 小時前` : `${h}h ago`;
  }
  if (s < 7 * 86400) {
    const d = Math.round(s / 86400);

    return zh ? `${d} 天前` : `${d}d ago`;
  }
  const d = new Date(Date.parse(iso) + 8 * 3600_000);

  return zh
    ? `${d.getUTCMonth() + 1} 月 ${d.getUTCDate()} 日`
    : d.toLocaleDateString("en", {
        month: "short",
        day: "numeric",
        timeZone: "UTC",
      });
}
