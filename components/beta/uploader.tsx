"use client";

import type { User } from "@supabase/supabase-js";

import { track } from "@vercel/analytics";
import clsx from "clsx";
import { useCallback, useEffect, useRef, useState } from "react";

import { uploadCopy, type UploadCopy } from "@/lib/beta/upload-copy";
import { siteConfig } from "@/config/site";
import {
  canTranscode,
  CLIP_MAX_S,
  ClipError,
  makeClip,
  probe,
} from "@/lib/beta/transcode";
import { supabaseBrowser } from "@/lib/supabase/browser";

interface Me {
  id: string;
  name: string;
  username: string | null;
  email: string | null;
  avatar: string | null;
}

type Result = "sent" | "flash" | "attempted";

/**
 * Sign in with Apple on the web: on once Supabase has the Apple Services ID
 * and client secret. The secret is a JWT that lasts at most 6 months, so it
 * must be renewed (see docs/web-apple-sign-in.md in the app repo).
 */
const APPLE_ON_WEB = process.env.NEXT_PUBLIC_APPLE_SIGNIN === "1";

type Phase =
  | { at: "loading" }
  | { at: "signedOut" }
  | { at: "profile"; user: User }
  | { at: "pick" }
  | { at: "trim" }
  | {
      at: "working";
      step: "processing" | "uploading" | "publishing";
      progress: number;
    }
  | { at: "done"; first: boolean };

export interface UploadRoute {
  id: string;
  gymId: string;
  /** Localized links. */
  routeHref: string;
  routeUrl: string;
  hubPath: string;
  callbackPath: string;
  privacyPath: string;
  minePath: string;
  /** Beta clips the route had when the page was built. */
  clipsBefore: number;
}

const today = () =>
  new Date(Date.now() + 8 * 3600_000).toISOString().slice(0, 10);

/**
 * Upload a beta clip from the website. Signed out: Apple or Google, the same
 * accounts as the app. New account: one screen (a name and the rules), the
 * rest waits for the app. Then pick, trim to ≤ 60 s, say how it went, and
 * the clip is made on this device, uploaded to my folder and published in
 * one call (`submit_web_beta`).
 */
export function BetaUploader({
  route,
  lang,
}: {
  route: UploadRoute;
  /** The copy has functions, which can't come from the server, so it's picked here. */
  lang: "zh-TW" | "en";
}) {
  const c = uploadCopy[lang];
  const [phase, setPhase] = useState<Phase>({ at: "loading" });
  const [me, setMe] = useState<Me | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [start, setStart] = useState(0);
  const [length, setLength] = useState(CLIP_MAX_S);
  const [result, setResult] = useState<Result>("sent");
  const [date, setDate] = useState(today());
  const [consent, setConsent] = useState(false);
  const [encodable, setEncodable] = useState<boolean | null>(null);
  const preview = useRef<HTMLVideoElement>(null);
  const abort = useRef<AbortController | null>(null);
  // One upload at a time; also keeps a retry on the same clip id (idempotent).
  const busy = useRef(false);
  const mediaId = useRef<string | null>(null);

  const loadMe = useCallback(async () => {
    const supabase = supabaseBrowser();
    const { data } = await supabase.auth.getUser();
    const user = data.user;

    if (!user) {
      setMe(null);
      setPhase({ at: "signedOut" });

      return;
    }
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, display_name, username, avatar_path")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile) {
      setPhase({ at: "profile", user });

      return;
    }
    const picture =
      user.user_metadata?.avatar_url ?? user.user_metadata?.picture;

    setMe({
      id: profile.id,
      name: profile.display_name,
      username: profile.username ?? null,
      email: user.email ?? null,
      // The VARO photo first, then the Google one.
      avatar: profile.avatar_path
        ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${profile.avatar_path}`
        : typeof picture === "string" && picture.startsWith("https://")
          ? picture
          : null,
    });
    setPhase({ at: "pick" });
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("signin") === "failed") setError(c.signInFailed);
    void loadMe().catch(() => setPhase({ at: "signedOut" }));
    void canTranscode().then(setEncodable);
  }, [loadMe, c.signInFailed]);

  useEffect(
    () => () => {
      if (fileUrl) URL.revokeObjectURL(fileUrl);
    },
    [fileUrl],
  );

  // Instagram, Facebook, LINE and Threads open links in their own webview,
  // where Google blocks sign-in (disallowed_useragent).
  const [inApp, setInApp] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    setInApp(
      /Instagram|FBAN|FBAV|FB_IAB|Line\/|Threads|Barcelona/i.test(
        navigator.userAgent,
      ),
    );
  }, []);

  const signIn = async (provider: "google" | "apple") => {
    setError(null);
    track("web_beta_signin", { provider });
    const next = window.location.pathname;
    const { error: e } = await supabaseBrowser().auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}${route.callbackPath}?next=${encodeURIComponent(next)}`,
      },
    });

    if (e) setError(c.signInFailed);
  };

  const signOut = async () => {
    await supabaseBrowser().auth.signOut();
    setMe(null);
    setPhase({ at: "signedOut" });
  };

  const pick = async (f: File | undefined) => {
    if (!f) return;
    setError(null);
    try {
      const p = await probe(f);

      if (fileUrl) URL.revokeObjectURL(fileUrl);
      setFile(f);
      setFileUrl(URL.createObjectURL(f));
      setDuration(p.duration);
      setStart(0);
      setLength(Math.min(CLIP_MAX_S, Math.floor(p.duration * 10) / 10));
      mediaId.current = null;
      setPhase({ at: "trim" });
      track("web_beta_picked", { seconds: Math.round(p.duration) });
    } catch {
      setError(c.errors.unreadable);
    }
  };

  // Keep the preview looping inside the chosen range.
  useEffect(() => {
    const v = preview.current;

    if (!v) return;
    const loop = () => {
      if (v.currentTime >= start + length || v.currentTime < start - 0.3) {
        v.currentTime = start;
      }
    };

    v.addEventListener("timeupdate", loop);

    return () => v.removeEventListener("timeupdate", loop);
  }, [start, length, phase.at]);

  const submit = async () => {
    if (!file || !me || busy.current) return;
    busy.current = true;
    setError(null);
    const supabase = supabaseBrowser();
    const ctrl = new AbortController();

    abort.current = ctrl;
    mediaId.current ??= crypto.randomUUID();
    const id = mediaId.current;
    const videoPath = `${me.id}/${id}.mp4`;
    const posterPath = `${me.id}/${id}.jpg`;

    try {
      setPhase({ at: "working", step: "processing", progress: 0 });
      const clip = await makeClip(
        file,
        { start, end: Math.min(duration, start + length) },
        (p) => setPhase({ at: "working", step: "processing", progress: p }),
        ctrl.signal,
      );

      setPhase({ at: "working", step: "uploading", progress: 0 });
      const media = supabase.storage.from("media");
      const up = await Promise.all([
        media.upload(videoPath, clip.video, {
          contentType: "video/mp4",
          upsert: true,
        }),
        media.upload(posterPath, clip.poster, {
          contentType: "image/jpeg",
          upsert: true,
        }),
      ]);

      if (up.some((u) => u.error)) throw new Error("network");

      setPhase({ at: "working", step: "publishing", progress: 1 });
      const { error: e } = await supabase.rpc("submit_web_beta", {
        p_media_id: id,
        p_route_id: route.id,
        p_occurred_on: date,
        p_result: result === "attempted" ? "attempted" : "sent",
        p_flash: result === "flash",
        p_storage_path: videoPath,
        p_thumbnail_path: posterPath,
        p_width: clip.width,
        p_height: clip.height,
        p_duration_ms: clip.durationMs,
      });

      if (e) {
        // Refused by the database (it answered with a code): nothing points
        // at the files, so take them back. A lost response may have gone
        // through, so the files stay and a retry reuses the same clip id.
        if (e.code) void media.remove([videoPath, posterPath]);
        throw new Error(e.code ? e.message : `network ${e.message}`);
      }

      // Let the route and gym pages show it now rather than in 5 minutes.
      // keepalive: survives the person leaving the page right away.
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
              body: JSON.stringify({ path: route.hubPath, routeId: route.id }),
            }),
        )
        .catch(() => undefined);
      track("web_beta_uploaded", {
        transcoded: clip.transcoded,
        seconds: Math.round(clip.durationMs / 1000),
      });
      mediaId.current = null;
      setPhase({ at: "done", first: route.clipsBefore === 0 });
    } catch (e) {
      const m = e instanceof Error ? e.message : "";
      const code =
        e instanceof ClipError
          ? e.code
          : /rate_limited_day/.test(m)
            ? "rate_limited_day"
            : /rate_limited_route/.test(m)
              ? "rate_limited_route"
              : /route not found/.test(m)
                ? "route_gone"
                : /too large/.test(m)
                  ? "too_big"
                  : /network|fetch|Failed/i.test(m)
                    ? "network"
                    : "generic";

      setPhase({ at: "trim" });
      if (code !== "canceled") {
        setError(
          c.errors[code as keyof UploadCopy["errors"]] ?? c.errors.generic,
        );
        track("web_beta_failed", { code });
      }
    } finally {
      busy.current = false;
      abort.current = null;
    }
  };

  const share = async () => {
    try {
      if (navigator.share) await navigator.share({ url: route.routeUrl });
      else {
        await navigator.clipboard.writeText(route.routeUrl);
        setError(null);
        alertCopied();
      }
    } catch {
      /* dismissed */
    }
  };
  const [copied, setCopied] = useState(false);
  const alertCopied = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const stepIndex =
    phase.at === "signedOut" || phase.at === "profile" || phase.at === "loading"
      ? 0
      : phase.at === "pick"
        ? 1
        : phase.at === "trim"
          ? 2
          : 3;

  return (
    <div className="mx-auto w-full max-w-[560px]">
      {phase.at !== "done" ? (
        <ol aria-label="steps" className="mb-6 grid grid-cols-4 gap-2">
          {c.steps.map((s, i) => (
            <li key={s} className="flex flex-col gap-1.5">
              <span
                className={clsx(
                  "h-1.5 rounded-full transition-colors",
                  i <= stepIndex ? "bg-night" : "bg-line",
                )}
              />
              <span
                className={clsx(
                  "text-[12px] font-semibold",
                  i === stepIndex ? "text-cream" : "text-mute",
                )}
              >
                {s}
              </span>
            </li>
          ))}
        </ol>
      ) : null}

      <div className="overflow-hidden rounded-[28px] border border-line bg-ink-2">
        {me && (phase.at === "pick" || phase.at === "trim") ? (
          <Account c={c} me={me} onSwitch={() => void signOut()} />
        ) : null}
        {phase.at === "loading" ? (
          <p className="p-8 text-center text-mute">{c.loading}</p>
        ) : null}

        {phase.at === "signedOut" ? (
          <section className="p-6 sm:p-8">
            <h2 className="text-[24px] font-extrabold">{c.signInTitle}</h2>
            <p className="mt-2 text-[15px] leading-[1.75] text-mute">
              {c.signInBody}
            </p>
            {inApp ? (
              // Google refuses sign-in inside Instagram/LINE/Threads webviews.
              <div className="mt-5 rounded-2xl border border-line bg-ink p-4">
                <p className="text-[14px] font-bold">{c.inAppTitle}</p>
                <p className="mt-1 text-[13px] leading-[1.7] text-mute">
                  {c.inAppBody}
                </p>
                <button
                  className="mt-3 h-10 rounded-full bg-night px-4 text-[14px] font-bold text-day"
                  type="button"
                  onClick={() => {
                    void navigator.clipboard
                      ?.writeText(window.location.href)
                      .then(() => setLinkCopied(true))
                      .catch(() => undefined);
                  }}
                >
                  {linkCopied ? c.copied : c.copyLink}
                </button>
              </div>
            ) : null}
            {APPLE_ON_WEB ? (
              <button
                className="mt-6 flex h-13 w-full items-center justify-center gap-2.5 rounded-full bg-black text-[16px] font-bold text-white transition-transform active:translate-y-px"
                type="button"
                onClick={() => void signIn("apple")}
              >
                <AppleGlyph />
                {c.apple}
              </button>
            ) : null}
            <button
              className={clsx(
                "btn-brutal flex h-13 w-full items-center justify-center gap-2.5 rounded-full bg-ink-2 text-[16px] font-bold text-cream",
                APPLE_ON_WEB ? "mt-3" : "mt-6",
              )}
              type="button"
              onClick={() => void signIn("google")}
            >
              <GoogleGlyph />
              {c.google}
            </button>
            <p className="mt-5 rounded-2xl bg-ink px-4 py-3 text-[13px] leading-[1.7] text-mute">
              {APPLE_ON_WEB ? c.sameMethodNote : c.appleNote}
            </p>
          </section>
        ) : null}

        {phase.at === "profile" ? (
          <ProfileStep
            c={c}
            gymId={route.gymId}
            privacyHref={route.privacyPath}
            user={phase.user}
            onDone={() => void loadMe()}
            onSwitch={() => void signOut()}
          />
        ) : null}

        {phase.at === "pick" ? (
          <section className="p-6 sm:p-8">
            <h2 className="text-[24px] font-extrabold">{c.pickTitle}</h2>
            <p className="mt-2 text-[15px] leading-[1.75] text-mute">
              {c.pickBody}
            </p>
            {encodable === false ? (
              <p className="mt-4 rounded-2xl bg-hold-orange/15 px-4 py-3 text-[14px] font-semibold text-[#9a4a00]">
                {c.unsupportedBrowser}
              </p>
            ) : null}
            <label className="bolt-grid mt-6 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-[22px] border-2 border-dashed border-night/50 bg-ink px-6 py-12 text-center transition-colors hover:border-night hover:bg-lime/10">
              <span className="flex size-16 items-center justify-center rounded-full bg-lime">
                <svg
                  aria-hidden
                  className="size-7"
                  fill="none"
                  stroke="#111"
                  strokeWidth="2.4"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 16V4m0 0-5 5m5-5 5 5M4 20h16"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="text-[17px] font-bold">{c.pickButton}</span>
              <input
                accept="video/mp4,video/quicktime,video/*"
                className="sr-only"
                type="file"
                onChange={(e) => void pick(e.target.files?.[0])}
              />
            </label>
          </section>
        ) : null}

        {(phase.at === "trim" || phase.at === "working") && fileUrl ? (
          <section>
            <div className="theme-dark relative bg-night">
              {}
              <video
                ref={preview}
                autoPlay
                loop
                muted
                playsInline
                className="mx-auto max-h-[56vh] w-full object-contain"
                src={fileUrl}
              />
              {phase.at === "working" ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/70 px-8 text-center backdrop-blur-sm">
                  <p className="text-[20px] font-extrabold text-white">
                    {c[phase.step]}
                  </p>
                  <div className="h-3 w-full max-w-[280px] overflow-hidden rounded-full border-2 border-lime bg-black">
                    <div
                      className={clsx(
                        "h-full bg-lime transition-[width] duration-300",
                        phase.step !== "processing" && "animate-pulse",
                      )}
                      style={{
                        width: `${Math.round((phase.step === "processing" ? phase.progress : 1) * 100)}%`,
                      }}
                    />
                  </div>
                  {phase.step === "processing" ? (
                    <>
                      <p className="text-[13px] text-white/70 tabular">
                        {Math.round(phase.progress * 100)}% · {c.processingNote}
                      </p>
                      <button
                        className="rounded-full border border-white/40 px-4 py-1.5 text-[13px] font-semibold text-white"
                        type="button"
                        onClick={() => abort.current?.abort()}
                      >
                        {c.cancel}
                      </button>
                    </>
                  ) : null}
                </div>
              ) : null}
            </div>

            <div
              className={clsx(
                "p-6 sm:p-8",
                phase.at === "working" && "pointer-events-none opacity-50",
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-[20px] font-extrabold">{c.trimTitle}</h2>
                <label className="cursor-pointer text-[14px] font-semibold underline underline-offset-4">
                  {c.pickAgain}
                  <input
                    accept="video/mp4,video/quicktime,video/*"
                    className="sr-only"
                    type="file"
                    onChange={(e) => void pick(e.target.files?.[0])}
                  />
                </label>
              </div>
              <Slider
                display={c.seconds(Math.round(start))}
                label={c.start}
                max={Math.max(0, duration - 1)}
                value={start}
                onChange={(v) => {
                  setStart(v);
                  setLength((l) => Math.min(l, duration - v, CLIP_MAX_S));
                  if (preview.current) preview.current.currentTime = v;
                }}
              />
              <Slider
                display={c.seconds(Math.round(length))}
                label={c.length}
                max={Math.min(CLIP_MAX_S, duration - start)}
                min={Math.min(3, duration - start)}
                value={length}
                onChange={setLength}
              />

              <h2 className="mt-8 text-[20px] font-extrabold">
                {c.detailsTitle}
              </h2>
              <div className="mt-3 flex flex-wrap gap-2" role="radiogroup">
                {(["sent", "flash", "attempted"] as const).map((r) => (
                  <button
                    key={r}
                    aria-checked={result === r}
                    className={clsx(
                      "h-11 rounded-full border-2 px-5 text-[15px] font-bold transition-colors",
                      result === r
                        ? r === "flash"
                          ? "border-night bg-lime text-night"
                          : "border-night bg-night text-day"
                        : "border-line bg-ink-2 hover:border-night",
                    )}
                    role="radio"
                    type="button"
                    onClick={() => setResult(r)}
                  >
                    {r === "flash" ? c.flash : c[r]}
                  </button>
                ))}
              </div>
              <label className="mt-5 flex items-center justify-between gap-4 rounded-2xl border-2 border-line px-4 py-3">
                <span className="text-[15px] font-semibold">{c.dateLabel}</span>
                <input
                  className="bg-transparent text-[15px] font-semibold tabular outline-none"
                  max={today()}
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value || today())}
                />
              </label>
              <label className="mt-5 flex cursor-pointer items-start gap-3 text-[14px] leading-[1.7] text-mute">
                <input
                  checked={consent}
                  className="mt-1 size-5 shrink-0 accent-[#111]"
                  type="checkbox"
                  onChange={(e) => setConsent(e.target.checked)}
                />
                {c.consent}
              </label>
              {error ? <ErrorNote>{error}</ErrorNote> : null}
              <button
                className="btn-brutal mt-6 h-14 w-full rounded-full bg-lime text-[17px] font-extrabold text-night disabled:cursor-not-allowed disabled:opacity-40"
                disabled={!consent || phase.at === "working"}
                type="button"
                onClick={() => void submit()}
              >
                {c.submit}
              </button>
            </div>
          </section>
        ) : null}

        {phase.at === "done" ? (
          <section className="bolt-grid relative overflow-hidden p-8 text-center sm:p-10">
            {/* eslint-disable-next-line @next/next/no-img-element -- the mascot, a small static PNG */}
            <img
              alt=""
              className="pop mx-auto size-20"
              height={80}
              src="/mascot/jug-lime.png"
              width={80}
            />
            <h2 className="mt-6 text-[28px] font-extrabold">{c.doneTitle}</h2>
            {phase.first ? (
              <p className="mt-2 inline-block rounded-full bg-night px-3 py-1 text-[14px] font-bold text-lime">
                {c.doneFirst}
              </p>
            ) : null}
            <p className="mx-auto mt-4 max-w-[24rem] text-[15px] leading-[1.75] text-mute">
              {c.doneBody}
            </p>
            <div className="mt-7 grid gap-3">
              <a
                className="btn-brutal flex h-13 items-center justify-center rounded-full bg-lime text-[16px] font-bold text-night"
                href={route.routeHref}
              >
                {c.viewRoute}
              </a>
              <button
                className="btn-brutal flex h-13 items-center justify-center rounded-full bg-ink-2 text-[16px] font-bold"
                type="button"
                onClick={() => void share()}
              >
                {copied ? c.copied : c.share}
              </button>
              {siteConfig.appStoreUrl ? (
                <a
                  className="flex h-12 items-center justify-center rounded-full text-[15px] font-semibold underline underline-offset-4"
                  href={siteConfig.appStoreUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {c.getApp}
                </a>
              ) : null}
              <button
                className="text-[14px] text-mute underline underline-offset-4"
                type="button"
                onClick={() => {
                  setFile(null);
                  setConsent(false);
                  setPhase({ at: "pick" });
                }}
              >
                {c.another}
              </button>
              <a
                className="text-[14px] text-mute underline underline-offset-4"
                href={route.minePath}
              >
                {c.mine}
              </a>
            </div>
          </section>
        ) : null}
      </div>
      {error && phase.at !== "trim" ? (
        <div className="mt-4">
          <ErrorNote>{error}</ErrorNote>
        </div>
      ) : null}
    </div>
  );
}

function ProfileStep({
  c,
  user,
  gymId,
  privacyHref,
  onDone,
  onSwitch,
}: {
  c: UploadCopy;
  user: User;
  gymId: string;
  privacyHref: string;
  onDone: () => void;
  onSwitch: () => void;
}) {
  const meta = user.user_metadata as { full_name?: string; name?: string };
  const [name, setName] = useState(
    (meta.full_name || meta.name || user.email?.split("@")[0] || "").slice(
      0,
      30,
    ),
  );
  const [agree, setAgree] = useState(false);
  const [saving, setSaving] = useState(false);
  const [failed, setFailed] = useState(false);
  const [hint, setHint] = useState(false);

  const create = async () => {
    if (saving || !name.trim() || !agree) return;
    setSaving(true);
    setFailed(false);
    const ascii = name
      .normalize("NFKD")
      .replace(/[^a-zA-Z0-9]/g, "")
      .toLowerCase();
    const { error } = await supabaseBrowser().rpc("complete_onboarding", {
      p_display_name: name.trim(),
      p_username_base: ascii.length >= 3 ? ascii : "climber",
      p_favorite_gym_ids: [gymId],
      p_referral_source: "other",
      p_referral_note: "getvaro.app beta",
    });

    setSaving(false);
    if (error) {
      setFailed(true);

      return;
    }
    track("web_beta_account_created");
    onDone();
  };

  return (
    <section className="p-6 sm:p-8">
      <h2 className="text-[24px] font-extrabold">{c.profileTitle}</h2>
      <p className="mt-2 text-[15px] leading-[1.75] text-mute">
        {c.profileBody}
      </p>
      <label className="mt-6 block">
        <span className="text-[14px] font-semibold">{c.nameLabel}</span>
        <input
          className="mt-2 h-13 w-full rounded-2xl border-2 border-line bg-ink px-4 text-[17px] font-semibold outline-none focus:border-night"
          maxLength={30}
          placeholder={c.namePlaceholder}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <label className="mt-5 flex cursor-pointer items-start gap-3 text-[14px] leading-[1.7] text-mute">
        <input
          checked={agree}
          className="mt-1 size-5 shrink-0 accent-[#111]"
          type="checkbox"
          onChange={(e) => setAgree(e.target.checked)}
        />
        <span>
          {c.agree[0]}
          <a
            className="font-semibold text-cream underline underline-offset-4"
            href={privacyHref}
            rel="noopener noreferrer"
            target="_blank"
          >
            {c.agree[1]}
          </a>
          {c.agree[2]}
        </span>
      </label>
      {failed ? <ErrorNote>{c.errors.generic}</ErrorNote> : null}
      <button
        className="btn-brutal mt-6 h-14 w-full rounded-full bg-lime text-[17px] font-extrabold text-night disabled:opacity-40"
        disabled={!agree || !name.trim() || saving}
        type="button"
        onClick={() => void create()}
      >
        {c.createAccount}
      </button>
      {/* With Apple on the web they can just pick it; the hint is for Google-only. */}
      {APPLE_ON_WEB ? null : (
        <div className="mt-5 text-center">
          <button
            className="text-[14px] font-semibold underline underline-offset-4"
            type="button"
            onClick={() => (hint ? onSwitch() : setHint(true))}
          >
            {c.usedApp}
          </button>
          {hint ? (
            <p className="mt-2 text-[13px] text-mute">{c.usedAppHint}</p>
          ) : null}
        </div>
      )}
    </section>
  );
}

/**
 * Whose account the beta goes to, plain to see before picking a clip: a
 * wrong Google account means the beta lands on another VARO account.
 */
function Account({
  c,
  me,
  onSwitch,
}: {
  c: UploadCopy;
  me: Me;
  onSwitch: () => void;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-line bg-ink px-6 py-4 sm:px-8">
      {me.avatar ? (
        // eslint-disable-next-line @next/next/no-img-element -- avatar from storage or Google
        <img
          alt=""
          className="size-11 shrink-0 rounded-full object-cover"
          referrerPolicy="no-referrer"
          src={me.avatar}
        />
      ) : (
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-lime text-[18px] font-extrabold text-night">
          {Array.from(me.name.trim())[0]?.toUpperCase() ?? "?"}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-[12px] font-semibold text-mute">{c.uploadingTo}</p>
        <p className="truncate text-[16px] font-extrabold">
          {me.name}
          {me.username ? (
            <span className="ml-1.5 text-[13px] font-semibold text-mute">
              @{me.username}
            </span>
          ) : null}
        </p>
        {me.email ? (
          <p className="truncate text-[12px] text-mute">{me.email}</p>
        ) : null}
      </div>
      <button
        className="h-9 shrink-0 rounded-full border border-line bg-ink-2 px-3.5 text-[13px] font-bold transition-colors hover:border-cream/30"
        type="button"
        onClick={onSwitch}
      >
        {c.switchAccount}
      </button>
    </div>
  );
}

function Slider({
  label,
  value,
  min = 0,
  max,
  display,
  onChange,
}: {
  label: string;
  value: number;
  min?: number;
  max: number;
  display: string;
  onChange: (v: number) => void;
}) {
  return (
    <label className="mt-5 block">
      <span className="flex items-center justify-between text-[14px] font-semibold">
        {label}
        <span className="rounded-full bg-night px-2.5 py-0.5 font-mono text-[12px] text-lime tabular">
          {display}
        </span>
      </span>
      <input
        className="mt-3 w-full accent-[#111]"
        max={max}
        min={min}
        step={0.1}
        type="range"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
}

function ErrorNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-4 rounded-2xl border-2 border-hold-red/50 bg-hold-red/10 px-4 py-3 text-[14px] font-semibold text-[#a3141a]">
      {children}
    </p>
  );
}

function AppleGlyph() {
  return (
    <svg
      aria-hidden
      className="size-5"
      fill="currentColor"
      viewBox="0 0 512 512"
    >
      <path d="M349.13 136.86c-40.32 0-57.36 19.24-85.44 19.24-28.79 0-50.75-19.1-85.69-19.1-34.2 0-70.67 20.88-93.83 56.45-32.52 50.16-27 144.63 25.67 225.11 18.84 28.81 44 61.12 77 61.47h.6c28.68 0 37.2-18.78 76.67-19h.6c38.88 0 46.68 18.89 75.24 18.89h.6c33-.35 59.51-36.15 78.35-64.85 13.56-20.64 18.6-31 29-54.35-76.19-28.92-88.43-136.93-13.08-178.34-23-28.8-55.32-45.48-85.79-45.48z" />
      <path d="M340.25 32c-24 1.63-52 16.91-68.4 36.86-14.88 18.08-27.12 44.9-22.32 70.91h1.92c25.56 0 51.72-15.39 67-35.11 14.72-20.3 25.88-49.06 21.8-72.66z" />
    </svg>
  );
}

function GoogleGlyph() {
  return (
    <svg aria-hidden className="size-5" viewBox="0 0 24 24">
      <path
        d="M21.6 12.23c0-.71-.06-1.39-.18-2.05H12v3.88h5.39a4.6 4.6 0 0 1-2 3.02v2.5h3.23c1.9-1.75 2.98-4.32 2.98-7.35Z"
        fill="#4285F4"
      />
      <path
        d="M12 22c2.7 0 4.96-.9 6.62-2.42l-3.23-2.5c-.9.6-2.04.95-3.39.95-2.6 0-4.81-1.76-5.6-4.12H3.07v2.58A10 10 0 0 0 12 22Z"
        fill="#34A853"
      />
      <path
        d="M6.4 13.91A6.02 6.02 0 0 1 6.08 12c0-.66.11-1.31.32-1.91V7.51H3.07A10 10 0 0 0 2 12c0 1.61.39 3.14 1.07 4.49l3.33-2.58Z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.98c1.47 0 2.79.5 3.83 1.5l2.87-2.87A9.6 9.6 0 0 0 12 2a10 10 0 0 0-8.93 5.51l3.33 2.58C7.19 7.74 9.4 5.98 12 5.98Z"
        fill="#EA4335"
      />
    </svg>
  );
}
