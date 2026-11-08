import clsx from "clsx";

import { hold, wallCrop } from "@/lib/beta/holds";

export interface WallPhoto {
  url: string;
  width: number;
  height: number;
}

/**
 * A route seen on its wall: the gym's wall photo zoomed toward where the
 * route starts, with that spot ringed. Without a photo or a pin it falls back
 * to a bolt-hole texture with a hold in the route's colour.
 */
export function WallCrop({
  photo,
  pin,
  color,
  aspect = 4 / 5,
  zoom = 2.4,
  ring = "md",
  className,
}: {
  photo: WallPhoto | null;
  pin: { x: number; y: number } | null;
  color: string | null;
  /** Frame width / height. */
  aspect?: number;
  zoom?: number;
  ring?: "sm" | "md" | "lg";
  className?: string;
}) {
  const h = hold(color);

  if (!photo) {
    return (
      <div
        aria-hidden
        className={clsx(
          "bolt-grid relative overflow-hidden bg-ink-3",
          className,
        )}
        style={{ aspectRatio: aspect }}
      >
        <svg
          className="absolute left-1/2 top-1/2 w-[38%] -translate-x-1/2 -translate-y-1/2"
          viewBox="-1.2 -1.2 2.4 2.4"
        >
          <path
            d="M-0.9,-0.2 C-0.8,-0.85 0.1,-1.05 0.65,-0.6 C1.1,-0.2 0.95,0.6 0.35,0.85 C-0.3,1.1 -1,0.55 -0.9,-0.2 Z"
            fill={h.fill}
            stroke="#111"
            strokeWidth="0.06"
          />
          <circle cx="0.05" cy="0.05" fill="#111" opacity="0.35" r="0.12" />
        </svg>
      </div>
    );
  }

  const crop = pin
    ? wallCrop(photo, aspect, pin, zoom)
    : wallCrop(photo, aspect, { x: 0.5, y: 0.5 }, 1);
  const r = ring === "sm" ? 22 : ring === "lg" ? 44 : 32;

  return (
    <div
      className={clsx("relative overflow-hidden bg-night", className)}
      style={{ aspectRatio: aspect }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- the gym's wall photo, from storage */}
      <img
        alt=""
        className="absolute max-w-none select-none"
        decoding="async"
        draggable={false}
        loading="lazy"
        src={photo.url}
        style={crop.img}
      />
      {pin ? (
        <span
          aria-hidden
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ ...crop.pin, width: r, height: r }}
        >
          <span
            className="absolute inset-0 rounded-full border-[3px] border-lime opacity-70 motion-safe:animate-ping"
            style={{ animationDuration: "2.2s" }}
          />
          <span className="absolute inset-0 rounded-full border-[3px] border-lime shadow-[0_0_0_2px_rgb(0_0_0/0.55),inset_0_0_0_2px_rgb(0_0_0/0.35)]" />
          <span
            className="absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-black/60"
            style={{ backgroundColor: h.fill }}
          />
        </span>
      ) : null}
    </div>
  );
}
