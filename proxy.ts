import { NextResponse, type NextRequest } from "next/server";

import { defaultLocale, locales } from "@/lib/i18n/config";

/**
 * Every route lives under `app/[lang]`. The default locale keeps the
 * unprefixed URLs (`/privacy`) via a rewrite; `/zh-TW/...` redirects there so
 * each page has one address. Other locales are served at `/{locale}/...`.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const prefix = locales.find(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
  );

  // Metadata images (og:image etc.) are linked at /zh-TW/...; serve them as is.
  if (
    prefix === defaultLocale &&
    !/\/(opengraph|twitter)-image/.test(pathname)
  ) {
    const url = request.nextUrl.clone();

    url.pathname = pathname.slice(prefix.length + 1) || "/";

    return NextResponse.redirect(url);
  }
  if (prefix) return;

  const url = request.nextUrl.clone();

  url.pathname = `/${defaultLocale}${pathname}`;

  return NextResponse.rewrite(url);
}

export const config = {
  // Skip Next internals, metadata images and anything with a file extension.
  matcher: [
    "/((?!_next|api|icon|apple-icon|opengraph-image|twitter-image|.*\\..*).*)",
  ],
};
