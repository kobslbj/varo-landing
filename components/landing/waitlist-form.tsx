"use client";

import type { Dictionary, Locale } from "@/lib/i18n";

import { useActionState, useId } from "react";
import clsx from "clsx";
import { toast } from "@heroui/react";
import { track } from "@vercel/analytics";

import { holdColors } from "./ui";

import { joinWaitlist, type WaitlistState } from "@/lib/waitlist";

/** Little holds stacked like avatars next to the signup count: lopsided, with a bolt hole. */
const COUNT_HOLDS = [
  {
    color: holdColors.red,
    radius: "46% 54% 38% 62% / 52% 44% 56% 48%",
    rot: -14,
  },
  {
    color: holdColors.yellow,
    radius: "58% 42% 50% 50% / 40% 58% 42% 60%",
    rot: 18,
  },
  {
    color: holdColors.blue,
    radius: "40% 60% 56% 44% / 56% 46% 54% 44%",
    rot: -6,
  },
];

/**
 * Email field and button in one box, shown while the app isn't on the App
 * Store yet. Every result gets a toast; a bad address is also explained under
 * the field. The browser's own validation bubble is off (`noValidate`).
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
  source: "hero" | "closing" | "gyms" | "articles";
  /** e.g. "已有 42 位岩友加入"; hidden when the count is unknown or 0. */
  countLabel: string | null;
  className?: string;
}) {
  // Toast right when the server answers, once per submit.
  const [state, action, pending] = useActionState(
    async (prev: WaitlistState, form: FormData) => {
      const next = await joinWaitlist(prev, form);

      if (next && next.status !== "idle") {
        const { title, body } = copy.toast[next.status];
        const show =
          next.status === "joined"
            ? toast.success
            : next.status === "already"
              ? toast.info
              : toast.danger;

        show(title, { description: body });
        if (next.status === "joined") track("waitlist_join", { source });
      }

      return next;
    },
    undefined,
  );
  const id = useId();
  const status = state?.status ?? "idle";
  const done = status === "joined" || status === "already";
  const failed = status === "invalid" || status === "error";

  return (
    <div className={clsx("w-full max-w-[30rem]", className)}>
      {done ? (
        <p
          className="flex min-h-[60px] items-center gap-2.5 rounded-xl border border-line bg-ink-2 px-5 text-[16px] font-semibold text-cream"
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
            "flex h-[60px] items-center gap-2 rounded-xl border bg-ink-2 p-1.5 pl-4 transition-[border-color] duration-200",
            failed ? "border-hold-red" : "border-line focus-within:border-lime",
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
            aria-describedby={status === "invalid" ? `${id}-msg` : undefined}
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

      {status === "invalid" ? (
        <p
          className="mt-3 text-[14px] leading-[1.6] text-hold-red"
          id={`${id}-msg`}
          role="alert"
        >
          {copy.invalid}
        </p>
      ) : countLabel ? (
        <p className="mt-3.5 flex items-center gap-2.5 text-[14px] text-mute">
          <span aria-hidden className="flex">
            {COUNT_HOLDS.map((hold, i) => (
              <span
                key={hold.color}
                className={clsx(
                  "grid h-[18px] w-[22px] place-items-center ring-2 ring-ink",
                  i > 0 && "-ml-1",
                )}
                style={{
                  backgroundColor: hold.color,
                  borderRadius: hold.radius,
                  transform: `rotate(${hold.rot}deg)`,
                }}
              >
                <span className="size-[3px] rounded-full bg-black/35" />
              </span>
            ))}
          </span>
          <span>{countLabel}</span>
        </p>
      ) : null}
    </div>
  );
}
