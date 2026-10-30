import type { ArticleCover as Cover, CoverArtKind } from "@/lib/articles/types";
import type { ReactNode } from "react";

import clsx from "clsx";
import Image from "next/image";

import { HOLD_ART, Hold, type HoldKind, Tape } from "./diagrams";

import { holdColors as R } from "@/components/landing/ui";

/**
 * Drawn covers for articles without a photo of their own. Drawn on a 900×1125
 * (4:5) canvas and cropped like `object-cover`, so everything that matters sits
 * in the middle band (about y 260–860) that survives the 4:3 and 16:10 crops.
 */

const W = 900;
const H = 1125;
const LIME = "#C6FF00";

function Wall({ id, children }: { id: string; children: ReactNode }) {
  return (
    <>
      <defs>
        <pattern height="44" id={id} patternUnits="userSpaceOnUse" width="44">
          <circle cx="22" cy="22" fill="#2e2e2e" r="2.6" />
        </pattern>
        <radialGradient cx="70%" cy="35%" id={`${id}-glow`} r="70%">
          <stop offset="0" stopColor="#26301a" />
          <stop offset="1" stopColor="#141516" />
        </radialGradient>
      </defs>
      <rect fill={`url(#${id}-glow)`} height={H} width={W} />
      <rect fill={`url(#${id})`} height={H} width={W} />
      {children}
    </>
  );
}

/** A blue route read from the floor: start and top taped, the line traced in lime. */
function RoutesArt() {
  const route = [
    { x: 330, y: 860, r: 46 },
    { x: 470, y: 800, r: 40 },
    { x: 400, y: 680, r: 42 },
    { x: 560, y: 590, r: 44 },
    { x: 430, y: 480, r: 40 },
    { x: 540, y: 380, r: 42 },
    { x: 450, y: 270, r: 52 },
  ];

  return (
    <Wall id="cv-routes">
      <path d="M600,520 L790,470 L770,700 L620,680 Z" fill="#30343a" />
      <path d="M600,520 L790,470 L720,580 Z" fill="#3a3f45" />
      {[
        [R.red, 150, 300, 40, 1],
        [R.yellow, 760, 250, 34, 2],
        [R.green, 160, 620, 38, 0],
        [R.purple, 250, 470, 30, 2],
        [R.red, 740, 860, 42, 0],
        [R.yellow, 200, 960, 36, 1],
        [R.green, 700, 120, 32, 1],
        [R.purple, 120, 150, 28, 0],
        [R.orange, 820, 1000, 34, 2],
      ].map(([c, x, y, r, sh], i) => (
        <Hold
          key={i}
          color={c as string}
          r={r as number}
          rot={i * 37}
          shape={sh as number}
          x={x as number}
          y={y as number}
        />
      ))}
      <polyline
        fill="none"
        points={route.map((p) => `${p.x},${p.y}`).join(" ")}
        stroke={LIME}
        strokeDasharray="4 18"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="8"
      />
      {route.map((p, i) => (
        <Hold
          key={i}
          color={R.blue}
          r={p.r}
          rot={i * 29 - 40}
          shape={i}
          x={p.x}
          y={p.y}
        />
      ))}
      <g transform="translate(330 914) scale(2.6)">
        <Tape x={0} y={0} />
      </g>
      <g transform="translate(450 332) scale(2.6)">
        <Tape x={0} y={0} />
      </g>
    </Wall>
  );
}

/** Holds climbing a staircase from V0 to V5. */
function GradesArt() {
  const steps = [
    { v: "V0", c: R.green },
    { v: "V1", c: R.yellow },
    { v: "V2", c: R.orange },
    { v: "V3", c: R.red },
    { v: "V4", c: R.purple },
    { v: "V5", c: "#0b0c0d" },
  ];

  return (
    <Wall id="cv-grades">
      {steps.map((s, i) => {
        const x = 110 + i * 120;
        const top = 820 - i * 92;

        return (
          <g key={s.v}>
            <rect
              fill="#242424"
              height={H - top}
              rx="18"
              width="104"
              x={x}
              y={top}
            />
            <Hold
              color={s.c}
              r={44}
              rot={i * 33 - 30}
              shape={i}
              x={x + 52}
              y={top - 58}
            />
            {s.c === "#0b0c0d" && (
              <circle
                cx={x + 52}
                cy={top - 58}
                fill="none"
                r="48"
                stroke="#3a3e44"
                strokeWidth="4"
              />
            )}
            <text
              fill="#F5F5F5"
              fontSize="44"
              fontWeight="900"
              textAnchor="middle"
              x={x + 52}
              y={top + 62}
            >
              {s.v}
            </text>
          </g>
        );
      })}
    </Wall>
  );
}

/** Climbers talking: beta, send, project. */
function TermsArt() {
  const bubbles: { text: string; me: boolean; y: number }[] = [
    { text: "這條 beta 是？", me: false, y: 440 },
    { text: "先 flag 再並手", me: true, y: 560 },
    { text: "我的 project 卡在 crux", me: false, y: 680 },
    { text: "Send！", me: true, y: 800 },
  ];

  return (
    <Wall id="cv-terms">
      <Hold color={R.red} r={46} rot={20} shape={1} x={560} y={300} />
      <Hold color={R.blue} r={40} rot={-30} x={780} y={900} />
      <Hold color={R.yellow} r={34} rot={50} shape={2} x={760} y={180} />
      <Hold color={R.green} r={38} rot={10} x={140} y={930} />
      {bubbles.map((b) => {
        const w =
          70 +
          Array.from(b.text).reduce(
            (n, ch) => n + (ch.charCodeAt(0) > 255 ? 54 : 30),
            0,
          );
        const x = b.me ? W - 90 - w : 90;

        return (
          <g key={b.text}>
            <rect
              fill={b.me ? LIME : "#2b2e31"}
              height="100"
              rx="50"
              width={w}
              x={x}
              y={b.y - 50}
            />
            <rect
              fill={b.me ? LIME : "#2b2e31"}
              height="40"
              width="40"
              x={b.me ? x + w - 40 : x}
              y={b.y + 12}
            />
            <text
              dominantBaseline="central"
              fill={b.me ? "#111111" : "#F5F5F5"}
              fontSize="52"
              fontWeight="800"
              x={x + 35}
              y={b.y + 2}
            >
              {b.text}
            </text>
          </g>
        );
      })}
    </Wall>
  );
}

/** A catalogue of hold shapes, three by three. */
function HoldsArt() {
  const kinds: HoldKind[] = [
    "jug",
    "crimp",
    "sloper",
    "pinch",
    "pocket",
    "undercling",
    "sidepull",
    "gaston",
    "edge",
  ];

  return (
    <Wall id="cv-holds">
      {kinds.map((k, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const x = 60 + col * 270;
        const y = 250 + row * 215;

        return (
          <g key={k} transform={`translate(${x} ${y})`}>
            <rect fill="#16181a" height="200" rx="28" width="250" />
            <g transform="translate(5 0) scale(2)">{HOLD_ART[k]}</g>
          </g>
        );
      })}
    </Wall>
  );
}

const ART: Record<CoverArtKind, () => ReactNode> = {
  routes: RoutesArt,
  grades: GradesArt,
  terms: TermsArt,
  holds: HoldsArt,
};

/**
 * An article's cover inside a positioned box: the photo with `fill`, or the
 * drawing scaled to cover the box the same way.
 */
export function ArticleCover({
  cover,
  sizes,
  priority,
  className,
}: {
  cover: Cover;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  if ("art" in cover) {
    const Art = ART[cover.art];

    return (
      <svg
        aria-label={cover.alt}
        className={clsx("absolute inset-0 size-full", className)}
        preserveAspectRatio="xMidYMid slice"
        role="img"
        viewBox={`0 0 ${W} ${H}`}
      >
        <Art />
      </svg>
    );
  }

  return (
    <Image
      fill
      alt={cover.alt}
      className={clsx("object-cover", className)}
      priority={priority}
      sizes={sizes}
      src={cover.src}
    />
  );
}
