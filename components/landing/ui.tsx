import type { ReactNode } from "react";

import clsx from "clsx";
import { buttonVariants } from "@heroui/styles";

export function Container({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={clsx(
        "mx-auto w-full max-w-[1240px] px-4 sm:px-6 lg:px-8",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Small "this is illustrative" label used on every mock UI / dataset. */
export function DemoLabel({
  children,
  tone = "dark",
}: {
  children: ReactNode;
  tone?: "dark" | "paper";
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] font-medium",
        tone === "dark"
          ? "border-line text-mute"
          : "border-paper-line text-mute-ink",
      )}
    >
      <svg aria-hidden className="size-3" fill="none" viewBox="0 0 12 12">
        <circle cx="6" cy="6" r="5" stroke="currentColor" />
        <path
          d="M6 5.4v3M6 3.4v.2"
          stroke="currentColor"
          strokeLinecap="round"
        />
      </svg>
      {children}
    </span>
  );
}

export const holdColors = {
  red: "#E5484D",
  orange: "#F2994A",
  yellow: "#F5D90A",
  green: "#30A46C",
  blue: "#3E8BFF",
  purple: "#8E4EC6",
} as const;

export type HoldColor = keyof typeof holdColors;

export function HoldDot({
  color,
  className,
}: {
  color: HoldColor;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={clsx(
        "inline-block shrink-0 rounded-full ring-2 ring-black/40",
        className,
      )}
      style={{ backgroundColor: holdColors[color] }}
    />
  );
}

/** Link styled as a HeroUI button. External links open in a new tab. */
export function CtaLink({
  href,
  children,
  variant = "primary",
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "outline";
  className?: string;
}) {
  const external = href.startsWith("http");

  return (
    <a
      className={buttonVariants({
        variant: variant === "primary" ? "primary" : "tertiary",
        size: "lg",
        className: clsx(
          "h-13 rounded-lg px-7 text-[16px] font-semibold",
          variant === "outline" &&
            "border border-line bg-transparent text-cream hover:bg-ink-2",
          className,
        ),
      })}
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}
