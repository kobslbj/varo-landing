/**
 * Words on /partners: VARO as a climbing gym's digital transformation and
 * marketplace, pitched on revenue (found → booked → back again → spend more
 * → proven → less busywork). Each need is marked live, in progress or
 * planned; owners vote for the planned ones, which is how we validate them.
 * Japanese and Korean read English.
 *
 * Only `live` items exist today; keep it that way when editing.
 */

export type NeedStatus = "live" | "building" | "idea";

export interface Need {
  /** Stable id, sent with votes; don't rename once live. */
  id: string;
  status: NeedStatus;
  title: string;
  body: string;
}

export interface NeedGroup {
  /** Where the money comes from, e.g. "新客". */
  stage: string;
  /** The question an owner asks themselves. */
  question: string;
  needs: Need[];
}

const zh = {
  metaTitle: "攀岩館的數位轉型｜用科技帶動營收｜VARO for Gyms",
  metaDescription:
    "VARO 正在打造攀岩館的數位轉型平台與岩友 Marketplace：現在就能讓新岩友找到你、換線帶岩友回來；體驗課與活動報名、營收報表規劃中。會員、預約、收款也在規劃中。",
  eyebrow: "VARO for Gyms · 攀岩館的數位轉型",
  title: ["用科技，", "把每次換線變成營收。"],
  lead: "VARO 正在打造攀岩館專屬的數位平台與岩友 Marketplace。現在就能做的：新岩友在岩館頁和 beta 頁找到你、每次換線推播把老岩友帶回來、路線數據讓你看見誰在爬。規劃中：體驗課與活動報名、營收報表。可以先和你現在的系統一起用，之後會員、預約、收款也能整合進 VARO。",
  ctaPrimary: "預約 30 分鐘營收健檢",
  ctaSecondary: "看 VARO 能幫你什麼",
  pilotNote: "首批合作岩館免費試用，我們幫你完成上架。",
  partnersLabel: "已經合作的岩館",
  heroStats: [
    { n: "51", label: "間全台岩館在 VARO 地圖上" },
    { n: "3", label: "種營收：新客、回訪、加購" },
    { n: "26", label: "項岩館需求，照實標示進度" },
  ],

  painTitle: "攀岩館的營收卡在哪裡",
  pains: [
    {
      title: "新客找不到你",
      body: "想嘗試抱石的人只會 Google「台北抱石」，你的資訊散在 IG、Google 地圖和朋友口耳相傳。",
    },
    {
      title: "體驗完就不回來",
      body: "第一次來的人不知道下一步可以挑戰什麼，體驗課變成一次性收入。",
    },
    {
      title: "換線的投入沒有回收",
      body: "定線花了一整天，公告卻 24 小時就消失，沒人知道換線有沒有帶人回來。",
    },
    {
      title: "課程和活動難招生",
      body: "每次辦比賽、開技巧課都要從頭宣傳，不知道該找誰。",
    },
    {
      title: "不知道錢從哪裡來",
      body: "哪個活動、哪次換線、哪個管道真的帶來營收，只能靠感覺。",
    },
  ],

  modelTitle: "VARO 怎麼幫你賺錢",
  modelLead:
    "攀岩館的營收 = 新客 × 回訪次數 × 每次消費。VARO 從岩友每天都在用的路線、beta 和紀錄切入，三個數字一起推。",
  model: [
    {
      k: "新客",
      title: "被找到、被報名",
      body: "現在：岩館頁和每條路線的 beta 頁，讓想爬的人找到你。規劃中：岩友 Marketplace，看到就能直接報名。",
    },
    {
      k: "回訪",
      title: "每次換線都是回來的理由",
      body: "現在：換線推播和沒完攀的 Project 提醒岩友回來。規劃中：換線挑戰與久沒來的回訪提醒。",
    },
    {
      k: "加購",
      title: "賣出更多課程與活動",
      body: "規劃中：在對的時機推薦對的課程。卡在 V4 三週的岩友，最需要的就是你的技巧課。",
    },
  ],

  calcTitle: "試算：回訪多一點，營收多多少",
  calcLead: "拉一下你館裡的數字。這只是公式試算，不是我們保證的成效。",
  calcVisits: "每月入場人次",
  calcPrice: "平均單次消費（NT$）",
  calcLift: "回訪增加",
  calcMonthly: "每月多出的營收",
  calcYearly: "一年",
  calcNote:
    "公式：入場人次 × 回訪增加 % × 平均單次消費。實際成效要等試用期的數據才知道。",

  needsTitle: "攀岩館需要的，我們做到哪裡了",
  needsLead:
    "每一項都照實標示進度。還沒做的，告訴我們你需不需要：點「我需要」，最後一起送出。我們依岩館的需求排開發順序。",
  status: { live: "已上線", building: "開發中", idea: "規劃中" },
  vote: "我需要",
  voted: "已選",
  groups: [
    {
      stage: "01 被找到",
      question: "怎麼讓新岩友找到你？",
      needs: [
        {
          id: "page",
          status: "live",
          title: "岩館頁與全台岩館地圖",
          body: "營業時間、價格、課程集中在一頁，Google 搜「台北抱石」找得到。",
        },
        {
          id: "beta-seo",
          status: "live",
          title: "每條路線都是一頁內容",
          body: "現役路線與 beta 影片自動變成網頁，岩友分享出去，就是你的免費曝光。",
        },
        {
          id: "listing",
          status: "idea",
          title: "在 VARO Marketplace 上架",
          body: "體驗課、入場券、比賽活動上架到 VARO，岩友在 App 裡逛館、比較、直接報名。",
        },
        {
          id: "crossgym",
          status: "idea",
          title: "跨館推薦",
          body: "常在其他館爬的岩友，在你換線時看到推薦，第一次來你的館。",
        },
      ],
    },
    {
      stage: "02 成交",
      question: "怎麼把看到的人變成付錢的客人？",
      needs: [
        {
          id: "referral",
          status: "idea",
          title: "專屬導流連結與優惠碼",
          body: "從 VARO 來的客人用專屬連結或優惠碼，在你原本的系統付款，成交多少一清二楚。",
        },
        {
          id: "pay-per-customer",
          status: "idea",
          title: "按有效新客計費",
          body: "只為第一次到訪的新客付費，沒帶來新客就不收錢。",
        },
        {
          id: "firsttime",
          status: "idea",
          title: "新手第一次來的指南",
          body: "入場流程、適合新手的路線、裝備租借，降低第一次的不安，報名意願更高。",
        },
      ],
    },
    {
      stage: "03 回訪",
      question: "怎麼讓岩友更常回來？",
      needs: [
        {
          id: "notify",
          status: "live",
          title: "換線推播",
          body: "發布新線，關注你這間館的岩友馬上收到通知。換線不再只是一則限動。",
        },
        {
          id: "qr",
          status: "live",
          title: "每面牆的 QR 海報與 beta",
          body: "卡關的岩友掃一下就看到別人怎麼爬，不會就此放棄；換線不用重印。",
        },
        {
          id: "project",
          status: "live",
          title: "沒完攀的 Project 提醒他回來",
          body: "岩友在你館裡還沒完攀的線留在 App 裡，就是他下次回來的理由。",
        },
        {
          id: "challenge",
          status: "idea",
          title: "換線挑戰",
          body: "換線後兩週內完成指定路線解鎖限定成就，你提供獎品，VARO 自動計分、統計參與。",
        },
        {
          id: "winback",
          status: "idea",
          title: "久沒來的岩友回訪提醒",
          body: "一個月沒來的岩友，在你換線時收到專屬提醒，附上他上次沒完攀的那條。",
        },
      ],
    },
    {
      stage: "04 加購",
      question: "怎麼賣出更多課程和活動？",
      needs: [
        {
          id: "class-match",
          status: "idea",
          title: "在對的時機推薦你的課",
          body: "岩友卡在同一個難度好幾週，推薦你的技巧課；第一次完攀 V3，推薦進階班。",
        },
        {
          id: "comp",
          status: "idea",
          title: "比賽與聯賽電子計分",
          body: "報名、計分、排名在手機上完成，不用紙本計分卡，辦活動更輕鬆、更常辦。",
        },
        {
          id: "brand",
          status: "idea",
          title: "品牌贊助挑戰",
          body: "攀岩品牌贊助你館內的挑戰與獎品，帶來額外收入和人潮。",
        },
      ],
    },
    {
      stage: "05 看見成效",
      question: "怎麼知道哪些做法真的帶來營收？",
      needs: [
        {
          id: "stats",
          status: "live",
          title: "路線數據",
          body: "每週紀錄、難度分布、哪條線最多人嘗試。只給彙總數字，不公開岩友的個人紀錄。",
        },
        {
          id: "reset-report",
          status: "idea",
          title: "換線成效報表",
          body: "換線後兩週有多少岩友回來、爬了哪些新線，定線投入看得到回收。",
        },
        {
          id: "funnel",
          status: "idea",
          title: "導流與成交報表",
          body: "從 VARO 看到你、點進來、報名到第一次到訪，每一步各有多少人。",
        },
      ],
    },
    {
      stage: "06 營運數位化",
      question: "怎麼讓員工少做一點？",
      needs: [
        {
          id: "publish",
          status: "live",
          title: "手機發布新線",
          body: "定線員拍牆、標起點、點顏色和難度，存草稿、一次發布。不用整理表格。",
        },
        {
          id: "setter",
          status: "idea",
          title: "定線排程與定線員回饋",
          body: "哪面牆該換、難度缺哪段；岩友的難度體感回到定線員手上，可選擇署名，不公開評分。",
        },
        {
          id: "embed",
          status: "idea",
          title: "官網與 IG 自動更新",
          body: "現役路線、課程、活動嵌進你的官網，換線一次全部更新。",
        },
        {
          id: "integration",
          status: "idea",
          title: "串接你現在的系統",
          body: "會員、預約、POS 系統。先了解你在用什麼，再決定怎麼接。",
        },
      ],
    },
    {
      stage: "07 會員、預約與收款",
      question: "想把營運整個搬上 VARO？",
      needs: [
        {
          id: "booking",
          status: "idea",
          title: "線上預約與課程報名",
          body: "體驗課、技巧課、包場在 VARO 開放預約，岩友在 App 裡報名、收到提醒，減少臨時不到。",
        },
        {
          id: "membership",
          status: "idea",
          title: "會員與方案管理",
          body: "月票、次數券、儲值、學生方案，到期提醒與續約，岩友在 App 裡就能看到剩幾次。",
        },
        {
          id: "payments",
          status: "idea",
          title: "線上收款與 POS",
          body: "入場、課程、裝備租借與商品，線上付款和櫃台收款在同一處對帳。",
        },
        {
          id: "checkin",
          status: "idea",
          title: "掃碼入場與切結書",
          body: "岩友用 App 出示 QR 入場、線上簽切結書，櫃台不用再翻紙本。",
        },
      ],
    },
  ] satisfies NeedGroup[],

  fitTitle: "現在一起用，之後一套搞定",
  fitLead:
    "不用一次換掉所有東西。先用 VARO 帶來新客和回訪，會員、預約、收款繼續用你現在的系統；等 VARO 的營運功能上線，你再決定要不要整合成一套。",
  fitYours: "之後也能交給 VARO（規劃中）",
  fitYoursItems: ["會員與方案", "課程預約", "收款、POS", "掃碼入場"],
  fitVaro: "VARO 現在就能做",
  fitVaroItems: [
    "岩館頁與路線 beta 頁",
    "換線推播與 QR 海報",
    "路線、beta 與岩友紀錄",
    "路線數據",
  ],

  pilotTitle: "先試 30 天",
  pilot: [
    {
      title: "第 1 週：上架",
      body: "我們到館裡拍牆、上架現有路線與岩館資訊，印好每面牆的 QR 海報。",
    },
    {
      title: "第 2–4 週：照常營運",
      body: "定線員用手機發布新線，岩友收到通知、看 beta、記錄。遇到問題直接找我們。",
    },
    {
      title: "第 30 天：一起看數據",
      body: "多少岩友看了新線、回來爬、記了幾條。再決定要不要繼續、要哪些功能。",
    },
  ],

  promiseTitle: "我們不做的事",
  promises: [
    "不逼你換系統：你決定什麼時候、搬哪些功能",
    "不拿走你的資料：你上架的路線資料是你的",
    "不賣岩友的個人資料",
    "不做岩友排行榜、不替定線員公開打分數",
  ],

  formTitle: "告訴我們你的岩館需要什麼",
  formLead: "填完會開啟你的 email，內容已經寫好，按送出就好。",
  formGym: "岩館名稱",
  formGymPlaceholder: "例如：某某攀岩館",
  formRole: "你是",
  roles: ["老闆／經營者", "行銷／營運", "定線員", "其他"],
  formContact: "怎麼聯絡你（Email 或 LINE ID）",
  formNote: "還想說的（選填）",
  formNotePlaceholder:
    "例如：每月大概多少人次、現在用什麼系統、最想增加哪種營收",
  formPicked: "你選的需求",
  formNone: "還沒選，可以回上面點「我需要」，也可以直接送出。",
  formSend: "用 Email 送出",
  mailSubject: "VARO 岩館合作：{gym}",
  mail: {
    gym: "岩館：",
    role: "身分：",
    contact: "聯絡方式：",
    needs: "需要的功能：",
    none: "（未選）",
    note: "其他：",
  },

  faqTitle: "常見問題",
  faq: [
    {
      q: "要換掉我現在的系統嗎？",
      a: "不用。VARO 先從路線、beta、岩友紀錄和攀岩社群出發，把岩友帶來、帶回來，和你現在的系統一起用。會員、預約、收款我們也在規劃，會照攀岩館的習慣來做，要不要搬過來由你決定。",
    },
    {
      q: "要花員工多少時間？",
      a: "上架由我們處理。之後每次換線，定線員用手機拍照、點難度就好；館內網路不好也能先存在手機。",
    },
    {
      q: "岩友一定要下載 App 嗎？",
      a: "不用。掃牆邊的 QR 海報或打開岩館頁，網頁就能看路線和 beta。想收換線通知、記錄進步，再下載 App。",
    },
    {
      q: "之後怎麼收費？",
      a: "首批合作岩館免費試用。之後會依你用到的功能與帶來的成效設計方案，例如月費或按有效新客計費，價格會先跟你討論。",
    },
  ],
};

const en: typeof zh = {
  metaTitle:
    "Digital transformation for climbing gyms | Grow revenue with tech | VARO for Gyms",
  metaDescription:
    "VARO is building a digital platform and climber marketplace for climbing gyms: today new climbers find you and resets bring regulars back; class and event booking and revenue reports are planned. Memberships, bookings and payments are planned too.",
  eyebrow: "VARO for Gyms · Digital transformation for climbing gyms",
  title: ["Turn every reset", "into revenue."],
  lead: "VARO is building a digital platform and climber marketplace for climbing gyms. Today: new climbers find you through your gym and beta pages, every reset alert brings regulars back, and route numbers show who's climbing. Planned: class and event booking, and revenue reports. Start alongside your current system; memberships, bookings and payments can move to VARO later.",
  ctaPrimary: "Book a 30-minute revenue review",
  ctaSecondary: "See what VARO can do",
  pilotNote: "Free for our first partner gyms. We do the setup.",
  partnersLabel: "Gyms already working with us",
  heroStats: [
    { n: "51", label: "Taiwan gyms on the VARO map" },
    { n: "3", label: "revenue levers: new, returning, spend" },
    { n: "26", label: "gym needs, each marked honestly" },
  ],

  painTitle: "Where gym revenue gets stuck",
  pains: [
    {
      title: "New climbers can't find you",
      body: "People curious about bouldering just Google it; your info is scattered across IG, Maps and word of mouth.",
    },
    {
      title: "First-timers don't come back",
      body: "They don't know what to try next, so the intro session stays a one-off.",
    },
    {
      title: "Resets don't pay back",
      body: "A full day of setting, an announcement gone in 24 hours, and no idea if it brought anyone back.",
    },
    {
      title: "Classes and events are hard to fill",
      body: "Every comp or technique class starts its marketing from zero.",
    },
    {
      title: "No idea where the money comes from",
      body: "Which event, reset or channel actually drove revenue is a guess.",
    },
  ],

  modelTitle: "How VARO grows your revenue",
  modelLead:
    "Gym revenue = new climbers × visits × spend per visit. VARO starts from what climbers use every session (routes, beta, their log) and pushes all three.",
  model: [
    {
      k: "New",
      title: "Get found, get booked",
      body: "Today: your gym page and a beta page for every route help climbers find you. Planned: a climber marketplace where they book on the spot.",
    },
    {
      k: "Return",
      title: "Every reset is a reason to come back",
      body: "Today: reset alerts and unsent Projects bring climbers back. Planned: reset challenges and win-back nudges.",
    },
    {
      k: "Spend",
      title: "Sell more classes and events",
      body: "Planned: the right class at the right moment. Someone stuck on V4 for three weeks needs your technique class.",
    },
  ],

  calcTitle: "Estimate: a few more visits, how much more revenue",
  calcLead:
    "Drag in your gym's numbers. This is a formula, not a promise of results.",
  calcVisits: "Monthly visits",
  calcPrice: "Average spend per visit (NT$)",
  calcLift: "More return visits",
  calcMonthly: "Extra revenue per month",
  calcYearly: "Per year",
  calcNote:
    "Formula: visits × return-visit lift % × average spend. Real results come from the trial's numbers.",

  needsTitle: "What gyms need, and where we are",
  needsLead:
    "Each item is marked honestly. For the ones we haven't built, tell us if you need them: tap \"I need this\" and send them together. Gyms' answers set our build order.",
  status: { live: "Live", building: "In progress", idea: "Planned" },
  vote: "I need this",
  voted: "Added",
  groups: [
    {
      stage: "01 Found",
      question: "How do new climbers find you?",
      needs: [
        {
          id: "page",
          status: "live",
          title: "Gym page and gym map",
          body: "Hours, prices and classes on one page, found when people Google bouldering in their city.",
        },
        {
          id: "beta-seo",
          status: "live",
          title: "Every route is a page",
          body: "Routes on the wall and their beta become web pages; every share is free exposure for you.",
        },
        {
          id: "listing",
          status: "idea",
          title: "List on the VARO marketplace",
          body: "Intro sessions, passes and events on VARO, where climbers browse gyms, compare and book.",
        },
        {
          id: "crossgym",
          status: "idea",
          title: "Cross-gym discovery",
          body: "Climbers who usually climb elsewhere see your reset and come for a first visit.",
        },
      ],
    },
    {
      stage: "02 Booked",
      question: "How do lookers become paying customers?",
      needs: [
        {
          id: "referral",
          status: "idea",
          title: "Referral links and promo codes",
          body: "Customers from VARO pay in your own system with a dedicated link or code, so conversions are clear.",
        },
        {
          id: "pay-per-customer",
          status: "idea",
          title: "Pay per new customer",
          body: "Pay only for verified first-time visitors; no new customers, no charge.",
        },
        {
          id: "firsttime",
          status: "idea",
          title: "A first-visit guide",
          body: "How entry works, beginner routes, shoe rental: less first-time anxiety, more bookings.",
        },
      ],
    },
    {
      stage: "03 Back again",
      question: "How do climbers come back more often?",
      needs: [
        {
          id: "notify",
          status: "live",
          title: "Reset notifications",
          body: "Publish new routes and climbers following your gym hear about it at once. A reset is more than a story.",
        },
        {
          id: "qr",
          status: "live",
          title: "A QR poster and beta for every wall",
          body: "Stuck climbers scan and see how others did it instead of giving up; no reprint after a reset.",
        },
        {
          id: "project",
          status: "live",
          title: "Unsent Projects bring them back",
          body: "Routes a climber hasn't sent at your gym stay in their app: their reason to return.",
        },
        {
          id: "challenge",
          status: "idea",
          title: "Reset challenges",
          body: "Send set routes within two weeks of a reset for a badge. You give the prize; VARO scores it and counts who joined.",
        },
        {
          id: "winback",
          status: "idea",
          title: "Win back lapsed climbers",
          body: "Climbers away for a month get a nudge at your reset, with the route they didn't send.",
        },
      ],
    },
    {
      stage: "04 Spend more",
      question: "How do you sell more classes and events?",
      needs: [
        {
          id: "class-match",
          status: "idea",
          title: "Recommend your class at the right moment",
          body: "Stuck at one grade for weeks? Your technique class. First V3? Your next-level course.",
        },
        {
          id: "comp",
          status: "idea",
          title: "Comps and leagues, scored digitally",
          body: "Sign-up, scoring and results on phones, no paper scorecards, so events are easier to run more often.",
        },
        {
          id: "brand",
          status: "idea",
          title: "Brand-sponsored challenges",
          body: "Climbing brands sponsor your in-gym challenges and prizes: extra income and footfall.",
        },
      ],
    },
    {
      stage: "05 Proven",
      question: "How do you know what drives revenue?",
      needs: [
        {
          id: "stats",
          status: "live",
          title: "Route numbers",
          body: "Weekly logs, grade spread, the most-tried routes. Totals only; no climber's personal log is shown.",
        },
        {
          id: "reset-report",
          status: "idea",
          title: "Reset reports",
          body: "How many climbers came back in the two weeks after a reset and what they climbed.",
        },
        {
          id: "funnel",
          status: "idea",
          title: "Referral and conversion reports",
          body: "From seeing you on VARO to clicking, booking and a first visit: how many at each step.",
        },
      ],
    },
    {
      stage: "06 Less busywork",
      question: "How does your staff do less?",
      needs: [
        {
          id: "publish",
          status: "live",
          title: "Post routes from a phone",
          body: "Setters photograph the wall, pin starts, tap color and grade, save a draft and publish once. No spreadsheets.",
        },
        {
          id: "setter",
          status: "idea",
          title: "Reset planning and setter feedback",
          body: "Which wall is due, which grades are missing; climbers' grade feel reaches setters, with optional credit and no public ratings.",
        },
        {
          id: "embed",
          status: "idea",
          title: "Website and IG, always current",
          body: "Routes, classes and events embedded in your site, updated with every reset.",
        },
        {
          id: "integration",
          status: "idea",
          title: "Connect your current system",
          body: "Membership, booking or POS. We'll learn what you use, then decide how to connect.",
        },
      ],
    },
    {
      stage: "07 Members, bookings and payments",
      question: "Want to run the whole gym on VARO?",
      needs: [
        {
          id: "booking",
          status: "idea",
          title: "Online booking and class sign-up",
          body: "Intro sessions, technique classes and private bookings on VARO, with reminders that cut no-shows.",
        },
        {
          id: "membership",
          status: "idea",
          title: "Memberships and plans",
          body: "Monthly passes, punch cards, credit and student plans, with renewal reminders; climbers see what's left in the app.",
        },
        {
          id: "payments",
          status: "idea",
          title: "Online payments and POS",
          body: "Entry, classes, rentals and merch: online and front-desk payments reconciled in one place.",
        },
        {
          id: "checkin",
          status: "idea",
          title: "QR check-in and waivers",
          body: "Climbers show a QR code to enter and sign waivers online; no paper at the desk.",
        },
      ],
    },
  ],

  fitTitle: "Together now, one system later",
  fitLead:
    "No big switch. Start with VARO for new and returning climbers while your current system runs memberships, bookings and payments; when VARO's operations features are ready, you decide whether to bring it all together.",
  fitYours: "Can move to VARO later (planned)",
  fitYoursItems: [
    "Members and plans",
    "Class bookings",
    "Payments, POS",
    "QR check-in",
  ],
  fitVaro: "VARO does today",
  fitVaroItems: [
    "Gym page and route beta pages",
    "Reset alerts and QR posters",
    "Routes, beta and climbers' logs",
    "Route numbers",
  ],

  pilotTitle: "Try it for 30 days",
  pilot: [
    {
      title: "Week 1: setup",
      body: "We come in, photograph the walls, put your routes and gym info up and print a QR poster for each wall.",
    },
    {
      title: "Weeks 2–4: business as usual",
      body: "Setters post from their phones; climbers get alerts, watch beta and log. Reach us anytime.",
    },
    {
      title: "Day 30: look at the numbers together",
      body: "How many climbers saw the new routes, came back and logged. Then decide what to keep.",
    },
  ],

  promiseTitle: "What we won't do",
  promises: [
    "Force a switch: you choose when, and what moves",
    "Claim your route data: what you post is yours",
    "Sell climbers' personal data",
    "Run climber leaderboards or publicly rate setters",
  ],

  formTitle: "Tell us what your gym needs",
  formLead: "This opens your email with the message written. Just hit send.",
  formGym: "Gym name",
  formGymPlaceholder: "e.g. Your Climbing Gym",
  formRole: "You are",
  roles: ["Owner / manager", "Marketing / operations", "Setter", "Other"],
  formContact: "How to reach you (email or LINE ID)",
  formNote: "Anything else (optional)",
  formNotePlaceholder:
    "e.g. monthly visits, the system you use, which revenue you most want to grow",
  formPicked: "Your picks",
  formNone: 'None yet. Tap "I need this" above, or just send.',
  formSend: "Send by email",
  mailSubject: "VARO gym partnership: {gym}",
  mail: {
    gym: "Gym: ",
    role: "Role: ",
    contact: "Contact: ",
    needs: "Needs:",
    none: "(none picked)",
    note: "Other: ",
  },

  faqTitle: "Questions",
  faq: [
    {
      q: "Do I have to replace my current system?",
      a: "No. VARO starts from routes, beta, climbers' logs and the climbing community to bring climbers in and back, alongside the system you use. Memberships, bookings and payments are planned too, built the way climbing gyms work; whether to move them is your call.",
    },
    {
      q: "How much staff time does it take?",
      a: "We do the setup. After that, setters photograph and tap a grade at each reset; it works offline and uploads later.",
    },
    {
      q: "Do climbers need the app?",
      a: "No. A wall's QR poster or your gym page shows routes and beta on the web. The app is for reset alerts and logging progress.",
    },
    {
      q: "How will pricing work?",
      a: "Free for our first partner gyms. Plans will follow the features you use and the results they bring, such as a monthly fee or pay per new customer; we'll discuss pricing with you first.",
    },
  ],
};

export const partnersCopy = { "zh-TW": zh, en };
export type PartnersCopy = typeof zh;
