import type { Gym } from "./types";
import type { Locale } from "@/lib/i18n/config";

import { cities, cityPath, gymsIn } from "./cities";
import { gyms } from "./data";

/**
 * Questions travellers type into Google ("climbing gym taipei", "台湾
 * クライミング", "대만 클라이밍", "taipei indoor activities"), answered from
 * the gym data. Not shown in Chinese: those pages already serve local searches.
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

const count = (zh: string) => gymsIn(zh).length;

/** Everything the answers say, read off the data. */
function stats() {
  const priced = gyms.filter((g) => g.price);

  return {
    total: gyms.length,
    cityCount: cities.length,
    taipei: count("台北市"),
    newTaipei: count("新北市"),
    priced: priced.length,
    dayPass: range(
      priced.flatMap((g) =>
        [g.price!.weekday, g.price!.weekend].filter(
          (n): n is number => n != null,
        ),
      ),
    ),
    shoes: range(
      priced.map((g) => g.price!.shoes).filter((n): n is number => n != null),
    ),
    onlineBooking: gyms.filter((g) =>
      /線上|Rezio|17FIT|BeClass/i.test(g.booking ?? ""),
    ).length,
    beginners: gyms.filter(
      (g) =>
        (g.city === "台北市" || g.city === "新北市") && isBeginnerFriendly(g),
    ).length,
    byCount: [...cities].sort((a, b) => count(b.name) - count(a.name)),
  };
}

type Stats = ReturnType<typeof stats>;
type Range = NonNullable<Stats["dayPass"]>;

interface Copy {
  sep: string;
  where: { q: string; a: (s: Stats) => string };
  cities: { q: string; a: (s: Stats, top: string) => string };
  dayPass: { q: string; a: (s: Stats, r: Range) => string };
  shoes: { q: string; a: (r: Range) => string };
  booking: { q: string; a: (s: Stats) => string };
  rainy: { q: string; a: (s: Stats) => string };
  language: { q: string; a: string };
  outdoor: { q: string; a: string };
}

const copy: Partial<Record<Locale, Copy>> = {
  en: {
    sep: ", ",
    where: {
      q: "Where can I go rock climbing or bouldering in Taipei?",
      a: (s) =>
        `We list ${s.taipei} indoor climbing and bouldering gyms in Taipei and ${s.newTaipei} more in New Taipei. Open a city page for the map, addresses, opening hours and prices.`,
    },
    cities: {
      q: "Which cities in Taiwan have climbing gyms?",
      a: (s, top) =>
        `${s.total} gyms across ${s.cityCount} cities and counties. The most are in ${top}.`,
    },
    dayPass: {
      q: "How much is a day pass at a climbing gym in Taiwan?",
      a: (s, r) =>
        `Published day passes at the ${s.priced} gyms that list prices run ${ntd(r)}, with weekends sometimes a little more. Several also sell cheaper afternoon or late-evening passes. Prices change, so check the gym’s own page before you go.`,
    },
    shoes: {
      q: "Can I rent climbing shoes?",
      a: (r) =>
        `Yes. ${r.n} gyms list shoe rental in their published prices, at ${ntd(r)}; for the rest, ask the gym.`,
    },
    booking: {
      q: "Do I need to book, or can I just walk in?",
      a: (s) =>
        `It depends on the gym, and we haven’t confirmed walk-in rules for each one. Intro sessions and classes are usually booked in advance; ${s.onlineBooking} gyms take bookings online (Rezio, 17FIT or BeClass). Each gym page links to its official Facebook, Instagram or website, the quickest way to ask.`,
    },
    rainy: {
      q: "I’ve never climbed. Is it a good thing to do in Taipei on a rainy day?",
      a: (s) =>
        `Bouldering needs no ropes, partner or experience, and it’s indoors. ${s.beginners} gyms in Taipei and New Taipei mention intro sessions for first-timers.`,
    },
    language: {
      q: "Is the gym information in English?",
      a: "Gym names, addresses and hours are shown in Chinese, as the gyms publish them. That’s what you’ll want anyway: paste the address into Google Maps or show it to a taxi driver, or tap Directions on any gym page.",
    },
    outdoor: {
      q: "What about outdoor climbing in Taiwan?",
      a: "This directory covers gyms. Taiwan’s best-known outdoor crag is Long Dong (龍洞), sandstone sea cliffs on the northeast coast of New Taipei, best climbed with a local guide or club.",
    },
  },
  ja: {
    sep: "、",
    where: {
      q: "台北でボルダリング・クライミングができる場所は？",
      a: (s) =>
        `台北市に${s.taipei}軒、新北市に${s.newTaipei}軒の屋内クライミング・ボルダリングジムを掲載しています。都市ページで地図、住所、営業時間、料金を確認できます。`,
    },
    cities: {
      q: "台湾のどの都市にクライミングジムがありますか？",
      a: (s, top) =>
        `${s.cityCount}の市・県に計${s.total}軒。多いのは${top}です。`,
    },
    dayPass: {
      q: "台湾のクライミングジムの1日券はいくら？",
      a: (s, r) =>
        `料金を公開している${s.priced}軒の1日券は${ntd(r)}（台湾ドル）で、週末はやや高めのことがあります。午後や夜間の割安券を用意しているジムもあります。料金は変わるので、行く前にジムの公式ページで確認してください。`,
    },
    shoes: {
      q: "クライミングシューズはレンタルできますか？",
      a: (r) =>
        `はい。${r.n}軒が公開料金にシューズレンタルを載せていて、${ntd(r)}です。それ以外のジムは直接お問い合わせください。`,
    },
    booking: {
      q: "予約は必要？それとも直接行っても大丈夫？",
      a: (s) =>
        `ジムによって異なり、当日利用のルールは各ジムで確認できていません。体験会やスクールは事前予約が一般的で、${s.onlineBooking}軒はオンライン予約（Rezio、17FIT、BeClass）に対応しています。各ジムのページから公式Facebook・Instagram・ウェブサイトに飛べるので、そこで問い合わせるのが早いです。`,
    },
    rainy: {
      q: "未経験でも大丈夫？台北の雨の日の過ごし方にいい？",
      a: (s) =>
        `ボルダリングはロープもパートナーも経験も不要で、屋内で楽しめます。台北市と新北市の${s.beginners}軒が初心者向けの体験会を案内しています。`,
    },
    language: {
      q: "ジムの情報は日本語で載っていますか？",
      a: "ジム名・住所・営業時間は、ジムが公開している中国語のまま掲載しています。漢字なのでだいたい読めますし、住所はそのままGoogleマップに貼り付けたりタクシーの運転手に見せたりできます。各ジムのページの「行き方」ボタンも使えます。",
    },
    outdoor: {
      q: "台湾で外岩はできますか？",
      a: "このページはジムのみを掲載しています。台湾で最も有名な外岩は新北市北東海岸の龍洞（ロンドン）で、砂岩の海食崖です。現地のガイドやクラブと一緒に行くのがおすすめです。",
    },
  },
  ko: {
    sep: ", ",
    where: {
      q: "타이베이에서 클라이밍·볼더링을 할 수 있는 곳은?",
      a: (s) =>
        `타이베이에 ${s.taipei}곳, 신베이에 ${s.newTaipei}곳의 실내 클라이밍·볼더링장을 소개합니다. 도시 페이지에서 지도, 주소, 영업시간, 요금을 볼 수 있습니다.`,
    },
    cities: {
      q: "대만 어느 도시에 클라이밍장이 있나요?",
      a: (s, top) =>
        `${s.cityCount}개 시·현에 총 ${s.total}곳이 있습니다. 가장 많은 곳은 ${top}입니다.`,
    },
    dayPass: {
      q: "대만 클라이밍장 1일 이용권은 얼마인가요?",
      a: (s, r) =>
        `요금을 공개한 ${s.priced}곳의 1일 이용권은 ${ntd(r)}(대만 달러)이고, 주말은 조금 더 비싼 경우가 있습니다. 오후·야간 할인권을 파는 곳도 있습니다. 요금은 바뀔 수 있으니 방문 전에 공식 페이지에서 확인하세요.`,
    },
    shoes: {
      q: "암벽화를 빌릴 수 있나요?",
      a: (r) =>
        `네. ${r.n}곳이 공개 요금표에 암벽화 대여를 적어 두었고, 가격은 ${ntd(r)}입니다. 나머지는 클라이밍장에 직접 문의하세요.`,
    },
    booking: {
      q: "예약해야 하나요, 그냥 가도 되나요?",
      a: (s) =>
        `클라이밍장마다 다르며, 당일 이용 규정은 클라이밍장별로 확인하지 못했습니다. 체험 강습과 수업은 보통 미리 예약하며, ${s.onlineBooking}곳은 온라인 예약(Rezio, 17FIT, BeClass)을 받습니다. 각 클라이밍장 페이지에 공식 Facebook·Instagram·웹사이트 링크가 있으니 거기서 문의하는 것이 가장 빠릅니다.`,
    },
    rainy: {
      q: "처음인데 괜찮을까요? 비 오는 날 타이베이에서 하기 좋나요?",
      a: (s) =>
        `볼더링은 로프도, 파트너도, 경험도 필요 없고 실내에서 즐길 수 있습니다. 타이베이와 신베이의 ${s.beginners}곳이 초보자 체험 강습을 안내하고 있습니다.`,
    },
    language: {
      q: "클라이밍장 정보가 한국어로 되어 있나요?",
      a: "클라이밍장 이름, 주소, 영업시간은 클라이밍장이 공개한 중국어 그대로 보여 줍니다. 주소를 그대로 Google 지도에 붙여 넣거나 택시 기사에게 보여 주면 되고, 각 클라이밍장 페이지의 ‘길찾기’ 버튼도 쓸 수 있습니다.",
    },
    outdoor: {
      q: "대만에서 자연 암벽 등반도 할 수 있나요?",
      a: "이 페이지는 클라이밍장만 다룹니다. 대만에서 가장 유명한 자연 암벽은 신베이 북동부 해안의 룽둥(龍洞)으로, 사암 해안 절벽입니다. 현지 가이드나 클럽과 함께 가는 것을 추천합니다.",
    },
  },
};

/** The traveller FAQ in `locale`, or an empty list where it isn't shown. */
export function visitorFaq(
  locale: Locale,
  cityName: (zh: string) => string,
): VisitorQuestion[] {
  const c = copy[locale];

  if (!c) return [];
  const s = stats();
  const cityLink = (zh: string) => ({
    label: `${cityName(zh)} (${count(zh)})`,
    path: cityPath(zh),
  });
  const top = s.byCount
    .slice(0, 4)
    .map((city) => `${cityName(city.name)} (${count(city.name)})`)
    .join(c.sep);

  return [
    {
      q: c.where.q,
      a: c.where.a(s),
      links: [cityLink("台北市"), cityLink("新北市")],
    },
    {
      q: c.cities.q,
      a: c.cities.a(s, top),
      links: s.byCount.slice(0, 6).map((city) => cityLink(city.name)),
    },
    ...(s.dayPass ? [{ q: c.dayPass.q, a: c.dayPass.a(s, s.dayPass) }] : []),
    ...(s.shoes ? [{ q: c.shoes.q, a: c.shoes.a(s.shoes) }] : []),
    { q: c.booking.q, a: c.booking.a(s) },
    { q: c.rainy.q, a: c.rainy.a(s) },
    c.language,
    c.outdoor,
  ];
}
