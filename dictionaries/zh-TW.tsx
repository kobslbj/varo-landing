import type { CityFacts } from "@/lib/gyms/city-facts";
import type { Country, GymKind } from "@/lib/gyms/types";

const zhTW = {
  htmlLang: "zh-Hant-TW",
  ogLocale: "zh_TW",
  meta: {
    title: "VARO｜抱石紀錄 App，為抱石者打造",
    description:
      "Varo 是為抱石者打造的攀岩紀錄 App。記下每次攀爬與嘗試、追蹤正在挑戰的 Project，回頭看見自己的進步。",
    keywords: [
      "抱石",
      "攀岩",
      "攀岩紀錄",
      "bouldering",
      "climbing log",
      "Varo",
    ],
  },
  nav: {
    articles: "文章",
    philosophy: "理念",
    partner: "場館合作",
    /** Link to the other language. */
    switchLabel: "EN",
    switchAria: "Switch to English",
  },
  partnerSubject: "Varo 場館合作",
  /** The /articles index and the chrome around each article. */
  articles: {
    meta: {
      title: "抱石新手指南與攀岩文章｜VARO",
      description:
        "第一次抱石怎麼玩、抱石跟上攀差在哪？VARO 整理給台灣岩友的抱石入門文章：從準備、入場、規矩到怎麼選第一次的攀岩體驗。",
    },
    eyebrow: "文章",
    title: "抱石，從第一次開始",
    lead: "給剛開始抱石的你：去岩館前該知道的事、牆上的規矩，以及怎麼一次比一次爬得更好。",
    heading: "VARO 抱石新手指南",
    slogan: ["生來就是", "為了突破。"] as [string, string],
    chat: [
      { me: false, text: "週五下班要不要去抱石？" },
      { me: true, text: "我沒爬過欸，會不會很難" },
      { me: false, text: "第一次從最簡單的開始，鞋子現場租就好" },
      { me: true, text: "好，衝！" },
    ],
    tags: ["#第一次抱石", "#抱石新手"] as [string, string],
    featured: "先讀這篇",
    closing: {
      title: "讀完了，就揪朋友去爬吧。",
      body: "全台抱石館的地址、營業時間和價格，一張地圖看完。",
      cta: "打開岩館地圖",
    },
    categories: { basics: "入門", routes: "路線知識" },
    readMinutes: (n: number) => `${n} 分鐘閱讀`,
    updated: "更新",
    published: "發布",
    readMore: "閱讀全文",
    onlyChinese: null as string | null,
  },
  /** Shown instead of the App Store button until the app is out. */
  waitlist: {
    label: "Email",
    placeholder: "你的 email",
    button: "上架通知我",
    sending: "送出中…",
    count: (n: number) => `已有 ${n.toLocaleString("zh-TW")} 位岩友加入`,
    joined: "已加入！上架時第一個通知你。",
    already: "這個 email 已經在名單上了，上架時會通知你。",
    invalid: "請輸入有效的 email。",
    /** Toasts after pressing the button. */
    toast: {
      joined: {
        title: "已加入等候名單！",
        body: "VARO 上架時，第一個通知你。",
      },
      already: {
        title: "你已經在名單上了",
        body: "上架時會寄信通知你，不用再登記一次。",
      },
      invalid: { title: "Email 格式不正確", body: "檢查一下再送出吧。" },
      error: { title: "送出失敗", body: "可能是網路不穩，請稍後再試一次。" },
    },
  },
  /** The /gyms page. Gym details stay in Chinese, as published by the gyms. */
  gyms: {
    meta: {
      title: (n: number, year: number) =>
        `全台抱石館・攀岩館地圖（${year}）｜${n} 間地址、營業時間與價格｜VARO`,
      description: (n: number) =>
        `全台 ${n} 間可以抱石的岩館：台北、新北、桃園、新竹、台中、台南、高雄、宜蘭等地的地址、營業時間、價格與預約方式，一張地圖看完。`,
    },
    nav: "岩館",
    title: "全台抱石館",
    lead: (n: number, cities: number) =>
      `${n} 間可以抱石的岩館，分布在 ${cities} 個縣市。地圖上每顆岩點都是一間館，點縣市就能看那一區。`,
    all: "全部",
    mapLabel: "台灣抱石館地圖",
    kinds: {
      boulder: "抱石館",
      mixed: "抱石＋上攀",
      rope: "上攀為主",
      kids: "兒童／小型抱石",
      outdoor: "戶外／半戶外",
    },
    unconfirmed: "營運狀態待確認",
    unconfirmedHint: "空心岩點：營運狀態待確認",
    weekday: "平日",
    weekend: "假日",
    shoes: "岩鞋",
    currency: "$",
    directions: "導航",
    website: "官網",
    call: "電話",
    more: "營業時間與更多資訊",
    hours: "營業時間",
    courses: "體驗與課程",
    facilities: "設施",
    booking: "預約方式",
    address: "地址",
    notes: "出發前留意",
    showAll: "看全部縣市",
    breadcrumb: "麵包屑導覽",
    /** Heading of the travellers' FAQ; not shown in Chinese. */
    visitorTitle: "",
    caveat: {
      title: "出發前先確認",
      body: (date: string) =>
        `這份清單整理自公開資訊，最後查核於 ${date}。營業時間和價格大多還沒跟場館確認，出發前請先看場館的官方公告。`,
      report: "資料有誤，或你經營其中一間岩館？",
      reportLink: "寫信告訴我們",
      reportSubject: "VARO 岩館資料更正",
    },
    closing: {
      title: ["找到想去的館了？", "每一次嘗試都記下來。"],
    },
    date: (iso: string) => {
      const [y, m, d] = iso.split("-").map(Number);

      return `${y} 年 ${m} 月 ${d} 日`;
    },
    cities: {
      台北市: "台北市",
      新北市: "新北市",
      桃園市: "桃園市",
      新竹市: "新竹市",
      新竹縣: "新竹縣",
      台中市: "台中市",
      彰化縣: "彰化縣",
      南投縣: "南投縣",
      雲林縣: "雲林縣",
      嘉義市: "嘉義市",
      台南市: "台南市",
      高雄市: "高雄市",
      宜蘭縣: "宜蘭縣",
      花蓮縣: "花蓮縣",
      台東縣: "台東縣",
      香港: "香港",
      新加坡: "新加坡",
      吉隆坡: "吉隆坡",
      八打靈再也: "八打靈再也",
      梳邦再也: "梳邦再也",
      莎阿南: "莎阿南",
      布城: "布城",
      檳城: "檳城",
      新山: "新山",
      馬六甲: "馬六甲",
      亞庇: "亞庇",
      古晉: "古晉",
      美里: "美里",
    } as Record<string, string>,
    countries: {
      TW: "台灣",
      HK: "香港",
      SG: "新加坡",
      MY: "馬來西亞",
    } as Record<Country, string>,
    /** Where a gym is, for sentences: "馬來西亞檳城", but just "香港". */
    where: (city: string, country: Country) =>
      country === "MY" ? `馬來西亞${city}` : city,
    abroad: {
      eyebrow: "其他地區",
      title: "香港・新加坡・馬來西亞",
      lead: (n: number) =>
        `VARO App 也收錄了這三地的 ${n} 間岩館。資料比台灣精簡：地址、官方連結與場館備註；營業時間與價格請向場館確認。`,
      /** The word under the big number. */
      unit: (_n: number) => "間岩館",
      jump: "也收錄香港・新加坡・馬來西亞",
      back: "看所有岩館",
    },
  },
  /** /gyms/[city]: every sentence is built from the data, so nothing is claimed that the research didn't find. */
  gymsCity: {
    meta: {
      title: (f: CityFacts) =>
        `${f.city}抱石館・攀岩館一覽（${f.year}）｜${f.n} 間地址、營業時間${f.priced.length ? "與價格" : "與預約方式"}｜VARO`,
      description: (f: CityFacts) =>
        `${f.city} ${f.n} 間可以抱石的岩館：${f.names.slice(0, 4).join("、")}${f.n > 4 ? "等" : ""}。附地圖、營業時間、預約方式${f.priced.length ? "與價格" : ""}。`,
    },
    title: (city: string) => `${city}抱石館・攀岩館`,
    lead: (f: CityFacts, kind: (k: GymKind) => string) =>
      `${f.city}有 ${f.n} 間可以抱石的岩館，${f.kinds.map((k) => `${k.n} 間${kind(k.kind)}`).join("、")}，分布在${f.districts.join("、")}。`,
    faqTitle: "常見問題",
    /** Each answer is a lead sentence plus, where there's a list, one item per gym. */
    faq: {
      count: (f: CityFacts) => ({
        q: `${f.city}有幾間抱石館？`,
        a: `目前整理到 ${f.n} 間可以抱石的岩館：`,
        items: f.names,
      }),
      price: (f: CityFacts) =>
        f.priced.length
          ? {
              q: `${f.city}抱石一次多少錢？`,
              a: "有公開價目的岩館如下，其他岩館請以官方公告為準：",
              items: f.priced.map(
                (p) =>
                  `${p.name}：${[
                    p.weekday && `平日 ${p.weekday} 元`,
                    p.weekend && `假日 ${p.weekend} 元`,
                    p.shoes && `岩鞋租借 ${p.shoes} 元`,
                    p.notes,
                  ]
                    .filter(Boolean)
                    .join("、")}（${p.source}）`,
              ),
            }
          : {
              q: `${f.city}抱石一次多少錢？`,
              a: "目前沒有取得可確認的現行價目，各館價格請以官方公告為準。",
            },
      beginners: (f: CityFacts) => ({
        q: `${f.city}哪些岩館有新手體驗或課程？`,
        a: "以下岩館有提到新手體驗或課程，實際開課時間請洽場館：",
        items: f.beginners.map((b) => `${b.name}：${b.courses}`),
      }),
      kids: (f: CityFacts) => ({
        q: `${f.city}哪些岩館可以帶小孩？`,
        a: "以下岩館有兒童或親子相關的課程或場地，出發前建議先詢問：",
        items: f.kids,
      }),
    } as Record<
      "count" | "price" | "beginners" | "kids",
      (f: CityFacts) => { q: string; a: string; items?: string[] }
    >,
    otherCities: "其他縣市的抱石館",
    allGyms: "看全台抱石館地圖",
    /** How a FAQ answer runs its list into one sentence for structured data. */
    listSep: "；",
    listEnd: "。",
  },
  /** Hong Kong, Singapore and Malaysia: city pages, country pages and gym pages. Their lists have no hours or prices. */
  gymsAbroad: {
    meta: {
      title: (f: CityFacts) =>
        `${f.where}抱石館・攀岩館一覽（${f.year}）｜${f.n} 間地址與地圖｜VARO`,
      description: (f: CityFacts) =>
        `${f.where}有 ${f.n} 間可以抱石的岩館：${f.names.slice(0, 4).join("、")}${f.n > 4 ? "等" : ""}。附地圖、地址與官方網站、Instagram 連結${f.ropes.length ? `，其中 ${f.ropes.length} 間也能上攀` : ""}。`,
    },
    faq: {
      districts: (f: CityFacts) => ({
        q: `${f.city}的抱石館集中在哪裡？`,
        a: `最多的是${f.districtCounts[0].name}（${f.districtCounts[0].n} 間）${
          f.districtCounts.length > 1
            ? `，其次是${f.districtCounts
                .slice(1, 3)
                .map((d) => `${d.name}（${d.n} 間）`)
                .join("、")}`
            : ""
        }。`,
      }),
      ropes: (f: CityFacts) => ({
        q: `${f.city}哪些岩館也能上攀或先鋒？`,
        a: "以下岩館除了抱石，也有頂繩或先鋒攀登：",
        items: f.ropes,
      }),
      hours: (f: CityFacts) => ({
        q: `${f.city}的抱石館營業時間和價格？`,
        a: "VARO 目前沒有收錄這些岩館的營業時間與價格。每間岩館的頁面都附有官方網站與 Instagram 連結，出發前請以官方公告為準。",
      }),
    } as Record<
      "districts" | "ropes" | "hours",
      (f: CityFacts) => { q: string; a: string; items?: string[] }
    >,
    /** A country page listing every city, e.g. /gyms/malaysia. */
    hub: {
      title: (country: string) => `${country}抱石館・攀岩館`,
      metaTitle: (country: string, n: number, cities: string[], year: number) =>
        `${country}抱石館・攀岩館一覽（${year}）｜${n} 間，${cities.slice(0, 3).join("、")}等 ${cities.length} 個城市｜VARO`,
      description: (country: string, n: number, cities: string[]) =>
        `${country} ${n} 間可以抱石的岩館，分布在${cities.join("、")}。依城市整理地址、地圖與官方連結。`,
      lead: (n: number, cities: { name: string; n: number }[]) =>
        `${n} 間可以抱石的岩館，分布在 ${cities.length} 個城市：${cities.map((c) => `${c.name} ${c.n} 間`).join("、")}。`,
      where: (country: string) => ({
        q: `${country}哪裡可以抱石？`,
        a: "以下城市有收錄岩館：",
      }),
      cityLine: (city: string, n: number, names: string[]) =>
        `${city}：${n} 間（${names.join("、")}）`,
      seeCity: (city: string) => `看${city}地圖 →`,
      all: (country: string) => `看全部${country}岩館 →`,
    },
  },
  /** A single gym's page. */
  gymPage: {
    titleAbroad: (name: string, where: string) =>
      `${name}｜${where}抱石館：地址、地圖與官方連結｜VARO`,
    descriptionAbroad: (g: {
      name: string;
      where: string;
      district: string;
      ropes: boolean;
    }) =>
      `${g.name}位於${g.where}${g.district}，是可以抱石的岩館${g.ropes ? "，也能上攀" : ""}。查看地址、地圖與官方網站、Instagram 連結；營業時間與價格請以官方公告為準。`,
    title: (name: string, _city: string) =>
      `${name}｜營業時間、價格與場館資訊｜VARO`,
    description: (g: {
      name: string;
      city: string;
      cityZh: string;
      district: string;
      /** City and, outside Taiwan, the country: from `gyms.where`. */
      where: string;
      priced: boolean;
    }) =>
      `${g.name}位於${g.cityZh}${g.district}。查看地址、已收錄的營業時間與價格、課程及官方聯絡入口；出發前請向場館確認最新資訊。`,
    missing: "尚未收錄，請向場館確認。",
    prices: "已收錄價格（新台幣）",
    sourceNote: "來源說明：",
    sourcesTitle: "資料來源與更新狀態",
    checked: "資料集查核日期：",
    sourcesBody:
      "這是整份名錄的查核日期，不代表本館每項資料都已獲官方確認。營業時間與價格可能變動，各欄附有已知的來源說明；未收錄不代表場館沒有提供。",
    officialLinks: "官方聯絡入口",
    officialNote: "以上供查詢最新公告，不表示每項資料都取自這些頁面。",
    moreInArea: "查看同縣市其他岩館",
    /** "台北市士林區"; the Chinese pages show the full city name. */
    place: (city: string, district: string) => `${city}${district}`,
  },
  /** The /partners page: recruiting the first gyms, nothing gym-side is built yet. */
  partners: {
    meta: {
      title: "場館合作｜換完線，岩友馬上知道｜VARO",
      description:
        "定線員用手機拍照、點難度，新線就出現在 VARO，岩友在牆前點一下就能記錄。定線工具第一版已完成，我們正在找首批合作岩館一起試用。",
    },
    eyebrow: "場館合作 · 招募首批岩館",
    title: ["換完線，", "岩友馬上知道。"],
    intro:
      "定線員用手機拍照、點難度，新線就出現在 VARO。岩友在牆前點一下就能記錄，還沒完攀的 Project，就是他們下次回來的理由。",
    status:
      "定線工具第一版已經完成，VARO App 已在 App Store 上架。我們正在找首批岩館，在真實換線中一起試用。",
    cta: "我有興趣",
    howLink: "看看怎麼運作",
    problem: {
      heading: "現在的狀況",
      items: [
        {
          title: "換線消息 24 小時就消失",
          body: "換線公告多半發在 IG 限動，沒追蹤、沒剛好滑到，岩友就錯過了。",
        },
        {
          title: "岩友不知道哪面牆換了",
          body: "到了現場才發現整面牆是新線，或是想挑戰的那條已經拆掉。",
        },
        {
          title: "路線資訊沒有地方集中",
          body: "難度、顏色、在哪面牆，每次都要到現場看、或是問櫃台。",
        },
      ],
    },
    how: {
      heading: "怎麼運作",
      intro:
        "定線員和岩友用的是同一份路線資料。定線員上傳一次，岩友就不用自己輸入。",
      demo: "示意圖",
      setter: "定線員",
      climber: "岩友",
      steps: [
        {
          title: "選剛換好的區域，拍下新線",
          body: "打開手機網頁、選區域，對著新線拍照。不用安裝 App，用自己的手機就可以。",
        },
        {
          title: "點顏色和難度，接著拍下一條",
          body: "顏色會沿用上一條，大部分路線只要點一下難度就存好，相機隨即打開。手上有粉，也不用打字。",
        },
        {
          title: "岩友在牆前點一下，就記錄好了",
          body: "新線立刻出現在 VARO 的牆面照片上。岩友點那條線，選沒完攀＋1、完攀或 Flash。",
        },
      ],
      mock: {
        zone: "B 區 · 新線",
        route: "藍色 · V3",
        buttons: ["沒完攀 ＋1", "完攀", "Flash"],
      },
    },
    value: {
      heading: "你的岩館會得到",
      now: {
        label: "第一版就有",
        items: [
          {
            title: "換線就是公告",
            body: "拍完上傳，新線就在 App 裡。不會 24 小時後消失，岩友打開就知道哪一區換了。",
          },
          {
            title: "換線不多一道文書",
            body: "不用整理表格、不用回到電腦前。館內網路不好也沒關係，照片先存在手機，有網路再自動上傳。",
          },
          {
            title: "岩友回來的理由",
            body: "岩友在你的館記下的每一條 Project，都留在 App 裡提醒他：那條線還沒完攀。",
          },
        ],
      },
      planned: {
        label: "規劃中",
        items: [
          {
            title: "換線通知",
            body: "你的館換線時，常來的岩友會收到通知。",
          },
          {
            title: "路線回饋",
            body: "哪些線最多人挑戰、岩友覺得難度如何。只統計用 VARO 記錄的岩友，不會顯示個人紀錄。",
          },
        ],
      },
    },
    setup: {
      heading: "開始很簡單",
      steps: [
        {
          title: "先聊聊",
          body: "了解你們多久換一次線、牆面怎麼分區。",
        },
        {
          title: "我們幫你設定好",
          body: "依你們的牆面建立區域，並開好定線員的帳號。",
        },
        {
          title: "下次換線就能用",
          body: "打開網址、登入，換完一區就拍一區。",
        },
      ],
    },
    faq: {
      heading: "場館常見問題",
      items: [
        {
          q: "需要安裝 App 或購買設備嗎？",
          a: "不用。定線工具是手機網頁，定線員用自己的手機打開就能上傳。",
        },
        {
          q: "館內網路不好怎麼辦？",
          a: "照片會先存在手機上，網路恢復後自動上傳。定線員可以繼續拍下一條，不用等。",
        },
        {
          q: "誰可以修改我們的路線？",
          a: "只有你們館的員工帳號。定線工具不開放註冊，每個帳號都由我們手動開通。",
        },
        {
          q: "場館看得到岩友的紀錄嗎？",
          a: "看不到。岩友的紀錄預設是私人的，只有他自己選擇分享的內容別人才看得到。",
        },
      ],
    },
    pilot: {
      heading: "成為首批合作場館",
      items: [
        "在真實換線中試用第一版，你的意見會直接決定下一步做什麼",
        "你的場館會是第一批在 VARO 上線的岩館",
        "不需要任何承諾，先聊聊就好",
      ],
    },
    contact: {
      heading: "有興趣？寫信給我們",
      body: "按下按鈕會開啟一封寫好問題的信，填幾行就好。我們會親自回覆。",
      button: "寫信給 VARO",
      or: "或直接寄到",
    },
    /** Pre-filled email body: the questions we'd ask on a first call. */
    mailBody: [
      "你好，我想了解 VARO 的場館合作。",
      "",
      "場館名稱：",
      "所在城市：",
      "牆面大約分成幾區：",
      "目前怎麼公告換線（IG、FB、現場公告…）：",
      "大約多久換一次線：",
      "聯絡人與電話（選填）：",
    ].join("\n"),
  },
  footer: {
    support: "支援",
    privacy: "隱私權政策",
    flag: "台灣國旗",
  },
  hero: {
    lead: "為抱石者打造的 iOS 攀岩紀錄 App。",
    body: "記下每條路線的嘗試與完攀、追蹤正在挑戰的 Project，回頭看見自己的進步。",
    download: "在 App Store 下載",
    comingSoon: "即將登陸 App Store",
    partnerLink: "經營岩館？了解場館合作 →",
    demo: "介面示意",
    finishLabel: "Varo 完成訓練畫面示意",
    sessionLabel: (gym: string, routes: number) =>
      `Varo 訓練紀錄畫面示意：${gym}，${routes} 條路線`,
  },
  screens: {
    gym: "VARO 抱石館",
    duration: (minutes: number) =>
      `${Math.floor(minutes / 60)} 小時 ${minutes % 60} 分`,
    topSend: "最高完攀",
    climbs: "條紀錄",
    sends: "完攀",
    flash: "Flash",
    routes: "路線",
    walls: { slab: "斜板", vertical: "垂直", overhang: "外傾", roof: "屋簷" },
    attempts: (n: number) => `嘗試 ${n} 次`,
    sent: "完攀",
    attempting: "嘗試中",
    finishTitle: "又往上一點了",
    finishSummary: (sends: number, flashes: number) =>
      `完攀 ${sends} 條 · Flash ${flashes} 條`,
    share: "分享",
    viewSession: "查看這次紀錄",
    addRoute: "新增路線",
    grade: "難度",
    gradeScale: "V 級",
    notSure: "不確定",
    holdColor: "岩點顏色",
    holdNames: {
      red: "紅",
      orange: "橘",
      yellow: "黃",
      green: "綠",
      blue: "藍",
      purple: "紫",
      pink: "粉紅",
      black: "黑",
    },
    wall: "牆面",
    tapHint: "點結果就會記錄",
    me: "我",
    tabs: ["紀錄", "進度", "Project", "影片"],
    thisWeek: "本週",
    daysClimbing: (n: number) => `攀爬 ${n} 天`,
    week: "週",
    month: "月",
    sessions: "訓練",
    monthLabel: (m: number) => `${m}月`,
    gradeSpread: "難度分布",
    allTime: "全部紀錄",
    project: "Project",
    inProgress: "進行中",
    projectName: "洞穴紫色 V6",
    daysTried: "嘗試天數",
    totalAttempts: "總嘗試次數",
    daysSoFar: "已進行天數",
    timeline: "歷程",
    tryAgain: "再試一次",
    storyAgo: "2 小時",
  },
  /** The feature sections under the hero, in page order. */
  features: {
    log: {
      eyebrow: "邊爬邊記",
      title: ["點兩下，", "記好一條路線"],
      body: "選難度、岩點顏色和牆面，再點一下結果就記好了。Flash、完攀還是嘗試中，每一次都算數。",
      label: "Varo 新增路線畫面示意：選擇難度、岩點顏色與牆面",
    },
    progress: {
      eyebrow: "看見進步",
      title: ["每一週，", "都往上一點"],
      body: "每週訓練幾天、完攀幾條、Flash 幾條，一眼就看得到。難度分布依各分級制度分開統計，清楚知道自己卡在哪一級。",
      label: "Varo 進度畫面示意：每週訓練次數與難度分布",
    },
    project: {
      eyebrow: "Project",
      title: ["反覆挑戰，", "直到完攀"],
      body: "把卡關的路線設成 Project，記下每一天、每一次嘗試。完攀那天，整段歷程都還在。",
      label: "Varo Project 畫面示意：一條 V6 路線的嘗試歷程",
    },
    share: {
      eyebrow: "分享貼紙",
      title: ["完攀了？", "貼上限動"],
      body: "完攀後產生專屬的難度貼紙，疊在攀爬照片或影片上，直接分享到限時動態。",
      label: "Varo 分享貼紙示意：限時動態上的 V5 完攀貼紙",
    },
    closing: {
      title: ["下一次上牆，", "就開始記錄。"],
      body: "VARO 記住的，是讓完攀發生的每一次嘗試。",
    },
  },
  philosophy: {
    meta: {
      title: "VARO 的理念：Venture · Attempt · Resilience · Overcome",
      description:
        "每一條路線都是一場冒險。不斷嘗試、帶著韌性再上去，直到突破。完攀只是一瞬間，VARO 記住的是讓那一刻發生的每一次嘗試。",
    },
    eyebrow: "THE NAME · 名字的由來",
    opening: (w: (word: string) => React.ReactNode) => (
      <>
        每一條路線，都是一場 {w("Venture")}。
        <br />
        我們不斷 {w("Attempt")}，帶著 {w("Resilience")} 再上去，
        <br className="hidden sm:block" />
        直到 {w("Overcome")}。
      </>
    ),
    /** V, A, R, O — in route order. */
    steps: [
      {
        label: "探索",
        line: "每一條新路線，都是一次未知。",
        sub: "站在牆下，讀線，然後決定出發。",
      },
      {
        label: "嘗試",
        line: "伸手、起攀，換一種解法，再伸一次手。",
        sub: "沒有白費的嘗試，每一次都讓下一次更近。",
      },
      {
        label: "韌性",
        line: "掉下來，拍掉止滑粉，再上去。",
        sub: "調整呼吸、調整腳點，調整自己。",
      },
      {
        label: "突破",
        line: "終於，完成那個曾經做不到的動作。",
        sub: "站上頂點的那一刻，屬於前面的每一次。",
      },
    ] as { label?: string; line: string; sub: string }[],
    closing: (
      <>
        完攀只是一瞬間。
        <br />
        VARO 想記住的，是讓那一刻發生的每一次嘗試。
      </>
    ),
  },
  /** Alt text. These images sit in aria-hidden decoration, so it's read by crawlers, not screen readers. */
  images: {
    mascot: "VARO 吉祥物：一顆萊姆綠的 Jug 岩點",
    climbPhoto: "在岩館抱石的攀岩者",
  },
  legal: {
    updated: "最後更新：",
  },
};

export default zhTW;
