import type { Gym } from "./types";

import { cities, cityPath, gymsIn } from "./cities";
import { gyms } from "./data";

/**
 * Questions travellers type into Google ("climbing gym taipei", "rock climbing
 * taiwan", "taipei indoor activities"), answered from the gym data. English
 * only: the directory's Chinese pages already serve local searches.
 */
export interface VisitorQuestion {
  q: string;
  a: string;
  /** City pages the answer points to, as unprefixed paths. */
  links?: { label: string; path: string }[];
}

const range = (values: number[]) => {
  const sorted = [...values].sort((a, b) => a - b);

  return sorted.length
    ? { min: sorted[0], max: sorted[sorted.length - 1], n: sorted.length }
    : null;
};

const ntd = (r: { min: number; max: number }) =>
  r.min === r.max ? `NT$${r.min}` : `NT$${r.min}–${r.max}`;

const isBeginnerFriendly = (g: Gym) =>
  Boolean(g.courses && /體驗|新手|初學|入門/.test(g.courses));

export function visitorFaq(
  cityName: (zh: string) => string,
): VisitorQuestion[] {
  const count = (zh: string) => gymsIn(zh).length;
  const priced = gyms.filter((g) => g.price);
  const dayPass = range(
    priced.flatMap((g) =>
      [g.price!.weekday, g.price!.weekend].filter(
        (n): n is number => n != null,
      ),
    ),
  );
  const shoes = range(
    priced.map((g) => g.price!.shoes).filter((n): n is number => n != null),
  );
  const onlineBooking = gyms.filter((g) =>
    /線上|Rezio|17FIT|BeClass/i.test(g.booking ?? ""),
  ).length;
  const taipeiArea = gyms.filter(
    (g) => g.city === "台北市" || g.city === "新北市",
  );
  const beginners = taipeiArea.filter(isBeginnerFriendly).length;
  const byCount = [...cities].sort((a, b) => count(b.name) - count(a.name));
  const cityLink = (zh: string) => ({
    label: `${cityName(zh)} (${count(zh)})`,
    path: cityPath(zh),
  });

  return [
    {
      q: "Where can I go rock climbing or bouldering in Taipei?",
      a: `We list ${count("台北市")} indoor climbing and bouldering gyms in Taipei and ${count("新北市")} more in New Taipei. Open a city page for the map, addresses, opening hours and prices.`,
      links: [cityLink("台北市"), cityLink("新北市")],
    },
    {
      q: "Which cities in Taiwan have climbing gyms?",
      a: `${gyms.length} gyms across ${cities.length} cities and counties. The most are in ${byCount
        .slice(0, 4)
        .map((c) => `${cityName(c.name)} (${count(c.name)})`)
        .join(", ")}.`,
      links: byCount.slice(0, 6).map((c) => cityLink(c.name)),
    },
    ...(dayPass
      ? [
          {
            q: "How much is a day pass at a climbing gym in Taiwan?",
            a: `Published day passes at the ${priced.length} gyms that list prices run ${ntd(dayPass)}, with weekends sometimes a little more. Several also sell cheaper afternoon or late-evening passes. Prices change, so check the gym’s own page before you go.`,
          },
        ]
      : []),
    ...(shoes
      ? [
          {
            q: "Can I rent climbing shoes?",
            a: `Yes. ${shoes.n} gyms list shoe rental in their published prices, at ${ntd(shoes)}; for the rest, ask the gym.`,
          },
        ]
      : []),
    {
      q: "Do I need to book, or can I just walk in?",
      a: `It depends on the gym, and we haven’t confirmed walk-in rules for each one. Intro sessions and classes are usually booked in advance; ${onlineBooking} gyms take bookings online (Rezio, 17FIT or BeClass). Each gym page links to its official Facebook, Instagram or website, the quickest way to ask.`,
    },
    {
      q: "I’ve never climbed. Is it a good thing to do in Taipei on a rainy day?",
      a: `Bouldering needs no ropes, partner or experience, and it’s indoors. ${beginners} gyms in Taipei and New Taipei mention intro sessions for first-timers.`,
    },
    {
      q: "Is the gym information in English?",
      a: "Gym names, addresses and hours are shown in Chinese, as the gyms publish them. That’s what you’ll want anyway: paste the address into Google Maps or show it to a taxi driver, or tap Directions on any gym page.",
    },
    {
      q: "What about outdoor climbing in Taiwan?",
      a: "This directory covers gyms. Taiwan’s best-known outdoor crag is Long Dong (龍洞), sandstone sea cliffs on the northeast coast of New Taipei, best climbed with a local guide or club.",
    },
  ];
}
