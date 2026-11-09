"use client";

import { track } from "@vercel/analytics";

import { siteConfig } from "@/config/site";

const COPY = {
  "zh-TW": {
    label: "意見 / 回報問題",
    subject: "[VARO Beta] 意見回饋",
    body: (page: string, url: string) =>
      `想跟 VARO 說的話（看到的問題、想要的功能都可以）：\n\n\n\n——\n頁面：${page}\n${url}`,
  },
  en: {
    label: "Feedback / report a bug",
    subject: "[VARO Beta] Feedback",
    body: (page: string, url: string) =>
      `What would you like to tell VARO (a bug, a feature you want)?\n\n\n\n——\nPage: ${page}\n${url}`,
  },
};

/**
 * A floating button on the beta pages that opens an email to support with
 * the page filled in: Gmail's compose window on a computer, the phone's mail
 * app (often Gmail too) on a phone, where Gmail on the web can't send.
 */
export function FeedbackButton({ zh }: { zh: boolean }) {
  const c = COPY[zh ? "zh-TW" : "en"];
  const to = siteConfig.contactEmail ?? "support@getvaro.app";

  const open = () => {
    const body = c.body(document.title, window.location.href);
    const phone = window.matchMedia("(pointer: coarse)").matches;

    track("beta_feedback_opened", { via: phone ? "mail_app" : "gmail" });
    if (phone) {
      window.location.href = `mailto:${to}?subject=${encodeURIComponent(c.subject)}&body=${encodeURIComponent(body)}`;

      return;
    }
    const gmail = new URL("https://mail.google.com/mail/");

    gmail.search = new URLSearchParams({
      view: "cm",
      fs: "1",
      to,
      su: c.subject,
      body,
    }).toString();
    window.open(gmail.toString(), "_blank", "noopener,noreferrer");
  };

  return (
    <button
      className="fixed bottom-4 right-4 z-30 inline-flex h-11 items-center gap-2 rounded-full border border-line bg-ink-2/95 pl-3.5 pr-4 text-[14px] font-bold shadow-[0_6px_24px_rgb(0_0_0/0.14)] backdrop-blur transition-transform hover:-translate-y-0.5 active:translate-y-0 sm:bottom-6 sm:right-6"
      type="button"
      onClick={open}
    >
      <svg aria-hidden className="size-4" fill="none" viewBox="0 0 16 16">
        <path
          d="M2.5 4.5A1.5 1.5 0 0 1 4 3h8a1.5 1.5 0 0 1 1.5 1.5v5A1.5 1.5 0 0 1 12 11H7l-3 2.5V11a1.5 1.5 0 0 1-1.5-1.5v-5Z"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
      </svg>
      {c.label}
    </button>
  );
}
