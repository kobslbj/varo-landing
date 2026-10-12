import { gyms } from "./data";

/**
 * Cities and counties with their URL slug, north to south then the east
 * coast. Only those with at least one gym get a page.
 */
const ALL = [
  { name: "台北市", slug: "taipei" },
  { name: "新北市", slug: "new-taipei" },
  { name: "基隆市", slug: "keelung" },
  { name: "桃園市", slug: "taoyuan" },
  { name: "新竹市", slug: "hsinchu-city" },
  { name: "新竹縣", slug: "hsinchu-county" },
  { name: "苗栗縣", slug: "miaoli" },
  { name: "台中市", slug: "taichung" },
  { name: "彰化縣", slug: "changhua" },
  { name: "南投縣", slug: "nantou" },
  { name: "雲林縣", slug: "yunlin" },
  { name: "嘉義市", slug: "chiayi-city" },
  { name: "嘉義縣", slug: "chiayi-county" },
  { name: "台南市", slug: "tainan" },
  { name: "高雄市", slug: "kaohsiung" },
  { name: "屏東縣", slug: "pingtung" },
  { name: "宜蘭縣", slug: "yilan" },
  { name: "花蓮縣", slug: "hualien" },
  { name: "台東縣", slug: "taitung" },
];

export const cities = ALL.filter((c) => gyms.some((g) => g.city === c.name));

export const cityOrder = cities.map((c) => c.name);

/**
 * The name people type into search: "台北" rather than "台北市". Where a city
 * and a county share a name (新竹, 嘉義), the full name stays.
 */
export function shortName(name: string) {
  const base = name.replace(/[市縣]$/, "");
  const shared =
    ALL.filter((c) => c.name.replace(/[市縣]$/, "") === base).length > 1;

  return shared ? name : base;
}

export const cityBySlug = (slug: string) => cities.find((c) => c.slug === slug);

/** Unprefixed path of a city's page, e.g. "/gyms/taipei". */
export const cityPath = (name: string) =>
  `/gyms/${cities.find((c) => c.name === name)?.slug ?? ""}`;

export const gymsIn = (name: string) => gyms.filter((g) => g.city === name);
