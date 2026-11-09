import { NextResponse, type NextRequest } from "next/server";

import { allGyms, gymPath } from "@/lib/gyms/cities";
import { hasLocale, localizePath } from "@/lib/i18n/config";

/**
 * getvaro.app/beta/g/<gym id>?zone=<wall>: the link on a wall's QR poster,
 * printed from the gym tool (varo-gym), which knows the gym's id but not
 * the directory's city and slug. Opens the gym's beta page on that wall;
 * `from=qr` lets analytics count scans.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ lang: string; gym: string }> },
) {
  const { lang, gym: id } = await params;
  const locale = hasLocale(lang) ? lang : "zh-TW";
  const fallback = new URL(
    localizePath(locale, "/beta"),
    request.nextUrl.origin,
  );
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key || !/^[0-9a-f-]{36}$/i.test(id)) {
    return NextResponse.redirect(fallback);
  }
  try {
    const res = await fetch(
      `${url}/rest/v1/gyms?select=external_id&id=eq.${id}&limit=1`,
      {
        headers: {
          apikey: key,
          ...(key.startsWith("eyJ") ? { Authorization: `Bearer ${key}` } : {}),
        },
        next: { revalidate: 3600 },
      },
    );
    const rows = (await res.json()) as { external_id: string | null }[];
    const [country, slug] = rows[0]?.external_id?.split(":") ?? [];
    const gym = allGyms.find(
      (g) => g.id === slug && (g.country ?? "TW").toLowerCase() === country,
    );

    if (!gym) return NextResponse.redirect(fallback);
    const target = new URL(
      localizePath(locale, `${gymPath(gym)}/beta`),
      request.nextUrl.origin,
    );
    const zone = request.nextUrl.searchParams.get("zone");

    if (zone && zone.length <= 80) target.searchParams.set("zone", zone);
    target.searchParams.set("from", "qr");

    // Not permanent: the gym's directory path could change.
    return NextResponse.redirect(target, 307);
  } catch {
    return NextResponse.redirect(fallback);
  }
}
