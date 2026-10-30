"use client";

import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";

import { CountUp } from "./count-up";
import { Card, Tag } from "./ui";

export interface Region {
  key: string;
  /** Tab label, e.g. "台灣". */
  label: string;
  n: number;
  /** Under the big number, e.g. "間全台岩館". */
  caption: string;
  /** Right card heading: cities, or gyms for one-city regions. */
  listTitle: string;
  items: { label: string; href: string; meta: string }[];
  /** Gym names are long: one column, scrolling inside the card. */
  gymList?: boolean;
  cta: { label: string; href: string };
}

/**
 * The homepage gym card: pick a region on the left, its cities (or, for
 * Hong Kong and Singapore, its gyms) show on the right. Taiwan first.
 * Server-rendered with Taiwan selected, so it reads fine without JS.
 */
export function GymRegions({
  regions,
  tag,
  title,
  body,
}: {
  regions: Region[];
  tag: string;
  title: string;
  body: string;
}) {
  const [key, setKey] = useState(regions[0].key);
  const region = regions.find((r) => r.key === key) ?? regions[0];
  const first = key === regions[0].key;

  return (
    <>
      <Card className="reveal flex flex-col p-6 sm:p-8 lg:col-span-7">
        <Tag>{tag}</Tag>
        <p
          key={`n-${region.key}`}
          className={clsx(
            "mt-8 font-display text-[96px] leading-[0.82] tracking-[-0.06em] tabular sm:text-[140px]",
            !first && "rise",
          )}
        >
          {/* Count up once on scroll; later switches just swap in. */}
          {first ? <CountUp value={region.n} /> : region.n}
        </p>
        <p className="mt-2 text-[15px] font-medium text-mute">
          {region.caption}
        </p>

        <div
          aria-label={tag}
          className="mt-5 flex flex-wrap gap-2"
          role="tablist"
        >
          {regions.map((r) => {
            const on = r.key === key;

            return (
              <button
                key={r.key}
                aria-controls="gym-region-panel"
                aria-selected={on}
                className={clsx(
                  "flex h-9 items-center gap-1.5 rounded-full border-2 px-3.5 text-[14px] font-semibold transition-colors",
                  on
                    ? "border-night bg-night text-day"
                    : "border-line bg-ink text-cream hover:border-night",
                )}
                role="tab"
                type="button"
                onClick={() => setKey(r.key)}
              >
                {r.label}
                <span
                  className={clsx(
                    "tabular font-medium",
                    on ? "text-lime" : "text-mute",
                  )}
                >
                  {r.n}
                </span>
              </button>
            );
          })}
        </div>

        <h2 className="mt-10 text-[28px] font-bold leading-tight sm:text-[36px]">
          {title}
        </h2>
        <p className="mt-4 max-w-[32rem] text-[16px] leading-[1.8] text-mute">
          {body}
        </p>
        <Link
          className="btn-brutal mt-8 inline-flex h-12 w-fit items-center rounded-full bg-lime px-6 font-bold text-night"
          href={region.cta.href}
        >
          {region.cta.label}
        </Link>
      </Card>

      <Card
        className="reveal p-6 sm:p-8 lg:col-span-5"
        style={{ ["--i" as string]: 1 }}
        tone="raised"
      >
        <div id="gym-region-panel" role="tabpanel">
          <Tag>{region.listTitle}</Tag>
          <ul
            key={`list-${region.key}`}
            className={clsx(
              "mt-6 grid gap-x-6",
              region.gymList
                ? "max-h-[480px] grid-cols-1 overflow-y-auto pr-2 [scrollbar-width:thin]"
                : "grid-cols-2",
              !first && "rise",
            )}
          >
            {region.items.map((item) => (
              <li key={item.href} className="min-w-0 border-b border-line">
                <Link
                  className="flex items-center justify-between gap-2 py-3 text-[15px] transition-colors hover:text-lime-ink"
                  href={item.href}
                >
                  <span className="truncate">{item.label}</span>
                  <span className="shrink-0 font-mono text-[12px] text-mute tabular">
                    {item.meta}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Card>
    </>
  );
}
