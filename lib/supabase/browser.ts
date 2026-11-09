"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * The signed-in browser client for web beta upload. Same Supabase project and
 * accounts as the app; the session lives in cookies so the OAuth callback
 * (a route handler) can finish sign-in. Only the publishable key is here.
 */
let client: ReturnType<typeof createBrowserClient> | null = null;

export function supabaseBrowser() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) throw new Error("Supabase is not configured");
  client ??= createBrowserClient(url, key);

  return client;
}
