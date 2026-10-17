import clsx from "clsx";

import { gyms } from "@/lib/gyms/data";
import { holdStyle, KIND_COLORS } from "@/lib/gyms/hold-style";
import {
  counties,
  MAP_HEIGHT,
  MAP_WIDTH,
  project,
} from "@/lib/gyms/taiwan-map";

/** Taiwan with every gym as a hold, drawn on the server. Decorative: the link beside it says where it goes. */
export function GymMapThumb({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={clsx("h-full w-auto", className)}
      viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
    >
      {counties.map((c) => (
        <path
          key={c.name}
          d={c.d}
          fill="#202326"
          stroke="#3a3e44"
          strokeLinejoin="round"
          strokeWidth={1.6}
        />
      ))}
      {gyms.map((g) => {
        if (g.lat == null || g.lng == null) return null;
        const [x, y] = project(g.lng, g.lat);
        const { blob, rot } = holdStyle(g.id);

        return (
          <g
            key={g.id}
            transform={`translate(${x} ${y}) scale(24) rotate(${rot})`}
          >
            <path
              d={blob}
              fill={KIND_COLORS[g.kind]}
              stroke="#101112"
              strokeWidth={0.18}
            />
            <circle cx=".18" cy="-.12" fill="rgba(0,0,0,.35)" r=".2" />
          </g>
        );
      })}
    </svg>
  );
}
