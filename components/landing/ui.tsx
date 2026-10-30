import type { CSSProperties, ReactNode } from "react";

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

/** A bento tile: rounded, flat, with a hairline border. */
export function Card({
  className,
  children,
  tone = "dark",
  style,
}: {
  className?: string;
  children: ReactNode;
  tone?: "dark" | "raised" | "lime";
  style?: CSSProperties;
}) {
  return (
    <div
      className={clsx(
        "relative overflow-hidden rounded-[var(--radius-card)] lg:rounded-[var(--radius-card-lg)]",
        tone === "dark" && "border-2 border-edge bg-ink-2",
        tone === "raised" && "border-2 border-edge bg-ink-3",
        tone === "lime" && "on-paper border-2 border-night bg-lime text-night",
        className,
      )}
      style={style}
    >
      {children}
    </div>
  );
}

/**
 * Index label in the top corner of a tile, e.g. "01 — 邊爬邊記".
 * Extra-wide caps, like a game HUD.
 */
export function Tag({
  index,
  children,
  className,
}: {
  index?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={clsx(
        "label-wide flex items-center gap-2 text-[11px] opacity-75 sm:text-[12px]",
        className,
      )}
    >
      {index && <span className="tabular">{index}</span>}
      {index && <span aria-hidden className="h-px w-5 bg-current opacity-50" />}
      <span>{children}</span>
    </p>
  );
}

/**
 * A square-cornered sticker for short facts, e.g. "iOS · 繁中 / EN".
 * Solid or outlined.
 */
export function Chip({
  children,
  outline,
}: {
  children: ReactNode;
  outline?: boolean;
}) {
  return (
    <span
      className={clsx(
        "inline-flex h-9 items-center rounded-[6px] px-3 text-[14px] font-semibold",
        outline ? "border-2 border-cream/80 text-cream" : "bg-cream text-ink",
      )}
    >
      {children}
    </span>
  );
}

/** Small "this is illustrative" label used on every mock UI / dataset. */
export function DemoLabel({
  children,
  tone = "dark",
}: {
  children: ReactNode;
  tone?: "dark" | "paper" | "photo";
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] font-medium",
        tone === "dark" && "border-line text-mute",
        tone === "paper" && "border-paper-line text-mute-ink",
        tone === "photo" && "border-night bg-night text-white",
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
  /** "dark": black with lime text, for lime backgrounds. */
  variant?: "primary" | "outline" | "dark";
  className?: string;
}) {
  const external = href.startsWith("http");

  return (
    <a
      className={buttonVariants({
        variant: variant === "outline" ? "tertiary" : "primary",
        size: "lg",
        className: clsx(
          "btn-brutal h-13 rounded-full px-7 text-[16px] font-bold",
          variant === "outline" &&
            "border border-line bg-transparent text-cream hover:bg-ink-2",
          variant === "dark" && "bg-night text-lime hover:bg-night",
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
