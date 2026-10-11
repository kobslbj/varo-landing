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
