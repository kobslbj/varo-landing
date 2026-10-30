import type { Dictionary } from "@/lib/i18n";

import en from "./en";

/**
 * Japanese covers the gym directory only (see `localesFor`). Everything the
 * gym pages show is translated; the rest falls back to English and is never
 * rendered, since other /ja pages redirect to /en.
 */
const ja: Dictionary = {
  ...en,
  htmlLang: "ja",
  ogLocale: "ja_JP",
  meta: {
    title: "VARO｜台湾のボルダリング・クライミングジム情報",
    description:
      "台湾のボルダリング・クライミングジムを地図で探せます。台北・台中・高雄などのジムの住所、営業時間、1日券の料金、シューズレンタル、行き方を掲載。",
    keywords: [
      "台湾 クライミング",
      "台北 ボルダリング",
      "台湾 ボルダリング",
      "台北 クライミングジム",
      "台北 雨の日",
      "台北 アクティビティ",
    ],
  },
  nav: {
    ...en.nav,
    switchLabel: "言語",
    switchAria: "言語を切り替える",
  },
  waitlist: {
    label: "メールアドレス",
    placeholder: "メールアドレス",
    button: "通知を受け取る",
    sending: "送信中…",
    count: (n) => `${n.toLocaleString("ja")}人が登録済み`,
    joined: "登録しました！リリース時にお知らせします。",
    already: "このメールアドレスは登録済みです。リリース時にお知らせします。",
    invalid: "有効なメールアドレスを入力してください。",
    toast: {
      joined: {
        title: "ウェイトリストに登録しました！",
        body: "VARO のリリース時に最初にお知らせします。",
      },
      already: {
        title: "すでに登録されています",
        body: "リリース時にメールでお知らせします。再登録は不要です。",
      },
      invalid: {
        title: "メールアドレスが正しくないようです",
        body: "確認してもう一度お試しください。",
      },
      error: {
        title: "登録できませんでした",
        body: "通信が不安定な可能性があります。しばらくしてからもう一度お試しください。",
      },
    },
  },
  gyms: {
    meta: {
      title: (n, year) =>
        `台湾のボルダリング・クライミングジム（${year}）：${n}軒を地図で｜VARO`,
      description: (n) =>
        `台湾でクライミングするならここ。台北・台中・高雄など${n}軒の屋内クライミング・ボルダリングジムの1日券料金、シューズレンタル、営業時間、行き方を地図で。旅行者にも。`,
    },
    nav: "ジムマップ",
    title: "台湾のクライミングジム",
    lead: (n, cities) =>
      `${cities}の市・県にある${n}軒の屋内クライミング・ボルダリングジム。地図上のホールドが1軒のジムです。都市を選ぶとそのエリアを表示します。`,
    all: "すべて",
    mapLabel: "台湾のボルダリングジムの地図",
    kinds: {
      boulder: "ボルダリング",
      mixed: "ボルダリング＋ロープ",
      rope: "主にロープ",
      kids: "キッズ・小さな壁",
      outdoor: "屋外・半屋外",
    },
    unconfirmed: "営業中か未確認",
    unconfirmedHint: "白抜きのホールド：営業中か未確認",
    weekday: "平日",
    weekend: "週末",
    shoes: "シューズ",
    currency: "NT$",
    directions: "行き方",
    website: "ウェブサイト",
    call: "電話",
    more: "営業時間と詳細",
    hours: "営業時間",
    courses: "体験会・スクール",
    facilities: "設備",
    booking: "予約",
    address: "住所",
    notes: "行く前に",
    showAll: "すべての都市を表示",
    breadcrumb: "パンくずリスト",
    visitorTitle: "旅行者のための台湾クライミングガイド",
    caveat: {
      title: "行く前に確認を",
      body: (date) =>
        `このリストは公開情報をもとにまとめたもので、最終確認日は${date}です。営業時間や料金の多くはジムに確認できていないため、行く前にジムの公式ページを確認してください。`,
      report: "誤りを見つけた方、ジムの運営者の方へ",
      reportLink: "メールで連絡",
      reportSubject: "VARO ジム情報の修正",
    },
    closing: {
      title: ["行きたいジムは見つかった？", "すべてのトライを記録しよう。"],
    },
    date: (iso) =>
      new Date(`${iso}T00:00:00`).toLocaleDateString("ja", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    cities: {
      台北市: "台北",
      新北市: "新北",
      桃園市: "桃園",
      新竹市: "新竹市",
      新竹縣: "新竹県",
      台中市: "台中",
      彰化縣: "彰化",
      南投縣: "南投",
      雲林縣: "雲林",
      嘉義市: "嘉義市",
      台南市: "台南",
      高雄市: "高雄",
      宜蘭縣: "宜蘭",
      花蓮縣: "花蓮",
      台東縣: "台東",
      香港: "香港",
      新加坡: "シンガポール",
      吉隆坡: "クアラルンプール",
      八打靈再也: "ペタリンジャヤ",
      梳邦再也: "スバンジャヤ",
      莎阿南: "シャー・アラム",
      布城: "プトラジャヤ",
      檳城: "ペナン",
      新山: "ジョホールバル",
      馬六甲: "マラッカ",
      亞庇: "コタキナバル",
      古晉: "クチン",
      美里: "ミリ",
    },
    countries: {
      TW: "台湾",
      HK: "香港",
      SG: "シンガポール",
      MY: "マレーシア",
    },
    where: (city, country) =>
      country === "TW"
        ? `台湾・${city}`
        : country === "MY"
          ? `マレーシア・${city}`
          : city,
    abroad: {
      eyebrow: "その他の地域",
      title: "香港・シンガポール・マレーシア",
      lead: (n) =>
        `VARO アプリには、この3つの地域のジム ${n} 件も掲載しています。情報は住所・公式リンク・備考のみです。営業時間と料金はジムに確認してください。`,
      unit: () => "件のジム",
      jump: "香港・シンガポール・マレーシアも掲載",
      back: "すべてのジム",
    },
  },
  gymsCity: {
    meta: {
      title: (f) =>
        `${f.city}のボルダリング・クライミングジム（${f.year}）：${f.n}軒｜VARO`,
      description: (f) =>
        `${f.city}でクライミングするなら。屋内クライミング・ボルダリングジム${f.n}軒の地図、営業時間、予約方法${f.priced.length ? "、1日券の料金とシューズレンタル" : ""}。`,
    },
    title: (city) => `${city}のクライミングジム`,
    lead: (f, kind) =>
      `${f.city}でボルダリングができるジムは${f.n}軒：${f.kinds.map((k) => `${kind(k.kind)}${k.n}軒`).join("、")}。`,
    faqTitle: "よくある質問",
    faq: {
      count: (f) => ({
        q: `${f.city}にボルダリングジムは何軒ありますか？`,
        a: `${f.n}軒を掲載しています：`,
        items: f.names,
      }),
      price: (f) =>
        f.priced.length
          ? {
              q: `${f.city}のボルダリングの料金は？`,
              a: "料金を公開しているジムは以下のとおりです。その他のジムは公式ページで確認してください：",
              items: f.priced.map(
                (p) =>
                  `${p.name}：${[
                    p.weekday && `平日 NT$${p.weekday}`,
                    p.weekend && `週末 NT$${p.weekend}`,
                    p.shoes && `シューズレンタル NT$${p.shoes}`,
                    p.notes,
                  ]
                    .filter(Boolean)
                    .join("、")}（出典：${p.source}）`,
              ),
            }
          : {
              q: `${f.city}のボルダリングの料金は？`,
              a: "確認できた最新の料金はありません。各ジムの公式ページで確認してください。",
            },
      beginners: (f) => ({
        q: `${f.city}で体験会やスクールがあるジムは？`,
        a: "以下のジムが体験会やスクールを案内しています。最新の日時はジムに確認してください：",
        items: f.beginners.map((b) => `${b.name}：${b.courses}`),
      }),
      kids: (f) => ({
        q: `${f.city}で子ども向けのジムは？`,
        a: "以下のジムがキッズクラスやキッズ用の壁を案内しています。行く前に確認してください：",
        items: f.kids,
      }),
    },
    otherCities: "ほかの都市のボルダリングジム",
    allGyms: "全ジムの地図を見る",
    listSep: "、",
    listEnd: "。",
  },
  gymsAbroad: {
    meta: {
      title: (f) =>
        `${f.where}のボルダリングジム（${f.year}）：${f.n}軒の住所と地図｜VARO`,
      description: (f) =>
        `${f.where}でボルダリングができるジム${f.n}軒：${f.names.slice(0, 3).join("、")}など。地図、住所、公式サイト・Instagramへのリンク${f.ropes.length ? `。うち${f.ropes.length}軒はロープクライミングも可能` : ""}。`,
    },
    faq: {
      districts: (f) => ({
        q: `${f.city}のボルダリングジムはどこに多いですか？`,
        a: `最も多いのは${f.districtCounts[0].name}（${f.districtCounts[0].n}軒）${
          f.districtCounts.length > 1
            ? `、次いで${f.districtCounts
                .slice(1, 3)
                .map((d) => `${d.name}（${d.n}軒）`)
                .join("、")}`
            : ""
        }です。`,
      }),
      ropes: (f) => ({
        q: `${f.city}でロープクライミングもできるジムは？`,
        a: "ボルダリングに加えて、トップロープやリードの壁があるジム：",
        items: f.ropes,
      }),
      hours: (f) => ({
        q: `${f.city}のクライミングジムの営業時間と料金は？`,
        a: "VARO ではこれらのジムの営業時間と料金をまだ掲載していません。各ジムのページに公式サイトと Instagram へのリンクがあるので、行く前にご確認ください。",
      }),
    },
    hub: {
      title: (country) => `${country}のクライミングジム`,
      metaTitle: (country, n, cities, year) =>
        `${country}のボルダリングジム（${year}）：${cities.slice(0, 2).join("・")}など${n}軒｜VARO`,
      description: (country, n, cities) =>
        `${country}のボルダリング・クライミングジム${n}軒（${cities.join("、")}）。都市ごとに住所、地図、公式リンクを掲載。`,
      lead: (n, cities) =>
        `ボルダリングができるジム${n}軒、${cities.length}都市：${cities.map((c) => `${c.name}${c.n}軒`).join("、")}。`,
      where: (country) => ({
        q: `${country}でボルダリングができる場所は？`,
        a: "ジムを掲載している都市：",
      }),
      cityLine: (city, n, names) => `${city}：${n}軒（${names.join("、")}）`,
      seeCity: (city) => `${city}の地図 →`,
      all: (country) => `${country}のすべてのジム →`,
    },
  },
  gymPage: {
    titleAbroad: (name, where) =>
      `${name}｜${where}のボルダリングジム：住所・地図・公式リンク｜VARO`,
    descriptionAbroad: (g) =>
      `${g.district ? `${g.where}・${g.district}` : g.where}の${g.ropes ? "ボルダリングとロープクライミングができる" : "ボルダリング"}ジム「${g.name}」。住所、地図、公式サイト・Instagramへのリンク。営業時間と料金は公式情報をご確認ください。`,
    title: (name, city) =>
      `${name}｜${city}のクライミングジム：営業時間・料金・行き方｜VARO`,
    description: (g) =>
      `${g.where}のクライミングジム「${g.name}」の住所、営業時間${g.priced ? "、1日券の料金" : ""}、公式連絡先。行く前に最新情報をジムに確認してください。`,
    missing: "未掲載です。ジムにお問い合わせください。",
    prices: "掲載料金（台湾ドル）",
    sourceNote: "出典：",
    sourcesTitle: "出典と更新状況",
    checked: "データ確認日：",
    sourcesBody:
      "これはリスト全体の確認日で、このジムのすべての情報が公式に確認済みという意味ではありません。営業時間や料金は変わることがあり、各項目に分かっている出典を記載しています。未掲載はサービスがないという意味ではありません。",
    officialLinks: "公式連絡先",
    officialNote:
      "最新のお知らせを確認するためのリンクです。上記のすべての情報がこれらのページから取られたという意味ではありません。",
    moreInArea: "このエリアのほかのジム",
    place: (city, district) => (district ? `${city} ${district}` : city),
  },
  footer: {
    support: "サポート",
    privacy: "プライバシー",
    flag: "台湾の国旗",
  },
};

export default ja;
