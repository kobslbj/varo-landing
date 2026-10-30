"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A number that counts up from 0 the first time it scrolls into view.
 * The server renders the final value, so it's correct without JS, for
 * crawlers, and with reduced motion.
 */
export function CountUp({
  value,
  duration = 1100,
}: {
  value: number;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    const el = ref.current;

    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    // Only animate numbers that start below the fold; one already on screen stays put.
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    setShown(0);
    let frame = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const step = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          // Ease out, so it lands softly on the value.
          const eased = 1 - Math.pow(1 - t, 4);

          setShown(Math.round(value * eased));
          if (t < 1) frame = requestAnimationFrame(step);
        };

        frame = requestAnimationFrame(step);
      },
      { threshold: 0.6 },
    );

    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, duration]);

  return (
    <span ref={ref} aria-label={String(value)}>
      <span aria-hidden>{shown}</span>
    </span>
  );
}
