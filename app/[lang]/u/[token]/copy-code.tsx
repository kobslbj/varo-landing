"use client";

import { useState } from "react";

/** The invite code, big enough to read off, with a copy button. */
export function CopyCode({
  code,
  copyLabel,
  copiedLabel,
}: {
  code: string;
  copyLabel: string;
  copiedLabel: string;
}) {
  const [copied, setCopied] = useState(false);

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-line bg-ink px-4 py-3">
      <span
        aria-label={code.split("").join(" ")}
        className="font-mono text-[28px] font-bold tracking-[0.3em] text-cream"
      >
        {code}
      </span>
      <button
        className="rounded-lg border border-line px-3 py-2 text-[14px] font-semibold text-cream hover:bg-ink-3"
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          } catch {
            // Clipboard blocked (some in-app browsers): the code is on screen.
          }
        }}
      >
        <span aria-live="polite">{copied ? copiedLabel : copyLabel}</span>
      </button>
    </div>
  );
}
