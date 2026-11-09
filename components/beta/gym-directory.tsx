"use client";

import type { GymLogo } from "@/lib/beta/gym-logos";

import clsx from "clsx";
import { IBM_Plex_Mono, Permanent_Marker } from "next/font/google";
import Link from "next/link";
import { useEffect, useState } from "react";

import { readLastGym, type LastGym } from "./remember-gym";

import { betaCopy, type BetaCopy } from "@/lib/beta/copy";

interface Place {
  id: string;
  name: string;
  /** "台北市 · 中山區" */
  place: string;
  /** City key, as the directory writes it ("台北市"), for the filter. */
  city: string;
  lat: number | null;
  lng: number | null;
}

/** A gym whose routes are in VARO: its card opens the beta. */
export interface OpenGym extends Place {
  href: string;
  cover: string | null;
  /** The gym's white logo, for the card's lockup. */
  logo: GymLogo | null;
  /** "TAIPEI · ZHONGSHAN", in the posts' mono caps. */
  tagline: string;
  routes: number;
  withBeta: number;
  fresh: number;
}

type Copy = Pick<
  BetaCopy,
  | "dirAll"
  | "dirLast"
  | "dirNear"
  | "dirLocating"
  | "dirDenied"
  | "dirKm"
  | "dirOpenTitle"
  | "dirOpenLead"
  | "dirExclusive"
  | "dirOpen"
  | "dirStats"
  | "dirFresh"
  | "dirEnter"
  | "dirNone"
>;

// The IG posts' faces: Plex Mono for the caps, Permanent Marker for tape.
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: "700",
  display: "swap",
});
const marker = Permanent_Marker({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

function km(a: { lat: number; lng: number }, b: Place) {
  if (b.lat == null || b.lng == null) return Infinity;
  const r = Math.PI / 180;
  const h =
    Math.sin(((b.lat - a.lat) * r) / 2) ** 2 +
    Math.cos(a.lat * r) *
      Math.cos(b.lat * r) *
      Math.sin(((b.lng - a.lng) * r) / 2) ** 2;

  return 12742 * Math.asin(Math.sqrt(h));
}

/**
 * The Beta tab's gym picker: the gyms on VARO as big cards under a region
 * filter. "Nearest" asks for the location only when tapped. Beta itself is
 * only inside a gym's page.
 */
export function GymDirectory({
  open,
  cities,
  zh,
}: {
  open: OpenGym[];
  /** Filter chips in order: city key and its label. */
  cities: { key: string; label: string }[];
  /** Copy comes from here: functions can't cross into a client component. */
  zh: boolean;
}) {
  const c: Copy = betaCopy[zh ? "zh-TW" : "en"];
  const [city, setCity] = useState<string | null>(null);
  const [last, setLast] = useState<LastGym | null>(null);
  const [here, setHere] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState<"idle" | "busy" | "denied">("idle");

  useEffect(() => {
    setLast(readLastGym());
  }, []);

  const locate = () => {
    if (here) return setHere(null);
    if (!("geolocation" in navigator)) return setLocating("denied");
    setLocating("busy");
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setHere({ lat: p.coords.latitude, lng: p.coords.longitude });
        setLocating("idle");
      },
      () => setLocating("denied"),
      { maximumAge: 600_000, timeout: 10_000 },
    );
  };

  const sorted = <T extends Place>(list: T[]) => {
    const inCity = city ? list.filter((g) => g.city === city) : list;

    return here
      ? [...inCity].sort((a, b) => km(here, a) - km(here, b))
      : inCity;
  };
  const shownOpen = sorted(open);
  const count = (key: string | null) =>
    open.filter((g) => !key || g.city === key).length;
  const distance = (g: Place) => {
    const d = here ? km(here, g) : Infinity;

    return Number.isFinite(d)
      ? c.dirKm(d < 10 ? d.toFixed(1) : d.toFixed(0))
      : null;
  };

  return (
    <div>
      {/* Region bar, Airbnb-style: one row that scrolls, counts beside each. */}
      <div className="sticky top-14 z-20 sm:top-16 -mx-4 border-b border-line bg-ink/90 px-4 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {last ? (
            <Link
              className="flex h-10 shrink-0 items-center gap-2 rounded-full bg-night pl-3 pr-4 text-[14px] font-bold text-day"
              href={last.href}
            >
              <span aria-hidden className="size-2 rounded-full bg-lime" />
              {c.dirLast} · {last.name}
            </Link>
          ) : null}
          <button
            aria-pressed={Boolean(here)}
            className={clsx(
              "flex h-10 shrink-0 items-center gap-1.5 rounded-full border px-4 text-[14px] font-bold transition-colors",
              here
                ? "border-night bg-night text-day"
                : "border-line bg-ink-2 hover:border-cream/40",
            )}
            type="button"
            onClick={locate}
          >
            <PinGlyph />
            {locating === "busy"
              ? c.dirLocating
              : locating === "denied"
                ? c.dirDenied
                : c.dirNear}
          </button>
          <span aria-hidden className="mx-1 h-6 w-px shrink-0 bg-line" />
          {[{ key: null, label: c.dirAll }, ...cities].map((x) => {
            const on = city === x.key;

            return (
              <button
                key={x.key ?? "all"}
                aria-pressed={on}
                className={clsx(
                  "flex h-10 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-[14px] font-bold transition-colors",
                  on ? "bg-cream text-ink" : "text-mute hover:text-cream",
                )}
                type="button"
                onClick={() => setCity(on ? null : x.key)}
              >
                {x.label}
                <span
                  className={clsx(
                    "text-[12px] tabular",
                    on ? "text-ink/70" : "text-mute/70",
                  )}
                >
                  {count(x.key)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* On VARO: the gyms you can open. */}
      <section aria-labelledby="open-gyms" className="pt-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2
              className="flex items-center gap-2.5 font-wide text-[22px] font-black tracking-tight sm:text-[28px]"
              id="open-gyms"
            >
              <span className="relative flex size-2.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-lime opacity-70 motion-reduce:hidden" />
                <span className="relative inline-flex size-2.5 rounded-full bg-lime-deep" />
              </span>
              {c.dirOpenTitle}
            </h2>
            <p className="mt-1 text-[14px] text-mute sm:text-[15px]">
              {c.dirOpenLead}
            </p>
          </div>
        </div>
        {shownOpen.length ? (
          <ul
            className={clsx(
              "mt-6 grid gap-x-5 gap-y-8 sm:grid-cols-2",
              // Two or fewer gyms get bigger cards instead of an empty column.
              shownOpen.length > 2 && "lg:grid-cols-3",
            )}
          >
            {shownOpen.map((g) => (
              <li key={g.id}>
                <OpenCard c={c} distance={distance(g)} g={g} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-6 rounded-2xl border border-dashed border-line px-6 py-10 text-center text-[14px] text-mute">
            {c.dirNone}
          </p>
        )}
      </section>
    </div>
  );
}

/**
 * A partner gym as an IG post: the wall photo pushed dark, mono caps in the
 * corners, VARO × the gym's logo in the middle, a lime tape when routes went
 * up lately. The name and distance sit under it, quiet.
 */
function OpenCard({
  g,
  c,
  distance,
}: {
  g: OpenGym;
  c: Copy;
  distance: string | null;
}) {
  return (
    <Link className="group block" href={g.href}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-[22px] bg-night sm:aspect-[4/3]">
        {g.cover ? (
          // eslint-disable-next-line @next/next/no-img-element -- a wall photo from storage
          <img
            alt=""
            className="absolute inset-0 size-full scale-[1.02] object-cover brightness-[0.42] saturate-[0.75] transition-[transform,filter] duration-700 group-hover:scale-[1.07] group-hover:brightness-[0.5] motion-reduce:transition-none"
            src={g.cover}
          />
        ) : (
          <span className="bolt-grid absolute inset-0 opacity-20" />
        )}
        <span className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_45%,transparent_30%,rgb(14_14_12/0.75))]" />

        {/* Corners: mono caps, as on the posts. */}
        <span
          className={clsx(
            mono.className,
            "absolute inset-x-4 top-4 flex items-start justify-between gap-3 text-[11px] font-bold uppercase leading-[1.7] tracking-[0.18em] text-white/85 sm:inset-x-5 sm:top-5",
          )}
        >
          <span className="inline-flex items-center gap-1.5 text-lime">
            <Seal />
            {c.dirExclusive}
          </span>
          <span className="text-right">
            Bouldering gym
            <br />
            {g.tagline}
          </span>
        </span>

        {/* The lockup: VARO × the gym. */}
        <span className="absolute inset-x-5 top-1/2 flex -translate-y-1/2 flex-col items-center gap-5">
          <span className="flex items-center justify-center gap-3 sm:gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element -- the VARO wordmark, a static PNG */}
            <img
              alt="VARO"
              className="h-6 w-auto sm:h-7"
              src="/brand/varo-wordmark-white.png"
            />
            <span
              aria-hidden
              className="text-[22px] font-light leading-none text-white/80"
            >
              ×
            </span>
            {g.logo ? (
              // eslint-disable-next-line @next/next/no-img-element -- the gym's logo, a static PNG
              <img
                alt={g.logo.name}
                className={clsx(
                  "w-auto",
                  g.logo.width / g.logo.height > 2
                    ? "h-9 sm:h-11"
                    : "h-12 sm:h-14",
                )}
                height={g.logo.height}
                src={g.logo.src}
                width={g.logo.width}
              />
            ) : (
              <span className="max-w-[9rem] font-wide text-[18px] font-black leading-tight text-white">
                {g.name}
              </span>
            )}
          </span>
          {g.fresh ? (
            <span
              className={clsx(
                marker.className,
                "-rotate-3 bg-lime px-5 pb-1.5 pt-1 text-[20px] leading-none text-night shadow-[0_6px_12px_rgb(0_0_0/0.3)] sm:text-[22px]",
                "[clip-path:polygon(0_8%,3%_0,6%_10%,9%_2%,12%_6%,88%_3%,91%_9%,94%_0,97%_7%,100%_3%,98%_50%,100%_96%,97%_92%,94%_100%,91%_93%,88%_98%,12%_95%,9%_100%,6%_92%,3%_99%,0_94%,2%_50%)]",
              )}
            >
              New set is live
            </span>
          ) : null}
        </span>

        {/* Bottom: the count, and the way in. */}
        <span
          className={clsx(
            mono.className,
            "absolute inset-x-4 bottom-4 flex items-end justify-between gap-3 text-[11px] font-bold uppercase tracking-[0.18em] text-white/85 sm:inset-x-5 sm:bottom-5",
          )}
        >
          <span className="tabular">
            {g.routes} routes
            {g.withBeta ? ` · ${g.withBeta} beta` : ""}
          </span>
          <span className="inline-flex items-center gap-1.5 text-white transition-transform group-hover:translate-x-1">
            {c.dirEnter} →
          </span>
        </span>
      </div>
      <div className="mt-3 flex items-start justify-between gap-3 px-0.5">
        <div className="min-w-0">
          <p className="truncate text-[17px] font-extrabold">{g.name}</p>
          <p className="truncate text-[14px] text-mute">{g.place}</p>
        </div>
        <div className="shrink-0 text-right text-[13px] font-semibold text-mute tabular">
          {g.fresh ? (
            <p className="text-lime-ink">{c.dirFresh(g.fresh)}</p>
          ) : null}
          {distance ? <p>{distance}</p> : null}
        </div>
      </div>
    </Link>
  );
}

function Seal() {
  return (
    <svg aria-hidden className="size-3.5" fill="none" viewBox="0 0 16 16">
      <path
        d="M8 1.5 9.8 3l2.3-.2.6 2.2 2 1.2-.9 2.1.9 2.1-2 1.2-.6 2.2-2.3-.2L8 14.5 6.2 13l-2.3.2-.6-2.2-2-1.2.9-2.1-.9-2.1 2-1.2.6-2.2L6.2 3 8 1.5Z"
        fill="currentColor"
      />
      <path
        d="m5.5 8 1.7 1.7L10.6 6"
        stroke="#c6ff00"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function PinGlyph() {
  return (
    <svg aria-hidden className="size-4" fill="none" viewBox="0 0 16 16">
      <path
        d="M8 14s4.5-4.2 4.5-7.5a4.5 4.5 0 0 0-9 0C3.5 9.8 8 14 8 14Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="8" cy="6.5" fill="currentColor" r="1.5" />
    </svg>
  );
}
