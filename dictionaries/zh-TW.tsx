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
