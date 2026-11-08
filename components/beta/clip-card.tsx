import type { BetaClip } from "@/lib/beta/data";
import type { BetaCopy } from "@/lib/beta/copy";

import clsx from "clsx";

import { BetaPlayer } from "./beta-player";

import { clipLength } from "@/lib/beta/holds";

/** One beta clip with who climbed it, how, and the body they chose to show. */
export function ClipCard({ clip, c }: { clip: BetaClip; c: BetaCopy }) {
  const gym = clip.source === "gym";
  const body = clip.owner
    ? c.body(clip.owner.heightCm, clip.owner.reachCm)
    : "";

  return (
    <article className="overflow-hidden rounded-[24px] border border-line bg-ink-2">
      <BetaPlayer
        duration={clipLength(clip.durationMs)}
        height={clip.height}
        label={c.play}
        posterUrl={clip.posterUrl}
        routeId={clip.routeId}
        source={clip.source}
        videoUrl={clip.videoUrl}
        width={clip.width}
      />
      <div className="flex items-start gap-3 border-t border-line p-4">
        {gym ? (
          <span
            aria-hidden
            className="flex size-11 shrink-0 items-center justify-center rounded-full bg-lime font-display text-[18px] font-bold text-night"
          >
            V
          </span>
        ) : clip.owner?.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- a climber's photo, from storage
          <img
            alt=""
            className="size-11 shrink-0 rounded-full object-cover ring-2 ring-line"
            height={44}
            loading="lazy"
            referrerPolicy="no-referrer"
            src={clip.owner.avatarUrl}
            width={44}
          />
        ) : (
          <span
            aria-hidden
            className="flex size-11 shrink-0 items-center justify-center rounded-full bg-ink-3 text-[17px] font-bold"
          >
            {clip.owner?.name.slice(0, 1) || "?"}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <p className="truncate text-[16px] font-bold">
              {gym ? c.gymDemo : clip.owner?.name}
            </p>
            {gym ? null : clip.flash ? (
              <Tag tone="lime">{c.flash}</Tag>
            ) : clip.result === "sent" ? (
              <Tag tone="dark">{c.sent}</Tag>
            ) : clip.result === "attempted" ? (
              <Tag tone="line">{c.attempted}</Tag>
            ) : null}
          </div>
          <p className="mt-1 text-[13px] text-mute tabular">
            {[
              body || null,
              clip.occurredAt ? c.date(clip.occurredAt) : null,
              clip.views ? c.views(clip.views) : null,
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>
        </div>
      </div>
    </article>
  );
}

function Tag({
  tone,
  children,
}: {
  tone: "lime" | "dark" | "line";
  children: React.ReactNode;
}) {
  return (
    <span
      className={clsx(
        "rounded-full px-2 py-0.5 text-[11px] font-extrabold tracking-wide",
        tone === "lime" && "bg-lime text-night",
        tone === "dark" && "bg-night text-day",
        tone === "line" && "border border-line text-mute",
      )}
    >
      {children}
    </span>
  );
}
