"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";

/**
 * "Ask a friend to film it": opens the phone's share sheet with a short
 * message and this route's link, so the climber's friend can film the next
 * try and either of them can upload it. Copies the text where there's no
 * share sheet.
 */
export function AskFriend({
  url,
  text,
  label,
  copied,
  routeId,
}: {
  url: string;
  /** The message, without the link. */
  text: string;
  label: string;
  copied: string;
  routeId: string;
}) {
  const [done, setDone] = useState(false);

  const ask = async () => {
    track("beta_ask_friend", { route: routeId });
    if (navigator.share) {
      try {
        await navigator.share({ text, url });

        return;
      } catch (e) {
        // Dismissed: done. Not allowed (some in-app browsers): copy instead.
        if ((e as Error).name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(`${text} ${url}`);
      setDone(true);
      setTimeout(() => setDone(false), 2500);
    } catch {
      // Clipboard blocked too; nothing else to try.
    }
  };

  return (
    <button
      className="h-12 rounded-full border border-line bg-ink-2 px-6 text-[15px] font-bold transition-colors hover:bg-ink-3"
      type="button"
      onClick={ask}
    >
      {done ? copied : label}
    </button>
  );
}
