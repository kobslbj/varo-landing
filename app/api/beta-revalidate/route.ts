import { revalidatePath } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

import { allGyms, countryOf, gymPath } from "@/lib/gyms/cities";
import { locales } from "@/lib/i18n/config";

const HUB = /^\/gyms\/[a-z0-9-]+\/[a-z0-9-]+\/beta$/;
const UUID = /^[0-9a-f-]{36}$/i;

/**
 * Rebuild a route's beta pages now instead of when their 5-minute cache runs
 * out: after a web upload (`{ path, routeId }`), and from the app when a clip
 * is shared or taken back (`{ routeId }`) or a shared clip finishes uploading
 * (`{ mediaId }`, one of the caller's own clips). Signed-in VARO users only,
 * so nobody can loop it to make every visit rebuild and hit Supabase.
 */
export async function POST(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace(/^Bearer /, "");

  if (!token || !(await signedIn(token))) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const body = (await request.json().catch(() => null)) as {
    path?: string;
    routeId?: string;
    mediaId?: string;
  } | null;
  let routeId = body?.routeId ?? "";
  let path = body?.path ?? "";

  if (!path && !routeId && UUID.test(body?.mediaId ?? "")) {
    routeId = (await routeOfMyClip(token, body!.mediaId!)) ?? "";
  }
  if (!UUID.test(routeId)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  if (!path) path = (await hubOfRoute(routeId)) ?? "";
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

function supabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;

  return url && key ? { url, key } : null;
}

/** The bearer token is a live Supabase session. */
async function signedIn(token: string) {
  const s = supabase();

  if (!s) return false;
  try {
    const res = await fetch(`${s.url}/auth/v1/user`, {
      headers: { apikey: s.key, Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    return res.ok;
  } catch {
    return false;
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
