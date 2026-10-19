import type { Gym } from "./types";
import type { Locale } from "@/lib/i18n/config";

import enText from "./i18n/en.json";
import jaText from "./i18n/ja.json";
import koText from "./i18n/ko.json";

/**
 * A gym's research text in the page's language. The data stays in Chinese
 * (lib/gyms/data.ts is generated from the CSV); free text is looked up by its
 * Chinese source, so text added by a new CSV shows in Chinese until it gets a
 * translation (`node scripts/gym-i18n-missing.mjs` lists it). `city` stays the
 * Chinese key the map filters on; addresses stay Chinese for maps and taxis.
 */
type Lang = Exclude<Locale, "zh-TW">;

const text: Record<Lang, Record<string, string>> = {
  en: enText,
  ja: jaText,
  ko: koText,
};

const DAYS = "一二三四五六日";

const days: Record<
  Lang,
  {
    names: string[];
    range: (a: string, b: string) => string;
    list: (d: string[]) => string;
    weekdays: string;
    daily: string;
    satHolidays: string;
    closed: (d: string) => string;
    sep: string;
  }
> = {
  en: {
    names: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    range: (a, b) => `${a}–${b}`,
    list: (d) => (d.length === 2 ? d.join(" & ") : d.join(", ")),
    weekdays: "Weekdays",
    daily: "Daily",
    satHolidays: "Sat & public holidays",
    closed: (d) => `${d}: closed`,
    sep: ", ",
  },
  ja: {
    names: ["月", "火", "水", "木", "金", "土", "日"],
    range: (a, b) => `${a}〜${b}`,
    list: (d) => d.join("・"),
    weekdays: "平日",
    daily: "毎日",
    satHolidays: "土・祝日",
    closed: (d) => `${d}曜定休`,
    sep: "、",
  },
  ko: {
    names: ["월", "화", "수", "목", "금", "토", "일"],
    range: (a, b) => `${a}–${b}`,
    list: (d) => d.join("·"),
    weekdays: "평일",
    daily: "매일",
    satHolidays: "토·공휴일",
    closed: (d) => `${d} 휴무`,
    sep: ", ",
  },
};

/** Whole lines that aren't a schedule. */
const phrases: Record<Lang, Record<string, string>> = {
  en: {
    預約制: "By appointment",
    "預約制，時段洽中心": "By appointment; ask the centre for times",
    "預約制，需向中心確認": "By appointment; confirm with the centre",
    可預約時段洽分館: "Ask the branch for bookable times",
    先預約確認: "Book ahead to confirm",
    未取得明確時段: "Hours not found",
  },
  ja: {
    預約制: "予約制",
    "預約制，時段洽中心": "予約制（時間はセンターに問い合わせ）",
    "預約制，需向中心確認": "予約制（センターに要確認）",
    可預約時段洽分館: "予約可能な時間は各店舗に問い合わせ",
    先預約確認: "事前に予約して確認",
    未取得明確時段: "営業時間は未確認",
  },
  ko: {
    預約制: "예약제",
    "預約制，時段洽中心": "예약제 (시간은 센터에 문의)",
    "預約制，需向中心確認": "예약제 (센터에 확인 필요)",
    可預約時段洽分館: "예약 가능 시간은 지점에 문의",
    先預約確認: "미리 예약해 확인",
    未取得明確時段: "영업시간 미확인",
  },
};

/** Lead-ins before a schedule: "體驗可預約週六日10:00–12:00". */
const prefixes: Record<Lang, Record<string, string>> = {
  en: { 體驗可預約: "Intro sessions: ", 團體: "Groups: " },
  ja: { 體驗可預約: "体験予約：", 團體: "団体：" },
  ko: { 體驗可預約: "체험 예약: ", 團體: "단체: " },
};

/** "週一至五14:00–22:00" → "Mon–Fri 14:00–22:00". Unknown lines come back as is. */
export function localizeHours(line: string, lang: Lang): string {
  const d = days[lang];
  const whole = phrases[lang][line];

  if (whole) return whole;
  for (const [zh, out] of Object.entries(prefixes[lang])) {
    if (line.startsWith(zh)) {
      const rest = localizeHours(line.slice(zh.length), lang);

      return rest === line.slice(zh.length) ? line : out + rest;
    }
  }

  const m = line.match(
    /^(週[一二三四五六日]+(?:至[一二三四五六日])?|平日|每日|週六／例假日)\s*(休|\d{2}:\d{2}–\d{2}:\d{2}(?:、\d{2}:\d{2}–\d{2}:\d{2})*)$/,
  );

  if (!m) return line;
  const [, when, what] = m;
  const day = (c: string) => d.names[DAYS.indexOf(c)];
  let label: string;

  if (when === "平日") label = d.weekdays;
  else if (when === "每日") label = d.daily;
  else if (when === "週六／例假日") label = d.satHolidays;
  else if (when.includes("至")) label = d.range(day(when[1]), day(when[3]));
  else {
    const chars = when.slice(1).split("");

    label = chars.length === 1 ? day(chars[0]) : d.list(chars.map(day));
  }

  return what === "休"
    ? d.closed(label)
    : `${label} ${what.split("、").join(d.sep)}`;
}

/** District names as each language writes them. */
const districts: Record<string, Record<Lang, string>> = {
  士林區: { en: "Shilin", ja: "士林区", ko: "스린구" },
  大同區: { en: "Datong", ja: "大同区", ko: "다퉁구" },
  中山區: { en: "Zhongshan", ja: "中山区", ko: "중산구" },
  中正區: { en: "Zhongzheng", ja: "中正区", ko: "중정구" },
  內湖區: { en: "Neihu", ja: "内湖区", ko: "네이후구" },
  文山區: { en: "Wenshan", ja: "文山区", ko: "원산구" },
  北投區: { en: "Beitou", ja: "北投区", ko: "베이터우구" },
  南港區: { en: "Nangang", ja: "南港区", ko: "난강구" },
  萬華區: { en: "Wanhua", ja: "萬華区", ko: "완화구" },
  中和區: { en: "Zhonghe", ja: "中和区", ko: "중허구" },
  永和區: { en: "Yonghe", ja: "永和区", ko: "융허구" },
  新店區: { en: "Xindian", ja: "新店区", ko: "신뎬구" },
  新莊區: { en: "Xinzhuang", ja: "新荘区", ko: "신좡구" },
  土城區: { en: "Tucheng", ja: "土城区", ko: "투청구" },
  中壢區: { en: "Zhongli", ja: "中壢区", ko: "중리구" },
  桃園區: { en: "Taoyuan District", ja: "桃園区", ko: "타오위안구" },
  楊梅區: { en: "Yangmei", ja: "楊梅区", ko: "양메이구" },
  東區: { en: "East District", ja: "東区", ko: "동구" },
  竹北市: { en: "Zhubei", ja: "竹北市", ko: "주베이시" },
  北屯區: { en: "Beitun", ja: "北屯区", ko: "베이툰구" },
  西屯區: { en: "Xitun", ja: "西屯区", ko: "시툰구" },
  南屯區: { en: "Nantun", ja: "南屯区", ko: "난툰구" },
  南投市: { en: "Nantou City", ja: "南投市", ko: "난터우시" },
  斗六市: { en: "Douliu", ja: "斗六市", ko: "더우류시" },
  西區: { en: "West District", ja: "西区", ko: "서구" },
  仁德區: { en: "Rende", ja: "仁徳区", ko: "런더구" },
  北區: { en: "North District", ja: "北区", ko: "북구" },
  左營區: { en: "Zuoying", ja: "左営区", ko: "쭤잉구" },
  前鎮區: { en: "Qianzhen", ja: "前鎮区", ko: "첸전구" },
  冬山鄉: { en: "Dongshan", ja: "冬山郷", ko: "둥산향" },
  宜蘭市: { en: "Yilan City", ja: "宜蘭市", ko: "이란시" },
  吉安鄉: { en: "Ji'an", ja: "吉安郷", ko: "지안향" },
  台東市: { en: "Taitung City", ja: "台東市", ko: "타이둥시" },
  員林市: { en: "Yuanlin", ja: "員林市", ko: "위안린시" },
};

/** The gym with its text in `locale`; Chinese pages get it unchanged. */
export function localizeGym(gym: Gym, locale: Locale): Gym {
  if (locale === "zh-TW") return gym;
  const t = text[locale];
  const tr = (s?: string) => (s ? (t[s] ?? s) : s);

  return {
    ...gym,
    district: districts[gym.district]?.[locale] ?? gym.district,
    hours: gym.hours?.map((h) => localizeHours(h, locale)),
    hoursNote: tr(gym.hoursNote),
    courses: tr(gym.courses),
    facilities: tr(gym.facilities),
    booking: tr(gym.booking),
    notes: tr(gym.notes),
    price: gym.price && {
      ...gym.price,
      notes: tr(gym.price.notes),
      source: tr(gym.price.source)!,
    },
  };
}

/** The language a gym's text is in, for `lang` attributes. */
export const gymTextLang = (locale: Locale) =>
  locale === "zh-TW" ? "zh-Hant" : locale;
