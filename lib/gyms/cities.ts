import type { Country, Gym } from "./types";
import type { Locale } from "@/lib/i18n/config";

import { gyms } from "./data";
import { abroadGyms } from "./data-abroad";

/** Taiwan first, then the app's other regions. */
export const allGyms: Gym[] = [...gyms, ...abroadGyms];

export const countryOf = (gym: Gym): Country => gym.country ?? "TW";

/**
 * Regional hreflang codes for pages about a country outside Taiwan: the
 * Chinese pages (Traditional) also suit Hong Kong; the English pages suit
 * Hong Kong, Singapore and Malaysia.
 */
export const regionalFor = (country: Country): Record<string, Locale> =>
  ({
    TW: {},
    HK: { "zh-HK": "zh-TW", "en-HK": "en" },
    SG: { "en-SG": "en" },
    MY: { "en-MY": "en" },
  })[country] as Record<string, Locale>;

/**
 * Cities and counties with their URL slug, north to south then the east
 * coast. Only those with at least one gym get a page.
 */
const TAIWAN = [
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

/** Outside Taiwan: Hong Kong and Singapore are one page each; Malaysia by city, Klang Valley first. */
const ABROAD: { name: string; slug: string; country: Country }[] = [
  { name: "香港", slug: "hong-kong", country: "HK" },
  { name: "新加坡", slug: "singapore", country: "SG" },
  { name: "吉隆坡", slug: "kuala-lumpur", country: "MY" },
  { name: "八打靈再也", slug: "petaling-jaya", country: "MY" },
  { name: "梳邦再也", slug: "subang-jaya", country: "MY" },
  { name: "莎阿南", slug: "shah-alam", country: "MY" },
  { name: "布城", slug: "putrajaya", country: "MY" },
  { name: "檳城", slug: "penang", country: "MY" },
  { name: "新山", slug: "johor-bahru", country: "MY" },
  { name: "馬六甲", slug: "melaka", country: "MY" },
  { name: "亞庇", slug: "kota-kinabalu", country: "MY" },
  { name: "古晉", slug: "kuching", country: "MY" },
  { name: "美里", slug: "miri", country: "MY" },
];

/** Taiwan's cities with gyms. Most of the directory (map, chips) is just these. */
export const cities = TAIWAN.filter((c) => gyms.some((g) => g.city === c.name));

export const cityOrder = cities.map((c) => c.name);

/** Cities outside Taiwan with gyms. */
export const abroadCities = ABROAD.filter((c) =>
  abroadGyms.some((g) => g.city === c.name),
);

/** Every city with a page, Taiwan first. */
export const allCities: { name: string; slug: string; country: Country }[] = [
  ...cities.map((c) => ({ ...c, country: "TW" as const })),
  ...abroadCities,
];

/** The regions outside Taiwan, in page order, with their cities. */
export const abroadCountries = (["HK", "SG", "MY"] as const).map((country) => ({
  country,
  cities: abroadCities.filter((c) => c.country === country),
  n: abroadGyms.filter((g) => g.country === country).length,
}));

/**
 * Country pages for regions with more than one city (Malaysia): every gym in
 * the country, grouped by city, at /gyms/<slug>. Hong Kong and Singapore are
 * one city each, so their city page already is the country page.
 */
const HUB_SLUGS: Partial<Record<Country, string>> = { MY: "malaysia" };

export const abroadHubs = abroadCountries
  .filter((c) => c.cities.length > 1 && HUB_SLUGS[c.country])
  .map((c) => ({ ...c, slug: HUB_SLUGS[c.country]! }));

export const hubBySlug = (slug: string) =>
  abroadHubs.find((h) => h.slug === slug);

/** The country page above a city, if it has one. */
export const hubFor = (name: string) => {
  const country = allCities.find((c) => c.name === name)?.country;

  return abroadHubs.find((h) => h.country === country);
};

/** Cities in the same country as `name`, for "other cities" links. */
export const citiesLike = (name: string) => {
  const country = allCities.find((c) => c.name === name)?.country ?? "TW";

  return allCities.filter((c) => c.country === country);
};

/**
 * The name people type into search: "台北" rather than "台北市". Where a city
 * and a county share a name (新竹, 嘉義), the full name stays.
 */
export function shortName(name: string) {
  const base = name.replace(/[市縣]$/, "");
  const shared =
    TAIWAN.filter((c) => c.name.replace(/[市縣]$/, "") === base).length > 1;

  return shared ? name : base;
}

export const cityBySlug = (slug: string) =>
  allCities.find((c) => c.slug === slug);

/** Unprefixed path of a city's page, e.g. "/gyms/taipei". */
export const cityPath = (name: string) =>
  `/gyms/${allCities.find((c) => c.name === name)?.slug ?? ""}`;

export const gymsIn = (name: string) => allGyms.filter((g) => g.city === name);

/** Stable detail URL, shared by the directory, sitemap and agent index. */
export const gymPath = (gym: Gym) => `${cityPath(gym.city)}/${gym.id}`;
