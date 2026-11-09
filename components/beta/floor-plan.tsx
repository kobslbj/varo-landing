"use client";

import type { FloorPlan } from "@/lib/beta/plans";

import clsx from "clsx";
import { useEffect, useRef } from "react";

/**
 * The gym's floor plan as the wall picker: tap a zone's printed letter to
 * choose that wall, tap it again to clear. A zone with no routes up is dimmed
 * and can't be chosen. Wide plans scroll sideways on a phone so the letters
 * stay big enough to tap.
 */
export function FloorPlanPicker({
  plan,
  active,
  count,
  routesLabel,
  onPick,
}: {
  plan: FloorPlan;
  active: string | null;
  count: (zone: string) => number;
  /** "{n} 條路線", for each spot's accessible name. */
  routesLabel: string;
  onPick: (zone: string) => void;
}) {
  const chosen = active ? plan.spots[active] : undefined;
  const scroller = useRef<HTMLDivElement>(null);

  // On a phone the plan is wider than the screen: keep the chosen zone in view
  // (a wall's QR code may open on the far end).
  useEffect(() => {
    const el = scroller.current;

    if (!el || !chosen) return;
    el.scrollTo({
      left: chosen.x * el.scrollWidth - el.clientWidth / 2,
      behavior: "smooth",
    });
  }, [chosen]);

  return (
    <div
      ref={scroller}
      className="-mx-4 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
    >
      <div
        className="relative min-w-[640px] overflow-hidden rounded-2xl bg-night"
        style={{ aspectRatio: `${plan.width} / ${plan.height}` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- a fixed drawing in /public, sized by its box */}
        <img
          alt=""
          className="absolute inset-0 size-full"
          height={plan.height}
          src={plan.src}
          width={plan.width}
        />
        {chosen?.outline ? (
          <svg
            aria-hidden
            className="pointer-events-none absolute inset-0 size-full"
            preserveAspectRatio="none"
            viewBox="0 0 1 1"
          >
            <polygon
              className="fill-lime/40 stroke-day"
              points={chosen.outline.map(([x, y]) => `${x},${y}`).join(" ")}
              strokeWidth={3}
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ) : null}
        {Object.entries(plan.spots).map(([zone, spot]) => {
          const n = count(zone);
          const on = active === zone;

          return (
            <button
              key={zone}
              aria-label={`${zone} · ${routesLabel.replace("{n}", String(n))}`}
              aria-pressed={on}
              className={clsx(
                // A hit area bigger than the printed letter; the ring hugs the letter.
                "group absolute aspect-square h-[20%] -translate-x-1/2 -translate-y-1/2 rounded-full",
                !n && "cursor-not-allowed",
              )}
              disabled={!n}
              style={{ left: `${spot.x * 100}%`, top: `${spot.y * 100}%` }}
              type="button"
              onClick={() => onPick(zone)}
            >
              <span
                className={clsx(
                  "absolute inset-[22%] rounded-full transition-[box-shadow,background-color]",
                  on
                    ? "ring-[3px] ring-day ring-offset-2 ring-offset-night"
                    : n
                      ? "group-hover:ring-2 group-hover:ring-day/70"
                      : "bg-night/70",
                )}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
