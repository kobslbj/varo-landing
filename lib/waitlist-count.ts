/** Cache tag for the waitlist count; `joinWaitlist` revalidates it. */
export const WAITLIST_COUNT_TAG = "waitlist-count";

/**
 * How many climbers are on the launch waitlist, or null when it can't be
 * read. Cached for five minutes and refreshed after each signup.
 */
export async function getWaitlistCount(): Promise<number | null> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;

  if (!url || !key) return null;

  try {
    const res = await fetch(`${url}/rest/v1/waitlist?select=id&limit=1`, {
      headers: {
        apikey: key,
        ...(key.startsWith("eyJ") ? { Authorization: `Bearer ${key}` } : {}),
        Prefer: "count=exact",
      },
      next: { revalidate: 300, tags: [WAITLIST_COUNT_TAG] },
    });
    // Content-Range: 0-0/42
    const total = Number(res.headers.get("content-range")?.split("/")[1]);

    return res.ok && Number.isFinite(total) ? total : null;
  } catch {
    return null;
  }
}
