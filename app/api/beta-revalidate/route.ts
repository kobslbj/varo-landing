import { revalidatePath } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

import { allGyms, countryOf, gymPath } from "@/lib/gyms/cities";
import { locales } from "@/lib/i18n/config";

const HUB = /^\/gyms\/[a-z0-9-]+\/[a-z0-9-]+\/beta$/;
const UUID = /^[0-9a-f-]{36}$/i;

/**
 * Rebuild a route's beta pages now instead of when their 5-minute cache runs
 * out: after a web upload or a take-back on the website (`{ routeId }`), and
 * from the app when a clip is shared or taken back (`{ routeId }`) or a
 * shared clip finishes uploading (`{ mediaId }`, one of the caller's own
 * clips).
 *
 * Signed-in VARO users only, and anyone can sign up, so two more limits keep
 * one account from making every visit rebuild and hit Supabase: the pages are
 * always the route's own (looked up here; a path sent by the caller is
 * ignored), and each account gets a limited number of rebuilds a minute.
 */
export async function POST(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace(/^Bearer /, "");
  const userId = token ? await signedIn(token) : null;

  if (!token || !userId) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const body = (await request.json().catch(() => null)) as {
    routeId?: string;
    mediaId?: string;
  } | null;
  let routeId = body?.routeId ?? "";

  if (!routeId && UUID.test(body?.mediaId ?? "")) {
    routeId = (await routeOfMyClip(token, body!.mediaId!)) ?? "";
  }
  if (!UUID.test(routeId)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  // Counted only now: the app asks after every clip it uploads, and a clip
  // that isn't beta stopped above without rebuilding anything.
  if (!allow(userId)) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }
  const path = (await hubOfRoute(routeId)) ?? "";

  if (!HUB.test(path)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  for (const l of locales) {
    revalidatePath(`/${l}${path}`);
    revalidatePath(`/${l}${path}/${routeId}`);
    revalidatePath(`/${l}${path.replace(/\/beta$/, "")}`);
  }

  return NextResponse.json({ ok: true });
}

// A visit's shared clips landing one after another is a busy minute for one person.
const PER_MINUTE = 20;
const calls = new Map<string, { n: number; until: number }>();

/**
 * At most PER_MINUTE calls a minute per account. Kept in this server
 * instance's memory, so it is a brake on a loop, not an exact quota: each
 * warm instance counts on its own.
 */
function allow(userId: string) {
  const now = Date.now();

  if (calls.size > 5000) {
    calls.forEach((v, k) => {
      if (v.until <= now) calls.delete(k);
    });
  }
  const c = calls.get(userId);

  if (!c || c.until <= now) {
    calls.set(userId, { n: 1, until: now + 60_000 });

    return true;
  }
  c.n += 1;

  return c.n <= PER_MINUTE;
}

function supabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;

  return url && key ? { url, key } : null;
}

/** The account behind the bearer token, if it is a live Supabase session. */
async function signedIn(token: string) {
  const s = supabase();

  if (!s) return null;
  try {
    const res = await fetch(`${s.url}/auth/v1/user`, {
      headers: { apikey: s.key, Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!res.ok) return null;
    const user = (await res.json()) as { id?: string };

    return typeof user.id === "string" && UUID.test(user.id) ? user.id : null;
  } catch {
    return null;
  }
}

async function get<T>(path: string, token?: string): Promise<T | null> {
  const s = supabase();

  if (!s) return null;
  try {
    const res = await fetch(`${s.url}${path}`, {
      headers: {
        apikey: s.key,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: "no-store",
    });

    return res.ok ? ((await res.json()) as T) : null;
  } catch {
    return null;
  }
}

/**
 * The route of one of the caller's own clips (RLS lets only the owner read
 * it), only if it's shared as beta: the app asks after every upload.
 */
async function routeOfMyClip(token: string, mediaId: string) {
  const rows = await get<
    { visibility: string; climb_logs: { route_id: string | null } | null }[]
  >(
    `/rest/v1/media_assets?select=visibility,climb_logs(route_id)&id=eq.${mediaId}&limit=1`,
    token,
  );
  const row = rows?.[0];

  return row?.visibility === "public"
    ? (row.climb_logs?.route_id ?? null)
    : null;
}

/** "/gyms/taipei/corner-huashan/beta" for a route, via its gym's directory id. */
async function hubOfRoute(routeId: string) {
  const route = await get<{ gym_id: string }[]>(
    `/rest/v1/routes?select=gym_id&id=eq.${routeId}&limit=1`,
  );
  const gymId = route?.[0]?.gym_id;

  if (!gymId || !UUID.test(gymId)) return null;
  const gym = await get<{ external_id: string | null }[]>(
    `/rest/v1/gyms?select=external_id&id=eq.${gymId}&limit=1`,
  );
  const [country, slug] = (gym?.[0]?.external_id ?? "").split(":");
  const directory = allGyms.find(
    (g) => g.id === slug && countryOf(g).toLowerCase() === country,
  );

  return directory ? `${gymPath(directory)}/beta` : null;
}
