"use client";

import clsx from "clsx";
import { useEffect, useState } from "react";

/** Table of contents that marks the section being read. */
export function Toc({
  items,
  label,
}: {
  items: { id: string; title: string }[];
  label: string;
}) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const headings = items
      .map(({ id }) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    // The last heading above the top ~third of the screen is the one being read.
    const update = () => {
      const line = window.innerHeight * 0.3;
      let current: string | null = null;

      for (const h of headings) {
        if (h.getBoundingClientRect().top <= line) current = h.id;
      }
      setActive(current);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [items]);

  return (
    <nav aria-label={label}>
      <p className="text-[13px] font-bold tracking-[0.08em] text-mute">
        {label}
      </p>
      <ol className="mt-4 space-y-1 border-l border-line">
        {items.map(({ id, title }) => (
          <li key={id}>
            <a
              aria-current={active === id ? "location" : undefined}
              className={clsx(
                "-ml-px block border-l-2 py-1.5 pl-4 text-[14px] leading-snug transition-colors",
                active === id
                  ? "border-lime font-semibold text-cream"
                  : "border-transparent text-mute hover:text-cream",
              )}
              href={`#${id}`}
            >
              {title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
