import type { Dictionary } from "@/lib/i18n";

import en from "./en";

/**
 * Korean covers the gym directory only (see `localesFor`). Everything the gym
 * pages show is translated; the rest falls back to English and is never
 * rendered, since other /ko pages redirect to /en.
 */
const ko: Dictionary = {
  ...en,
  htmlLang: "ko",
  ogLocale: "ko_KR",
  meta: {
    title: "VARO | 대만 볼더링·클라이밍장 정보",
    description:
      "대만의 볼더링·클라이밍장을 지도에서 찾아보세요. 타이베이, 타이중, 가오슝 등 클라이밍장의 주소, 영업시간, 1일 이용권 요금, 암벽화 대여, 가는 길을 소개합니다.",
    keywords: [
      "대만 클라이밍",
      "타이베이 클라이밍",
      "대만 볼더링",
      "타이베이 클라이밍장",
      "타이베이 비오는날",
      "타이베이 액티비티",
    ],
  },
  nav: {
    ...en.nav,
    switchLabel: "언어",
    switchAria: "언어 바꾸기",
  },
  waitlist: {
    label: "이메일",
    placeholder: "이메일 주소",
    button: "알림 받기",
    sending: "보내는 중…",
    count: (n) => `${n.toLocaleString("ko")}명이 신청했어요`,
    joined: "신청 완료! 출시되면 가장 먼저 알려 드릴게요.",
    already: "이미 신청한 이메일이에요. 출시되면 알려 드릴게요.",
    invalid: "올바른 이메일을 입력해 주세요.",
    toast: {
      joined: {
        title: "대기자 명단에 올렸어요!",
        body: "VARO가 출시되면 가장 먼저 알려 드릴게요.",
      },
      already: {
        title: "이미 신청하셨어요",
        body: "출시되면 이메일로 알려 드릴게요. 다시 신청하지 않아도 돼요.",
      },
      invalid: {
        title: "이메일 형식이 올바르지 않아요",
        body: "확인 후 다시 시도해 주세요.",
      },
      error: {
        title: "신청하지 못했어요",
        body: "연결이 불안정할 수 있어요. 잠시 후 다시 시도해 주세요.",
      },
    },
  },
  gyms: {
    meta: {
      title: (n, year) =>
        `대만 볼더링·클라이밍장 (${year}): ${n}곳 지도 | VARO`,
      description: (n) =>
        `대만에서 클라이밍하려면 여기서 찾아보세요. 타이베이, 타이중, 가오슝 등 실내 클라이밍·볼더링장 ${n}곳의 1일 이용권 요금, 암벽화 대여, 영업시간, 가는 길을 지도로. 여행자도 환영.`,
    },
    nav: "클라이밍장 지도",
    title: "대만 클라이밍장",
    lead: (n, cities) =>
      `${cities}개 시·현의 실내 클라이밍·볼더링장 ${n}곳. 지도 위 홀드 하나가 클라이밍장 한 곳이에요. 도시를 고르면 그 지역을 보여 줍니다.`,
    all: "전체",
    mapLabel: "대만 볼더링장 지도",
    kinds: {
      boulder: "볼더링",
      mixed: "볼더링 + 로프",
      rope: "주로 로프",
      kids: "어린이·작은 벽",
      outdoor: "야외·반야외",
    },
    unconfirmed: "영업 여부 미확인",
    unconfirmedHint: "속이 빈 홀드: 영업 여부 미확인",
    weekday: "평일",
    weekend: "주말",
    shoes: "암벽화",
    currency: "NT$",
    directions: "길찾기",
    website: "웹사이트",
    call: "전화",
    more: "영업시간과 자세한 정보 (중국어)",
    hours: "영업시간",
    courses: "체험 강습·수업",
    facilities: "시설",
    booking: "예약",
    address: "주소",
    notes: "가기 전에",
    showAll: "모든 도시 보기",
    breadcrumb: "탐색 경로",
    visitorTitle: "여행자를 위한 대만 클라이밍 안내",
    caveat: {
      title: "가기 전에 확인하세요",
      body: (date) =>
        `이 목록은 공개된 정보를 모아 만든 것으로, 마지막 확인일은 ${date}입니다. 영업시간과 요금 대부분은 클라이밍장에 직접 확인하지 못했으니, 가기 전에 공식 페이지를 확인하세요.`,
      report: "잘못된 정보를 발견했거나 클라이밍장을 운영하시나요?",
      reportLink: "이메일 보내기",
      reportSubject: "VARO 클라이밍장 정보 수정",
    },
    closing: {
      title: ["가 보고 싶은 곳을 찾았나요?", "모든 시도를 기록하세요."],
    },
    date: (iso) =>
      new Date(`${iso}T00:00:00`).toLocaleDateString("ko", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    cities: {
      台北市: "타이베이",
      新北市: "신베이",
      桃園市: "타오위안",
      新竹市: "신주시",
      新竹縣: "신주현",
      台中市: "타이중",
      彰化縣: "장화",
      南投縣: "난터우",
      雲林縣: "윈린",
      嘉義市: "자이시",
      台南市: "타이난",
      高雄市: "가오슝",
      宜蘭縣: "이란",
      花蓮縣: "화롄",
      台東縣: "타이둥",
    },
  },
  gymsCity: {
    meta: {
      title: (f) => `${f.city} 볼더링·클라이밍장 (${f.year}): ${f.n}곳 | VARO`,
      description: (f) =>
        `${f.city}에서 클라이밍하려면. 실내 클라이밍·볼더링장 ${f.n}곳의 지도, 영업시간, 예약 방법${f.priced.length ? ", 1일 이용권 요금과 암벽화 대여" : ""}.`,
    },
    title: (city) => `${city} 클라이밍장`,
    lead: (f, kind) =>
      `${f.city}에서 볼더링을 할 수 있는 곳은 ${f.n}곳: ${f.kinds.map((k) => `${kind(k.kind)} ${k.n}곳`).join(", ")}.`,
    faqTitle: "자주 묻는 질문",
    faq: {
      count: (f) => ({
        q: `${f.city}에 볼더링장은 몇 곳인가요?`,
        a: `${f.n}곳을 소개합니다:`,
        items: f.names,
      }),
      price: (f) =>
        f.priced.length
          ? {
              q: `${f.city}에서 볼더링 요금은 얼마인가요?`,
              a: "요금을 공개한 곳은 다음과 같습니다. 나머지는 각 클라이밍장 페이지에서 확인하세요:",
              items: f.priced.map(
                (p) =>
                  `${p.name}: ${[
                    p.weekday && `평일 NT$${p.weekday}`,
                    p.weekend && `주말 NT$${p.weekend}`,
                    p.shoes && `암벽화 대여 NT$${p.shoes}`,
                    p.notes,
                  ]
                    .filter(Boolean)
                    .join(", ")} (출처: ${p.source})`,
              ),
            }
          : {
              q: `${f.city}에서 볼더링 요금은 얼마인가요?`,
              a: "확인된 최신 요금이 없습니다. 각 클라이밍장 페이지에서 확인하세요.",
            },
      beginners: (f) => ({
        q: `${f.city}에서 체험 강습이나 수업이 있는 곳은?`,
        a: "다음 클라이밍장이 체험 강습이나 수업을 안내하고 있습니다. 최신 일정은 클라이밍장에 문의하세요:",
        items: f.beginners.map((b) => `${b.name}: ${b.courses}`),
      }),
      kids: (f) => ({
        q: `${f.city}에서 아이와 가기 좋은 곳은?`,
        a: "다음 클라이밍장이 어린이 수업이나 어린이용 벽을 안내하고 있습니다. 가기 전에 확인하세요:",
        items: f.kids,
      }),
    },
    otherCities: "다른 도시의 볼더링장",
    allGyms: "전체 클라이밍장 지도 보기",
    listSep: "; ",
    listEnd: ".",
  },
  gymPage: {
    title: (name, city) =>
      `${name} | ${city} 클라이밍장: 영업시간·요금·가는 길 | VARO`,
    description: (g) =>
      `대만 ${g.city}의 클라이밍장 ${g.name}의 주소, 영업시간${g.priced ? ", 1일 이용권 요금" : ""}, 공식 연락처. 가기 전에 최신 정보를 클라이밍장에 확인하세요.`,
    missing: "아직 정보가 없습니다. 클라이밍장에 문의하세요.",
    prices: "공개된 요금 (대만 달러)",
    sourceNote: "출처: ",
    sourcesTitle: "출처와 업데이트 상태",
    checked: "데이터 확인일: ",
    sourcesBody:
      "이 날짜는 목록 전체의 확인일이며, 이 클라이밍장의 모든 정보가 공식 확인되었다는 뜻은 아닙니다. 영업시간과 요금은 바뀔 수 있고, 각 항목에 알려진 출처를 적어 두었습니다. 정보가 없다고 해서 서비스가 없다는 뜻은 아닙니다.",
    officialLinks: "공식 연락처",
    officialNote:
      "최신 공지를 확인하기 위한 링크이며, 위 정보가 모두 이 페이지에서 나왔다는 뜻은 아닙니다.",
    moreInArea: "이 지역의 다른 클라이밍장",
  },
  footer: {
    support: "고객 지원",
    privacy: "개인정보",
    flag: "대만 국기",
  },
};

export default ko;
