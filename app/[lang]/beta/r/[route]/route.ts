import { NextResponse, type NextRequest } from "next/server";

import { allGyms, gymPath } from "@/lib/gyms/cities";
import { hasLocale, localizePath } from "@/lib/i18n/config";

/**
 * getvaro.app/beta/r/<route id>: a short, stable link to a route's beta
 * page, for places that know the route but not the gym directory (the app's
 * share button, the "my beta" list). Resolves the gym and redirects.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ lang: string; route: string }> },
) {
  const { lang, route } = await params;
  const locale = hasLocale(lang) ? lang : "zh-TW";
  const fallback = new URL(
    localizePath(locale, "/gyms"),
    request.nextUrl.origin,
  );
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key || !/^[0-9a-f-]{36}$/i.test(route)) {
    return NextResponse.redirect(fallback);
  }
  try {
    const res = await fetch(
      `${url}/rest/v1/routes?select=id,gyms(external_id)&id=eq.${route}&limit=1`,
      {
        headers: {
          apikey: key,
          ...(key.startsWith("eyJ") ? { Authorization: `Bearer ${key}` } : {}),
        },
        next: { revalidate: 3600 },
      },
    );
    const rows = (await res.json()) as {
      id: string;
      gyms: { external_id: string | null } | null;
    }[];
    const ext = rows[0]?.gyms?.external_id;
    const [country, slug] = ext?.split(":") ?? [];
    const gym = allGyms.find(
      (g) => g.id === slug && (g.country ?? "TW").toLowerCase() === country,
    );

    if (!gym) return NextResponse.redirect(fallback);

    return NextResponse.redirect(
      new URL(
        localizePath(locale, `${gymPath(gym)}/beta/${route}`),
        request.nextUrl.origin,
      ),
      308,
    );
  } catch {
    return NextResponse.redirect(fallback);
  }
}
