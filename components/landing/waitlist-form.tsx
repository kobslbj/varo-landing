"use client";

import type { Dictionary, Locale } from "@/lib/i18n";

import { useActionState, useEffect, useId } from "react";
import clsx from "clsx";
import { track } from "@vercel/analytics";

import { holdColors } from "./ui";

import { joinWaitlist } from "@/lib/waitlist";

/** Little holds stacked like avatars next to the signup count. */
const COUNT_HOLDS = [holdColors.red, holdColors.yellow, holdColors.blue];

/**
 * Email field and button in one box, shown while the app isn't on the App
 * Store yet. The browser's own validation bubble is off (`noValidate`); the
 * server checks the address and the message shows under the field instead.
 */
export function WaitlistForm({
  copy,
  locale,
  source,
  countLabel,
  className,
}: {
  copy: Omit<Dictionary["waitlist"], "count">;
  locale: Locale;
  /** Which form on the site, stored with the signup. */
  source: "hero" | "closing";
  /** e.g. "已有 42 位岩友加入"; hidden when the count is unknown or 0. */
  countLabel: string | null;
  className?: string;
}) {
  const [state, action, pending] = useActionState(joinWaitlist, undefined);
  const id = useId();
  const status = state?.status ?? "idle";
  const done = status === "joined" || status === "already";
  const failed = status === "invalid" || status === "error";

  useEffect(() => {
    if (status === "joined") track("waitlist_join", { source });
  }, [status, source]);

  return (
    <div className={clsx("w-full max-w-[30rem]", className)}>
      {done ? (
        <p
          className="flex min-h-[60px] items-center gap-2.5 rounded-xl border border-lime/40 bg-lime/10 px-5 text-[16px] font-semibold text-lime"
          role="status"
        >
          <span
            aria-hidden
            className="grid size-6 shrink-0 place-items-center rounded-full bg-lime text-[13px] text-ink"
          >
            ✓
          </span>
          {status === "joined" ? copy.joined : copy.already}
        </p>
      ) : (
        <form
          noValidate
          action={action}
          className={clsx(
            "flex h-[60px] items-center gap-2 rounded-xl border bg-ink-2 p-1.5 pl-4 transition-[border-color,box-shadow] duration-200",
            failed
              ? "border-hold-red/70"
              : "border-line focus-within:border-lime/70 focus-within:shadow-[0_0_0_4px_rgba(212,255,90,0.12)]",
          )}
        >
          <svg
            aria-hidden
            className="size-[18px] shrink-0 text-mute"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.6"
            viewBox="0 0 24 24"
          >
            <rect height="16" rx="3" width="20" x="2" y="4" />
            <path d="m3 7 9 6 9-6" />
          </svg>
          <label className="sr-only" htmlFor={id}>
            {copy.label}
          </label>
          {/* Autofill paints its own blue background; an inset shadow in the box colour covers it. */}
          <input
            key={state?.email}
            aria-describedby={failed ? `${id}-msg` : undefined}
            aria-invalid={failed || undefined}
            autoComplete="email"
            className="h-full min-w-0 flex-1 bg-transparent text-[16px] text-cream caret-lime outline-none placeholder:text-[#6f6e6a] focus-visible:outline-none autofill:shadow-[inset_0_0_0_1000px_var(--color-ink-2)] autofill:[-webkit-text-fill-color:var(--color-cream)]"
            defaultValue={state?.email}
            id={id}
            inputMode="email"
            maxLength={254}
            name="email"
            placeholder={copy.placeholder}
            type="email"
          />
          {/* Honeypot, hidden from people and assistive tech */}
          <input
            aria-hidden
            autoComplete="off"
            className="hidden"
            name="company"
            tabIndex={-1}
          />
          <input name="locale" type="hidden" value={locale} />
          <input name="source" type="hidden" value={source} />
          <button
            className="h-full shrink-0 rounded-lg bg-lime px-4 text-[15px] font-bold text-ink transition-[background-color,transform] hover:bg-lime-deep active:scale-[0.97] disabled:opacity-60 sm:px-6 sm:text-[16px]"
            disabled={pending}
            type="submit"
          >
            {pending ? copy.sending : copy.button}
          </button>
        </form>
      )}

      {failed ? (
        <p
          className="mt-3 text-[14px] leading-[1.6] text-hold-red"
          id={`${id}-msg`}
          role="alert"
        >
          {status === "invalid" ? copy.invalid : copy.error}
        </p>
      ) : countLabel ? (
        <p className="mt-3.5 flex items-center gap-2.5 text-[14px] text-mute">
          <span aria-hidden className="flex">
            {COUNT_HOLDS.map((color, i) => (
              <span
                key={color}
                className={clsx(
                  "size-[18px] rounded-full border-2 border-ink",
                  i > 0 && "-ml-1.5",
                )}
                style={{ backgroundColor: color }}
              />
            ))}
          </span>
          <span>{countLabel}</span>
        </p>
      ) : null}
    </div>
  );
}
