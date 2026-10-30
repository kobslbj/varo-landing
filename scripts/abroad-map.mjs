/**
 * Land outlines around the gym cities outside Taiwan, for the /gyms map.
 * Writes lib/gyms/abroad-map.ts.
 *
 * Input: countries-10m.json from https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/
 * (Natural Earth 1:10m, public domain). Keep it outside this project:
 *
 *   node scripts/abroad-map.mjs /path/to/countries-10m.json
 *
 * Only the land near each city is kept, cropped to a box a bit larger than
 * the map's zoomed view, so the file stays small. Uses the same projection
 * as the Taiwan map, so gyms and land line up in one coordinate space.
 */
import { readFileSync, writeFileSync } from "node:fs";

const [, , input] = process.argv;

if (!input) throw new Error("Usage: node scripts/abroad-map.mjs <countries-10m.json>");

// Same projection as lib/gyms/taiwan-map.ts.
const BOX = { w: 119.98, n: 25.32 };
const K = 400;
const COS = Math.cos((23.7 * Math.PI) / 180);
const project = (lng, lat) => [(lng - BOX.w) * K * COS, (BOX.n - lat) * K];
const MAP_RATIO = 748 / 1380;

// --- Gym positions, read from the generated data file.
const data = readFileSync("lib/gyms/data-abroad.ts", "utf8");
const byCity = new Map();

for (const block of data.split(/\n  \{\n/).slice(1)) {
  const city = block.match(/city: "([^"]+)"/)?.[1];
  const lat = Number(block.match(/lat: ([\d.-]+)/)?.[1]);
  const lng = Number(block.match(/lng: ([\d.-]+)/)?.[1]);

  if (!city || !lat || !lng) continue;
  if (!byCity.has(city)) byCity.set(city, []);
  byCity.get(city).push(project(lng, lat));
}

// --- One crop box per city: the map's zoomed view (see countyBox in
// gym-explorer.tsx), grown so panning edges never show bare sea.
const GROW = 2.4;
let rects = [...byCity.values()].map((pts) => {
  const MIN = 40;
  const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length;
  const cy = pts.reduce((s, p) => s + p[1], 0) / pts.length;
  const xs = [...pts.map((p) => p[0]), cx - MIN / 2, cx + MIN / 2];
  const ys = [...pts.map((p) => p[1]), cy - MIN / 2, cy + MIN / 2];
  const pad = 0.12;
  const w0 = (Math.max(...xs) - Math.min(...xs)) * (1 + pad * 2);
  const h0 = (Math.max(...ys) - Math.min(...ys)) * (1 + pad * 2);
  const w = Math.max(w0, h0 * MAP_RATIO) * GROW;
  const h = (w / MAP_RATIO) * 1;
  const mx = (Math.min(...xs) + Math.max(...xs)) / 2;
  const my = (Math.min(...ys) + Math.max(...ys)) / 2;

  return { x0: mx - w / 2, x1: mx + w / 2, y0: my - h / 2, y1: my + h / 2 };
});

// Merge overlapping boxes (Klang Valley, Johor Bahru next to Singapore).
const overlaps = (a, b) =>
  a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;

for (let merged = true; merged; ) {
  merged = false;
  outer: for (let i = 0; i < rects.length; i++) {
    for (let j = i + 1; j < rects.length; j++) {
      if (overlaps(rects[i], rects[j])) {
        const a = rects[i];
        const b = rects[j];

        rects[i] = {
          x0: Math.min(a.x0, b.x0),
          x1: Math.max(a.x1, b.x1),
          y0: Math.min(a.y0, b.y0),
          y1: Math.max(a.y1, b.y1),
        };
        rects.splice(j, 1);
        merged = true;
        break outer;
      }
    }
  }
}

// --- TopoJSON decoding (quantized, delta-encoded arcs), no dependencies.
const topo = JSON.parse(readFileSync(input, "utf8"));
const { scale, translate } = topo.transform;
const arcs = topo.arcs.map((arc) => {
  let x = 0;
  let y = 0;

  return arc.map(([dx, dy]) => {
    x += dx;
    y += dy;

    return project(x * scale[0] + translate[0], y * scale[1] + translate[1]);
  });
});
const ring = (indexes) => {
  const out = [];

  for (const i of indexes) {
    const pts = i >= 0 ? arcs[i] : [...arcs[~i]].reverse();

    out.push(...(out.length ? pts.slice(1) : pts));
  }

  return out;
};
const polygons = [];

for (const geom of topo.objects.land.geometries) {
  const polys = geom.type === "Polygon" ? [geom.arcs] : geom.arcs;

  for (const p of polys) polygons.push(p.map(ring));
}

// --- Sutherland–Hodgman: clip a ring to an axis-aligned box.
function clip(points, r) {
  const edges = [
    [(p) => p[0] >= r.x0, (a, b) => cross(a, b, 0, r.x0)],
    [(p) => p[0] <= r.x1, (a, b) => cross(a, b, 0, r.x1)],
    [(p) => p[1] >= r.y0, (a, b) => cross(a, b, 1, r.y0)],
    [(p) => p[1] <= r.y1, (a, b) => cross(a, b, 1, r.y1)],
  ];
  let out = points;

  for (const [inside, at] of edges) {
    const input = out;

    out = [];
    for (let i = 0; i < input.length; i++) {
      const cur = input[i];
      const prev = input[(i + input.length - 1) % input.length];

      if (inside(cur)) {
        if (!inside(prev)) out.push(at(prev, cur));
        out.push(cur);
      } else if (inside(prev)) out.push(at(prev, cur));
    }
    if (!out.length) break;
  }

  return out;
}
function cross(a, b, axis, v) {
  const t = (v - a[axis]) / (b[axis] - a[axis]);

  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
}

// Drop points closer than this to the last kept one (viewBox units; 1 ≈ 250 m).
const MIN_STEP = 0.25;
const round = (n) => Math.round(n * 10) / 10;
const paths = [];

for (const r of rects) {
  let d = "";

  for (const poly of polygons) {
    for (const pts of poly) {
      const xs = pts.map((p) => p[0]);
      const ys = pts.map((p) => p[1]);

      if (
        Math.max(...xs) < r.x0 ||
        Math.min(...xs) > r.x1 ||
        Math.max(...ys) < r.y0 ||
        Math.min(...ys) > r.y1
      )
        continue;
      const clipped = clip(pts, r);

      if (clipped.length < 3) continue;
      const kept = [clipped[0]];

      for (const p of clipped.slice(1)) {
        const q = kept[kept.length - 1];

        if (Math.hypot(p[0] - q[0], p[1] - q[1]) >= MIN_STEP) kept.push(p);
      }
      if (kept.length < 3) continue;
      d += `M${kept.map((p) => `${round(p[0])},${round(p[1])}`).join("L")}Z`;
    }
  }
  if (d) paths.push(d);
}

const out = `// Generated by scripts/abroad-map.mjs from world-atlas@2.0.2 countries-10m.json
// (Natural Earth 1:10m, public domain). Do not edit by hand.

/**
 * Land around the gym cities outside Taiwan, cropped per area, in the same
 * viewBox units as lib/gyms/taiwan-map.ts. Fill only: the crop edges are not
 * coastline, so they must not be stroked.
 */
export const abroadLand: string[] = ${JSON.stringify(paths, null, 2)};
`;

writeFileSync("lib/gyms/abroad-map.ts", out);
console.log(
  `lib/gyms/abroad-map.ts: ${paths.length} areas, ${(out.length / 1024).toFixed(1)} KB`,
);
