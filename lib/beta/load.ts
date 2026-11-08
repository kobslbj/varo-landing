import type { WallPhoto } from "@/components/beta/wall-crop";

import { notFound } from "next/navigation";

import { betaCopy } from "./copy";
import {
  activeRoutes,
  betaClips,
  betaGymFor,
  zones as loadZones,
  type BetaClip,
  type BetaRoute,
  type BetaZone,
} from "./data";

import { cityBySlug, gymPath, gymsIn } from "@/lib/gyms/cities";
import { localizeGym } from "@/lib/gyms/localize";
import { getI18n, siteLocale } from "@/lib/i18n";

export type GymParams = Promise<{ city: string; gym: string }>;

/** The directory gym in the URL, or a 404. */
export async function directoryGym(params: GymParams) {
  const { city: slug, gym: id } = await params;
  const city = cityBySlug(slug);
  const raw = city && gymsIn(city.name).find((g) => g.id === id);

  if (!raw) notFound();
  const i18n = await getI18n();
  const zh = siteLocale(i18n.locale) === "zh-TW";

  return {
    ...i18n,
    raw,
    gym: localizeGym(raw, i18n.locale),
    zh,
    c: betaCopy[zh ? "zh-TW" : "en"],
    gymPath: gymPath(raw),
    betaPath: `${gymPath(raw)}/beta`,
  };
}

/**
 * Rank a grade for sorting easiest first: "V2+" sits between V2 and V3, and
 * a gym's own labels fall back to text order after the V scale.
 */
export function gradeRank(label: string | null) {
  if (!label) return 1e6;
  const m = /^V(\d+)(\+)?/i.exec(label.trim());

  if (m) return Number(m[1]) * 2 + (m[2] ? 1 : 0);
  const n = /(\d+(?:\.\d+)?)/.exec(label);

  return n ? 1000 + Number(n[1]) : 1e5;
}

export function zonePhoto(z: BetaZone | undefined): WallPhoto | null {
  return z?.photoUrl && z.photoWidth && z.photoHeight
    ? { url: z.photoUrl, width: z.photoWidth, height: z.photoHeight }
    : null;
}

export function pinOf(r: BetaRoute) {
  return r.pinX != null && r.pinY != null ? { x: r.pinX, y: r.pinY } : null;
}

/** Everything the gym's beta page shows; 404 when the gym has no route data. */
export async function gymBeta(params: GymParams) {
  const base = await directoryGym(params);
  const app = await betaGymFor(base.raw);

  if (!app) notFound();
  const [routes, walls, clips] = await Promise.all([
    activeRoutes(app.id),
    loadZones(app.id),
    betaClips({ gymId: app.id }),
  ]);
  const active = new Set(routes.map((r) => r.id));
  const live = clips.filter((c) => active.has(c.routeId));
  const perRoute = new Map<string, number>();

  for (const c of live)
    perRoute.set(c.routeId, (perRoute.get(c.routeId) ?? 0) + 1);

  return { ...base, app, routes, walls, clips: live, perRoute };
}

/** Newest first, for the strip. */
export function newest(clips: BetaClip[], n: number) {
  return [...clips]
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
    .slice(0, n);
}
