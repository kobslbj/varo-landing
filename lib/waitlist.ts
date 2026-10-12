"use server";

import { revalidateTag } from "next/cache";

import { hasLocale } from "@/lib/i18n/config";
import { WAITLIST_COUNT_TAG } from "@/lib/waitlist-count";

export type WaitlistState =
  | {
      status: "idle" | "joined" | "already" | "invalid" | "error";
      /** What was typed, so the field can be refilled after a failed submit. */
      email?: string;
    }
  | undefined;

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/**
 * Adds an email to `public.waitlist` in the varo-production Supabase project.
 * Runs on the server with the secret key; the table has no RLS policies and
 * no anon/authenticated grants, so nothing else can read or write it.
 */
export async function joinWaitlist(
  _prev: WaitlistState,
  form: FormData,
): Promise<WaitlistState> {
  // Honeypot: people never see this field, bots fill it in.
  if (form.get("company")) return { status: "joined" };

  const email = String(form.get("email") ?? "")
    .trim()
    .toLowerCase();
  const locale = String(form.get("locale") ?? "");
  const source = String(form.get("source") ?? "");

  if (!EMAIL.test(email) || email.length > 254) {
    return { status: "invalid", email };
  }
  if (!hasLocale(locale) || !/^[a-z-]{1,32}$/.test(source)) {
    return { status: "error", email };
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;

  if (!url || !key) {
    // Server log, shows up in Vercel function logs.
    // eslint-disable-next-line no-console
    console.error("[waitlist] SUPABASE_URL or SUPABASE_SECRET_KEY is not set");

    return { status: "error", email };
  }

  const res = await fetch(`${url}/rest/v1/waitlist`, {
    method: "POST",
    headers: {
      apikey: key,
      // Legacy service_role keys are JWTs and also go in Authorization;
      // the newer sb_secret_ keys must not.
      ...(key.startsWith("eyJ") ? { Authorization: `Bearer ${key}` } : {}),
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({ email, locale, source }),
    cache: "no-store",
  });

  if (res.ok) {
    revalidateTag(WAITLIST_COUNT_TAG, "max");

    return { status: "joined" };
  }
  // Unique violation: this address is already on the list.
  if (res.status === 409) return { status: "already" };

  // eslint-disable-next-line no-console
  console.error("[waitlist] insert failed", res.status, await res.text());

  return { status: "error", email };
}
