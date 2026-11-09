"use client";

import type { FloorPlan } from "@/lib/beta/plans";

import clsx from "clsx";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import { FloorPlanPicker } from "./floor-plan";
import { GradeChip } from "./grade-chip";
import { WallCrop, type WallPhoto } from "./wall-crop";

import { hold } from "@/lib/beta/holds";

export interface BrowserRoute {
  id: string;
  href: string;
  wall: string | null;
  grade: string | null;
  /** The grade's scale: a gym's own "V5" is not the V-scale V5. */
  system: string | null;
  color: string | null;
  colorName: string;
  /** Rank within the gym's scale, for sorting easiest first. */
  rank: number;
  pin: { x: number; y: number } | null;
  clips: number;
}

export interface BrowserZone {
  name: string;
  photo: WallPhoto | null;
}

/** Sub-walls are named "<area>・<n>" ("Slab・1"), as in varo-gym (`WALL_SEP`). */
const WALL_SEP = "・";

function areaOf(wall: string) {
  const i = wall.indexOf(WALL_SEP);

  return i > 0 ? wall.slice(0, i) : wall;
}

/** "Slab・2" → "2"; a wall without an area keeps its name. */
function partOf(wall: string) {
  const i = wall.indexOf(WALL_SEP);

  return i > 0 ? wall.slice(i + WALL_SEP.length) : wall;
}

type Filter = {
  zone: string | null;
  color: string | null;
  grade: string | null;
};

/**
 * Find the route in front of you: which wall, what colour, what grade (what a
 * climber can see from the mat), then pick it by its photo. Each choice
 * narrows the next. The choices live in the URL (`?zone=&color=&grade=`), so
 * a wall's QR code can open on that wall and a link can be shared.
 */
export function RouteBrowser({
  zones,
  routes,
  colorNames,
  labels,
  plan = null,
}: {
  zones: BrowserZone[];
  routes: BrowserRoute[];
  /** Hold colour → its name ("綠" / "Green"), for the colours in use. */
  colorNames: Record<string, string>;
  labels: {
    onlyBeta: string;
    noBetaYet: string;
    clips: string;
    wall: string;
    color: string;
    grade: string;
    found: string;
    clear: string;
    none: string;
    /** "{area} 的哪一面" */
    part: string;
  };
  /** The gym's floor plan, shown above the walls as another way to pick one. */
  plan?: FloorPlan | null;
}) {
  const [f, setF] = useState<Filter>({ zone: null, color: null, grade: null });
  const [onlyBeta, setOnlyBeta] = useState(false);

  // Read the URL after hydration, so the page itself stays static.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const zone = q.get("zone");

    // A wall can exist only as routes' `wall` (no zone row, no photo): a QR
    // poster for it must still open on it. `zone` can also be an area ("Slab").
    const known =
      zone &&
      (zones.some((z) => z.name === zone || areaOf(z.name) === zone) ||
        routes.some((r) => r.wall === zone || areaOf(r.wall ?? "") === zone));

    setF({
      zone: known ? zone : null,
      color: q.get("color"),
      grade: q.get("grade"),
    });
  }, [zones, routes]);

  // Keep the chosen area and wall in sight in their scrolling rows (a QR code
  // may open on the last wall).
  const row = useRef<HTMLDivElement>(null);
  const partRow = useRef<HTMLDivElement>(null);

  useEffect(() => {
    for (const r of [row.current, partRow.current]) {
      const el = r?.querySelector<HTMLElement>('[aria-pressed="true"]');

      if (el && r) {
        r.scrollTo({
          left: el.offsetLeft - r.clientWidth / 2 + el.clientWidth / 2,
          behavior: "smooth",
        });
      }
    }
  }, [f.zone]);

  const update = (next: Filter) => {
    setF(next);
    const url = new URL(window.location.href);

    for (const k of ["zone", "color", "grade"] as const) {
      const v = next[k];

      if (v) url.searchParams.set(k, v);
      else url.searchParams.delete(k);
    }
    window.history.replaceState(null, "", url);
  };

  // Walls in the gym's order, plus any wall a route names without a zone row.
  const walls = useMemo(() => {
    const names = zones.map((z) => z.name);

    for (const r of routes) {
      if (r.wall && !names.includes(r.wall)) names.push(r.wall);
    }

    return names;
  }, [zones, routes]);
  const photoOf = (wall: string | null) =>
    zones.find((z) => z.name === wall)?.photo ?? null;
  const routesOn = (wall: string) => routes.filter((r) => r.wall === wall);

  // Areas by name, each with its walls. An area's bare zone
  // ("Slab" beside "Slab・1…") is left out unless routes are on it, as
  // varo-gym does.
  const areas = useMemo(() => {
    const by = new Map<string, string[]>();

    for (const w of walls) {
      const a = areaOf(w);

      by.set(a, [...(by.get(a) ?? []), w]);
    }

    // By name, like varo-gym (`localeCompare`, "zh-Hant"), numbers in order.
    const names = Array.from(by.keys()).sort((a, b) =>
      a.localeCompare(b, "zh-Hant", { numeric: true }),
    );

    return names.map((name) => {
      const list = by.get(name)!;
      const parts = list.filter(
        (w) => w !== name || list.length === 1 || routesOn(w).length,
      );

      parts.sort((a, b) =>
        partOf(a).localeCompare(partOf(b), "zh-Hant", { numeric: true }),
      );

      return { name, walls: parts, split: parts.some((w) => w !== name) };
    });
  }, [walls, routes]);
  const areaFor = (zone: string | null) =>
    zone ? (areas.find((a) => a.name === areaOf(zone)) ?? null) : null;
  const chosenArea = areaFor(f.zone);
  // The chosen zone is a whole area ("Slab") or one wall ("Slab・2").
  const onZone = (wall: string | null, zone: string | null) =>
    !zone ||
    wall === zone ||
    (areaFor(zone)?.split === true &&
      areaFor(zone)?.name === zone &&
      wall !== null &&
      areaOf(wall) === zone);

  const inZone = routes.filter(
    (r) => onZone(r.wall, f.zone) && (!onlyBeta || r.clips > 0),
  );
  // Only the colours and grades that exist on the chosen wall.
  const colors = unique(inZone.map((r) => r.color));
  const inColor = inZone.filter((r) => !f.color || r.color === f.color);
  // A grade is its system plus its label; the URL keeps the pair.
  const gradeKey = (r: BrowserRoute) =>
    r.grade ? `${r.system ?? ""}:${r.grade}` : null;
  const grades = unique(
    [...inColor].sort((a, b) => a.rank - b.rank).map(gradeKey),
  );
  const labelOf = (key: string) => key.slice(key.indexOf(":") + 1);
  const shown = inColor
    .filter((r) => !f.grade || gradeKey(r) === f.grade)
    .sort((a, b) => a.rank - b.rank || b.clips - a.clips);
  const filtering = Boolean(f.zone || f.color || f.grade || onlyBeta);
  const count = (zone: string | null) =>
    routes.filter((r) => onZone(r.wall, zone) && (!onlyBeta || r.clips > 0))
      .length;
  const pick = (zone: string | null) =>
    update({ zone, color: null, grade: null });

  return (
    <div>
      <div className="space-y-5 rounded-[24px] border border-line bg-ink-2 p-4 sm:p-6">
        {/* 1. Which wall: by its photo, as you see it from the mat. */}
        <Step label={labels.wall} n={1}>
          {plan ? (
            <div className="mb-3">
              <FloorPlanPicker
                active={f.zone}
                count={count}
                plan={plan}
                routesLabel={labels.found}
                onPick={(w) =>
                  update({
                    zone: f.zone === w ? null : w,
                    color: null,
                    grade: null,
                  })
                }
              />
            </div>
          ) : null}
          {/* First the area (Slab, Cave…), then which of its walls. No "all"
              tile: nothing chosen already lists every route. */}
          <div
            ref={row}
            className="relative -mx-4 flex gap-2.5 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:-mx-6 sm:px-6 [&::-webkit-scrollbar]:hidden"
          >
            {areas.map((a) => {
              const on = chosenArea?.name === a.name;
              // A single wall is the area itself; choosing it picks that wall.
              const zone = a.split ? a.name : a.walls[0];

              return (
                <WallTile
                  key={a.name}
                  active={on}
                  count={count(zone)}
                  name={a.name}
                  parts={a.split ? a.walls.length : 0}
                  photo={a.walls.map(photoOf).find(Boolean) ?? photoOf(a.name)}
                  onClick={() => pick(on ? null : zone)}
                />
              );
            })}
          </div>
          {chosenArea?.split ? (
            <div className="mt-3 rounded-2xl bg-ink-3/60 p-2.5 sm:p-3">
              <p className="mb-2 px-1 text-[12px] font-bold text-mute">
                {labels.part.replace("{area}", chosenArea.name)}
              </p>
              <div
                ref={partRow}
                className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {chosenArea.walls.map((w) => (
                  <PartTile
                    key={w}
                    active={f.zone === w}
                    count={count(w)}
                    label={partOf(w)}
                    name={w}
                    photo={photoOf(w)}
                    onClick={() => pick(f.zone === w ? chosenArea.name : w)}
                  />
                ))}
              </div>
            </div>
          ) : null}
        </Step>

        {/* 2. What colour the holds are. */}
        <Step label={labels.color} n={2}>
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden">
            {colors.map((c) => {
              const active = f.color === c;

              return (
                <button
                  key={c}
                  aria-pressed={active}
                  className={clsx(
                    "flex h-11 shrink-0 items-center gap-2 rounded-full border pl-1.5 pr-3.5 text-[14px] font-bold transition-colors",
                    active
                      ? "border-night bg-night text-day"
                      : "border-line bg-ink text-cream hover:border-cream/30",
                  )}
                  type="button"
                  onClick={() =>
                    update({ ...f, color: active ? null : c, grade: null })
                  }
                >
                  <span
                    aria-hidden
                    className={clsx(
                      "size-8 rounded-full",
                      c === "white" && "ring-1 ring-inset ring-line",
                    )}
                    style={{ backgroundColor: hold(c).fill }}
                  />
                  {colorNames[c] ?? c}
                </button>
              );
            })}
          </div>
        </Step>

        {/* 3. The grade on the tag. */}
        <Step label={labels.grade} n={3}>
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden">
            {grades.map((g) => {
              const active = f.grade === g;

              return (
                <button
                  key={g}
                  aria-pressed={active}
                  className={clsx(
                    "h-11 min-w-14 shrink-0 rounded-full border px-4 font-display text-[16px] font-bold tabular transition-colors",
                    active
                      ? "border-night bg-night text-day"
                      : "border-line bg-ink text-cream hover:border-cream/30",
                  )}
                  type="button"
                  onClick={() => update({ ...f, grade: active ? null : g })}
                >
                  {labelOf(g)}
                </button>
              );
            })}
          </div>
        </Step>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[15px] font-bold tabular">
          {labels.found.replace("{n}", String(shown.length))}
        </p>
        <div className="flex items-center gap-2">
          {filtering ? (
            <button
              className="h-10 rounded-full px-3 text-[14px] font-semibold text-mute hover:text-cream"
              type="button"
              onClick={() => {
                setOnlyBeta(false);
                update({ zone: null, color: null, grade: null });
              }}
            >
              {labels.clear}
            </button>
          ) : null}
          <button
            aria-pressed={onlyBeta}
            className={clsx(
              "flex h-10 items-center gap-2 rounded-full border px-4 text-[14px] font-bold transition-colors",
              onlyBeta
                ? "border-night bg-night text-day"
                : "border-line bg-ink-2 text-cream hover:border-cream/30",
            )}
            type="button"
            onClick={() => setOnlyBeta((v) => !v)}
          >
            <PlayGlyph />
            {labels.onlyBeta}
          </button>
        </div>
      </div>

      {shown.length ? (
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
          {shown.map((r) => (
            <li key={r.id}>
              <RouteCard
                labels={labels}
                photo={photoOf(r.wall)}
                route={r}
                showWall={!f.zone}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 rounded-2xl border border-dashed border-line px-5 py-10 text-center text-mute">
          {labels.none}
        </p>
      )}
    </div>
  );
}

function unique(list: (string | null)[]) {
  return Array.from(new Set(list.filter((x): x is string => Boolean(x))));
}

function Step({
  n,
  label,
  children,
}: {
  n: number;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-2.5 text-[13px] font-bold text-mute tabular">
        {n} · {label}
      </p>
      {children}
    </div>
  );
}

function WallTile({
  name,
  photo,
  count,
  parts = 0,
  active,
  onClick,
}: {
  name: string;
  photo: WallPhoto | null;
  count: number;
  /** How many walls the area has, when it has several. */
  parts?: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      aria-pressed={active}
      className={clsx(
        "w-[104px] shrink-0 overflow-hidden rounded-2xl border-2 p-0.5 text-left transition-colors sm:w-[120px]",
        active ? "border-night" : "border-transparent",
      )}
      type="button"
      onClick={onClick}
    >
      <span className="relative block aspect-[4/3] overflow-hidden rounded-[13px] bg-ink-3">
        {photo ? (
          <WallCrop
            aspect={4 / 3}
            className="absolute inset-0"
            color={null}
            photo={photo}
            pin={null}
          />
        ) : (
          <span className="bolt-grid absolute inset-0" />
        )}
        {parts ? (
          // An area of several walls: a stack, so it reads as "opens more".
          <span className="absolute left-1 top-1 inline-flex items-center gap-1 rounded-full bg-black/60 px-1.5 py-px text-[11px] font-bold text-white tabular">
            <StackGlyph />
            {parts}
          </span>
        ) : null}
        <span className="absolute bottom-1 right-1 rounded-full bg-black/60 px-1.5 text-[11px] font-bold text-white tabular">
          {count}
        </span>
      </span>
      <span
        className={clsx(
          "block truncate px-1 py-1.5 text-[13px] font-bold",
          active ? "text-cream" : "text-mute",
        )}
      >
        {name}
      </span>
    </button>
  );
}

/** One wall of the chosen area: its photo, its number big, its route count. */
function PartTile({
  name,
  label,
  photo,
  count,
  active,
  onClick,
}: {
  name: string;
  label: string;
  photo: WallPhoto | null;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={name}
      aria-pressed={active}
      className={clsx(
        "relative w-[84px] shrink-0 overflow-hidden rounded-xl border-2 transition-colors sm:w-[96px]",
        active ? "border-night" : "border-transparent",
        !count && "opacity-50",
      )}
      type="button"
      onClick={onClick}
    >
      <span className="relative block aspect-square overflow-hidden rounded-[10px] bg-ink-3">
        {photo ? (
          <WallCrop
            aspect={1}
            className="absolute inset-0"
            color={null}
            photo={photo}
            pin={null}
          />
        ) : (
          <span className="bolt-grid absolute inset-0" />
        )}
        <span className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
        <span className="absolute bottom-1 left-1.5 font-wide text-[22px] font-black leading-none text-white">
          {label}
        </span>
        <span className="absolute bottom-1.5 right-1.5 rounded-full bg-black/60 px-1.5 text-[11px] font-bold text-white tabular">
          {count}
        </span>
      </span>
    </button>
  );
}

function StackGlyph() {
  return (
    <svg aria-hidden className="size-3" fill="none" viewBox="0 0 12 12">
      <rect
        height="6"
        rx="1.2"
        stroke="currentColor"
        strokeWidth="1.3"
        width="7"
        x="1"
        y="4.5"
      />
      <path
        d="M3.5 2.5h6a1 1 0 0 1 1 1V8"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.3"
      />
    </svg>
  );
}

function RouteCard({
  route: r,
  photo,
  labels,
  showWall,
}: {
  route: BrowserRoute;
  photo: WallPhoto | null;
  labels: { noBetaYet: string; clips: string };
  showWall: boolean;
}) {
  return (
    <Link
      className="lift group block overflow-hidden rounded-[20px] border border-line bg-ink-2"
      href={r.href}
    >
      <div className="relative">
        <WallCrop color={r.color} photo={photo} pin={r.pin} ring="sm" />
        {r.clips > 0 ? (
          <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-lime px-2 py-0.5 text-[12px] font-extrabold text-night tabular">
            <PlayGlyph />
            {r.clips}
          </span>
        ) : null}
      </div>
      <div className="flex items-center gap-2.5 border-t border-line px-3 py-2.5">
        <GradeChip color={r.color} grade={r.grade} size="sm" />
        <div className="min-w-0">
          <p className="truncate text-[14px] font-bold leading-tight">
            {showWall && r.wall ? `${r.colorName} · ${r.wall}` : r.colorName}
          </p>
          <p
            className={clsx(
              "truncate text-[12px] leading-tight",
              r.clips ? "font-semibold text-lime-ink" : "text-mute",
            )}
          >
            {r.clips
              ? labels.clips.replace("{n}", String(r.clips))
              : labels.noBetaYet}
          </p>
        </div>
      </div>
    </Link>
  );
}

function PlayGlyph() {
  return (
    <svg aria-hidden className="size-3 fill-current" viewBox="0 0 24 24">
      <path d="M7 4.5v15a1 1 0 0 0 1.52.85l12-7.5a1 1 0 0 0 0-1.7l-12-7.5A1 1 0 0 0 7 4.5Z" />
    </svg>
  );
}
