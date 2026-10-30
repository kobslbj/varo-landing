import Image from "next/image";
import clsx from "clsx";

import { StatusBar } from "./phone-3d";
import {
  flashes,
  progress,
  project,
  projectAttempts,
  session,
  sends,
  share,
  type SessionClimb,
} from "./data";
import { holdColors } from "./ui";
import { HoldShape, ROUTE } from "./holds";

import { getI18n, type Dictionary } from "@/lib/i18n";

/** The session page: photo on top, quick counts, one card per route. */
export async function SessionScreen() {
  const { t } = await getI18n();
  const s = t.screens;

  return (
    <div aria-hidden className="flex h-full flex-col bg-black text-white">
      <StatusBar />
      <div className="flex items-center justify-between px-4 pb-2">
        <Circle>‹</Circle>
        <Circle>⋯</Circle>
      </div>

      <div className="relative mx-3 aspect-[4/4.4] overflow-hidden rounded-[20px]">
        <Image
          fill
          priority
          alt={t.images.climbPhoto}
          className="object-cover"
          sizes="300px"
          src={session.photos[0]}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
        <span className="absolute left-3 top-3 rounded-full bg-black/55 px-2 py-[3px] text-[9px] font-bold">
          {s.topSend}{" "}
          <span className="font-display text-[11px] text-hold-red">V5</span>
        </span>
        <span className="absolute right-3 top-3 rounded-full bg-black/55 px-2 py-[3px] text-[9px] font-bold tabular">
          1 / 3
        </span>
        <div className="absolute inset-x-3 bottom-3">
          <p className="text-[18px] font-extrabold leading-tight">{s.gym}</p>
          <p className="mt-0.5 text-[10px] font-semibold text-white/75 tabular">
            {session.date} · {s.duration(session.durationMinutes)}
          </p>
        </div>
      </div>

      <div className="mt-3 flex gap-1.5 px-3">
        <Pill label={s.climbs} value={session.climbs.length} />
        <Pill label={s.sends} value={sends.length} />
        <Pill flash label={s.flash} value={flashes.length} />
      </div>

      <p className="mt-3 px-4 text-[11px] font-bold">{s.routes}</p>
      <ul className="mt-1.5 flex flex-col gap-1.5 px-3">
        {session.climbs.slice(0, 4).map((c) => (
          <RouteCard key={c.id} climb={c} t={s} />
        ))}
      </ul>
    </div>
  );
}

/** The finish screen: the splash's little route and the character topping out. */
export async function FinishScreen() {
  const { t } = await getI18n();
  const s = t.screens;

  return (
    <div aria-hidden className="flex h-full flex-col bg-black text-white">
      <StatusBar />
      <div className="relative mx-auto mt-6 h-[210px] w-full">
        {ROUTE.map((h, i) => (
          <HoldShape
            key={i}
            hold={h}
            scale={0.85}
            style={{
              left: `calc(50% + ${h.x * 0.75}px)`,
              top: `${30 + h.y * 0.44}px`,
              opacity: 0.55,
            }}
          />
        ))}
        <Image
          alt={t.images.mascot}
          className="blink absolute left-1/2 top-0 w-[92px] -translate-x-1/2"
          height={512}
          sizes="96px"
          src="/mascot/jug-lime.png"
          width={512}
        />
      </div>
      <p className="text-center text-[19px] font-extrabold">{s.finishTitle}</p>
      <p className="mt-1 text-center text-[11px] text-[#a1a1a8] tabular">
        {s.finishSummary(sends.length, flashes.length)}
      </p>
      <div className="mt-auto flex flex-col gap-2 px-4 pb-6">
        <div className="flex h-10 items-center justify-center rounded-full bg-white text-[13px] font-bold text-black">
          {s.share}
        </div>
        <div className="flex h-10 items-center justify-center rounded-full bg-[#232326] text-[13px] font-bold">
          {s.viewSession}
        </div>
      </div>
    </div>
  );
}

const GRADES = [
  "VB",
  "V0",
  "V1",
  "V2",
  "V3",
  "V4",
  "V5",
  "V6",
  "V7",
  "V8",
  "V9",
  "V10",
  "V11",
  "V12",
];

/** The app has two more hold colours than the site's palette. */
const LOG_HOLDS = {
  ...holdColors,
  pink: "#E93D82",
  black: "#1C1C1F",
} as const;

/** Add a route: grade, hold colour, wall, then one tap on the result. */
export async function LogScreen() {
  const { t } = await getI18n();
  const s = t.screens;

  return (
    <div aria-hidden className="flex h-full flex-col bg-black text-white">
      <StatusBar />
      <div className="relative flex items-center justify-center px-4 pb-1 pt-1">
        <span className="absolute left-4">
          <Circle>✕</Circle>
        </span>
        <p className="text-[12px] font-semibold">{s.addRoute}</p>
      </div>

      <div className="mt-3 flex items-center justify-between px-4">
        <p className="text-[10px] font-bold">{s.grade}</p>
        <span className="rounded-full bg-[#161618] px-2 py-[3px] text-[8px] font-semibold text-[#d4d4d8]">
          {s.gradeScale} ⌄
        </span>
      </div>
      <div className="mt-2 grid grid-cols-5 gap-1.5 px-4">
        {[...GRADES, s.notSure].map((g) => (
          <span
            key={g}
            className={clsx(
              "flex h-[22px] items-center justify-center rounded-[7px] font-bold",
              g === share.grade ? "bg-white text-black" : "bg-[#161618]",
              g === s.notSure ? "text-[8px]" : "text-[10px]",
            )}
          >
            {g}
          </span>
        ))}
      </div>

      <p className="mt-4 px-4 text-[10px] font-bold">{s.holdColor}</p>
      <div className="mt-2 grid grid-cols-8 px-3">
        {(Object.keys(LOG_HOLDS) as (keyof typeof LOG_HOLDS)[]).map((c) => (
          <span key={c} className="flex flex-col items-center gap-1">
            <span
              className={clsx(
                "size-[17px] rounded-full",
                c === share.hold &&
                  "ring-[1.5px] ring-white ring-offset-[1.5px] ring-offset-black",
                c === "black" && "border border-[#3a3a3d]",
              )}
              style={{ backgroundColor: LOG_HOLDS[c] }}
            />
            <span
              className={clsx(
                "text-[7px]",
                c === share.hold ? "font-bold text-white" : "text-[#8a8a90]",
              )}
            >
              {s.holdNames[c]}
            </span>
          </span>
        ))}
      </div>

      <p className="mt-4 px-4 text-[10px] font-bold">{s.wall}</p>
      <div className="mt-2 grid grid-cols-4 gap-1.5 px-4">
        {(["slab", "vertical", "overhang", "roof"] as const).map((w, i) => (
          <span
            key={w}
            className={clsx(
              "flex h-[22px] items-center justify-center rounded-[7px] text-[9px] font-bold",
              i === 0 ? "bg-white text-black" : "bg-[#161618]",
            )}
          >
            {s.walls[w]}
          </span>
        ))}
      </div>

      <div className="mx-4 mt-4 grid size-[34px] place-items-center rounded-[9px] bg-[#161618] text-[13px] text-[#a1a1a8]">
        ⊕
      </div>

      <div className="mt-auto px-4 pb-6">
        <p className="text-center text-[8px] text-[#8a8a90]">{s.tapHint}</p>
        <div className="mt-2 grid grid-cols-3 gap-1.5">
          <span className="flex h-[30px] items-center justify-center rounded-[10px] bg-[#232326] text-[10px] font-bold">
            {s.attempting}
          </span>
          <span className="flex h-[30px] items-center justify-center rounded-[10px] bg-cream text-[10px] font-bold text-black">
            ✓ {s.sent}
          </span>
          <span className="flex h-[30px] items-center justify-center rounded-[10px] bg-lime text-[10px] font-bold text-black">
            ⚡ {s.flash}
          </span>
        </div>
      </div>
    </div>
  );
}

/** Me → Progress: this week's counts, sessions per week, grade spread. */
export async function ProgressScreen() {
  const { t } = await getI18n();
  const s = t.screens;
  const { week, weeklySessions, monthTicks, grades } = progress;
  const tallest = Math.max(...weeklySessions);
  const widest = Math.max(...grades.map((g) => g.flash + g.send + g.attempt));

  return (
    <div aria-hidden className="flex h-full flex-col bg-black text-white">
      <StatusBar />
      <p className="pt-1 text-center text-[12px] font-bold">{s.me}</p>
      <div className="mt-2 grid grid-cols-4 border-b border-[#1f1f22]">
        {s.tabs.map((tab, i) => (
          <span
            key={tab}
            className={clsx(
              "pb-1.5 text-center text-[8px] font-semibold",
              i === 1 ? "border-b-2 border-white text-white" : "text-[#8a8a90]",
            )}
          >
            {tab}
          </span>
        ))}
      </div>

      <div className="mx-3 mt-2 rounded-[14px] bg-[#161618] p-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-bold">{s.thisWeek}</p>
            <p className="text-[8px] text-[#8a8a90]">
              {s.daysClimbing(week.days)}
            </p>
          </div>
          <span className="flex rounded-full bg-[#232326] p-[2px] text-[8px] font-bold">
            <span className="rounded-full bg-white px-2 py-[2px] text-black">
              {s.week}
            </span>
            <span className="px-2 py-[2px] text-[#a1a1a8]">{s.month}</span>
          </span>
        </div>
        <div className="mt-2 grid grid-cols-3">
          <Stat label={s.sessions} value={week.sessions} />
          <Stat label={s.sends} value={week.sends} />
          <Stat label={s.flash} value={week.flashes} />
        </div>
        <div className="mt-2 flex h-[54px] items-end gap-[3px]">
          {weeklySessions.map((n, i) => (
            <span
              key={i}
              className={clsx(
                "flex-1 rounded-[3px]",
                i === weeklySessions.length - 1 ? "bg-cream" : "bg-[#2e2e32]",
              )}
              style={{ height: `${(n / tallest) * 100}%` }}
            />
          ))}
        </div>
        <div className="relative mt-1 h-[10px] text-[7px] text-[#8a8a90]">
          {monthTicks.map((m) => (
            <span
              key={m.month}
              className="absolute -translate-x-1/2"
              style={{
                left: `${((m.index + 0.5) / weeklySessions.length) * 100}%`,
              }}
            >
              {s.monthLabel(m.month)}
            </span>
          ))}
        </div>
      </div>

      <div className="mx-3 mt-2 rounded-[14px] bg-[#161618] p-3">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-bold">{s.gradeSpread}</p>
          <p className="text-[8px] text-[#8a8a90]">{s.allTime}</p>
        </div>
        <ul className="mt-2 flex flex-col gap-[7px]">
          {grades.map((g) => (
            <li key={g.grade} className="flex items-center gap-2">
              <span className="w-5 text-[9px] font-bold">{g.grade}</span>
              <span className="flex h-[6px] flex-1 overflow-hidden rounded-full bg-[#232326]">
                <span
                  className="bg-lime"
                  style={{ width: `${(g.flash / widest) * 100}%` }}
                />
                <span
                  className="bg-cream"
                  style={{ width: `${(g.send / widest) * 100}%` }}
                />
                <span
                  className="bg-[#55555b]"
                  style={{ width: `${(g.attempt / widest) * 100}%` }}
                />
              </span>
              <span className="w-4 text-right text-[9px] font-bold tabular">
                {g.flash + g.send + g.attempt}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-2.5 flex gap-3 text-[7px] text-[#a1a1a8]">
          <Legend className="bg-lime" label={s.flash} />
          <Legend className="bg-cream" label={s.sent} />
          <Legend className="bg-[#55555b]" label={s.attempting} />
        </div>
      </div>
    </div>
  );
}

/** One project: photo, totals, the timeline so far and a big "try again". */
export async function ProjectScreen() {
  const { t } = await getI18n();
  const s = t.screens;

  return (
    <div aria-hidden className="flex h-full flex-col bg-black text-white">
      <StatusBar />
      <div className="relative flex items-center justify-between px-4 pb-2">
        <Circle>‹</Circle>
        <p className="text-[12px] font-semibold">{s.project}</p>
        <Circle>⋯</Circle>
      </div>

      <div className="relative mx-3 aspect-[4/3.9] overflow-hidden rounded-[20px]">
        <Image
          fill
          alt={t.images.climbPhoto}
          className="object-cover"
          sizes="300px"
          src={project.photo}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/5 to-transparent" />
        <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-black/55 px-2 py-[3px] text-[8px] font-bold">
          <span className="size-[5px] rounded-full bg-lime" />
          {s.inProgress}
        </span>
        <div className="absolute inset-x-3 bottom-3">
          <p
            className="font-display text-[28px] leading-none"
            style={{ color: holdColors[project.hold] }}
          >
            {project.grade}
          </p>
          <p className="mt-1 text-[14px] font-extrabold leading-tight">
            {s.projectName}
          </p>
          <p className="text-[9px] font-semibold text-white/75">{s.gym}</p>
        </div>
      </div>

      <div className="mx-3 mt-2 grid grid-cols-3 divide-x divide-[#2a2a2d] rounded-[14px] bg-[#161618] py-2.5">
        <Stat center label={s.daysTried} value={project.timeline.length} />
        <Stat center label={s.totalAttempts} value={projectAttempts} />
        <Stat center label={s.daysSoFar} value={project.daysSoFar} />
      </div>

      <div className="mx-3 mt-2 rounded-[14px] bg-[#161618] px-3 pt-2.5">
        <p className="text-[10px] font-bold">{s.timeline}</p>
        <ul className="mt-1.5 flex flex-col gap-1.5 pb-2.5">
          {project.timeline.slice(0, 3).map((day) => (
            <li key={day.date} className="flex items-center gap-2 text-[9px]">
              <span className="size-[9px] rounded-full border border-[#55555b]" />
              <span className="font-semibold tabular">{day.date}</span>
              <span className="rounded-full bg-[#232326] px-1.5 py-[1px] text-[7px] text-[#a1a1a8]">
                {s.attempting}
              </span>
              <span className="ml-auto text-[8px] text-[#8a8a90]">
                {s.attempts(day.attempts)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto px-3 pb-6">
        <div className="flex h-9 items-center justify-center rounded-full bg-white text-[11px] font-bold text-black">
          ↻ {s.tryAgain}
        </div>
      </div>
    </div>
  );
}

/** A story with the send sticker on it, the way friends see it. */
export async function ShareScreen() {
  const { t } = await getI18n();
  const s = t.screens;

  return (
    <div
      aria-hidden
      className="relative h-full overflow-hidden bg-black text-white"
    >
      <Image
        fill
        alt={t.images.climbPhoto}
        className="object-cover"
        sizes="300px"
        src={share.photo}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/70" />

      <div className="absolute inset-x-3 top-[46px]">
        <div className="flex gap-[3px]">
          <span className="h-[2px] flex-1 overflow-hidden rounded-full bg-white/35">
            <span className="block h-full w-1/2 bg-white" />
          </span>
          <span className="h-[2px] flex-1 rounded-full bg-white/35" />
        </div>
        <div className="mt-2 flex items-center gap-1.5">
          <span className="grid size-[20px] place-items-center overflow-hidden rounded-full bg-lime">
            <Image
              alt={t.images.mascot}
              className="w-[16px]"
              height={512}
              sizes="20px"
              src="/mascot/jug-lime.png"
              width={512}
            />
          </span>
          <span className="text-[9px] font-semibold">{share.user}</span>
          <span className="text-[9px] text-white/70">{s.storyAgo}</span>
        </div>
      </div>

      {/* The sticker */}
      <div className="absolute inset-x-0 bottom-[13%] flex -rotate-3 flex-col items-center">
        <Image
          alt="VARO"
          className="h-[11px] w-auto drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
          height={172}
          sizes="80px"
          src="/brand/varo-wordmark-white.png"
          width={1000}
        />
        <p
          className="mt-1 font-display text-[54px] leading-none drop-shadow-[0_3px_8px_rgba(0,0,0,0.45)]"
          style={{ color: holdColors[share.hold] }}
        >
          {share.grade}
        </p>
        <span className="mt-2 -skew-x-12 rounded-[3px] bg-white px-2.5 py-[2px] text-[10px] font-extrabold text-black">
          {s.sent}
        </span>
        <p className="mt-2 text-[8px] font-semibold tracking-[0.08em] text-white/85 drop-shadow tabular">
          {s.gym} · {session.date}
        </p>
      </div>
    </div>
  );
}

function Stat({
  value,
  label,
  center,
}: {
  value: number;
  label: string;
  center?: boolean;
}) {
  return (
    <span className={clsx("flex flex-col", center && "items-center")}>
      <span className="font-display text-[20px] leading-tight tabular">
        {value}
      </span>
      <span className="text-[8px] text-[#a1a1a8]">{label}</span>
    </span>
  );
}

function Legend({ className, label }: { className: string; label: string }) {
  return (
    <span className="flex items-center gap-1">
      <span className={clsx("size-[5px] rounded-full", className)} />
      {label}
    </span>
  );
}

function Circle({ children }: { children: string }) {
  return (
    <span className="grid size-7 place-items-center rounded-full border border-[#2a2a2d] bg-[#161618] text-[13px] leading-none">
      {children}
    </span>
  );
}

function Pill({
  value,
  label,
  flash,
}: {
  value: number;
  label: string;
  flash?: boolean;
}) {
  return (
    <span className="flex h-6 items-center gap-1 rounded-full bg-[#161618] px-2.5 text-[9px]">
      {flash ? <span className="text-lime-ink">⚡</span> : null}
      <span className="text-[11px] font-extrabold tabular">{value}</span>
      <span className="font-semibold text-[#a1a1a8]">{label}</span>
    </span>
  );
}

type ScreenCopy = Dictionary["screens"];

function RouteCard({ climb, t }: { climb: SessionClimb; t: ScreenCopy }) {
  return (
    <li className="flex h-[38px] items-center gap-2.5 rounded-[12px] bg-[#161618] px-3">
      <span
        className="w-8 font-display text-[15px] leading-none"
        style={{ color: holdColors[climb.hold] }}
      >
        {climb.grade}
      </span>
      <span className="flex flex-1 items-center gap-1.5">
        <Result result={climb.result} t={t} />
        <span className="text-[9px] text-[#a1a1a8]">
          {t.walls[climb.wall]} · {t.attempts(climb.attempts)}
        </span>
      </span>
    </li>
  );
}

function Result({
  result,
  t,
}: {
  result: SessionClimb["result"];
  t: ScreenCopy;
}) {
  if (result === "flash") {
    return (
      <span className="-skew-x-12 rounded-[3px] bg-lime px-1.5 py-[1px] font-display text-[8px] tracking-wide text-black">
        ⚡ FLASH
      </span>
    );
  }
  if (result === "send") {
    return (
      <span className="text-[11px] font-bold">
        <span className="text-[#4ade80]">✓</span> {t.sent}
      </span>
    );
  }

  return (
    <span className="text-[11px] font-bold text-[#a1a1a8]">{t.attempting}</span>
  );
}
