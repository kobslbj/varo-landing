/**
 * Illustrative data for the hero's app previews (labelled 介面示意).
 * Totals are derived from the list, never typed twice. Display text
 * (gym name, wall names, duration) comes from the dictionary.
 */
import type { HoldColor } from "./ui";

export type ClimbResult = "send" | "flash" | "attempt";

export interface SessionClimb {
  id: string;
  grade: string;
  hold: HoldColor;
  wall: "slab" | "vertical" | "overhang" | "roof";
  attempts: number;
  result: ClimbResult;
}

export const session = {
  date: "2026.10.11",
  durationMinutes: 72,
  /** Unsplash photos, see `photoCredits`. */
  photos: ["/shots/climb-3.jpg", "/shots/climb-5.jpg", "/shots/climb-1.jpg"],
  climbs: [
    {
      id: "a",
      grade: "V5",
      hold: "red",
      wall: "overhang",
      attempts: 6,
      result: "send",
    },
    {
      id: "b",
      grade: "V3",
      hold: "blue",
      wall: "vertical",
      attempts: 1,
      result: "flash",
    },
    {
      id: "c",
      grade: "V4",
      hold: "yellow",
      wall: "roof",
      attempts: 4,
      result: "send",
    },
    {
      id: "d",
      grade: "V6",
      hold: "purple",
      wall: "overhang",
      attempts: 5,
      result: "attempt",
    },
    {
      id: "e",
      grade: "V2",
      hold: "green",
      wall: "slab",
      attempts: 2,
      result: "send",
    },
  ] satisfies SessionClimb[],
};

export const sends = session.climbs.filter((c) => c.result !== "attempt");
export const flashes = session.climbs.filter((c) => c.result === "flash");

/**
 * Where the preview photos come from (Unsplash License: free to use,
 * attribution optional). Not shown on the site; kept for the record.
 */
export const photoCredits = [
  {
    name: "Yns Plt",
    href: "https://images.unsplash.com/photo-1564769662533-4f00a87b4056",
  },
  {
    name: "Tofan Teodor",
    href: "https://images.unsplash.com/photo-1689775884353-b01c7a8ad1b2",
  },
  {
    name: "Nathan Cima",
    href: "https://images.unsplash.com/photo-1696105538782-7815474f28e0",
  },
];

/** The progress preview: this week's counts and sessions per week, oldest first. */
export const progress = {
  week: { days: 3, sessions: 3, sends: 19, flashes: 7 },
  weeklySessions: [1, 1, 2, 1, 2, 2, 2, 3, 2, 3, 3, 3],
  /** Which bar each month label sits under (month number, 1-12). */
  monthTicks: [
    { index: 2, month: 8 },
    { index: 7, month: 9 },
    { index: 11, month: 10 },
  ],
  grades: [
    { grade: "V0", flash: 4, send: 0, attempt: 0 },
    { grade: "V1", flash: 8, send: 7, attempt: 0 },
    { grade: "V2", flash: 11, send: 16, attempt: 2 },
    { grade: "V3", flash: 8, send: 29, attempt: 1 },
    { grade: "V4", flash: 1, send: 24, attempt: 6 },
    { grade: "V5", flash: 0, send: 12, attempt: 11 },
    { grade: "V6", flash: 0, send: 1, attempt: 8 },
  ],
};

/** The project preview: one route, worked over several days. Totals come from the timeline. */
export const project = {
  grade: "V6",
  hold: "purple" as HoldColor,
  photo: "/shots/climb-5.jpg",
  daysSoFar: 21,
  timeline: [
    { date: "10.11", attempts: 6 },
    { date: "10.06", attempts: 5 },
    { date: "10.02", attempts: 4 },
    { date: "09.27", attempts: 6 },
    { date: "09.21", attempts: 4 },
  ],
};

export const projectAttempts = project.timeline.reduce(
  (n, day) => n + day.attempts,
  0,
);

/** The share-sticker preview, shown inside an Instagram-style story. */
export const share = {
  grade: "V5",
  hold: "blue" as HoldColor,
  photo: "/shots/climb-1.jpg",
  user: "alex.climbs",
};
