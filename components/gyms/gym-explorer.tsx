"use client";

import type { Gym, GymKind } from "@/lib/gyms/types";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import clsx from "clsx";

import { holdColors } from "@/components/landing/ui";
import {
  counties,
  MAP_HEIGHT,
  MAP_WIDTH,
  project,
} from "@/lib/gyms/taiwan-map";

/** Hold colour per kind; the legend and the list use the same ones. */
export const KIND_COLORS: Record<GymKind, string> = {
  boulder: "#D4FF5A",
  mixed: holdColors.blue,
  rope: holdColors.purple,
  kids: holdColors.yellow,
  outdoor: holdColors.green,
};

const KIND_ORDER: GymKind[] = ["boulder", "mixed", "rope", "kids", "outdoor"];

/** Three lopsided hold outlines around (0, 0), radius about 1. */
const BLOBS = [
  "M-1,-.2C-.9,-.9 .2,-1 .8,-.6C1.2,-.2 1,.7 .4,.85C-.3,1 -1.1,.6 -1,-.2Z",
  "M-.9,-.5C-.5,-1 .6,-.95 .95,-.35C1.15,.15 .7,.9 0,.9C-.8,.95 -1.2,.1 -.9,-.5Z",
  "M-.8,-.7C-.2,-1.05 .9,-.8 1,-.1C1.05,.6 .3,1 -.3,.85C-.95,.7 -1.15,-.3 -.8,-.7Z",
];

/** Stable per-gym shape and tilt, so the map doesn't reshuffle between renders. */
function holdStyle(id: string) {
  let h = 0;

  for (const c of id) h = (h * 31 + c.charCodeAt(0)) >>> 0;

  return { blob: BLOBS[h % BLOBS.length], rot: (h % 70) - 35 };
}

type ViewBox = [x: number, y: number, w: number, h: number];
const FULL: ViewBox = [0, 0, MAP_WIDTH, MAP_HEIGHT];
/** Hold radius in viewBox units at full zoom; kept the same size on screen when zoomed. */
const HOLD_R = 12;

export interface ExplorerCopy {
  all: string;
  mapLabel: string;
  kinds: Record<GymKind, string>;
  unconfirmed: string;
  unconfirmedHint: string;
  weekday: string;
  weekend: string;
  shoes: string;
  currency: string;
  directions: string;
  website: string;
  call: string;
  more: string;
  hours: string;
  courses: string;
  facilities: string;
  booking: string;
  address: string;
  notes: string;
  showAll: string;
  cities: Record<string, string>;
}

/**
 * The map and the list, which share one selection: pick a county (on the map
 * or in the chips) to zoom in and list only its gyms; hover or tap a hold to
 * find its gym in the list, and the other way round.
 */
export function GymExplorer({
  gyms,
  cityOrder,
  cityHrefs,
  gymHrefs,
  copy,
}: {
  gyms: Gym[];
  /** Cities that have gyms, north to south. With just one, it's that city's page. */
  cityOrder: string[];
  /** Each city's own page, by city name. */
  cityHrefs: Record<string, string>;
  gymHrefs: Record<string, string>;
  copy: ExplorerCopy;
}) {
  const single = cityOrder.length === 1 ? cityOrder[0] : null;
  const router = useRouter();
  const [city, setCity] = useState<string | null>(single);
  const [active, setActive] = useState<string | null>(null);
  const view = useZoom(city);

  const byCity = useMemo(
    () =>
      cityOrder.map((c) => ({
        city: c,
        gyms: gyms.filter((g) => g.city === c),
      })),
    [gyms, cityOrder],
  );
  const shown = city ? byCity.filter((g) => g.city === city) : byCity;
  const activeGym = gyms.find((g) => g.id === active);

  const pickCity = (next: string | null) => {
    // On a city's page the map is fixed to it; other counties lead to their own page.
    if (single) {
      if (next && next !== single) router.push(cityHrefs[next]);

      return;
    }
    setCity((prev) => (prev === next ? null : next));
    setActive(null);
  };

  const pickGym = (gym: Gym) => {
    setCity(gym.city);
    setActive(gym.id);
    // Let the filtered list render, then bring the gym into view.
    requestAnimationFrame(() =>
      document
        .getElementById(`gym-${gym.id}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" }),
    );
  };

  const scale = view[2] / MAP_WIDTH;

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
      {/* Map */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <div className="flex h-[440px] w-full items-center justify-center [container-type:size] sm:h-[560px] lg:h-[calc(100dvh-13rem)] lg:max-h-[760px] lg:min-h-[520px]">
          {/* Exactly the map's proportions, whichever of width or height runs
              out first, so the SVG and the label share coordinates */}
          <div
            className="relative"
            style={{
              width: `min(100cqw, calc(100cqh * ${MAP_WIDTH} / ${MAP_HEIGHT}))`,
              aspectRatio: `${MAP_WIDTH} / ${MAP_HEIGHT}`,
            }}
          >
            <svg
              aria-label={copy.mapLabel}
              className="size-full"
              role="group"
              viewBox={view.join(" ")}
            >
              {counties.map((c) => {
                const has = c.name in cityHrefs;
                const selected = c.name === city;

                return (
                  // Pointer shortcut only: the city chips (or the other-city
                  // links on a city's page) do the same from the keyboard.
                  <path
                    key={c.name}
                    aria-hidden
                    className={clsx(
                      "transition-[fill,stroke] duration-200",
                      has && "cursor-pointer",
                      selected
                        ? "fill-[#2a2e33] stroke-lime"
                        : city
                          ? // Zoomed in, the rest sinks into the page, so the frame's cut edge doesn't show.
                            "fill-ink stroke-[#2c2f33] hover:fill-[#17191b]"
                          : has
                            ? "fill-[#202326] stroke-[#3a3e44] hover:fill-[#262a2e]"
                            : "fill-[#17191b] stroke-[#2c2f33]",
                    )}
                    d={c.d}
                    strokeLinejoin="round"
                    strokeWidth={1.2 * scale}
                    onClick={has ? () => pickCity(c.name) : undefined}
                  />
                );
              })}

              {gyms.map((g) => {
                if (g.lat == null || g.lng == null) return null;
                const [x, y] = project(g.lng, g.lat);
                const { blob, rot } = holdStyle(g.id);
                const on = g.id === active;
                const dim = city && g.city !== city;
                const color = KIND_COLORS[g.kind];

                return (
                  <g
                    key={g.id}
                    aria-label={
                      g.confirmed ? g.name : `${g.name}（${copy.unconfirmed}）`
                    }
                    className="cursor-pointer outline-none"
                    opacity={dim ? 0.25 : 1}
                    role="button"
                    tabIndex={0}
                    transform={`translate(${x} ${y}) scale(${HOLD_R * scale * (on ? 1.6 : 1)}) rotate(${rot})`}
                    onBlur={() => setActive((a) => (a === g.id ? null : a))}
                    onClick={() => pickGym(g)}
                    onFocus={() => setActive(g.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        pickGym(g);
                      }
                    }}
                    onMouseEnter={() => setActive(g.id)}
                    onMouseLeave={() =>
                      setActive((a) => (a === g.id ? null : a))
                    }
                  >
                    {/* Ring on the hovered, focused or picked hold */}
                    {on ? (
                      <circle
                        fill="none"
                        r="1.45"
                        stroke="#F5F3EE"
                        strokeWidth=".16"
                      />
                    ) : null}
                    <path
                      d={blob}
                      fill={g.confirmed ? color : "#101112"}
                      stroke={g.confirmed ? "#101112" : color}
                      strokeWidth={g.confirmed ? 0.18 : 0.3}
                    />
                    {g.confirmed ? (
                      <circle
                        cx=".18"
                        cy="-.12"
                        fill="rgba(0,0,0,.35)"
                        r=".2"
                      />
                    ) : null}
                  </g>
                );
              })}
            </svg>

            {/* Name of the hovered / picked gym, pinned above its hold */}
            {activeGym?.lat != null && activeGym.lng != null ? (
              <MapLabel gym={activeGym} view={view} />
            ) : null}
          </div>
        </div>

        <Legend copy={copy} />
      </div>

      {/* Chips + list */}
      <div className="min-w-0">
        <div
          className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
          hidden={Boolean(single)}
          role="group"
        >
          <Chip
            count={gyms.length}
            on={city === null}
            onClick={() => pickCity(null)}
          >
            {copy.all}
          </Chip>
          {byCity.map((c) => (
            <Chip
              key={c.city}
              count={c.gyms.length}
              on={city === c.city}
              onClick={() => pickCity(c.city)}
            >
              {copy.cities[c.city] ?? c.city}
            </Chip>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-12">
          {shown.map((group) => (
            <section key={group.city} aria-labelledby={`city-${group.city}`}>
              <h2
                className="flex items-baseline gap-3 border-b border-line pb-3 text-[22px] font-bold"
                id={`city-${group.city}`}
              >
                {single ? (
                  (copy.cities[group.city] ?? group.city)
                ) : (
                  <Link
                    className="underline decoration-transparent underline-offset-4 transition-colors hover:text-lime hover:decoration-lime"
                    href={cityHrefs[group.city]}
                  >
                    {copy.cities[group.city] ?? group.city}
                  </Link>
                )}
                <span className="text-[14px] font-medium text-mute tabular">
                  {group.gyms.length}
                </span>
              </h2>
              <ul>
                {group.gyms.map((g) => (
                  <GymRow
                    key={g.id}
                    active={g.id === active}
                    copy={copy}
                    gym={g}
                    href={gymHrefs[g.id]}
                    onHover={setActive}
                  />
                ))}
              </ul>
            </section>
          ))}
        </div>

        {city && !single ? (
          <button
            className="mt-10 text-[15px] font-medium text-mute underline decoration-line underline-offset-4 transition-colors hover:text-lime hover:decoration-lime"
            type="button"
            onClick={() => pickCity(null)}
          >
            {copy.showAll}
          </button>
        ) : null}
      </div>
    </div>
  );
}

/** Tweens the map's viewBox to the picked county, or back to all of Taiwan. */
function useZoom(city: string | null) {
  // A city's page starts zoomed in, with no animation.
  const [start] = useState<ViewBox>(() => (city ? countyBox(city) : FULL));
  const [view, setView] = useState<ViewBox>(start);
  const current = useRef<ViewBox>(start);

  useEffect(() => {
    const target = city ? countyBox(city) : FULL;
    const from = current.current;

    if (from.every((v, i) => v === target[i])) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduce) {
      current.current = target;
      setView(target);

      return;
    }

    const began = performance.now();
    let frame = 0;
    const step = (now: number) => {
      const t = Math.min(1, (now - began) / 520);
      const e = 1 - Math.pow(1 - t, 3);
      const next = from.map((v, i) => v + (target[i] - v) * e) as ViewBox;

      current.current = next;
      setView(next);
      if (t < 1) frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);

    return () => cancelAnimationFrame(frame);
  }, [city]);

  return view;
}

/** A county's bounding box, padded and kept at the map's aspect ratio. */
function countyBox(name: string): ViewBox {
  const d = counties.find((c) => c.name === name)?.d;

  if (!d) return FULL;
  const nums = d.match(/-?\d+(\.\d+)?/g)?.map(Number) ?? [];
  const xs = nums.filter((_, i) => i % 2 === 0);
  const ys = nums.filter((_, i) => i % 2 === 1);
  let [x0, x1, y0, y1] = [
    Math.min(...xs),
    Math.max(...xs),
    Math.min(...ys),
    Math.max(...ys),
  ];
  const pad = 0.12;
  const w0 = (x1 - x0) * (1 + pad * 2);
  const h0 = (y1 - y0) * (1 + pad * 2);
  // Grow the shorter side so the zoomed view keeps the map's shape.
  const ratio = MAP_WIDTH / MAP_HEIGHT;
  const w = Math.max(w0, h0 * ratio);
  const h = w / ratio;
  const cx = (x0 + x1) / 2;
  const cy = (y0 + y1) / 2;

  [x0, y0] = [cx - w / 2, cy - h / 2];
  [x1, y1] = [w, h];

  return [x0, y0, x1, y1];
}

function MapLabel({ gym, view }: { gym: Gym; view: ViewBox }) {
  const [x, y] = project(gym.lng!, gym.lat!);
  const left = ((x - view[0]) / view[2]) * 100;
  const top = ((y - view[1]) / view[3]) * 100;

  if (left < 0 || left > 100 || top < 0 || top > 100) return null;

  return (
    <span
      aria-hidden
      className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[calc(100%+14px)] whitespace-nowrap rounded-md bg-cream px-2.5 py-1 text-[13px] font-bold text-ink shadow-[0_6px_20px_rgba(0,0,0,.5)]"
      style={{ left: `${left}%`, top: `${top}%` }}
    >
      {gym.name}
    </span>
  );
}

function Legend({ copy }: { copy: ExplorerCopy }) {
  return (
    <ul className="mx-auto mt-5 flex max-w-[420px] flex-wrap justify-center gap-x-4 gap-y-2 text-[13px] text-mute">
      {KIND_ORDER.map((k) => (
        <li key={k} className="flex items-center gap-1.5">
          <HoldGlyph color={KIND_COLORS[k]} />
          {copy.kinds[k]}
        </li>
      ))}
      <li className="flex items-center gap-1.5">
        <HoldGlyph hollow color="#a3a29d" />
        {copy.unconfirmedHint}
      </li>
    </ul>
  );
}

export function HoldGlyph({
  color,
  hollow,
  className,
}: {
  color: string;
  hollow?: boolean;
  className?: string;
}) {
  return (
    <svg
      aria-hidden
      className={clsx("size-[14px] shrink-0", className)}
      viewBox="-1.2 -1.2 2.4 2.4"
    >
      <path
        d={BLOBS[0]}
        fill={hollow ? "none" : color}
        stroke={hollow ? color : "none"}
        strokeWidth={0.28}
        transform="rotate(-18)"
      />
      {hollow ? null : (
        <circle cx=".18" cy="-.12" fill="rgba(0,0,0,.35)" r=".2" />
      )}
    </svg>
  );
}

function Chip({
  on,
  count,
  onClick,
  children,
}: {
  on: boolean;
  count: number;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      aria-pressed={on}
      className={clsx(
        "flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-[15px] font-medium transition-colors",
        on
          ? "border-lime bg-lime text-ink"
          : "border-line text-cream hover:border-[#4a4e54]",
      )}
      type="button"
      onClick={onClick}
    >
      {children}
      <span
        className={clsx(
          "text-[13px] tabular",
          on ? "text-ink/60" : "text-mute",
        )}
      >
        {count}
      </span>
    </button>
  );
}

function GymRow({
  gym,
  href,
  active,
  copy,
  onHover,
}: {
  gym: Gym;
  href: string;
  active: boolean;
  copy: ExplorerCopy;
  onHover: (id: string | null) => void;
}) {
  const site = gym.website ?? gym.instagram ?? gym.facebook;
  const p = gym.price;
  const money = (n?: number) => (n == null ? null : `${copy.currency}${n}`);

  return (
    <li
      className={clsx(
        "-mx-3 scroll-mt-28 rounded-xl border-b border-line px-3 py-5 transition-colors last:border-b-0",
        active && "bg-ink-2",
      )}
      id={`gym-${gym.id}`}
      onMouseEnter={() => onHover(gym.id)}
      onMouseLeave={() => onHover(null)}
    >
      <div className="flex gap-3.5">
        <HoldGlyph
          className="mt-[5px] size-[18px]"
          color={KIND_COLORS[gym.kind]}
          hollow={!gym.confirmed}
        />
        <div className="min-w-0 flex-1">
          <h3 className="text-[18px] font-bold leading-snug" lang="zh-Hant">
            <Link
              className="underline decoration-line underline-offset-4 hover:text-lime"
              href={href}
            >
              {gym.name}
            </Link>
          </h3>
          <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[14px] text-mute">
            <span lang="zh-Hant">{gym.district}</span>
            <span style={{ color: KIND_COLORS[gym.kind] }}>
              {copy.kinds[gym.kind]}
            </span>
            {gym.confirmed ? null : (
              <span className="text-[13px] font-semibold text-hold-orange">
                {copy.unconfirmed}
              </span>
            )}
          </p>

          {p ? (
            <>
              <dl className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[14px]">
                {[
                  [copy.weekday, money(p.weekday)],
                  [copy.weekend, money(p.weekend)],
                  [copy.shoes, money(p.shoes)],
                ]
                  .filter(([, v]) => v)
                  .map(([k, v]) => (
                    <div key={k} className="flex gap-1.5">
                      <dt className="text-mute">{k}</dt>
                      <dd className="font-semibold tabular">{v}</dd>
                    </div>
                  ))}
              </dl>
              {/* Hourly, time-slot or intro prices, as the gym words them */}
              {p.notes ? (
                <p className="mt-1 text-[14px] text-cream" lang="zh-Hant">
                  {p.notes}
                </p>
              ) : null}
              {/* Where the price comes from, e.g. 官方分店頁可讀價目 */}
              <p className="mt-1 text-[12px] text-mute" lang="zh-Hant">
                {p.source}
              </p>
            </>
          ) : null}

          <div className="mt-4 flex flex-wrap gap-2">
            {gym.mapsUrl ? (
              <RowLink primary href={gym.mapsUrl}>
                {copy.directions}
              </RowLink>
            ) : null}
            {site ? <RowLink href={site}>{copy.website}</RowLink> : null}
            {gym.phone ? (
              <RowLink href={`tel:${gym.phone.replace(/[^\d+]/g, "")}`}>
                {copy.call}
              </RowLink>
            ) : null}
          </div>

          <details className="group mt-4">
            <summary className="flex w-fit cursor-pointer list-none items-center gap-1.5 text-[14px] font-medium text-mute transition-colors hover:text-cream [&::-webkit-details-marker]:hidden">
              <svg
                aria-hidden
                className="size-3.5 transition-transform group-open:rotate-90"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="m9 6 6 6-6 6" />
              </svg>
              {copy.more}
            </summary>
            <dl className="mt-3 grid gap-x-6 gap-y-3 text-[14px] leading-[1.65] sm:grid-cols-[auto_1fr]">
              {gym.hours ? (
                <Detail label={copy.hours}>
                  {gym.hours.map((line) => (
                    <span key={line} className="block tabular">
                      {line}
                    </span>
                  ))}
                  {gym.hoursNote ? (
                    <span className="mt-1 block text-[13px] text-mute">
                      {gym.hoursNote}
                    </span>
                  ) : null}
                </Detail>
              ) : null}
              {gym.courses ? (
                <Detail label={copy.courses}>{gym.courses}</Detail>
              ) : null}
              {gym.facilities ? (
                <Detail label={copy.facilities}>{gym.facilities}</Detail>
              ) : null}
              {gym.booking ? (
                <Detail label={copy.booking}>{gym.booking}</Detail>
              ) : null}
              {gym.address ? (
                <Detail label={copy.address}>{gym.address}</Detail>
              ) : null}
              {gym.notes ? (
                <Detail label={copy.notes}>
                  <span className="text-hold-orange">{gym.notes}</span>
                </Detail>
              ) : null}
            </dl>
          </details>
        </div>
      </div>
    </li>
  );
}

function Detail({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <dt className="text-mute">{label}</dt>
      <dd className="text-cream/90" lang="zh-Hant">
        {children}
      </dd>
    </>
  );
}

function RowLink({
  href,
  primary,
  children,
}: {
  href: string;
  primary?: boolean;
  children: React.ReactNode;
}) {
  return (
    <a
      className={clsx(
        "inline-flex h-9 items-center rounded-lg px-3.5 text-[14px] font-semibold transition-colors",
        primary
          ? "bg-cream text-ink hover:bg-white"
          : "border border-line text-cream hover:border-[#4a4e54]",
      )}
      href={href}
      {...(href.startsWith("http")
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
    >
      {children}
    </a>
  );
}
