import type { Gym } from "@/lib/gyms/types";

import { PHASE_PRODUCTION_BUILD } from "next/constants";

/**
 * Beta for the public gym pages, read from VARO's Supabase with the
 * publishable key only. Everything here is already public to the app's
 * signed-out reads: routes, zones and `beta_clips()`. A climber clip's files
 * sit in the private `media` bucket, which lets anyone sign a URL for a clip
 * shared as beta (`private.can_read_media_object`); the gym's own clip is in
 * the public `route-betas` bucket.
 *
 * Pages using this revalidate every 5 minutes (ISR). Signed URLs last 6 hours,
 * well past one cache period.
 */

const REVALIDATE = 300;
// Long enough that a page left unvisited (ISR serves it stale once before
// rebuilding) still plays: these clips are public beta, so a long-lived URL
// gives away nothing extra.
const SIGNED_FOR = 30 * 24 * 60 * 60;

export interface BetaGym {
  id: string;
  name: string;
  branch: string | null;
}

export interface BetaZone {
  name: string;
  photoUrl: string | null;
  photoWidth: number | null;
  photoHeight: number | null;
  position: number;
}

export interface BetaRoute {
  id: string;
  name: string | null;
  wall: string | null;
  holdColor: string | null;
  gradeLabel: string | null;
  gradeSystem: string | null;
  setDate: string | null;
  imageUrl: string | null;
  pinX: number | null;
  pinY: number | null;
  createdAt: string;
}

export interface BetaClip {
  id: string;
  source: "climber" | "gym";
  routeId: string;
  owner: {
    /** For counting distinct climbers on the server; never rendered. */
    id: string | null;
    name: string;
    avatarUrl: string | null;
    heightCm: number | null;
    reachCm: number | null;
  } | null;
  result: "sent" | "attempted" | null;
  flash: boolean;
  occurredAt: string | null;
  videoUrl: string;
  posterUrl: string | null;
  width: number | null;
  height: number | null;
  durationMs: number | null;
  views: number;
  /** Fist bumps, and people who logged a send after watching it. */
  bumps: number;
  helped: number;
  createdAt: string;
}

function env() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;

  return url && key ? { url, key } : null;
}

function headers(key: string) {
  return {
    apikey: key,
    // A legacy anon JWT also goes as the bearer; a publishable key must not.
    ...(key.startsWith("eyJ") ? { Authorization: `Bearer ${key}` } : {}),
    "Content-Type": "application/json",
  };
}

/**
 * Supabase could not answer (network error, HTTP error, unreadable reply).
 * Thrown rather than read as "nothing there": an outage must not turn into
 * 404s, an emptied sitemap or noindexed routes.
 */
export class BetaDataUnavailable extends Error {
  constructor(path: string, cause?: unknown) {
    super(`beta data unavailable: ${path.split("?")[0]}`, { cause });
    this.name = "BetaDataUnavailable";
  }
}

/**
 * Null when Supabase isn't configured, or can't answer during `next build`:
 * the pages prerendered then (home, /beta, the sitemap, gym pages) ship
 * without beta rather than failing the deploy, and fill in on revalidation,
 * where a failure throws and the last good page stays.
 */
async function rest<T>(path: string, init?: RequestInit): Promise<T | null> {
  const e = env();

  if (!e) return null;
  try {
    return await fetchJson<T>(e, path, init);
  } catch (err) {
    if (process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD) return null;
    throw err;
  }
}

async function fetchJson<T>(
  e: { url: string; key: string },
  path: string,
  init?: RequestInit,
): Promise<T> {
  let res: Response;

  try {
    res = await fetch(`${e.url}${path}`, {
      ...init,
      headers: { ...headers(e.key), ...init?.headers },
      next: { revalidate: REVALIDATE },
    });
  } catch (err) {
    throw new BetaDataUnavailable(path, err);
  }
  if (!res.ok) throw new BetaDataUnavailable(path, res.status);
  try {
    return (await res.json()) as T;
  } catch (err) {
    throw new BetaDataUnavailable(path, err);
  }
}

/** The app's gym for a directory gym (`tw:corner-huashan`), if it has route data. */
export async function betaGymFor(gym: Gym): Promise<BetaGym | null> {
  const externalId = `${(gym.country ?? "TW").toLowerCase()}:${gym.id}`;
  const rows = await rest<
    { id: string; name: string; branch: string | null; has_routes: boolean }[]
  >(
    `/rest/v1/gyms?select=id,name,branch,has_routes&external_id=eq.${encodeURIComponent(externalId)}&limit=1`,
  );
  const row = rows?.[0];

  return row?.has_routes
    ? { id: row.id, name: row.name, branch: row.branch }
    : null;
}

/** A gym's routes on the wall now (not retired). */
export async function activeRoutes(gymId: string): Promise<BetaRoute[]> {
  const rows = await rest<
    {
      id: string;
      name: string | null;
      wall: string | null;
      hold_color: string | null;
      grade_label: string | null;
      grade_system: string | null;
      set_date: string | null;
      image_url: string | null;
      pin_x: number | null;
      pin_y: number | null;
      created_at: string;
    }[]
  >(
    `/rest/v1/routes?select=id,name,wall,hold_color,grade_label,grade_system,set_date,image_url,pin_x,pin_y,created_at&gym_id=eq.${gymId}&status=neq.retired&order=created_at.asc`,
  );

  return (rows ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    wall: r.wall,
    holdColor: r.hold_color,
    gradeLabel: r.grade_label,
    gradeSystem: r.grade_system,
    setDate: r.set_date,
    imageUrl: r.image_url,
    pinX: r.pin_x,
    pinY: r.pin_y,
    createdAt: r.created_at,
  }));
}

/** One route by id, retired or not (a retired one still answers, to say so). */
export async function routeById(
  gymId: string,
  routeId: string,
): Promise<(BetaRoute & { retired: boolean }) | null> {
  if (!/^[0-9a-f-]{36}$/i.test(routeId)) return null;
  const rows = await rest<
    {
      id: string;
      name: string | null;
      wall: string | null;
      hold_color: string | null;
      grade_label: string | null;
      grade_system: string | null;
      set_date: string | null;
      image_url: string | null;
      pin_x: number | null;
      pin_y: number | null;
      created_at: string;
      status: string;
    }[]
  >(
    `/rest/v1/routes?select=id,name,wall,hold_color,grade_label,grade_system,set_date,image_url,pin_x,pin_y,created_at,status&gym_id=eq.${gymId}&id=eq.${routeId}&limit=1`,
  );
  const r = rows?.[0];

  return r
    ? {
        id: r.id,
        name: r.name,
        wall: r.wall,
        holdColor: r.hold_color,
        gradeLabel: r.grade_label,
        gradeSystem: r.grade_system,
        setDate: r.set_date,
        imageUrl: r.image_url,
        pinX: r.pin_x,
        pinY: r.pin_y,
        createdAt: r.created_at,
        retired: r.status === "retired",
      }
    : null;
}

/** The gym's zones (walls), in the order the gym set. */
export async function zones(gymId: string): Promise<BetaZone[]> {
  const rows = await rest<
    {
      name: string;
      photo_url: string | null;
      photo_width: number | null;
      photo_height: number | null;
      position: number;
    }[]
  >(
    `/rest/v1/zones?select=name,photo_url,photo_width,photo_height,position&gym_id=eq.${gymId}&order=position.asc`,
  );

  return (rows ?? []).map((z) => ({
    name: z.name,
    photoUrl: z.photo_url,
    photoWidth: z.photo_width,
    photoHeight: z.photo_height,
    position: z.position,
  }));
}

interface ClipRow {
  source: "climber" | "gym";
  media_id: string | null;
  route_id: string;
  owner_id: string | null;
  display_name: string | null;
  avatar_path: string | null;
  public_height_cm: number | null;
  public_reach_cm: number | null;
  result: "sent" | "attempted" | null;
  flash: boolean | null;
  occurred_at: string | null;
  storage_path: string;
  thumbnail_path: string | null;
  width: number | null;
  height: number | null;
  duration_ms: number | null;
  created_at: string;
  views: number | null;
  bumps: number | null;
  helped: number | null;
}

/** Signs climber clip files in one request; a path that fails is left out. */
async function sign(paths: string[]): Promise<Map<string, string>> {
  const e = env();
  const out = new Map<string, string>();

  if (!e || !paths.length) return out;
  const rows = await rest<
    { path: string | null; signedURL: string | null; error: string | null }[]
  >("/storage/v1/object/sign/media", {
    method: "POST",
    body: JSON.stringify({ expiresIn: SIGNED_FOR, paths }),
  });

  for (const r of rows ?? []) {
    if (r.path && r.signedURL)
      out.set(r.path, `${e.url}/storage/v1${r.signedURL}`);
  }

  return out;
}

/**
 * Beta clips for a gym (`gymId`) or one route (`routeId`), gym clips first,
 * then sends, flashes, newest: `beta_clips()`' order. A clip whose video
 * can't be signed is dropped rather than shown broken.
 */
export async function betaClips(
  by: { gymId: string } | { routeId: string },
): Promise<BetaClip[]> {
  const e = env();

  if (!e) return [];
  const rows = await rest<ClipRow[]>("/rest/v1/rpc/beta_clips", {
    method: "POST",
    body: JSON.stringify(
      "gymId" in by
        ? { p_gym_id: by.gymId, p_route_id: null }
        : { p_gym_id: null, p_route_id: by.routeId },
    ),
  });

  if (!rows) return [];
  const climber = rows.filter((r) => r.source === "climber");
  const signed = await sign(
    climber.flatMap((r) =>
      r.thumbnail_path ? [r.storage_path, r.thumbnail_path] : [r.storage_path],
    ),
  );
  const pub = (path: string) =>
    `${e.url}/storage/v1/object/public/route-betas/${path}`;

  return rows.flatMap((r): BetaClip[] => {
    const gym = r.source === "gym";
    const videoUrl = gym ? pub(r.storage_path) : signed.get(r.storage_path);

    if (!videoUrl) return [];

    return [
      {
        id: gym ? `gym-${r.route_id}` : (r.media_id ?? r.storage_path),
        source: r.source,
        routeId: r.route_id,
        owner: gym
          ? null
          : {
              id: r.owner_id,
              name: r.display_name ?? "",
              avatarUrl: r.avatar_path
                ? `${e.url}/storage/v1/object/public/avatars/${r.avatar_path}`
                : null,
              heightCm: r.public_height_cm,
              reachCm: r.public_reach_cm,
            },
        result: r.result,
        flash: Boolean(r.flash),
        occurredAt: r.occurred_at,
        videoUrl,
        posterUrl: r.thumbnail_path
          ? gym
            ? pub(r.thumbnail_path)
            : (signed.get(r.thumbnail_path) ?? null)
          : null,
        width: r.width,
        height: r.height,
        durationMs: r.duration_ms,
        views: r.views ?? 0,
        bumps: r.bumps ?? 0,
        helped: r.helped ?? 0,
        createdAt: r.created_at,
      },
    ];
  });
}

/** Every gym with route data, for the sitemap: directory external id → app gym id. */
export async function gymsWithRoutes(): Promise<
  { externalId: string; id: string }[]
> {
  const rows = await rest<{ id: string; external_id: string | null }[]>(
    "/rest/v1/gyms?select=id,external_id&has_routes=eq.true&external_id=not.is.null",
  );

  return (rows ?? []).flatMap((r) =>
    r.external_id ? [{ externalId: r.external_id, id: r.id }] : [],
  );
}
