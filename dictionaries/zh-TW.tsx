import type { CityFacts } from "@/lib/gyms/city-facts";
import type { GymKind } from "@/lib/gyms/types";

const zhTW = {
  htmlLang: "zh-Hant-TW",
  ogLocale: "zh_TW",
  meta: {
    title: "VARO｜抱石紀錄 App，為台灣攀岩者打造",
    description:
      "Varo 是為台灣抱石者打造的攀岩紀錄 App。記下每次攀爬與嘗試、追蹤正在挑戰的 Project，回頭看見自己的進步。",
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
    philosophy: "理念",
    partner: "場館合作",
    /** Link to the other language. */
    switchLabel: "EN",
    switchAria: "Switch to English",
  },
  partnerSubject: "Varo 場館合作",
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
    } as Record<string, string>,
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
  },
  /** The /partners page: recruiting the first gyms, nothing gym-side is built yet. */
  partners: {
    meta: {
      title: "場館合作｜VARO 招募首批合作岩館",
      description:
        "VARO 想幫岩館整理路線與換線資訊，讓岩友在 App 裡就知道牆上換了什麼。我們正在找第一批合作場館，一起決定這個功能該長什麼樣子。",
    },
    eyebrow: "場館合作 · 招募首批岩館",
    title: ["讓岩友知道，", "牆上換了什麼。"],
    intro:
      "VARO 是給抱石者的攀爬紀錄 App。下一步，我們想幫岩館把路線和換線資訊整理好，直接送到岩友手上。這個功能還在規劃，我們想先聽聽岩館的想法。",
    cta: "我有興趣",
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
    plan: {
      heading: "我們想做的",
      badge: "規劃中",
      items: [
        {
          title: "路線資訊整理",
          body: "把場館的路線（難度、岩點顏色、牆面）放進 VARO。岩友記錄時直接選，不用自己輸入。",
        },
        {
          title: "換線公告",
          body: "哪面牆、哪天換線，岩友在 App 裡就看得到，也能收到通知。",
        },
      ],
    },
    pilot: {
      heading: "成為首批合作場館",
      items: [
        "一起決定功能該怎麼設計，符合場館實際的換線流程",
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
    eyebrow: "為台灣抱石而生的紀錄與社群 App",
    lead: "記錄每次挑戰，看見自己的進步。",
    body: "從第一次摸線到終於完攀，與岩友分享值得記住的每一刻。",
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
