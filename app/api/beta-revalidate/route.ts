import { revalidatePath } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

import { locales } from "@/lib/i18n/config";

const HUB = /^\/gyms\/[a-z0-9-]+\/[a-z0-9-]+\/beta$/;
const UUID = /^[0-9a-f-]{36}$/i;

/**
 * After a web upload: rebuild that gym's beta page and the route's page now
 * instead of when their 5-minute cache runs out. Signed-in VARO users only,
 * so nobody can loop it to make every visit rebuild and hit Supabase.
 */
export async function POST(request: NextRequest) {
  if (!(await signedIn(request))) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const body = (await request.json().catch(() => null)) as {
    path?: string;
    routeId?: string;
  } | null;
  const path = body?.path ?? "";

  if (!HUB.test(path) || !UUID.test(body?.routeId ?? "")) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  for (const l of locales) {
    revalidatePath(`/${l}${path}`);
    revalidatePath(`/${l}${path}/${body!.routeId}`);
    revalidatePath(`/${l}${path.replace(/\/beta$/, "")}`);
  }

  return NextResponse.json({ ok: true });
}

/** The bearer token is a live Supabase session. */
async function signedIn(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace(/^Bearer /, "");
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!token || !url || !key) return false;
  try {
    const res = await fetch(`${url}/auth/v1/user`, {
      headers: { apikey: key, Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    return res.ok;
  } catch {
    return false;
  }
}
