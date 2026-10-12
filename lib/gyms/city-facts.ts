import type { Gym, GymKind } from "./types";

/** What a city page says about its gyms, all read off the data. */
export interface CityFacts {
  /** Display name in the page's language. */
  city: string;
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
}

const KIND_ORDER: GymKind[] = ["boulder", "mixed", "rope", "kids", "outdoor"];

export function cityFacts(
  city: string,
  list: Gym[],
  checkedAt: string,
): CityFacts {
  const districts = new Map<string, number>();

  for (const g of list)
    districts.set(g.district, (districts.get(g.district) ?? 0) + 1);

  return {
    city,
    n: list.length,
    year: Number(checkedAt.slice(0, 4)),
    names: list.map((g) => g.name),
    kinds: KIND_ORDER.map((kind) => ({
      kind,
      n: list.filter((g) => g.kind === kind).length,
    })).filter((k) => k.n),
    districts: Array.from(districts)
      .sort((a, b) => b[1] - a[1])
      .map(([d]) => d),
    priced: list
      .filter((g) => g.price)
      .map((g) => ({ name: g.name, ...g.price! })),
    beginners: list
      .filter((g) => g.courses && /體驗|新手|初學|入門/.test(g.courses))
      // The research text often ends in a full stop; the page adds its own.
      .map((g) => ({
        name: g.name,
        courses: g.courses!.replace(/[。.]+$/, ""),
      })),
    kids: list
      .filter(
        (g) =>
          g.kind === "kids" || (g.courses && /兒童|親子|小孩/.test(g.courses)),
      )
      .map((g) => g.name),
  };
}
