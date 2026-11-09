import type { Gym } from "@/lib/gyms/types";

import {
  activeRoutes,
  betaClips,
  gymsWithRoutes,
  zones,
  type BetaClip,
  type BetaRoute,
} from "./data";

import { allGyms, countryOf, gymPath } from "@/lib/gyms/cities";

/** A gym with route data, as the home page and /beta list it. */
export interface OverviewGym {
  gym: Gym;
  /** Unprefixed; callers localize with `href()`. */
  path: string;
  betaPath: string;
  routes: number;
  withBeta: number;
  clips: number;
  /** Routes set in the last 14 days. */
  fresh: number;
  /** A few routes to show while the gym has no beta yet. */
  sample: BetaRoute[];
  /** A wall photo for the gym's card, if any zone has one. */
  cover: string | null;
}

/** One clip with the route and gym it belongs to, newest first. */
export interface OverviewClip {
  clip: BetaClip;
  route: BetaRoute;
  gym: Gym;
  /** Unprefixed route page path. */
  path: string;
}

const FRESH_DAYS = 14;

/**
 * Every gym whose routes are in VARO, with its beta, for the cross-gym
 * pages. Each fetch is cached for five minutes (see `data.ts`), and there are
 * only a handful of such gyms, so this stays cheap.
 */
export async function betaOverview() {
  const app = await gymsWithRoutes();
  const byExternal = new Map(
    allGyms.map((g) => [`${countryOf(g).toLowerCase()}:${g.id}`, g]),
  );
  const now = Date.now();

  const rows = await Promise.all(
    app.flatMap(({ externalId, id }) => {
      const gym = byExternal.get(externalId);

      return gym
        ? [
            Promise.all([
              activeRoutes(id),
              betaClips({ gymId: id }),
              zones(id),
            ]).then(([routes, clips, walls]) => ({
              gym,
              routes,
              clips,
              cover: walls.find((z) => z.photoUrl)?.photoUrl ?? null,
            })),
          ]
        : [];
    }),
  );

  const gyms: OverviewGym[] = [];
  const clips: OverviewClip[] = [];

  for (const { gym, routes, clips: all, cover } of rows) {
    if (!routes.length) continue;
    const path = gymPath(gym);
    const byId = new Map(routes.map((r) => [r.id, r]));
    const live = all.filter((c) => byId.has(c.routeId));

    gyms.push({
      gym,
      path,
      betaPath: `${path}/beta`,
      routes: routes.length,
      withBeta: new Set(live.map((c) => c.routeId)).size,
      clips: live.length,
      fresh: routes.filter((r) => {
        const set = Date.parse(r.setDate ?? r.createdAt);

        return now - set < FRESH_DAYS * 86400_000;
      }).length,
      sample: [...routes]
        .sort(
          (a, b) =>
            Date.parse(b.setDate ?? b.createdAt) -
            Date.parse(a.setDate ?? a.createdAt),
        )
        .slice(0, 8),
      cover,
    });
    for (const clip of live) {
      clips.push({
        clip,
        route: byId.get(clip.routeId)!,
        gym,
        path: `${path}/beta/${clip.routeId}`,
      });
    }
  }

  gyms.sort((a, b) => b.clips - a.clips || b.routes - a.routes);
  clips.sort(
    (a, b) => Date.parse(b.clip.createdAt) - Date.parse(a.clip.createdAt),
  );

  return {
    gyms,
    clips,
    totals: {
      routes: gyms.reduce((n, g) => n + g.routes, 0),
      withBeta: gyms.reduce((n, g) => n + g.withBeta, 0),
      clips: clips.length,
      climbers: new Set(
        clips.flatMap((c) => (c.clip.owner?.id ? [c.clip.owner.id] : [])),
      ).size,
      helped: clips.reduce((n, c) => n + c.clip.helped, 0),
    },
  };
}
