"use client";

import { type ReactNode, useLayoutEffect, useRef, useState } from "react";

/**
 * Lays the app screen out at a fixed design width and scales it to whatever
 * size the phone mockup ends up being, so the preview looks like a shrunken
 * screenshot on small screens instead of re-wrapping its text.
 */
export function ScaledScreen({
  children,
  designWidth = 268,
}: {
  children: ReactNode;
  designWidth?: number;
}) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);

  useLayoutEffect(() => {
    const el = box.current;

    if (!el) return;
    const measure = () => setScale(el.clientWidth / designWidth);

    measure();
    const ro = new ResizeObserver(measure);

    ro.observe(el);

    return () => ro.disconnect();
  }, [designWidth]);

  return (
    <div ref={box} className="absolute inset-0 overflow-hidden">
      <div
        style={{
          width: designWidth,
          height: (designWidth * 19.5) / 9,
          transform: `scale(${scale ?? 1})`,
          transformOrigin: "top left",
          // Hidden until measured, so it never flashes at the wrong size.
          opacity: scale === null ? 0 : 1,
          transition: "opacity 200ms",
        }}
      >
        {children}
      </div>
    </div>
  );
}
