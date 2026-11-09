"use client";

import type { FloorPlan } from "@/lib/beta/plans";

import { ListBox, Select, Tag, TagGroup, type Selection } from "@heroui/react";
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
    /** Dropdown placeholders on phones: "全部顏色", "全部難度". */
    anyColor: string;
    anyGrade: string;
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
      const el = r?.querySelector<HTMLElement>('[data-selected="true"]');

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
          <TagGroup
            aria-label={labels.wall}
            selectedKeys={chosenArea ? [chosenArea.name] : []}
            selectionMode="single"
            onSelectionChange={(keys) => {
              const k = first(keys);
              const a = areas.find((x) => x.name === k);

              // A single wall is the area itself; choosing it picks that wall.
              pick(a ? (a.split ? a.name : a.walls[0]) : null);
            }}
          >
            <TagGroup.List ref={row} className={ROW}>
              {areas.map((a) => (
                <Tag
                  key={a.name}
                  className={TILE}
                  id={a.name}
                  textValue={a.name}
                >
                  <TileFace
                    count={count(a.split ? a.name : a.walls[0])}
                    dim={Boolean(chosenArea) && chosenArea?.name !== a.name}
                    name={a.name}
                    on={chosenArea?.name === a.name}
                    parts={a.split ? a.walls.length : 0}
                    photo={
                      a.walls.map(photoOf).find(Boolean) ?? photoOf(a.name)
                    }
                  />
                </Tag>
              ))}
            </TagGroup.List>
          </TagGroup>
          {chosenArea?.split ? (
            <div className="mt-3 rounded-2xl bg-ink-3/60 p-2.5 sm:p-3">
              <p className="mb-2 px-1 text-[12px] font-bold text-mute">
                {labels.part.replace("{area}", chosenArea.name)}
              </p>
              <TagGroup
                aria-label={labels.part.replace("{area}", chosenArea.name)}
                selectedKeys={
                  f.zone && f.zone !== chosenArea.name ? [f.zone] : []
                }
                selectionMode="single"
                onSelectionChange={(keys) =>
                  pick(first(keys) ?? chosenArea.name)
                }
              >
                <TagGroup.List
                  ref={partRow}
                  className="-m-1 flex !flex-nowrap gap-2 overflow-x-auto p-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                  {chosenArea.walls.map((w) => (
                    <Tag key={w} className={PART} id={w} textValue={w}>
                      <PartFace
                        count={count(w)}
                        label={partOf(w)}
                        on={f.zone === w}
                        photo={photoOf(w)}
                      />
                    </Tag>
                  ))}
                </TagGroup.List>
              </TagGroup>
            </div>
          ) : null}
        </Step>

        {/* Phones: colour and grade as two dropdowns side by side, so every
            choice is one tap away instead of hidden off the edge of a row. */}
        <div className="grid grid-cols-2 gap-2.5 sm:hidden">
          <Step label={labels.color} n={2}>
            <Select
              aria-label={labels.color}
              className="w-full"
              placeholder={labels.anyColor}
              value={f.color}
              onChange={(v) =>
                update({
                  ...f,
                  color: pickedKey(v),
                  grade: null,
                })
              }
            >
              <Select.Trigger className={TRIGGER}>
                {f.color ? (
                  <span
                    aria-hidden
                    className={clsx(
                      "size-5 shrink-0 rounded-full",
                      f.color === "white" && "ring-1 ring-inset ring-line",
                    )}
                    style={{ backgroundColor: hold(f.color).fill }}
                  />
                ) : null}
                <Select.Value className="truncate" />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox>
                  <ListBox.Item id={ANY} textValue={labels.anyColor}>
                    <span className="text-[16px] font-bold text-mute">
                      {labels.anyColor}
                    </span>
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                  {colors.map((c) => (
                    <ListBox.Item key={c} id={c} textValue={colorNames[c] ?? c}>
                      <span
                        aria-hidden
                        className={clsx(
                          "size-6 shrink-0 rounded-full",
                          c === "white" && "ring-1 ring-inset ring-line",
                        )}
                        style={{ backgroundColor: hold(c).fill }}
                      />
                      <span className="text-[16px] font-bold">
                        {colorNames[c] ?? c}
                      </span>
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
            </Select>
          </Step>
          <Step label={labels.grade} n={3}>
            <Select
              aria-label={labels.grade}
              className="w-full"
              placeholder={labels.anyGrade}
              value={f.grade}
              onChange={(v) => update({ ...f, grade: pickedKey(v) })}
            >
              <Select.Trigger className={TRIGGER}>
                <Select.Value className="truncate font-display" />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox>
                  <ListBox.Item id={ANY} textValue={labels.anyGrade}>
                    <span className="text-[16px] font-bold text-mute">
                      {labels.anyGrade}
                    </span>
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                  {grades.map((g) => (
                    <ListBox.Item key={g} id={g} textValue={labelOf(g)}>
                      <span className="font-display text-[17px] font-bold tabular">
                        {labelOf(g)}
                      </span>
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
            </Select>
          </Step>
        </div>

        {/* Larger screens: every colour and grade fits, so they stay chips. */}
        <div className="hidden space-y-5 sm:block">
          {/* 2. What colour the holds are. */}
          <Step label={labels.color} n={2}>
            <TagGroup
              aria-label={labels.color}
              selectedKeys={f.color ? [f.color] : []}
              selectionMode="single"
              onSelectionChange={(keys) =>
                update({ ...f, color: first(keys), grade: null })
              }
            >
              <TagGroup.List className={CHIPS}>
                {colors.map((c) => {
                  const on = f.color === c;

                  return (
                    <Tag
                      key={c}
                      className={clsx(CHIP, "gap-2 pl-1.5 pr-4")}
                      id={c}
                      textValue={colorNames[c] ?? c}
                    >
                      <span
                        aria-hidden
                        className={clsx(
                          "relative grid size-8 place-items-center rounded-full",
                          c === "white" && "ring-1 ring-inset ring-line",
                          on &&
                            "ring-2 ring-lime ring-offset-2 ring-offset-night",
                        )}
                        style={{ backgroundColor: hold(c).fill }}
                      >
                        {on ? <CheckGlyph color={hold(c).ink} /> : null}
                      </span>
                      {colorNames[c] ?? c}
                    </Tag>
                  );
                })}
              </TagGroup.List>
            </TagGroup>
          </Step>

          {/* 3. The grade on the tag. */}
          <Step label={labels.grade} n={3}>
            <TagGroup
              aria-label={labels.grade}
              selectedKeys={f.grade ? [f.grade] : []}
              selectionMode="single"
              onSelectionChange={(keys) => update({ ...f, grade: first(keys) })}
            >
              <TagGroup.List className={CHIPS}>
                {grades.map((g) => (
                  <Tag
                    key={g}
                    className={clsx(
                      CHIP,
                      "min-w-14 justify-center px-4 font-display text-[16px] tabular",
                      "data-[selected=true]:!border-night data-[selected=true]:!bg-lime data-[selected=true]:!text-night",
                    )}
                    id={g}
                    textValue={labelOf(g)}
                  >
                    {labelOf(g)}
                  </Tag>
                ))}
              </TagGroup.List>
            </TagGroup>
          </Step>
        </div>

        {/* Phones: the list is below the fold, one tap to it. */}
        {filtering ? (
          <button
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-night text-[15px] font-bold text-day sm:hidden"
            type="button"
            onClick={() =>
              document
                .getElementById("route-results")
                ?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
          >
            {labels.found.replace("{n}", String(shown.length))} ↓
          </button>
        ) : null}
      </div>

      <div
        className="mt-6 flex scroll-mt-20 flex-wrap items-center justify-between gap-3"
        id="route-results"
      >
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

/** The "all" row at the top of a phone dropdown: picking it clears the filter. */
const ANY = "__any";

function pickedKey(v: unknown): string | null {
  return v == null || v === ANY ? null : String(v);
}

/** The one selected key of a single-selection group, or null. */
function first(keys: Selection): string | null {
  if (keys === "all") return null;
  const k = keys.values().next().value;

  return k == null ? null : String(k);
}

/** Tag overrides: HeroUI gives selection, keyboard and a11y; the look is ours. */
const ROW =
  "-mx-4 flex !flex-nowrap snap-x gap-2.5 overflow-x-auto px-4 pb-1 pt-1 [scrollbar-width:none] sm:-mx-6 sm:px-6 [&::-webkit-scrollbar]:hidden";
const TILE =
  "group/tile !block w-[30vw] min-w-[100px] max-w-[132px] shrink-0 snap-start !rounded-[18px] !bg-transparent !p-0 text-left outline-none sm:w-[124px]";
const PART =
  "group/part !block w-[22vw] min-w-[76px] max-w-[96px] shrink-0 !rounded-[14px] !bg-transparent !p-0 outline-none";
const TRIGGER =
  "!flex h-12 w-full items-center gap-2 !rounded-2xl border border-line !bg-ink px-3.5 text-[15px] font-bold !text-cream data-[focus-visible=true]:ring-2 data-[focus-visible=true]:ring-lime";
const CHIPS =
  "-mx-4 flex !flex-nowrap gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:!flex-wrap sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden";
const CHIP =
  "!flex h-11 shrink-0 items-center !rounded-full border border-line !bg-ink text-[14px] font-bold !text-cream outline-none transition-colors hover:border-cream/30 data-[focus-visible=true]:ring-2 data-[focus-visible=true]:ring-lime data-[selected=true]:!border-night data-[selected=true]:!bg-night data-[selected=true]:!text-day";

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

/** An area's tile: its wall photo, how many walls, routes across them. */
function TileFace({
  name,
  photo,
  count,
  parts,
  on,
  dim,
}: {
  name: string;
  photo: WallPhoto | null;
  count: number;
  /** How many walls the area has, when it has several. */
  parts: number;
  on: boolean;
  /** Another area is chosen: step back so the choice stands out. */
  dim: boolean;
}) {
  return (
    <span
      className={clsx(
        "block transition-[opacity,filter] duration-200",
        dim && "opacity-55 saturate-[0.6] group-hover/tile:opacity-90",
      )}
    >
      <span
        className={clsx(
          "relative block aspect-[4/3] overflow-hidden rounded-[16px] bg-ink-3 transition-shadow duration-200",
          on
            ? "shadow-[0_0_0_3px_var(--color-night),0_0_0_6px_var(--color-lime)]"
            : "group-data-[focus-visible=true]/tile:shadow-[0_0_0_3px_var(--color-lime)]",
        )}
      >
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
          <span className="absolute left-1.5 top-1.5 inline-flex items-center gap-1 rounded-full bg-black/60 px-1.5 py-px text-[11px] font-bold text-white tabular">
            <StackGlyph />
            {parts}
          </span>
        ) : null}
        {on ? (
          <span className="absolute right-1.5 top-1.5 grid size-6 place-items-center rounded-full bg-lime shadow">
            <CheckGlyph color="#111111" />
          </span>
        ) : null}
        <span className="absolute bottom-1.5 right-1.5 rounded-full bg-black/60 px-1.5 text-[11px] font-bold text-white tabular">
          {count}
        </span>
      </span>
      <span
        className={clsx(
          "block truncate px-1 pt-2 text-[14px]",
          on ? "font-black text-cream" : "font-bold text-mute",
        )}
      >
        {name}
      </span>
    </span>
  );
}

/** One wall of the chosen area: its photo, its number big, its route count. */
function PartFace({
  label,
  photo,
  count,
  on,
}: {
  label: string;
  photo: WallPhoto | null;
  count: number;
  on: boolean;
}) {
  return (
    <span
      className={clsx(
        "relative block aspect-square overflow-hidden rounded-[12px] bg-ink-3 transition-shadow duration-200",
        on
          ? "shadow-[0_0_0_3px_var(--color-night),0_0_0_5px_var(--color-lime)]"
          : "group-data-[focus-visible=true]/part:shadow-[0_0_0_3px_var(--color-lime)]",
        !count && "opacity-50",
      )}
    >
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
      <span
        className={clsx(
          "absolute inset-0 transition-colors",
          on
            ? "bg-gradient-to-t from-black/70 via-black/10 to-lime/25"
            : "bg-gradient-to-t from-black/65 via-transparent to-transparent",
        )}
      />
      <span className="absolute bottom-1 left-1.5 font-wide text-[24px] font-black leading-none text-white">
        {label}
      </span>
      <span className="absolute bottom-1.5 right-1.5 rounded-full bg-black/60 px-1.5 text-[11px] font-bold text-white tabular">
        {count}
      </span>
    </span>
  );
}

function CheckGlyph({ color }: { color: string }) {
  return (
    <svg aria-hidden className="!size-3.5" fill="none" viewBox="0 0 14 14">
      <path
        d="m3 7.2 2.6 2.6L11 4.4"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
      />
    </svg>
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
