import type { HomeCopy } from "@/lib/home-copy";

import clsx from "clsx";
import Image from "next/image";

import { holdColors, type HoldColor } from "@/components/landing/ui";

/** The album tiles: real climbing photos, each framed a little differently. */
const TILES: {
  src: string;
  pos: string;
  grade: string;
  hold: HoldColor;
  date: string;
}[] = [
  {
    src: "/shots/climb-3.jpg",
    pos: "50% 30%",
    grade: "V5",
    hold: "purple",
    date: "11.02",
  },
  {
    src: "/shots/climb-1.jpg",
    pos: "40% 50%",
    grade: "V3",
    hold: "green",
    date: "10.28",
  },
  {
    src: "/shots/climb-5.jpg",
    pos: "60% 40%",
    grade: "V4",
    hold: "orange",
    date: "10.21",
  },
  {
    src: "/shots/partners-wall.jpg",
    pos: "30% 50%",
    grade: "V2",
    hold: "yellow",
    date: "10.17",
  },
  {
    src: "/shots/climb-1.jpg",
    pos: "80% 20%",
    grade: "V4",
    hold: "blue",
    date: "10.09",
  },
  {
    src: "/shots/climb-3.jpg",
    pos: "20% 70%",
    grade: "V3",
    hold: "red",
    date: "10.03",
  },
  {
    src: "/shots/climb-5.jpg",
    pos: "20% 60%",
    grade: "V2",
    hold: "green",
    date: "09.27",
  },
  {
    src: "/shots/partners-wall.jpg",
    pos: "70% 40%",
    grade: "V3",
    hold: "purple",
    date: "09.20",
  },
  {
    src: "/shots/climb-1.jpg",
    pos: "10% 80%",
    grade: "V1",
    hold: "blue",
    date: "09.14",
  },
];

/**
 * The app's 回憶 tab, drawn for the page: an album of climbing videos by
 * date and the year's climbing calendar. Illustrative, at the 268px design
 * width that `Phone3D` scales.
 */
export function MemoriesScreen({ h }: { h: HomeCopy }) {
  // A believable year: denser lately, two or three days a week.
  const days = Array.from({ length: 7 * 26 }, (_, i) => {
    const week = Math.floor(i / 7);
    const dow = i % 7;

    return (week * 7 + dow * 3) % 5 === 0 || (week > 16 && dow % 3 === 1);
  });

  return (
    <div
      aria-hidden
      className="h-full overflow-hidden bg-black px-3 pt-[46px] text-white"
    >
      <div className="flex items-center justify-between">
        <span className="text-[17px] font-extrabold">{h.memEyebrow}</span>
        <span className="flex rounded-full bg-[#1c1c1f] p-[2px] text-[9px] font-bold">
          <span className="rounded-full bg-white px-2 py-[3px] text-black">
            {h.memAlbum}
          </span>
          <span className="px-2 py-[3px] text-[#a1a1a8]">{h.memCalendar}</span>
        </span>
      </div>

      <ul className="mt-3 grid grid-cols-3 gap-[3px] overflow-hidden rounded-[10px]">
        {TILES.map((t, i) => (
          <li
            key={i}
            className="relative aspect-[3/4] overflow-hidden bg-[#161618]"
          >
            <Image
              fill
              alt=""
              className="object-cover"
              sizes="90px"
              src={t.src}
              style={{ objectPosition: t.pos }}
            />
            <span className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <span
              className="absolute left-1 top-1 rounded-full px-1.5 py-px font-display text-[8px] font-bold leading-[1.4]"
              style={{
                backgroundColor: holdColors[t.hold],
                color: t.hold === "yellow" ? "#111" : "#fff",
              }}
            >
              {t.grade}
            </span>
            <span className="absolute bottom-1 left-1 text-[8px] font-semibold tabular">
              {t.date}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-3 rounded-[12px] bg-[#161618] p-3">
        <p className="text-[12px] font-extrabold">{h.memYear}</p>
        <p className="text-[9px] text-[#a1a1a8]">{h.memDays}</p>
        <div className="mt-2 grid grid-flow-col grid-rows-7 gap-[2px]">
          {days.map((on, i) => (
            <span
              key={i}
              className={clsx(
                "size-[6px] rounded-[1.5px]",
                on ? "bg-lime" : "bg-[#26262a]",
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
