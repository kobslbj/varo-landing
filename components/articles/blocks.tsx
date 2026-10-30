import type { ReactNode } from "react";

import clsx from "clsx";
import Link from "next/link";

import { holdColors } from "@/components/landing/ui";

/** Building blocks for article bodies. Plain p/ul/ol/h3 are styled by `.article-body`. */

/** A solid hold with its bolt hole, the site's bullet and icon. */
export function HoldMark({
  color,
  className,
  shape = 0,
  children,
}: {
  color: string;
  className?: string;
  /** Picks one of a few lopsided outlines, so a column of holds isn't uniform. */
  shape?: number;
  children?: ReactNode;
}) {
  return (
    <span
      aria-hidden
      className={clsx("relative grid shrink-0 place-items-center", className)}
      style={{
        background: color,
        borderRadius: holdShapes[shape % holdShapes.length],
      }}
    >
      {children ?? (
        <span className="size-[18%] min-h-1 min-w-1 rounded-full bg-black/35" />
      )}
    </span>
  );
}

const holdShapes = [
  "46% 54% 42% 58% / 52% 44% 56% 48%",
  "58% 42% 50% 50% / 40% 58% 42% 60%",
  "40% 60% 56% 44% / 56% 46% 54% 44%",
  "52% 48% 44% 56% / 46% 54% 46% 54%",
];

const tones = {
  tip: { label: "小提醒", color: holdColors.green, glyph: "✓" },
  safety: { label: "安全", color: holdColors.orange, glyph: "!" },
  note: { label: "因館而異", color: holdColors.blue, glyph: "?" },
} as const;

/** A hold-marked aside: no box, the hold's colour says what kind it is. */
export function Callout({
  tone = "tip",
  title,
  children,
}: {
  tone?: keyof typeof tones;
  title?: string;
  children: ReactNode;
}) {
  const t = tones[tone];

  return (
    <aside className="not-prose my-10 grid grid-cols-[44px_1fr] gap-4 sm:gap-5">
      <HoldMark
        className="size-11 -rotate-6"
        color={t.color}
        shape={tone.length}
      >
        <span className="font-display text-[20px] leading-none text-night">
          {t.glyph}
        </span>
      </HoldMark>
      <div className="pt-1">
        <p className="text-[17px] font-extrabold leading-snug text-cream">
          <span className="sr-only">{t.label}：</span>
          {title ?? t.label}
        </p>
        <div className="callout-body mt-2 text-[16px] leading-[1.85] text-cream/80">
          {children}
        </div>
      </div>
    </aside>
  );
}

const stepColors = Object.values(holdColors);

/** Numbered steps, each number on a hold, like moves up a route. */
export function Steps({
  items,
}: {
  items: { title: string; body: ReactNode }[];
}) {
  return (
    <ol className="not-prose relative my-8 space-y-6">
      <span
        aria-hidden
        className="absolute bottom-6 left-[19px] top-6 w-px bg-line"
      />
      {items.map((item, i) => (
        <li
          key={item.title}
          className="relative grid grid-cols-[40px_1fr] gap-4"
        >
          <span
            aria-hidden
            className="relative grid size-10 place-items-center rounded-[46%_54%_42%_58%/52%_44%_56%_48%] font-display text-[17px] text-night"
            style={{ background: stepColors[i % stepColors.length] }}
          >
            {i + 1}
          </span>
          <div className="pt-1.5">
            <p className="text-[18px] font-bold leading-snug text-cream">
              <span className="sr-only">步驟 {i + 1}：</span>
              {item.title}
            </p>
            <div className="mt-1.5 text-[16px] leading-[1.85] text-cream/80">
              {item.body}
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}

/** A tick list for things to bring or check, each tick a hold. */
export function Checklist({
  title,
  items,
}: {
  title?: string;
  items: ReactNode[];
}) {
  const colors = Object.values(holdColors);

  return (
    <div className="not-prose my-10 border-t-2 border-lime pt-6">
      {title && (
        <p className="text-[20px] font-extrabold text-cream">{title}</p>
      )}
      <ul
        className={clsx("grid gap-x-8 gap-y-4 sm:grid-cols-2", title && "mt-5")}
      >
        {items.map((item, i) => (
          <li
            key={i}
            className="flex gap-3.5 text-[16px] leading-[1.7] text-cream/85"
          >
            <HoldMark
              className="mt-[3px] size-5"
              color={colors[i % colors.length]}
              shape={i}
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** A comparison table that scrolls sideways on phones instead of squashing. */
export function CompareTable({
  caption,
  head,
  rows,
}: {
  caption: string;
  head: string[];
  rows: ReactNode[][];
}) {
  return (
    <figure className="not-prose my-8">
      <div
        // Focusable so keyboard users can scroll it (a scrollable region is interactive).
        aria-label={caption}
        className="overflow-x-auto rounded-xl border border-line"
        role="region"
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
      >
        <table className="w-full min-w-[36rem] border-collapse text-left text-[15px] leading-[1.6]">
          <caption className="sr-only">{caption}</caption>
          <thead className="bg-ink-2">
            <tr>
              {head.map((h, i) => (
                <th
                  key={h}
                  className={clsx(
                    "border-b border-line px-4 py-3 font-bold",
                    i === 0 ? "text-mute" : "text-cream",
                  )}
                  scope="col"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, r) => (
              <tr key={r} className="border-b border-line last:border-0">
                {row.map((cell, c) =>
                  c === 0 ? (
                    <th
                      key={c}
                      className="whitespace-nowrap px-4 py-3 align-top font-semibold text-mute"
                      scope="row"
                    >
                      {cell}
                    </th>
                  ) : (
                    <td key={c} className="px-4 py-3 align-top text-cream/85">
                      {cell}
                    </td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <figcaption className="mt-2 text-[13px] text-mute sm:hidden">
        ← 左右滑動看完整表格 →
      </figcaption>
    </figure>
  );
}

/** Link to another page on the site, inside article copy. */
export function A({ href, children }: { href: string; children: ReactNode }) {
  return href.startsWith("http") ? (
    <a href={href} rel="noopener noreferrer" target="_blank">
      {children}
    </a>
  ) : (
    <Link href={href}>{children}</Link>
  );
}

/** "問題？副標" titles break after the question mark, so neither half wraps mid-phrase. */
export function TitleLines({ title }: { title: string }) {
  const at = title.indexOf("？");

  if (at < 0 || at === title.length - 1) return <>{title}</>;

  return (
    <>
      <span className="block">{title.slice(0, at + 1)}</span>
      <span className="block">{title.slice(at + 1)}</span>
    </>
  );
}

export type GlossaryTerm = { term: string; zh: string; def: string };

/** Anchor for a term, e.g. "Top out" → "top-out", so a term can be linked to directly. */
export const termId = (term: string) =>
  term
    .split("/")[0]
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** A run of terms: English, the Chinese people say, and a plain explanation. */
export function Glossary({ terms }: { terms: GlossaryTerm[] }) {
  return (
    <dl className="not-prose my-8 divide-y divide-line border-y border-line">
      {terms.map((t) => (
        <div
          key={t.term}
          className="grid scroll-mt-24 gap-1 py-4 sm:grid-cols-[13rem_1fr] sm:gap-6"
          id={termId(t.term)}
        >
          <dt>
            <span className="block text-[17px] font-extrabold text-cream">
              {t.term}
            </span>
            <span className="mt-0.5 block text-[14px] text-lime-ink">
              {t.zh}
            </span>
          </dt>
          <dd className="text-[16px] leading-[1.8] text-cream/80">{t.def}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Things climbers say at the gym, each with its plain meaning underneath. */
export function GymTalk({
  lines,
}: {
  lines: { say: string; means: string }[];
}) {
  return (
    <ul className="not-prose my-8 space-y-5">
      {lines.map((l, i) => (
        <li key={l.say} className={clsx("flex flex-col", i % 2 && "items-end")}>
          <p
            className={clsx(
              "max-w-[85%] rounded-[22px] px-4 py-2.5 text-[16px] font-semibold leading-snug",
              i % 2
                ? "rounded-br-md bg-lime text-night"
                : "rounded-bl-md bg-[#2b2e31] text-cream",
            )}
          >
            「{l.say}」
          </p>
          <p
            className={clsx(
              "mt-2 max-w-[85%] text-[15px] leading-[1.7] text-mute",
              i % 2 ? "pr-2 text-right" : "pl-2",
            )}
          >
            白話：{l.means}
          </p>
        </li>
      ))}
    </ul>
  );
}
