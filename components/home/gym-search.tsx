"use client";

import { useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";

export interface SearchGym {
  name: string;
  /** "台北市 · 中山區" */
  place: string;
  href: string;
  /** Has routes and beta on VARO. */
  routes: boolean;
}

/**
 * Type a gym or city, jump to its page. Gyms with routes in VARO come first
 * and are what shows before typing. Plain filtering, no index: the whole
 * directory is a couple hundred names.
 */
export function GymSearch({
  gyms,
  labels,
  allHref,
}: {
  gyms: SearchGym[];
  labels: { label: string; placeholder: string; empty: string; routes: string };
  allHref: string;
}) {
  const router = useRouter();
  const id = useId();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const box = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase().replace(/[臺]/g, "台");

    if (!needle) return gyms.filter((g) => g.routes).slice(0, 5);

    return gyms
      .filter((g) =>
        `${g.name} ${g.place}`
          .toLowerCase()
          .replace(/[臺]/g, "台")
          .includes(needle),
      )
      .sort((a, b) => Number(b.routes) - Number(a.routes))
      .slice(0, 7);
  }, [gyms, q]);

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <div
      ref={box}
      className="relative w-full"
      onBlur={(e) => {
        if (!box.current?.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <label className="sr-only" htmlFor={`${id}-q`}>
        {labels.label}
      </label>
      <div className="flex h-14 items-center gap-3 rounded-full border border-line bg-ink-2 pl-5 pr-2 shadow-[0_8px_30px_-12px_rgb(0_0_0/0.18)] transition-shadow focus-within:border-cream/30 focus-within:shadow-[0_12px_36px_-12px_rgb(0_0_0/0.28)] sm:h-16">
        <svg
          aria-hidden
          className="size-5 shrink-0 text-mute"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          aria-activedescendant={
            open && results[active] ? `${id}-${active}` : undefined
          }
          aria-autocomplete="list"
          aria-controls={`${id}-list`}
          aria-expanded={open}
          autoComplete="off"
          className="h-full min-w-0 flex-1 bg-transparent text-[16px] outline-none placeholder:text-mute/80 sm:text-[17px]"
          id={`${id}-q`}
          placeholder={labels.placeholder}
          role="combobox"
          type="search"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setActive(0);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
              setActive((a) => Math.min(a + 1, results.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((a) => Math.max(a - 1, 0));
            } else if (e.key === "Enter") {
              e.preventDefault();
              go(results[active]?.href ?? allHref);
            } else if (e.key === "Escape") {
              setOpen(false);
            }
          }}
        />
        <button
          aria-label={labels.label}
          className="grid size-10 shrink-0 place-items-center rounded-full bg-lime text-night transition-transform active:scale-95 sm:size-12"
          type="button"
          onClick={() => go(results[active]?.href ?? allHref)}
        >
          <svg
            aria-hidden
            className="size-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            viewBox="0 0 24 24"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
      </div>

      {open ? (
        <ul
          className="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-line bg-ink-2 p-1.5 text-left shadow-[0_20px_50px_-20px_rgb(0_0_0/0.35)]"
          id={`${id}-list`}
          role="listbox"
        >
          {results.length ? (
            results.map((g, i) => (
              <li
                key={g.href}
                aria-selected={i === active}
                id={`${id}-${i}`}
                role="option"
              >
                <Link
                  className={clsx(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors",
                    i === active ? "bg-ink-3" : "hover:bg-ink-3",
                  )}
                  href={g.href}
                  onClick={() => setOpen(false)}
                  onMouseEnter={() => setActive(i)}
                >
                  <span
                    aria-hidden
                    className={clsx(
                      "size-2.5 shrink-0 rounded-full",
                      g.routes ? "bg-lime ring-2 ring-lime/30" : "bg-line",
                    )}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[15px] font-semibold">
                      {g.name}
                    </span>
                    <span className="block truncate text-[12px] text-mute">
                      {g.place}
                    </span>
                  </span>
                  {g.routes ? (
                    <span className="shrink-0 rounded-full bg-lime/25 px-2 py-0.5 text-[11px] font-bold text-lime-ink">
                      {labels.routes}
                    </span>
                  ) : null}
                </Link>
              </li>
            ))
          ) : (
            <li>
              <Link
                className="block rounded-xl px-3 py-3 text-[14px] text-mute hover:bg-ink-3"
                href={allHref}
              >
                {labels.empty}
              </Link>
            </li>
          )}
        </ul>
      ) : null}
    </div>
  );
}
