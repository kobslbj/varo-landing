import type { Gym, GymKind } from "./types";

/** What a city page says about its gyms, all read off the data. */
export interface CityFacts {
  /** Display name in the page's language. */
  city: string;
  /** City with its country where that helps, e.g. "Penang, Malaysia". */
  where: string;
  n: number;
  year: number;
  names: string[];
  kinds: { kind: GymKind; n: number }[];
  /** Districts, most gyms first. */
  districts: string[];
  priced: {
    name: string;
    weekday?: number;
    weekend?: number;
    shoes?: number;
    notes?: string;
    source: string;
  }[];
  /** Gyms that mention intro sessions or classes for beginners. */
  beginners: { name: string; courses: string }[];
  /** Gyms with kids' classes or a kids' wall. */
  kids: string[];
  /** Gyms with roped climbing (as well as, or instead of, bouldering). */
  ropes: string[];
  /** Districts with their gym counts, most first. */
  districtCounts: { name: string; n: number }[];
}

const KIND_ORDER: GymKind[] = ["boulder", "mixed", "rope", "kids", "outdoor"];

/** `show` turns a gym into the page's language; filters read the Chinese data. */
export function cityFacts(
  city: string,
  list: Gym[],
  checkedAt: string,
  show: (g: Gym) => Gym = (g) => g,
  where: string = city,
  /** A district in the page's language. */
  district: (d: string, country?: Gym["country"]) => string = (d) => d,
): CityFacts {
  // Counted and sorted once; gyms with no recorded district are left out.
  const counts = new Map<string, { n: number; country?: Gym["country"] }>();

  for (const g of list) {
    if (!g.district) continue;
    const c = counts.get(g.district);

    counts.set(g.district, { n: (c?.n ?? 0) + 1, country: g.country });
  }
  const sorted = Array.from(counts).sort((a, b) => b[1].n - a[1].n);
  const districtCounts = sorted.map(([d, { n, country }]) => ({
    name: district(d, country),
    n,
  }));

  return {
    city,
    where,
    districtCounts,
    ropes: list
      .filter((g) => g.kind === "mixed" || g.kind === "rope")
      .map((g) => g.name),
    n: list.length,
    year: Number(checkedAt.slice(0, 4)),
    names: list.map((g) => g.name),
    kinds: KIND_ORDER.map((kind) => ({
      kind,
      n: list.filter((g) => g.kind === kind).length,
    })).filter((k) => k.n),
    districts: sorted.map(([d]) => d),
    priced: list
      .filter((g) => g.price)
      .map((g) => ({ name: g.name, ...show(g).price! })),
    beginners: list
      .filter((g) => g.courses && /體驗|新手|初學|入門/.test(g.courses))
      // The research text often ends in a full stop; the page adds its own.
      .map((g) => ({
        name: g.name,
        courses: show(g).courses!.replace(/[。.]+$/, ""),
      })),
    kids: list
      .filter(
        (g) =>
          g.kind === "kids" || (g.courses && /兒童|親子|小孩/.test(g.courses)),
      )
      .map((g) => g.name),
  };
}
