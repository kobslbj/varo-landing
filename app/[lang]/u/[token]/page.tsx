import type { Metadata } from "next";

import Link from "next/link";
import { headers } from "next/headers";

import { CopyCode } from "./copy-code";
import { getInvite, isToken } from "./invite";

import { CtaLink } from "@/components/landing/ui";
import { siteConfig } from "@/config/site";
import { getI18n, siteLocale } from "@/lib/i18n";

type Props = { params: Promise<{ token: string }> };

/**
 * getvaro.app/u/<token>: where a VARO friend QR code or invite link lands.
 * For someone without the app it says who's inviting and what VARO is first,
 * then how to get it; the 6-character code carries the invite through the
 * App Store install. With the app, one tap opens varo://friend/<token>.
 */
const copy = {
  "zh-TW": {
    title: (name: string) => `${name} 邀請你在 VARO 當岩友`,
    gym: (gym: string) => `常在 ${gym} 爬`,
    what: "VARO 是給攀岩者的記錄 App：記下每次嘗試、追蹤 Project，和一起爬的朋友互相加油。你的記錄預設只有自己看得到。",
    open: "在 VARO 開啟",
    download: "下載 VARO",
    codeTitle: "還沒有 VARO？",
    codeBody: (name: string) =>
      `下載後，在第一個畫面點「輸入邀請碼」，輸入這 6 碼就會和 ${name} 成為好友。`,
    copy: "複製",
    copied: "已複製",
    qrNote: "這個 QR Code 每 10 分鐘更新一次。",
    inApp: "按了沒反應？點右上角的「⋯」，選擇用 Safari 開啟。",
    goneTitle: "這個邀請已失效",
    goneBody:
      "QR Code 每 10 分鐘更新一次，邀請連結只能用一次，也可能已被重設。請朋友重新打開 QR Code，或再傳一條新的邀請連結。",
    metaTitle: "VARO 好友邀請",
  },
  en: {
    title: (name: string) =>
      `${name} invited you to be climbing friends on VARO`,
    gym: (gym: string) => `Climbs at ${gym}`,
    what: "VARO is a climbing log: record every attempt, follow your Projects, and cheer on the friends you climb with. Your sessions are private by default.",
    open: "Open in VARO",
    download: "Download VARO",
    codeTitle: "No VARO yet?",
    codeBody: (name: string) =>
      `After downloading, tap “Enter invite code” on the first screen and type these 6 characters to become friends with ${name}.`,
    copy: "Copy",
    copied: "Copied",
    qrNote: "This QR code changes every 10 minutes.",
    inApp: "Nothing happens? Tap “⋯” at the top right and open in Safari.",
    goneTitle: "This invite has expired",
    goneBody:
      "QR codes change every 10 minutes, and an invite link works once and can be reset. Ask your friend to open their QR code again, or to send a new invite link.",
    metaTitle: "VARO friend invite",
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await getI18n();
  const { token } = await params;
  const c = copy[siteLocale(locale)];
  const invite = isToken(token) ? await getInvite(token) : null;

  return {
    title: invite ? c.title(invite.name) : c.metaTitle,
    // A personal invite: never indexed, and the token never leaves as a referrer.
    robots: { index: false, follow: false },
    referrer: "no-referrer",
  };
}

export default async function InvitePage({ params }: Props) {
  const { locale } = await getI18n();
  const { token } = await params;
  const c = copy[siteLocale(locale)];
  const invite = isToken(token) ? await getInvite(token) : null;
  // LINE and Instagram open links in their own browser, which may not hand
  // varo:// to the app.
  const ua = (await headers()).get("user-agent") ?? "";
  const inAppBrowser = /\bLine\/|Instagram|FBAN|FBAV/i.test(ua);

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col justify-center gap-8 px-5 py-12">
      <Link
        aria-label="VARO"
        className="font-display text-[22px] tracking-wide text-cream"
        href="/"
      >
        VARO
      </Link>

      {invite ? (
        <>
          <section className="flex flex-col items-center gap-4 text-center">
            {invite.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- a user photo from storage
              <img
                alt=""
                className="size-24 rounded-full object-cover ring-4 ring-ink-3"
                height={96}
                referrerPolicy="no-referrer"
                src={invite.avatarUrl}
                width={96}
              />
            ) : (
              <div
                aria-hidden
                className="flex size-24 items-center justify-center rounded-full bg-ink-3 text-[36px] font-bold text-cream"
              >
                {invite.name.slice(0, 1)}
              </div>
            )}
            <h1 className="text-[26px] font-extrabold leading-tight text-cream">
              {c.title(invite.name)}
            </h1>
            {invite.gym ? (
              <p className="text-[15px] text-mute">{c.gym(invite.gym)}</p>
            ) : null}
            <p className="text-[15px] leading-relaxed text-mute">{c.what}</p>
          </section>

          <section className="flex flex-col gap-3">
            <CtaLink className="w-full" href={`varo://friend/${token}`}>
              {c.open}
            </CtaLink>
            {inAppBrowser ? (
              <p className="text-center text-[13px] text-mute">{c.inApp}</p>
            ) : null}
            {siteConfig.appStoreUrl ? (
              <CtaLink
                className="w-full"
                href={siteConfig.appStoreUrl}
                variant="outline"
              >
                {c.download}
              </CtaLink>
            ) : null}
          </section>

          {invite.code ? (
            <section className="flex flex-col gap-3 rounded-2xl border border-line bg-ink-2 p-5">
              <h2 className="text-[17px] font-bold text-cream">
                {c.codeTitle}
              </h2>
              <p className="text-[14px] leading-relaxed text-mute">
                {c.codeBody(invite.name)}
              </p>
              <CopyCode
                code={invite.code}
                copiedLabel={c.copied}
                copyLabel={c.copy}
              />
            </section>
          ) : (
            <p className="text-center text-[13px] text-mute">{c.qrNote}</p>
          )}
        </>
      ) : (
        <section className="flex flex-col gap-4 text-center">
          <h1 className="text-[26px] font-extrabold text-cream">
            {c.goneTitle}
          </h1>
          <p className="text-[15px] leading-relaxed text-mute">{c.goneBody}</p>
          {siteConfig.appStoreUrl ? (
            <CtaLink href={siteConfig.appStoreUrl} variant="outline">
              {c.download}
            </CtaLink>
          ) : null}
        </section>
      )}
    </main>
  );
}
