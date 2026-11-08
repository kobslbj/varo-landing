import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Where Apple and Google send someone back after signing in on the website
 * (PKCE): trade the code for a session cookie, then return to `next`. Only a
 * path on this site is accepted as `next`, so the link can't be used to
 * bounce people elsewhere.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const raw = searchParams.get("next") ?? "/";
  // Checked after resolving: URL parsing turns "/\evil.example" into another host.
  const resolved = new URL(raw.startsWith("/") ? raw : "/", origin);
  const back =
    resolved.origin === origin
      ? new URL(resolved.pathname + resolved.search, origin)
      : new URL("/", origin);

  if (!code) {
    back.searchParams.set("signin", "failed");

    return NextResponse.redirect(back);
  }

  const store = await cookies();
  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => store.getAll(),
        setAll: (list) => {
          for (const { name, value, options } of list) {
            store.set(name, value, options);
          }
        },
      },
    },
  );
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) back.searchParams.set("signin", "failed");

  return NextResponse.redirect(back);
}
