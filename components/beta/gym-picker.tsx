"use client";

import clsx from "clsx";
import Link from "next/link";
import { useEffect, useState } from "react";

import { readLastGym, type LastGym } from "./remember-gym";

export interface PickerGym {
  href: string;
  name: string;
  place: string;
  routes: number;
  withBeta: number;
  lat: number | null;
  lng: number | null;
}

/**
 * "Which gym are you at?": the gym you opened last time first (one tap back
 * from the mat), then every gym with routes. "Near me" asks for the location
 * only when tapped, then sorts by distance.
 */
export function GymPicker({
  gyms,
  labels,
}: {
  gyms: PickerGym[];
  labels: {
    title: string;
    last: string;
    near: string;
    locating: string;
    denied: string;
    /** "{r} 條路線 · {b} 條有 beta" */
    routes: string;
    /** "{km} 公里" */
    km: string;
  };
}) {
  const [last, setLast] = useState<LastGym | null>(null);
  const [here, setHere] = useState<{ lat: number; lng: number } | null>(null);
  const [state, setState] = useState<"idle" | "locating" | "denied">("idle");

  useEffect(() => setLast(readLastGym()), []);

  const locate = () => {
    if (!("geolocation" in navigator)) return setState("denied");
    setState("locating");
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setHere({ lat: p.coords.latitude, lng: p.coords.longitude });
        setState("idle");
      },
      () => setState("denied"),
      { maximumAge: 600_000, timeout: 10_000 },
    );
  };

  const dist = (g: PickerGym) =>
    here && g.lat != null && g.lng != null
      ? km(here.lat, here.lng, g.lat, g.lng)
      : null;
  const list = here
    ? [...gyms].sort((a, b) => (dist(a) ?? 1e9) - (dist(b) ?? 1e9))
    : gyms;
  const lastGym = last && gyms.find((g) => g.href === last.href);

  return (
    <div>
      {lastGym ? (
        <Link
          className="lift mb-3 flex items-center justify-between gap-4 rounded-2xl bg-night px-5 py-4 text-day"
          href={lastGym.href}
        >
          <span className="min-w-0">
            <span className="block text-[12px] font-bold text-lime">
              {labels.last}
            </span>
            <span className="block truncate text-[18px] font-extrabold">
              {lastGym.name}
            </span>
          </span>
          <span aria-hidden className="text-[22px] text-lime">
            →
          </span>
        </Link>
      ) : null}

      <div className="flex items-center justify-between gap-3">
        <p className="text-[15px] font-bold">{labels.title}</p>
        <button
          className="h-9 rounded-full border border-line bg-ink-2 px-3.5 text-[13px] font-bold transition-colors hover:bg-ink-3 disabled:opacity-60"
          disabled={state === "locating"}
          type="button"
          onClick={locate}
        >
          {state === "locating" ? labels.locating : labels.near}
        </button>
      </div>
      {state === "denied" ? (
        <p className="mt-2 text-[13px] text-mute">{labels.denied}</p>
      ) : null}

      <ul className="mt-3 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-ink-2">
        {list.map((g) => {
          const d = dist(g);

          return (
            <li key={g.href}>
              <Link
                className={clsx(
                  "flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-ink-3 sm:px-5",
                )}
                href={g.href}
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[16px] font-bold">
                    {g.name}
                  </span>
                  <span className="block truncate text-[13px] text-mute tabular">
                    {[
                      g.place,
                      labels.routes
                        .replace("{r}", String(g.routes))
                        .replace("{b}", String(g.withBeta)),
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                </span>
                {d != null ? (
                  <span className="shrink-0 text-[13px] font-semibold text-mute tabular">
                    {labels.km.replace(
                      "{km}",
                      d < 10 ? d.toFixed(1) : String(Math.round(d)),
                    )}
                  </span>
                ) : null}
                <span aria-hidden className="text-mute">
                  →
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** Great-circle distance in km. */
function km(lat1: number, lng1: number, lat2: number, lng2: number) {
  const r = (d: number) => (d * Math.PI) / 180;
  const a =
    Math.sin(r(lat2 - lat1) / 2) ** 2 +
    Math.cos(r(lat1)) * Math.cos(r(lat2)) * Math.sin(r(lng2 - lng1) / 2) ** 2;

  return 6371 * 2 * Math.asin(Math.sqrt(a));
}
