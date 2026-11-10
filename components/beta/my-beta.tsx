"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { GradeChip } from "./grade-chip";

import { supabaseBrowser } from "@/lib/supabase/browser";

const copy = {
  "zh-TW": {
    loading: "載入中…",
    signedOut: "登入後就能看到你分享過的 beta。",
    signIn: "去上傳頁登入",
    empty: "你還沒有分享過 beta。去岩館頁找一條你爬過的路線吧。",
    browse: "看全部岩館",
    views: "觀看",
    bumps: "碰拳",
    helped: "幫人完攀",
    total: (n: number) => `${n} 支 beta`,
    note: "從 beta 拿下：影片還在，只是別人看不到。刪除：整筆紀錄和影片都會刪掉。",
    more: "更多",
    takeBack: "從 beta 拿下",
    takeBackSure: "從這條路線的 beta 拿下？影片還在你的紀錄裡，別人看不到。",
    takeBackSureFriends: "從這條路線的 beta 拿下？好友仍看得到，其他人看不到。",
    del: "刪除",
    delSure: "刪除這支影片和它的紀錄？刪除後無法復原。",
    cancel: "取消",
    working: "處理中…",
    inApp:
      "這支影片在 App 的紀錄裡（還有其他攀爬或影片），請到 VARO App 刪除。",
    failed: "沒有成功，再試一次。",
  },
  en: {
    loading: "Loading…",
    signedOut: "Sign in to see the beta you've shared.",
    signIn: "Sign in on an upload page",
    empty:
      "You haven't shared any beta yet. Find a route you've climbed on a gym page.",
    browse: "Browse gyms",
    views: "Views",
    bumps: "Fist bumps",
    helped: "Helped send",
    total: (n: number) => `${n} beta`,
    note: "Take off beta: the video stays, others can't see it. Delete: the video and its visit are gone.",
    more: "More",
    takeBack: "Take off beta",
    takeBackSure:
      "Take it off this route's beta? It stays in your log; others can't see it.",
    takeBackSureFriends:
      "Take it off this route's beta? Friends can still see it; no one else can.",
    del: "Delete",
    delSure: "Delete this video and its visit? This can't be undone.",
    cancel: "Cancel",
    working: "Working…",
    inApp:
      "This video is in a visit with other climbs or videos in the app. Delete it in the VARO app.",
    failed: "That didn't work. Try again.",
  },
};

interface Row {
  id: string;
  routeId: string;
  /**
   * Taken off beta, friends still see it: it was a friend clip before it was
   * shared and its visit is shared with friends (set_beta_shared decides).
   */
  friendsVisit: boolean;
  grade: string | null;
  color: string | null;
  wall: string | null;
  gym: string;
  poster: string | null;
  createdAt: string;
  views: number;
  bumps: number;
  helped: number;
}

/**
 * The beta I've shared, with what came of each: views, fist bumps, and how
 * many people sent after watching. Only I can see the last two.
 */
export function MyBeta({
  lang,
  gymsHref,
  shortHref,
}: {
  lang: "zh-TW" | "en";
  gymsHref: string;
  /** "/beta/r" (localized): the short link that finds a route's page. */
  shortHref: string;
}) {
  const c = copy[lang];
  const [rows, setRows] = useState<Row[] | null>(null);
  const [signedOut, setSignedOut] = useState(false);
  // One card's actions open at a time: its menu, or a confirm for one of them.
  const [open, setOpen] = useState<{
    id: string;
    step: "menu" | "takeBack" | "delete";
  } | null>(null);
  const [busy, setBusy] = useState(false);
  // The guard itself: `busy` only re-renders the buttons, and a second tap
  // can land before that. Set before the request, cleared when it answers.
  const working = useRef(false);
  const [notice, setNotice] = useState<{ id: string; text: string } | null>(
    null,
  );

  const refresh = (routeId: string) =>
    void supabaseBrowser()
      .auth.getSession()
      .then(
        ({ data }: { data: { session: { access_token: string } | null } }) =>
          fetch("/api/beta-revalidate", {
            method: "POST",
            keepalive: true,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${data.session?.access_token ?? ""}`,
            },
            body: JSON.stringify({ routeId }),
          }),
      )
      .catch(() => undefined);

  const drop = (id: string) => {
    setRows((list) => (list ?? []).filter((x) => x.id !== id));
    setOpen(null);
  };

  /**
   * Off the beta, kept in the log. The server decides where it lands: back
   * with friends only if it was a friend clip, its visit is still shared and
   * there is room (five per visit), else private. A clip already taken back
   * elsewhere stays as it is, so a page left open never re-shares anything.
   */
  const takeBack = async (r: Row) => {
    if (working.current) return;
    working.current = true;
    setBusy(true);
    setNotice(null);
    const { error } = await supabaseBrowser().rpc("set_beta_shared", {
      p_media: r.id,
      p_share: false,
    });

    working.current = false;
    setBusy(false);
    if (error) {
      setNotice({ id: r.id, text: c.failed });

      return;
    }
    refresh(r.routeId);
    drop(r.id);
  };

  /**
   * A web upload's visit, whole (delete_web_beta refuses an app visit). Its
   * files go with cleanup-orphans: once the rows are gone only I can read them.
   */
  const remove = async (r: Row) => {
    if (working.current) return;
    working.current = true;
    setBusy(true);
    setNotice(null);
    const { error } = await supabaseBrowser().rpc("delete_web_beta", {
      p_media_id: r.id,
    });

    working.current = false;
    if (error) {
      setBusy(false);
      setNotice({
        id: r.id,
        text: error.message.includes("in_app_visit") ? c.inApp : c.failed,
      });
      setOpen(null);

      return;
    }
    setBusy(false);
    refresh(r.routeId);
    drop(r.id);
  };

  useEffect(() => {
    void (async () => {
      try {
        await load();
      } catch {
        // No env, no network or a refused query (even a synchronous throw
        // from the client): an empty list rather than "Loading…" forever.
        setRows([]);
      }
    })();

    async function load() {
      const supabase = supabaseBrowser();
      const { data: auth } = await supabase.auth.getUser();

      if (!auth.user) {
        setSignedOut(true);

        return;
      }
      const { data } = await supabase
        .from("media_assets")
        .select(
          "id, thumbnail_path, created_at, beta_from, climb_logs(route_id, sessions(visibility), routes(grade_label, hold_color, wall, gyms(name, branch)))",
        )
        .eq("owner_id", auth.user.id)
        .eq("visibility", "public")
        .eq("kind", "video")
        .eq("status", "uploaded")
        .order("created_at", { ascending: false })
        .limit(60);

      type R = {
        id: string;
        thumbnail_path: string | null;
        created_at: string;
        beta_from: string | null;
        climb_logs: {
          route_id: string | null;
          sessions: { visibility: string } | null;
          routes: {
            grade_label: string | null;
            hold_color: string | null;
            wall: string | null;
            gyms: { name: string; branch: string | null } | null;
          } | null;
        } | null;
      };
      const list = ((data ?? []) as unknown as R[]).filter(
        (r) => r.climb_logs?.route_id,
      );
      const thumbs = list.flatMap((r) =>
        r.thumbnail_path ? [r.thumbnail_path] : [],
      );
      const signed: { path: string | null; signedUrl: string }[] = thumbs.length
        ? ((await supabase.storage.from("media").createSignedUrls(thumbs, 3600))
            .data ?? [])
        : [];
      const posterFor = new Map<string, string>(
        signed.flatMap((s) =>
          s.path && s.signedUrl
            ? [[s.path, s.signedUrl] as [string, string]]
            : [],
        ),
      );
      // Counts come from beta_clips(), which shows bumps and helped to the owner only.
      const routes = Array.from(
        new Set(list.map((r) => r.climb_logs!.route_id!)),
      );
      const stats = new Map<
        string,
        { views: number; bumps: number; helped: number }
      >();

      await Promise.all(
        routes.map(async (routeId) => {
          const { data: clips } = await supabase.rpc("beta_clips", {
            p_route_id: routeId,
          });

          for (const cl of (clips ?? []) as {
            media_id: string | null;
            views: number | null;
            bumps: number | null;
            helped: number | null;
          }[]) {
            if (cl.media_id) {
              stats.set(cl.media_id, {
                views: cl.views ?? 0,
                bumps: cl.bumps ?? 0,
                helped: cl.helped ?? 0,
              });
            }
          }
        }),
      );

      setRows(
        list.map((r) => {
          const route = r.climb_logs!.routes;
          const s = stats.get(r.id);

          return {
            id: r.id,
            routeId: r.climb_logs!.route_id!,
            friendsVisit:
              r.beta_from === "friends" &&
              // As the server: any visit that isn't private.
              !!r.climb_logs!.sessions &&
              r.climb_logs!.sessions.visibility !== "private",
            grade: route?.grade_label ?? null,
            color: route?.hold_color ?? null,
            wall: route?.wall ?? null,
            gym: [route?.gyms?.name, route?.gyms?.branch]
              .filter(Boolean)
              .join(" "),
            poster: r.thumbnail_path
              ? (posterFor.get(r.thumbnail_path) ?? null)
              : null,
            createdAt: r.created_at,
            views: s?.views ?? 0,
            bumps: s?.bumps ?? 0,
            helped: s?.helped ?? 0,
          };
        }),
      );
    }
  }, []);

  if (signedOut) {
    return (
      <p className="rounded-2xl border border-dashed border-line px-6 py-12 text-center text-mute">
        {c.signedOut}
      </p>
    );
  }
  if (!rows) return <p className="py-12 text-center text-mute">{c.loading}</p>;
  if (!rows.length) {
    return (
      <div className="rounded-2xl border border-dashed border-line px-6 py-12 text-center">
        <p className="text-mute">{c.empty}</p>
        <Link
          className="mt-4 inline-block font-semibold underline underline-offset-4"
          href={gymsHref}
        >
          {c.browse}
        </Link>
      </div>
    );
  }
  const sum = (k: "views" | "bumps" | "helped") =>
    rows.reduce((n, r) => n + r[k], 0);

  return (
    <div>
      <dl className="grid grid-cols-3 overflow-hidden rounded-[20px] border border-line bg-ink-2">
        {(
          [
            ["views", c.views],
            ["bumps", c.bumps],
            ["helped", c.helped],
          ] as const
        ).map(([k, label], i) => (
          <div
            key={k}
            className={`px-4 py-5 ${i ? "border-l border-line" : ""} ${k === "helped" ? "bg-lime" : ""}`}
          >
            <dd className="font-display text-[34px] leading-none tabular">
              {sum(k)}
            </dd>
            <dt className="mt-2 text-[13px] font-semibold text-mute">
              {label}
            </dt>
          </div>
        ))}
      </dl>
      <p className="mt-8 text-[14px] font-semibold text-mute">
        {c.total(rows.length)}
      </p>
      <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {rows.map((r) => (
          <li key={r.id} className="relative">
            <Link
              className="lift theme-dark group relative block aspect-[9/14] overflow-hidden rounded-[20px] bg-night"
              href={`${shortHref}/${r.routeId}`}
            >
              {r.poster ? (
                // eslint-disable-next-line @next/next/no-img-element -- my clip's poster, from storage
                <img
                  alt=""
                  className="absolute inset-0 size-full object-cover"
                  src={r.poster}
                />
              ) : (
                <span className="bolt-grid absolute inset-0" />
              )}
              <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/30" />
              <span className="absolute left-2.5 top-2.5">
                <GradeChip color={r.color} grade={r.grade} size="sm" />
              </span>
              <span className="absolute inset-x-0 bottom-0 p-3">
                <span className="block truncate text-[13px] font-bold text-white">
                  {r.gym}
                </span>
                <span className="block truncate text-[12px] text-white/70">
                  {r.wall}
                </span>
                <span className="mt-2 flex gap-2 text-[11px] font-bold text-white tabular">
                  <span>
                    {lang === "zh-TW" ? `觀看 ${r.views}` : `${r.views} views`}
                  </span>
                  <span>
                    {lang === "zh-TW" ? `碰拳 ${r.bumps}` : `${r.bumps} bumps`}
                  </span>
                  <span className="text-lime">
                    {lang === "zh-TW"
                      ? `幫 ${r.helped} 人完攀`
                      : `Helped ${r.helped} send`}
                  </span>
                </span>
              </span>
            </Link>
            <button
              aria-expanded={open?.id === r.id}
              aria-label={c.more}
              className="absolute right-2 top-2 grid size-9 place-items-center rounded-full bg-black/55 text-[18px] font-black leading-none text-white backdrop-blur transition-colors hover:bg-black/75"
              type="button"
              onClick={() =>
                setOpen(open?.id === r.id ? null : { id: r.id, step: "menu" })
              }
            >
              ⋯
            </button>
            {open?.id === r.id ? (
              <div className="absolute inset-x-2 top-12 z-10 rounded-2xl border border-line bg-ink-2 p-3 text-cream shadow-[0_10px_30px_rgb(0_0_0/0.25)]">
                {open.step === "menu" ? (
                  <div className="grid gap-1">
                    <button
                      className="rounded-xl px-3 py-2.5 text-left text-[14px] font-bold hover:bg-ink-3"
                      type="button"
                      onClick={() => setOpen({ id: r.id, step: "takeBack" })}
                    >
                      {c.takeBack}
                    </button>
                    <button
                      className="rounded-xl px-3 py-2.5 text-left text-[14px] font-bold text-[#c2272d] hover:bg-hold-red/10"
                      type="button"
                      onClick={() => setOpen({ id: r.id, step: "delete" })}
                    >
                      {c.del}
                    </button>
                  </div>
                ) : (
                  <div>
                    <p className="text-[13px] leading-[1.6]">
                      {open.step === "delete"
                        ? c.delSure
                        : r.friendsVisit
                          ? c.takeBackSureFriends
                          : c.takeBackSure}
                    </p>
                    <div className="mt-3 flex justify-end gap-2">
                      <button
                        className="rounded-full px-3 py-2 text-[13px] font-bold text-mute"
                        disabled={busy}
                        type="button"
                        onClick={() => setOpen(null)}
                      >
                        {c.cancel}
                      </button>
                      <button
                        className={`rounded-full px-3.5 py-2 text-[13px] font-bold text-white disabled:opacity-50 ${open.step === "delete" ? "bg-[#c2272d]" : "bg-night"}`}
                        disabled={busy}
                        type="button"
                        onClick={() =>
                          void (open.step === "delete"
                            ? remove(r)
                            : takeBack(r))
                        }
                      >
                        {busy
                          ? c.working
                          : open.step === "delete"
                            ? c.del
                            : c.takeBack}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : null}
            {notice?.id === r.id ? (
              <p
                className="mt-2 text-[12px] font-semibold text-[#c2272d]"
                role="alert"
              >
                {notice.text}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
      <p className="mt-6 text-[13px] text-mute">{c.note}</p>
    </div>
  );
}
