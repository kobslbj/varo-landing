import type { ReactNode } from "react";

import Image from "next/image";

import { holdColors } from "@/components/landing/ui";
import { BLOBS } from "@/lib/gyms/hold-style";

/**
 * Explainer drawings for the route-knowledge articles. The pictures are SVG;
 * every label is HTML beside or under them, so it stays readable on phones and
 * to screen readers.
 */

const WALL = "#1a1a1a";
const VOLUME = "#30343a";

function Figure({
  caption,
  children,
}: {
  caption: string;
  children: ReactNode;
}) {
  return (
    <figure className="not-prose my-10">
      {children}
      <figcaption className="mt-3 text-[14px] leading-[1.7] text-mute">
        {caption}
      </figcaption>
    </figure>
  );
}

/** A hold on the drawing, at (x, y) with radius r in viewBox units. */
export function Hold({
  x,
  y,
  r,
  color,
  rot = 0,
  shape = 0,
}: {
  x: number;
  y: number;
  r: number;
  color: string;
  rot?: number;
  shape?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${r}) rotate(${rot})`}>
      <path d={BLOBS[shape % BLOBS.length]} fill={color} />
      <circle cx=".18" cy="-.12" fill="rgba(0,0,0,.35)" r=".2" />
    </g>
  );
}

/** Numbered marker pointing at a feature; the legend explains each number. */
function Marker({ x, y, n }: { x: number; y: number; n: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle fill="#C6FF00" r="13" stroke={WALL} strokeWidth="3" />
      <text
        dominantBaseline="central"
        fill="#111111"
        fontSize="15"
        fontWeight="800"
        textAnchor="middle"
      >
        {n}
      </text>
    </g>
  );
}

/** Start/top tape: a short strip of white tape under a hold. */
export function Tape({
  x,
  y,
  rot = 0,
}: {
  x: number;
  y: number;
  rot?: number;
}) {
  return (
    <rect
      fill="#F5F5F5"
      height="7"
      rx="1.5"
      transform={`rotate(${rot} ${x} ${y})`}
      width="26"
      x={x - 13}
      y={y - 3.5}
    />
  );
}

/** Bolt-hole dots, as on a real wall panel. */
function BoltGrid({ id }: { id: string }) {
  return (
    <defs>
      <pattern height="28" id={id} patternUnits="userSpaceOnUse" width="28">
        <circle cx="14" cy="14" fill="#2e2e2e" r="1.6" />
      </pattern>
    </defs>
  );
}

const R = holdColors;

/** One blue route among other colours, with start, top, a volume and a foothold marked. */
export function RouteAnatomy() {
  const blue = R.blue;
  const legend: { title: string; body: string }[] = [
    { title: "終點（Top）", body: "最上面貼膠帶的點，雙手一起抓穩才算完攀。" },
    { title: "同色岩點", body: "這條路線只能用藍色的點，其他顏色是別的路線。" },
    {
      title: "地形點（Volume）",
      body: "鎖在牆上的大型造型。能不能踩、上面別色的點能不能用，各館不同，先問館員。",
    },
    {
      title: "腳點",
      body: "小顆的同色點，通常拿來踩。除非標示只能踩（feet only），手也能用。",
    },
    {
      title: "起點（Start）",
      body: "依膠帶或標示放好手，雙腳離地、身體穩住，才算開始。",
    },
  ];

  return (
    <Figure caption="示意圖，不代表任何一間館的規定。常見做法是同一個顏色為同一條路線；膠帶貼法、地形點和牆面能不能用，以各館說明為準。">
      <div className="grid gap-6 rounded-[24px] border border-line bg-ink-2 p-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,15rem)] sm:p-6">
        <svg
          aria-label="抱石路線示意圖：藍色路線從貼膠帶的起點往上，經過地形點，到貼膠帶的終點"
          className="w-full"
          role="img"
          viewBox="0 0 360 480"
        >
          <BoltGrid id="bolts-route" />
          <rect fill={WALL} height="480" rx="14" width="360" />
          <rect fill="url(#bolts-route)" height="480" rx="14" width="360" />
          {/* Volume */}
          <path d="M236,236 L338,214 L330,330 L244,318 Z" fill={VOLUME} />
          <path d="M236,236 L338,214 L300,262 Z" fill="#3a3f45" />

          {/* Other routes */}
          <Hold color={R.red} r={15} rot={20} shape={1} x={300} y={420} />
          <Hold color={R.red} r={12} rot={-30} x={70} y={318} />
          <Hold color={R.red} r={13} rot={40} shape={2} x={318} y={150} />
          <Hold color={R.yellow} r={14} rot={10} shape={2} x={262} y={456} />
          <Hold color={R.yellow} r={12} rot={-20} shape={1} x={58} y={214} />
          <Hold color={R.yellow} r={11} rot={30} x={300} y={70} />
          <Hold color={R.green} r={12} rot={60} x={108} y={104} />
          <Hold color={R.green} r={13} rot={-10} shape={1} x={328} y={378} />
          <Hold color={R.purple} r={11} rot={15} shape={2} x={160} y={236} />
          <Hold color={R.purple} r={10} rot={-40} x={42} y={430} />

          {/* The blue route, bottom to top */}
          <Hold color={blue} r={8} rot={10} shape={2} x={96} y={460} />
          <Hold color={blue} r={16} rot={-15} x={120} y={404} />
          <Tape rot={-8} x={120} y={428} />
          <Hold color={blue} r={15} rot={20} shape={1} x={176} y={410} />
          <Tape rot={6} x={176} y={433} />
          <Hold color={blue} r={8} rot={-30} shape={1} x={232} y={392} />
          <Hold color={blue} r={14} rot={25} shape={2} x={206} y={330} />
          <Hold color={blue} r={13} rot={-20} x={284} y={262} />
          <Hold color={blue} r={15} rot={5} shape={1} x={196} y={196} />
          <Hold color={blue} r={13} rot={-35} shape={2} x={248} y={130} />
          <Hold color={blue} r={17} rot={12} x={196} y={62} />
          <Tape rot={-4} x={196} y={88} />

          <Marker n={1} x={160} y={40} />
          <Marker n={2} x={282} y={112} />
          <Marker n={3} x={312} y={292} />
          <Marker n={4} x={262} y={404} />
          <Marker n={5} x={70} y={392} />
        </svg>
        <ol className="space-y-4 self-center">
          {legend.map((item, i) => (
            <li key={item.title} className="grid grid-cols-[26px_1fr] gap-3">
              <span className="grid size-[26px] place-items-center rounded-full bg-lime text-[14px] font-extrabold text-night">
                {i + 1}
              </span>
              <span>
                <span className="block text-[15px] font-bold text-cream">
                  {item.title}
                </span>
                <span className="mt-0.5 block text-[14px] leading-[1.7] text-mute">
                  {item.body}
                </span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </Figure>
  );
}

/** Three common ways a start is marked. */
export function StartTypes() {
  const panels: { title: string; body: string; art: ReactNode }[] = [
    {
      title: "雙手同一點",
      body: "例如：一顆起點，兩隻手一起放上去。",
      art: (
        <>
          <Hold color={R.blue} r={22} rot={-10} x={80} y={70} />
          <Tape x={80} y={102} />
          <Hold color={R.blue} r={8} shape={2} x={50} y={140} />
        </>
      ),
    },
    {
      title: "雙手分開",
      body: "例如：兩顆起點，一手一顆。",
      art: (
        <>
          <Hold color={R.blue} r={17} rot={15} shape={1} x={52} y={74} />
          <Tape rot={-8} x={52} y={100} />
          <Hold color={R.blue} r={17} rot={-20} x={112} y={66} />
          <Tape rot={6} x={112} y={92} />
          <Hold color={R.blue} r={8} shape={2} x={80} y={140} />
        </>
      ),
    },
    {
      title: "坐姿起攀（SDS）",
      body: "起點很低，坐在墊子上起手，屁股離墊才開始。",
      art: (
        <>
          <Hold color={R.blue} r={17} rot={8} x={80} y={124} />
          <Tape x={80} y={150} />
          <rect fill="#2a2d31" height="12" rx="4" width="160" y="160" />
        </>
      ),
    },
  ];

  return (
    <Figure caption="示意圖：三種常見的起手方式。膠帶數量不一定等於手的數量，有些館會寫 S、左右手符號或文字，看不懂就問館員。">
      <ul className="grid gap-3 sm:grid-cols-3">
        {panels.map((p) => (
          <li
            key={p.title}
            className="overflow-hidden rounded-[20px] border border-line bg-ink-2"
          >
            <svg aria-hidden className="block w-full" viewBox="0 0 160 172">
              <rect fill={WALL} height="172" width="160" />
              {p.art}
            </svg>
            <div className="px-4 pb-4 pt-3">
              <p className="text-[15px] font-bold text-cream">{p.title}</p>
              <p className="mt-1 text-[14px] leading-[1.65] text-mute">
                {p.body}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </Figure>
  );
}

/** An example colour circuit. Explicitly an example: every gym sets its own. */
export function ColorCircuit({
  steps,
}: {
  steps: { name: string; color: string; range: string; dark?: boolean }[];
}) {
  return (
    <Figure caption="示意：一種色帶排法的例子，不是任何一間館的規定。台灣沒有通用的顏色順序，「白色最簡單、黑色最難」也不是通則，請看館內的難度表。">
      <ol className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {steps.map((s, i) => (
          <li
            key={s.name}
            className="flex flex-col items-center rounded-[20px] border border-line bg-ink-2 px-3 pb-4 pt-5 text-center"
          >
            <svg aria-hidden className="size-14" viewBox="-1.3 -1.3 2.6 2.6">
              <path
                d={BLOBS[i % BLOBS.length]}
                fill={s.color}
                stroke={s.dark ? "#3a3e44" : "none"}
                strokeWidth=".08"
                transform={`rotate(${((i * 37) % 60) - 30})`}
              />
              <circle cx=".18" cy="-.12" fill="rgba(0,0,0,.35)" r=".2" />
            </svg>
            <span className="mt-3 text-[15px] font-bold text-cream">
              {s.name}
            </span>
            <span className="mt-0.5 text-[14px] tabular text-mute">
              {s.range}
            </span>
          </li>
        ))}
      </ol>
      <div className="mt-3 flex items-center gap-3 text-[13px] text-mute">
        <span>簡單</span>
        <span className="h-px flex-1 bg-gradient-to-r from-line to-lime" />
        <span>困難</span>
      </div>
    </Figure>
  );
}

/**
 * Side views of four walls. The climber stands on the right; the dashed line
 * is vertical, and the arc shows how far the wall leans back or out from it.
 */
export function WallAngles() {
  const walls: {
    name: string;
    zh: string;
    lean: number;
    label: string;
    note: string;
  }[] = [
    {
      name: "Slab",
      zh: "俯角牆",
      lean: -20,
      label: "後倒",
      note: "牆往後倒，比垂直還「躺」。靠腳和重心。",
    },
    {
      name: "Vertical",
      zh: "垂直牆",
      lean: 0,
      label: "垂直",
      note: "跟地面垂直，最接近爬梯子。新手最好上手。",
    },
    {
      name: "Overhang",
      zh: "仰角牆",
      lean: 30,
      label: "前傾",
      note: "牆往你身上倒，超過垂直。手和核心吃重。",
    },
    {
      name: "Roof",
      zh: "屋簷",
      lean: 90,
      label: "",
      note: "接近水平的天花板。要勾腳、掛著爬。",
    },
  ];
  const by = 150;

  return (
    <Figure caption="示意圖：從側面看四種牆，人站在右邊。虛線是垂直，綠色弧線是牆面偏離垂直的角度；各館實際角度不同。">
      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {walls.map((w, i) => {
          const roof = w.lean >= 90;
          // Pick the base so the wall stays inside the frame.
          const bx = w.lean < 0 ? 100 : w.lean > 0 ? 34 : 60;
          const len = 122;
          const rad = (w.lean * Math.PI) / 180;
          const top = roof
            ? { x: bx, y: 48 }
            : { x: bx + Math.sin(rad) * len, y: by - Math.cos(rad) * len };
          const end = roof ? { x: bx + 108, y: 56 } : top;
          const along = (t: number) =>
            roof
              ? {
                  x: top.x + (end.x - top.x) * t,
                  y: top.y + (end.y - top.y) * t + 8,
                }
              : { x: bx + (top.x - bx) * t + 8, y: by + (top.y - by) * t };
          const arcR = 96;
          const ax = bx + Math.sin(rad) * arcR;
          const ay = by - Math.cos(rad) * arcR;

          return (
            <li
              key={w.name}
              className="overflow-hidden rounded-[20px] border border-line bg-ink-2"
            >
              <svg aria-hidden className="block w-full" viewBox="0 0 170 170">
                <rect
                  fill="#2a2d31"
                  height="10"
                  rx="3"
                  width="150"
                  x="10"
                  y={by}
                />
                {!roof && (
                  <line
                    stroke="#5c5b57"
                    strokeDasharray="4 5"
                    strokeWidth="2"
                    x1={bx}
                    x2={bx}
                    y1={by}
                    y2={by - len}
                  />
                )}
                <path
                  d={
                    roof
                      ? `M${bx},${by} L${top.x},${top.y} L${end.x},${end.y}`
                      : `M${bx},${by} L${top.x},${top.y}`
                  }
                  fill="none"
                  stroke="#F5F5F5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="6"
                />
                {[0.22, 0.5, 0.95].map((t, k) => {
                  const p = along(t);

                  return (
                    <Hold
                      key={t}
                      color={Object.values(R)[(i + k) % 6]}
                      r={7}
                      rot={k * 40}
                      shape={k}
                      x={p.x}
                      y={p.y}
                    />
                  );
                })}
                {w.lean !== 0 && !roof && (
                  <>
                    <path
                      d={`M${bx},${by - arcR} A${arcR},${arcR} 0 0 ${w.lean > 0 ? 1 : 0} ${ax},${ay}`}
                      fill="none"
                      stroke="#C6FF00"
                      strokeWidth="2.5"
                    />
                    <text
                      fill="#C6FF00"
                      fontSize="14"
                      fontWeight="800"
                      textAnchor={w.lean > 0 ? "start" : "end"}
                      x={w.lean > 0 ? bx + 6 : 162}
                      y={w.lean > 0 ? 20 : 24}
                    >
                      {w.label} {Math.abs(w.lean)}°
                    </text>
                  </>
                )}
              </svg>
              <div className="px-4 pb-4 pt-1">
                <p className="text-[16px] font-extrabold text-cream">
                  {w.zh}
                  <span className="ml-1.5 font-display text-[13px] font-normal text-mute">
                    {w.name}
                  </span>
                </p>
                <p className="mt-1 text-[14px] leading-[1.65] text-mute">
                  {w.note}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </Figure>
  );
}

/** V grades beside their usual Font equivalents, V0 to V8. Approximate by nature. */
export function GradeLadder() {
  const rows: [string, string][] = [
    ["V0", "4"],
    ["V1", "5"],
    ["V2", "5+"],
    ["V3", "6A–6A+"],
    ["V4", "6B–6B+"],
    ["V5", "6C–6C+"],
    ["V6", "7A"],
    ["V7", "7A+"],
    ["V8", "7B–7B+"],
  ];
  const colors = [
    R.green,
    R.green,
    R.yellow,
    R.yellow,
    R.orange,
    R.orange,
    R.red,
    R.red,
    R.purple,
  ];

  return (
    <Figure caption="示意：V 級和 Font 是兩套分級，這是常見的約略對照，不是精確換算；不同對照表在低階區間可能差一格。">
      <ol className="grid grid-cols-3 gap-2 sm:grid-cols-9">
        {rows.map(([v, font], i) => (
          <li
            key={v}
            className="flex flex-col items-center rounded-[18px] border border-line bg-ink-2 px-1 pb-3 pt-3 text-center"
          >
            <svg aria-hidden className="size-6" viewBox="-1.3 -1.3 2.6 2.6">
              <path
                d={BLOBS[i % BLOBS.length]}
                fill={colors[i]}
                transform={`rotate(${((i * 41) % 70) - 35})`}
              />
              <circle cx=".18" cy="-.12" fill="rgba(0,0,0,.35)" r=".2" />
            </svg>
            <span className="mt-2 font-display text-[18px] leading-none text-cream">
              {v}
            </span>
            <span className="mt-1.5 text-[13px] tabular text-mute">
              Font {font}
            </span>
          </li>
        ))}
      </ol>
      <div className="mt-3 flex items-center gap-3 text-[13px] text-mute">
        <span>較簡單</span>
        <span className="h-px flex-1 bg-gradient-to-r from-line to-lime" />
        <span>較難</span>
      </div>
    </Figure>
  );
}

const LIME = "#C6FF00";

/** A pull/push direction arrow in viewBox units. */
function Arrow({
  x1,
  y1,
  x2,
  y2,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}) {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const h = 9;
  const p1 = `${x2 - h * Math.cos(a - 0.5)},${y2 - h * Math.sin(a - 0.5)}`;
  const p2 = `${x2 - h * Math.cos(a + 0.5)},${y2 - h * Math.sin(a + 0.5)}`;

  return (
    <g
      stroke={LIME}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="3.5"
    >
      <line x1={x1} x2={x2} y1={y1} y2={y2} />
      <polyline fill="none" points={`${p1} ${x2},${y2} ${p2}`} />
    </g>
  );
}

/** The surface you use on a hold, drawn as a lime line. */
function Grip({ d }: { d: string }) {
  return (
    <path
      d={d}
      fill="none"
      stroke={LIME}
      strokeLinecap="round"
      strokeWidth="3"
    />
  );
}

export type HoldKind =
  | "jug"
  | "edge"
  | "crimp"
  | "sloper"
  | "pinch"
  | "pocket"
  | "undercling"
  | "sidepull"
  | "gaston"
  | "volume";

/** Each hold seen from the front, the usable surface in lime and the pull as an arrow. */
export const HOLD_ART: Record<HoldKind, ReactNode> = {
  jug: (
    <>
      <path
        d="M30,38 C30,20 90,18 92,38 C96,62 78,78 60,78 C40,78 26,62 30,38 Z"
        fill={R.red}
      />
      <path d="M40,40 C48,30 74,30 82,40 C74,48 48,48 40,40 Z" fill="#7a2326" />
      <Grip d="M42,40 C50,32 72,32 80,40" />
      <Arrow x1={61} x2={61} y1={52} y2={86} />
    </>
  ),
  edge: (
    <>
      <path d="M22,42 L98,42 L92,66 L28,66 Z" fill={R.blue} />
      <Grip d="M24,42 L96,42" />
      <Arrow x1={60} x2={60} y1={50} y2={86} />
    </>
  ),
  crimp: (
    <>
      <path d="M36,50 L84,50 L82,58 L38,58 Z" fill={R.yellow} />
      <Grip d="M38,50 L82,50" />
      <Arrow x1={60} x2={60} y1={62} y2={88} />
    </>
  ),
  sloper: (
    <>
      <path d="M20,74 C22,30 98,30 100,74 Z" fill={R.green} />
      <path
        d="M36,52 C46,40 74,40 84,52"
        fill="none"
        stroke="rgba(255,255,255,.25)"
        strokeWidth="5"
      />
      <Grip d="M30,58 C40,40 80,40 90,58" />
      <Arrow x1={60} x2={60} y1={66} y2={90} />
    </>
  ),
  pinch: (
    <>
      <path
        d="M50,18 C62,14 70,20 70,30 L68,82 C64,90 54,90 50,82 Z"
        fill={R.purple}
      />
      <Grip d="M50,26 L50,78" />
      <Grip d="M70,30 L68,78" />
      <Arrow x1={22} x2={44} y1={52} y2={52} />
      <Arrow x1={98} x2={76} y1={52} y2={52} />
    </>
  ),
  pocket: (
    <>
      <path
        d="M28,34 C34,18 88,18 94,36 C98,60 80,78 60,78 C38,78 24,58 28,34 Z"
        fill={R.orange}
      />
      <ellipse cx="50" cy="44" fill="#6b3d14" rx="9" ry="7" />
      <ellipse cx="72" cy="44" fill="#6b3d14" rx="9" ry="7" />
      <Arrow x1={61} x2={61} y1={58} y2={90} />
    </>
  ),
  undercling: (
    <>
      <path
        d="M26,30 C30,14 92,14 96,30 C98,52 86,62 60,62 C36,62 24,52 26,30 Z"
        fill={R.blue}
      />
      <path d="M40,58 C48,48 74,48 82,58 C74,60 48,60 40,58 Z" fill="#1d4a8f" />
      <Grip d="M42,58 L80,58" />
      <Arrow x1={61} x2={61} y1={58} y2={14} />
    </>
  ),
  sidepull: (
    <>
      <path
        d="M40,22 C64,18 74,30 72,52 C70,74 62,84 42,80 C30,60 30,40 40,22 Z"
        fill={R.red}
      />
      <path d="M66,30 C76,42 76,62 66,74 C70,60 70,44 66,30 Z" fill="#7a2326" />
      <Grip d="M70,32 L70,72" />
      <Arrow x1={70} x2={18} y1={52} y2={52} />
    </>
  ),
  gaston: (
    <>
      <path
        d="M80,22 C56,18 46,30 48,52 C50,74 58,84 78,80 C90,60 90,40 80,22 Z"
        fill={R.yellow}
      />
      <path d="M54,30 C44,42 44,62 54,74 C50,60 50,44 54,30 Z" fill="#7a6a06" />
      <Grip d="M50,32 L50,72" />
      <Arrow x1={50} x2={102} y1={52} y2={52} />
    </>
  ),
  volume: (
    <>
      <path d="M18,84 L60,16 L102,84 Z" fill={VOLUME} />
      <path d="M60,16 L102,84 L70,84 Z" fill="#3a3f45" />
      <Hold color={R.green} r={9} shape={1} x={56} y={58} />
    </>
  ),
};

/** A real photo of a hold in use, with the credit its licence asks for. */
export type HoldPhoto = {
  src: string;
  alt: string;
  author: string;
  license: string;
  licenseUrl: string;
  /** The file's page on Wikimedia Commons. */
  sourceUrl: string;
};

/**
 * Cards of hold types: a photo of the hold in use where we have one (with the
 * drawing as a small inset showing the pull), otherwise the drawing itself.
 */
export function HoldTypes({
  holds,
}: {
  holds: {
    kind: HoldKind;
    name: string;
    zh: string;
    how: string;
    tip: string;
    photo?: HoldPhoto;
  }[];
}) {
  return (
    <Figure caption="照片下方註明作者與授權（照片經裁切）。插畫是從正面看岩點：綠線是手抓、用力的那一面，箭頭是用力方向。實際岩點形狀千變萬化，常常同時屬於好幾種。">
      <ul className="grid grid-cols-2 gap-3">
        {holds.map((h) => (
          <li
            key={h.kind}
            className="flex flex-col overflow-hidden rounded-[20px] border border-line bg-ink-2"
            id={`hold-${h.kind}`}
          >
            <div className="relative aspect-[4/3] bg-[#16181a]">
              {h.photo ? (
                <>
                  <Image
                    fill
                    alt={h.photo.alt}
                    className="object-cover"
                    sizes="(min-width: 768px) 340px, 50vw"
                    src={h.photo.src}
                  />
                  <svg
                    aria-hidden
                    className="absolute bottom-2 right-2 w-[34%] rounded-[12px] bg-[#16181a]/90"
                    viewBox="0 0 120 100"
                  >
                    {HOLD_ART[h.kind]}
                  </svg>
                </>
              ) : (
                <svg
                  aria-hidden
                  className="absolute inset-0 size-full"
                  viewBox="-10 -5 140 110"
                >
                  {HOLD_ART[h.kind]}
                </svg>
              )}
            </div>
            <div className="flex flex-1 flex-col px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
              <p className="text-[16px] font-extrabold text-cream">
                {h.zh}
                <span className="ml-1.5 font-display text-[13px] font-normal text-mute">
                  {h.name}
                </span>
              </p>
              <p className="mt-1 text-[14px] leading-[1.65] text-cream/80">
                {h.how}
              </p>
              <p className="mt-1.5 text-[13px] leading-[1.6] text-mute">
                {h.tip}
              </p>
              {h.photo && (
                <p className="mt-auto pt-2.5 text-[11px] leading-[1.5] text-mute/80">
                  照片：
                  <a
                    className="underline decoration-line underline-offset-2 hover:text-lime-ink"
                    href={h.photo.sourceUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {h.photo.author}
                  </a>
                  ，
                  <a
                    className="underline decoration-line underline-offset-2 hover:text-lime-ink"
                    href={h.photo.licenseUrl}
                    rel="noopener license noreferrer"
                    target="_blank"
                  >
                    {h.photo.license}
                  </a>
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </Figure>
  );
}

/** Side view of a finger on a small edge in the three common grips. */
export function GripTypes() {
  const grips: {
    name: string;
    zh: string;
    load: number;
    note: string;
    finger: string;
    thumb?: string;
  }[] = [
    {
      name: "Open hand",
      zh: "開掌",
      load: 1,
      note: "手指微彎、自然掛在點上。手指負擔最小，大點、圓點都適合。",
      finger: "M14,30 L46,44 L70,56 L88,63",
    },
    {
      name: "Half crimp",
      zh: "半摳",
      load: 2,
      note: "中間關節彎成大約直角，拇指不鎖住。小邊點最常用。",
      finger: "M18,24 L50,28 L62,52 L88,63",
    },
    {
      name: "Full crimp",
      zh: "全摳",
      load: 3,
      note: "手指更彎，拇指壓在食指上鎖住。最有力，但手指韌帶負擔最大，新手少用。",
      finger: "M22,18 L52,18 L58,46 L88,63",
      thumb: "M44,80 L74,62",
    },
  ];

  return (
    <Figure caption="示意圖：從側面看一根手指抓小邊點。綠色長條是手指負擔的相對高低；研究顯示越彎的抓法，手指滑車韌帶受力越大。">
      <ul className="grid gap-3 sm:grid-cols-3">
        {grips.map((g) => (
          <li
            key={g.name}
            className="overflow-hidden rounded-[20px] border border-line bg-ink-2"
          >
            <svg aria-hidden className="block w-full" viewBox="0 0 120 90">
              <rect fill="#16181a" height="90" width="120" />
              {/* The edge: a small ledge on the wall */}
              <rect fill="#2a2d31" height="90" width="14" x="106" />
              <path d="M84,64 L106,64 L106,72 L86,72 Z" fill={R.yellow} />
              <path
                d={g.finger}
                fill="none"
                stroke="#F5F5F5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="9"
              />
              {g.thumb && (
                <path
                  d={g.thumb}
                  fill="none"
                  stroke="#d9d6cf"
                  strokeLinecap="round"
                  strokeWidth="10"
                />
              )}
            </svg>
            <div className="px-4 pb-4 pt-3">
              <p className="text-[16px] font-extrabold text-cream">
                {g.zh}
                <span className="ml-1.5 font-display text-[13px] font-normal text-mute">
                  {g.name}
                </span>
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-[13px] text-mute">手指負擔</span>
                <span className="flex gap-1">
                  {[1, 2, 3].map((n) => (
                    <span
                      key={n}
                      className={`h-2 w-6 rounded-full ${n <= g.load ? "bg-lime" : "bg-line"}`}
                    />
                  ))}
                </span>
              </div>
              <p className="mt-2 text-[14px] leading-[1.65] text-mute">
                {g.note}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </Figure>
  );
}
