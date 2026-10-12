/**
 * Builds the county outlines for the /gyms map (lib/gyms/taiwan-map.ts is
 * written from this script's JSON output).
 *
 * Input: counties-10t.json from https://cdn.jsdelivr.net/npm/taiwan-atlas@2021.9.20/
 * Needs (install in a scratch folder, not this project):
 *   topojson-client@3.1.0 topojson-simplify@3.0.3 d3-geo@3.1.1
 *
 *   node taiwan-map.mjs counties-10t.json taiwan.json 0.15
 */
import { readFileSync, writeFileSync } from "node:fs";
import { feature } from "topojson-client";
import { presimplify, simplify, quantile } from "topojson-simplify";
import { geoPath, geoTransform } from "d3-geo";

const [, , input, out, q = "0.12"] = process.argv;
let topo = presimplify(JSON.parse(readFileSync(input, "utf8")));
topo = simplify(topo, quantile(topo, Number(q)));
const fc = feature(topo, topo.objects.counties);

// Main island + nearby islands only (drops Penghu, Kinmen, Matsu).
const BOX = { w: 119.98, e: 122.02, s: 21.87, n: 25.32 };
const K = 400; // px per degree of latitude
const COS = Math.cos((23.7 * Math.PI) / 180);
const project = (lng, lat) => [(lng - BOX.w) * K * COS, (BOX.n - lat) * K];

const inBox = (ring) => ring.every(([x, y]) => x >= BOX.w && x <= BOX.e && y >= BOX.s && y <= BOX.n);
const keep = (geom) => {
  const polys = geom.type === "Polygon" ? [geom.coordinates] : geom.coordinates;
  const kept = polys.filter((p) => inBox(p[0]));
  return kept.length ? { type: "MultiPolygon", coordinates: kept } : null;
};

const path = geoPath(
  geoTransform({
    point(x, y) {
      const [px, py] = project(x, y);
      this.stream.point(Math.round(px), Math.round(py));
    },
  }),
);

const counties = fc.features
  .map((f) => ({ name: f.properties.COUNTYNAME, geom: keep(f.geometry) }))
  .filter((c) => c.geom)
  .map((c) => ({ name: c.name, d: path(c.geom) }));

const [width, height] = project(BOX.e, BOX.s).map((v) => Math.ceil(v));
writeFileSync(out, JSON.stringify({ box: BOX, k: K, cos: COS, width, height, counties }));
console.log(counties.map((c) => `${c.name} ${c.d.length}`).join("\n"), "\n", width, height);
