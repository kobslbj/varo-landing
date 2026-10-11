import type { CSSProperties } from "react";

import { holdColors } from "./ui";

/**
 * The app splash's little route: rounded, lopsided holds with a bolt hole.
 * x/y are offsets in px from the route's anchor (y grows downward).
 */
export const ROUTE = [
  {
    x: -64,
    y: 300,
    size: 34,
    color: holdColors.red,
    rot: -18,
    r: [16, 22, 10, 18],
  },
  {
    x: 58,
    y: 236,
    size: 28,
    color: holdColors.yellow,
    rot: 24,
    r: [12, 18, 16, 8],
  },
  {
    x: -44,
    y: 172,
    size: 30,
    color: holdColors.blue,
    rot: 8,
    r: [18, 10, 20, 12],
  },
  {
    x: 40,
    y: 110,
    size: 24,
    color: holdColors.green,
    rot: -30,
    r: [10, 16, 12, 18],
  },
  { x: -14, y: 58, size: 22, color: "#D4FF5A", rot: 12, r: [14, 10, 16, 12] },
] as const;

export type Hold = (typeof ROUTE)[number];

export function HoldShape({
  hold,
  scale = 1,
  style,
  className,
}: {
  hold: Hold;
  scale?: number;
  style?: CSSProperties;
  className?: string;
}) {
  const [tl, tr, br, bl] = hold.r;
  const size = hold.size * scale;

  return (
    <span
      aria-hidden
      className={className}
      style={{
        position: "absolute",
        width: size,
        height: size * 0.82,
        background: hold.color,
        borderRadius: `${tl * scale}px ${tr * scale}px ${br * scale}px ${bl * scale}px`,
        transform: `translate(-50%, -50%) rotate(${hold.rot}deg)`,
        display: "grid",
        placeItems: "center",
        ...style,
      }}
    >
      <span
        style={{
          width: Math.max(3, 4 * scale),
          height: Math.max(3, 4 * scale),
          borderRadius: 999,
          background: "rgba(0,0,0,0.35)",
        }}
      />
    </span>
  );
}

/**
 * Decorative route climbing up behind the phones: holds pop in one by one
 * (like the app's splash), then drift gently. Hidden from assistive tech.
 */
export function FloatingRoute() {
  const holds = [
    { ...ROUTE[0], left: "6%", top: "86%", s: 2.1 },
    { ...ROUTE[1], left: "92%", top: "70%", s: 1.9 },
    { ...ROUTE[2], left: "2%", top: "44%", s: 1.8 },
    { ...ROUTE[3], left: "95%", top: "24%", s: 1.7 },
    { ...ROUTE[4], left: "30%", top: "4%", s: 1.6 },
  ];

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {holds.map((h, i) => (
        <span
          key={i}
          className="hold-pop absolute"
          style={{
            left: h.left,
            top: h.top,
            ["--pop-delay" as string]: `${260 + i * 140}ms`,
          }}
        >
          <span
            className="hold-drift block"
            style={{ ["--drift-delay" as string]: `${i * -0.9}s` }}
          >
            <HoldShape
              hold={h}
              scale={h.s}
              style={{ position: "relative", transform: `rotate(${h.rot}deg)` }}
            />
          </span>
        </span>
      ))}
      {/* a little chalk */}
      {[
        [18, 30, 5],
        [84, 50, 4],
        [12, 64, 3],
        [70, 12, 4],
        [50, 94, 3],
      ].map(([x, y, r], i) => (
        <span
          key={`c${i}`}
          className="absolute rounded-full bg-white/50 blur-[1px]"
          style={{ left: `${x}%`, top: `${y}%`, width: r, height: r }}
        />
      ))}
    </div>
  );
}
