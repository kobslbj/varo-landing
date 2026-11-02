/**
 * Who a VARO friend invite is from: name, photo, home gym, and for a link its
 * 6-character code. Read with the publishable key through the narrow
 * `preview_friend_token` RPC, which returns nothing for an unknown, expired
 * or revoked token. Never cached: a QR code changes every 10 minutes.
 */
export interface Invite {
  name: string;
  avatarUrl: string | null;
  gym: string | null;
  kind: "qr" | "link";
  code: string | null;
}

const TOKEN_RE = /^[0-9a-f]{32}$/;

export const isToken = (value: string) => TOKEN_RE.test(value);

export async function getInvite(token: string): Promise<Invite | null> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key || !isToken(token)) return null;

  try {
    const res = await fetch(`${url}/rest/v1/rpc/preview_friend_token`, {
      method: "POST",
      headers: {
        apikey: key,
        ...(key.startsWith("eyJ") ? { Authorization: `Bearer ${key}` } : {}),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ p_token: token }),
      cache: "no-store",
    });

    if (!res.ok) return null;
    const rows = (await res.json()) as {
      display_name: string;
      avatar_path: string | null;
      gym_name: string | null;
      gym_branch: string | null;
      kind: "qr" | "link";
      code: string | null;
    }[];
    const r = rows[0];

    if (!r) return null;

    return {
      name: r.display_name,
      avatarUrl: r.avatar_path
        ? `${url}/storage/v1/object/public/avatars/${r.avatar_path}`
        : null,
      gym: r.gym_name
        ? [r.gym_name, r.gym_branch].filter(Boolean).join(" ")
        : null,
      kind: r.kind,
      code: r.code,
    };
  } catch {
    return null;
  }
}
