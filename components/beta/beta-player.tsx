"use client";

import { track } from "@vercel/analytics";
import clsx from "clsx";
import { useState } from "react";

/**
 * A beta clip that plays only when tapped: seeing the moves spoils a route
 * for anyone who wants to read it themselves. The poster shows until then.
 */
export function BetaPlayer({
  videoUrl,
  posterUrl,
  width,
  height,
  duration,
  routeId,
  source,
  label,
  className,
}: {
  videoUrl: string;
  posterUrl: string | null;
  width: number | null;
  height: number | null;
  duration: string | null;
  routeId: string;
  source: "climber" | "gym";
  /** Accessible name of the play button. */
  label: string;
  className?: string;
}) {
  const [playing, setPlaying] = useState(false);
  // Phones film upright; clamp odd sizes so one clip can't take the whole page.
  const ratio =
    width && height
      ? Math.min(4 / 3, Math.max(9 / 16, width / height))
      : 9 / 16;

  return (
    <div
      className={clsx(
        "theme-dark relative w-full overflow-hidden bg-night",
        className,
      )}
      style={{ aspectRatio: ratio }}
    >
      {playing ? (
        // eslint-disable-next-line jsx-a11y/media-has-caption -- climbing footage, no speech
        <video
          autoPlay
          controls
          playsInline
          className="absolute inset-0 size-full bg-night object-contain"
          poster={posterUrl ?? undefined}
          preload="auto"
          src={videoUrl}
        />
      ) : (
        <button
          aria-label={label}
          className="group absolute inset-0 size-full cursor-pointer"
          type="button"
          onClick={() => {
            setPlaying(true);
            track("beta_play", { route: routeId, source });
          }}
        >
          {posterUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- a clip's poster, from storage
            <img
              alt=""
              className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              decoding="async"
              loading="lazy"
              src={posterUrl}
            />
          ) : (
            <span className="bolt-grid absolute inset-0" />
          )}
          <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-black/25" />
          <span className="absolute left-1/2 top-1/2 flex size-[72px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-lime transition-transform duration-150 group-active:shadow-none">
            <svg
              aria-hidden
              className="ml-1 size-7 fill-night"
              viewBox="0 0 24 24"
            >
              <path d="M7 4.5v15a1 1 0 0 0 1.52.85l12-7.5a1 1 0 0 0 0-1.7l-12-7.5A1 1 0 0 0 7 4.5Z" />
            </svg>
          </span>
          {duration ? (
            <span className="absolute bottom-3 right-3 rounded-full bg-black/65 px-2.5 py-1 font-mono text-[12px] font-semibold text-white backdrop-blur-sm tabular">
              {duration}
            </span>
          ) : null}
        </button>
      )}
    </div>
  );
}
