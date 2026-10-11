import Image from "next/image";

import { StatusBar } from "./phone-3d";
import { flashes, session, sends, type SessionClimb } from "./data";
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
      {flash ? <span className="text-lime">⚡</span> : null}
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
