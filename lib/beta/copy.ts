/**
 * A date or timestamp as the day it was in Taipei, read with getUTC*: the
 * server runs in UTC, and an evening session there is already tomorrow here.
 */
const taipei = (iso: string) => new Date(Date.parse(iso) + 8 * 3600_000);

/** Words on the public beta pages. Japanese and Korean read English (`siteLocale`). */
export const betaCopy = {
  "zh-TW": {
    eyebrow: "BETA",
    dirTitle: ["每一條路線的", "beta 影片"],
    dirLead:
      "卡在哪一步，就看別人怎麼爬。VARO 合作岩館的現役路線，都標好牆面、顏色和難度，還有岩友的完攀影片。選你的岩館，找到你正在爬的那條。",
    dirLive: (gyms: number, routes: number) =>
      `${gyms} 間岩館開放中 · ${routes} 條現役路線`,
    dirAll: "全部",
    dirLast: "上次去的",
    dirNear: "離我最近",
    dirLocating: "定位中…",
    dirDenied: "沒拿到位置，從清單選就好",
    dirKm: (km: string) => `${km} 公里`,
    dirOpenTitle: "VARO 限定",
    dirOpenLead: "只有這幾間，能在 VARO 看到每條路線的 beta。",
    dirExclusive: "VARO 限定",
    dirOpen: "開放中",
    dirStats: (routes: number, beta: number) =>
      beta ? `${routes} 條路線 · ${beta} 條有 beta` : `${routes} 條路線`,
    dirFresh: (n: number) => `14 天內新上 ${n} 條`,
    dirEnter: "進去看 beta",
    dirNone: "這個地區還沒有岩館。",
    dirGymCta: "你是館方？讓岩友在這裡找到你的每一條路線",
    dirGymLink: "岩館合作",
    hubTitle: (gym: string) => `${gym} 的路線與 beta`,
    hubMetaTitle: (gym: string) => `${gym}｜抱石路線與 beta 影片｜VARO`,
    hubMetaDescription: (gym: string, routes: number, withBeta: number) =>
      `${gym}現在牆上的 ${routes} 條抱石路線，${withBeta} 條有 beta 影片：館方示範與岩友的完攀影片，依牆面、顏色與難度整理。`,
    latestSet: (date: string) => `最新路線 ${date}上線`,
    fullDate: (iso: string) => {
      const d = taipei(iso);

      return `${d.getUTCFullYear()} 年 ${d.getUTCMonth() + 1} 月 ${d.getUTCDate()} 日`;
    },
    hubLead:
      "現在牆上的每一條路線，和岩友、館方分享的 beta。卡關的時候，看看別人怎麼爬。",
    statRoutes: "條現役路線",
    statWithBeta: "條有 beta",
    statClips: "支影片",
    latest: "最新 beta",
    allZones: "全部",
    onlyBeta: "只看有 beta",
    finderTitle: "找你正在爬的路線",
    finderLead: "照你眼前看到的：哪面牆、什麼顏色、標籤上的難度，三下就找到。",
    finderWall: "哪面牆",
    finderColor: "什麼顏色",
    finderGrade: "標籤上的難度",
    finderPart: "{area} 的哪一面",
    finderAnyColor: "全部顏色",
    finderAnyGrade: "全部難度",
    finderFound: "{n} 條路線",
    finderClear: "清除",
    finderNone: "沒有符合的路線，換個條件試試。",
    hubSummary: (routes: number, withBeta: number) =>
      `現在牆上 ${routes} 條路線，${withBeta} 條有 beta`,
    routesCount: (n: number) => `${n} 條路線`,
    /** Templates for the client-side browser, where `{n}` is filled in. */
    routesTpl: "{n} 條路線",
    clipsTpl: "{n} 支 beta",
    noBetaYet: "還沒有 beta",
    clips: (n: number) => `${n} 支 beta`,
    gymDemo: "館方示範",
    sent: "完攀",
    flash: "Flash",
    attempted: "嘗試中",
    views: (n: number) => `${n} 次觀看`,
    body: (h: number | null, r: number | null) =>
      [h ? `身高 ${h}` : null, r ? `臂展 ${r}` : null]
        .filter(Boolean)
        .join(" · "),
    play: "播放 beta",
    emptyZone: "這面牆目前沒有符合的路線。",
    noRoutes: "這間館還沒有上架路線。",
    routeMetaTitle: (grade: string, color: string, wall: string, gym: string) =>
      `${gym} ${wall} ${color}${grade} beta｜VARO`,
    routeMetaDescription: (
      grade: string,
      wall: string,
      gym: string,
      n: number,
    ) =>
      n
        ? `${gym}${wall}的 ${grade}：${n} 支 beta 影片，館方示範與岩友完攀，點了才播放，不怕被暴雷。`
        : `${gym}${wall}的 ${grade}：還沒有 beta，成為第一個分享的人。`,
    setOn: (date: string) => `${date} 上線`,
    retired: "這條路線已經換掉了，影片僅供參考。",
    spoiler: "點了才播放，想自己解的人不會被暴雷。",
    firstTitle: "這條還沒有 beta",
    firstBody: "爬完了嗎？上傳你的影片當 beta，你會是第一個分享的人。",
    uploadCta: "上傳我的 beta",
    uploadSub: "手機或電腦的影片都可以，最長 60 秒。",
    orApp: "也可以在 VARO App 分享",
    sameWall: "同一面牆的其他路線",
    backToGym: (gym: string) => `${gym} 全部路線`,
    ctaTitle: ["在 VARO", "分享你的 beta"],
    ctaBody:
      "記下完攀時順手把影片分享成 beta。有人看了你的 beta 之後完攀，你會收到通知。",
    ctaButton: "在 App Store 下載",
    ctaNote: "iPhone · 免費",
    openApp: "在 VARO 開啟",
    gymTeaserTitle: "這間館的路線與 beta",
    gymTeaserBody: (routes: number, withBeta: number) =>
      withBeta
        ? `現在牆上 ${routes} 條路線，${withBeta} 條有 beta 影片。`
        : `現在牆上 ${routes} 條路線，等你分享第一支 beta。`,
    gymTeaserLink: "看全部路線與 beta →",
    wall: "牆面",
    date: (iso: string) => {
      const d = taipei(iso);

      return `${d.getUTCMonth() + 1} 月 ${d.getUTCDate()} 日`;
    },
  },
  en: {
    eyebrow: "BETA",
    dirTitle: ["Beta videos", "for every route"],
    dirLead:
      "Stuck on a move? See how others climbed it. Every route on the wall at VARO's partner gyms is marked by wall, hold color and grade, with climbers' send videos. Pick your gym and find the route you're on.",
    dirLive: (gyms: number, routes: number) =>
      `${gyms} ${gyms === 1 ? "gym" : "gyms"} open · ${routes} routes up`,
    dirAll: "All",
    dirLast: "Last visited",
    dirNear: "Nearest",
    dirLocating: "Locating…",
    dirDenied: "No location; pick from the list",
    dirKm: (km: string) => `${km} km`,
    dirOpenTitle: "Only on VARO",
    dirOpenLead: "The only gyms where you can see beta for every route.",
    dirExclusive: "VARO only",
    dirOpen: "Open",
    dirStats: (routes: number, beta: number) =>
      beta ? `${routes} routes · ${beta} with beta` : `${routes} routes`,
    dirFresh: (n: number) => `${n} new in 14 days`,
    dirEnter: "See the beta",
    dirNone: "No gyms in this area yet.",
    dirGymCta: "Run a gym? Let climbers find every one of your routes here",
    dirGymLink: "Partner with VARO",
    hubTitle: (gym: string) => `Routes & beta at ${gym}`,
    hubMetaTitle: (gym: string) =>
      `${gym} | Bouldering routes & beta videos | VARO`,
    hubMetaDescription: (gym: string, routes: number, withBeta: number) =>
      `${routes} bouldering routes on the wall at ${gym} now, ${withBeta} with beta videos from the gym and from climbers, by wall, hold color and grade.`,
    latestSet: (date: string) => `Newest route set ${date}`,
    fullDate: (iso: string) =>
      taipei(iso).toLocaleDateString("en", {
        year: "numeric",
        month: "short",
        day: "numeric",
        timeZone: "UTC",
      }),
    hubLead:
      "Every route on the wall now, with beta shared by climbers and the gym. Stuck? See how others climbed it.",
    statRoutes: "routes up",
    statWithBeta: "with beta",
    statClips: "videos",
    latest: "Latest beta",
    allZones: "All",
    onlyBeta: "With beta",
    finderTitle: "Find the route you're on",
    finderLead:
      "Go by what's in front of you: the wall, the hold color, the grade on the tag.",
    finderWall: "Which wall",
    finderColor: "Hold color",
    finderGrade: "Grade on the tag",
    finderPart: "Which part of {area}",
    finderAnyColor: "Any colour",
    finderAnyGrade: "Any grade",
    finderFound: "{n} routes",
    finderClear: "Clear",
    finderNone: "No routes match. Try fewer filters.",
    hubSummary: (routes: number, withBeta: number) =>
      `${routes} routes on the wall now, ${withBeta} with beta`,
    routesCount: (n: number) => `${n} ${n === 1 ? "route" : "routes"}`,
    routesTpl: "{n} routes",
    clipsTpl: "{n} beta",
    noBetaYet: "No beta yet",
    clips: (n: number) => `${n} beta`,
    gymDemo: "Gym demo",
    sent: "Sent",
    flash: "Flash",
    attempted: "Working it",
    views: (n: number) => `${n} ${n === 1 ? "view" : "views"}`,
    body: (h: number | null, r: number | null) =>
      [h ? `${h} cm tall` : null, r ? `${r} cm reach` : null]
        .filter(Boolean)
        .join(" · "),
    play: "Play beta",
    emptyZone: "No routes here match.",
    noRoutes: "This gym hasn't put up routes yet.",
    routeMetaTitle: (grade: string, color: string, wall: string, gym: string) =>
      `${color} ${grade} on ${wall}, ${gym} — beta | VARO`,
    routeMetaDescription: (
      grade: string,
      wall: string,
      gym: string,
      n: number,
    ) =>
      n
        ? `${grade} on ${wall} at ${gym}: ${n} beta videos from the gym and climbers. Nothing plays until you tap, so no spoilers.`
        : `${grade} on ${wall} at ${gym}: no beta yet. Be the first to share one.`,
    setOn: (date: string) => `Set ${date}`,
    retired: "This route has been taken down. The videos are for reference.",
    spoiler:
      "Nothing plays until you tap, so no spoilers if you want to read it yourself.",
    firstTitle: "No beta for this one yet",
    firstBody:
      "Sent it? Upload your video as beta. You'll be the first to share one.",
    uploadCta: "Upload my beta",
    uploadSub: "From your phone or computer, up to 60 seconds.",
    orApp: "Or share it from the VARO app",
    sameWall: "More on this wall",
    backToGym: (gym: string) => `All routes at ${gym}`,
    ctaTitle: ["Share your beta", "on VARO"],
    ctaBody:
      "Share your video as beta when you log a send. When someone sends after watching it, you'll hear about it.",
    ctaButton: "Download on the App Store",
    ctaNote: "iPhone · Free",
    openApp: "Open in VARO",
    gymTeaserTitle: "Routes & beta here",
    gymTeaserBody: (routes: number, withBeta: number) =>
      withBeta
        ? `${routes} routes on the wall now, ${withBeta} with beta videos.`
        : `${routes} routes on the wall now. Be the first to share beta.`,
    gymTeaserLink: "See all routes & beta →",
    wall: "Wall",
    date: (iso: string) =>
      taipei(iso).toLocaleDateString("en", {
        month: "short",
        day: "numeric",
        timeZone: "UTC",
      }),
  },
};

export type BetaCopy = (typeof betaCopy)["zh-TW"];
