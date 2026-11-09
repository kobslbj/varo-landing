import clsx from "clsx";

import { hold, wallCrop } from "@/lib/beta/holds";

export interface WallPhoto {
  url: string;
  width: number;
  height: number;
}

/**
 * A route seen on its wall: the gym's wall photo zoomed toward where the
 * route starts, with that spot ringed, or tagged with the grade when `label`
 * is given. Without a photo or a pin it falls back to a bolt-hole texture
 * with a hold in the route's colour.
 */
export function WallCrop({
  photo,
  pin,
  color,
  aspect = 4 / 5,
  zoom = 2.4,
  ring = "md",
  label = null,
  className,
}: {
  photo: WallPhoto | null;
  pin: { x: number; y: number } | null;
  color: string | null;
  /** Frame width / height. */
  aspect?: number;
  zoom?: number;
  ring?: "sm" | "md" | "lg";
  /** The grade ("V5"): drawn as a tag in the hold colour pointing at the start, instead of the ring. */
  label?: string | null;
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
      {pin && label ? (
        <GradeTag
          fill={h.fill}
          ink={h.ink}
          label={label}
          left={crop.pin.left}
          size={ring}
          top={crop.pin.top}
        />
      ) : pin ? (
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

/**
 * The grade on a tag in the hold's colour, its point on the start hold (a dot
 * marks the exact spot). The tag sits above the hold, or below it when the
 * hold is near the top of the frame, and slides inward near a side edge so
 * it isn't cut off.
 */
function GradeTag({
  label,
  fill,
  ink,
  left,
  top,
  size,
}: {
  label: string;
  fill: string;
  ink: string;
  left: string;
  top: string;
  size: "sm" | "md" | "lg";
}) {
  const below = parseFloat(top) < 22;
  const x = parseFloat(left);
  const align = x < 14 ? "start" : x > 86 ? "end" : "center";
  const text =
    size === "lg"
      ? "px-3.5 py-1 text-[22px]"
      : size === "md"
        ? "px-2.5 py-0.5 text-[16px]"
        : "px-1.5 py-px text-[11px]";
  const gap = size === "sm" ? 9 : 14;

  return (
    <span aria-hidden className="absolute" style={{ left, top }}>
      <span
        className={clsx(
          "absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1.5px_rgb(0_0_0/0.6)]",
          size === "sm" ? "size-2.5" : "size-3.5",
        )}
        style={{ backgroundColor: fill }}
      />
      <span
        className={clsx(
          "absolute left-0",
          // The point stays over the hold: 12px in from the tag's edge.
          align === "center" && "-translate-x-1/2",
          align === "start" && "-translate-x-3",
          align === "end" && "-translate-x-[calc(100%-12px)]",
        )}
        style={below ? { top: gap } : { bottom: gap }}
      >
        <span
          className={clsx(
            "relative block whitespace-nowrap rounded-full border-2 border-white font-wide font-black leading-none tracking-tight shadow-[0_3px_10px_rgb(0_0_0/0.45)]",
            text,
          )}
          style={{ backgroundColor: fill, color: ink }}
        >
          {label}
          <span
            className={clsx(
              "absolute size-2.5 -translate-x-1/2 rotate-45 border-white",
              align === "center" && "left-1/2",
              align === "start" && "left-3",
              align === "end" && "left-[calc(100%-12px)]",
              below
                ? "-top-[7px] border-l-2 border-t-2"
                : "-bottom-[7px] border-b-2 border-r-2",
            )}
            style={{ backgroundColor: fill }}
          />
        </span>
      </span>
    </span>
  );
}
