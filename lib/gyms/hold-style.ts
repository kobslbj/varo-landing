import type { GymKind } from "./types";

import { holdColors } from "@/components/landing/ui";

// Shared by the interactive map (a client component) and server-rendered map thumbnails.

/** Hold colour per kind; the legend and the list use the same ones. */
export const KIND_COLORS: Record<GymKind, string> = {
  boulder: "#C6FF00",
  mixed: holdColors.blue,
  rope: holdColors.purple,
  kids: holdColors.yellow,
  outdoor: holdColors.green,
};

/** Three lopsided hold outlines around (0, 0), radius about 1. */
export const BLOBS = [
  "M-1,-.2C-.9,-.9 .2,-1 .8,-.6C1.2,-.2 1,.7 .4,.85C-.3,1 -1.1,.6 -1,-.2Z",
  "M-.9,-.5C-.5,-1 .6,-.95 .95,-.35C1.15,.15 .7,.9 0,.9C-.8,.95 -1.2,.1 -.9,-.5Z",
  "M-.8,-.7C-.2,-1.05 .9,-.8 1,-.1C1.05,.6 .3,1 -.3,.85C-.95,.7 -1.15,-.3 -.8,-.7Z",
];

/** Stable per-gym shape and tilt, so the map doesn't reshuffle between renders. */
export function holdStyle(id: string) {
  let h = 0;

  for (const c of id) h = (h * 31 + c.charCodeAt(0)) >>> 0;

  return { blob: BLOBS[h % BLOBS.length], rot: (h % 70) - 35 };
}
