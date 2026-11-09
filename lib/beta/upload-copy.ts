/** Words on the web beta upload page. Japanese and Korean read English. */
export const uploadCopy = {
  "zh-TW": {
    metaTitle: "上傳 beta｜VARO",
    title: "上傳你的 beta",
    lead: "把你爬這條的影片分享給岩友。點了才會播放，不會暴雷。",
    steps: ["登入", "選影片", "剪片段", "確認"],
    signInTitle: "登入後上傳",
    signInBody:
      "在 App 用 Google 登入的人，這裡是同一個帳號。還沒有 App 也可以，登入就會建立 VARO 帳號。",
    google: "用 Google 登入",
    apple: "用 Apple 登入",
    sameMethodNote:
      "選你在 VARO App 用的那一個，上傳的 beta 就會在你的 App 裡。",
    inAppTitle: "請改用 Safari 或 Chrome 開啟",
    inAppBody:
      "在 IG、LINE、Threads 裡開的網頁，Google 不允許登入。點右上角「⋯」選擇用瀏覽器開啟，或複製連結貼到 Safari。",
    copyLink: "複製連結",
    appClipsTitle: "你在 App 記過這條線",
    appClipsBody:
      "直接把那支影片分享成 beta 就好，不用再傳一次，也不會多一筆紀錄。",
    appClipsShared: "這條線的 beta 已經有你的影片了。",
    appClipDate: (iso: string) => {
      const d = new Date(Date.parse(iso) + 8 * 3600_000);

      return `${d.getUTCMonth() + 1} 月 ${d.getUTCDate()} 日的影片`;
    },
    appClipNotUp: "還在你的手機，App 上傳完就能分享",
    appClipShare: "分享成 beta",
    appClipSharing: "分享中…",
    appClipIsBeta: "已是 beta",
    appClipsOr: "或在下面上傳另一支影片。再傳一次會多一筆紀錄。",
    inAppPickTitle: "在 IG 裡可能選不了影片",
    inAppPickBody:
      "IG、LINE、Threads 裡開的網頁常常讀不到相簿的影片。點右上角「⋯」選擇用瀏覽器開啟，或複製連結貼到 Safari。",
    reading: "讀取影片中…",
    appleNote:
      "在 App 是用 Apple 登入的話，這裡的 Google 會是另一個帳號。更新到最新版 App，在「設定 › 登入方式」連結 Google，就是同一個帳號。",
    signInFailed: "登入沒有完成，再試一次。",
    signingIn: "登入中…",
    loading: "載入中…",
    profileTitle: "第一次使用 VARO",
    profileBody: "取個名字，岩友看 beta 時會看到。其他設定之後到 App 再填。",
    nameLabel: "顯示名稱",
    namePlaceholder: "例如：小明",
    agree: ["我已閱讀並同意 VARO 的", "隱私權政策", "。"],
    createAccount: "建立帳號並繼續",
    usedApp: "我在 App 是用 Apple 登入的 →",
    usedAppHint:
      "繼續的話會建立一個新帳號，跟 App 裡的分開。建議改在 VARO App 分享這支 beta。再按一次就登出。",
    uploadingTo: "beta 會存到這個帳號",
    switchAccount: "換帳號",
    pickTitle: "選擇影片",
    pickBody: "手機相簿或電腦裡的影片都可以。最長 60 秒，可以剪。",
    pickButton: "選擇影片",
    pickAgain: "換一支",
    unsupportedBrowser:
      "這個瀏覽器沒辦法處理影片。請改用 iPhone 的 Safari（iOS 16.4 以上）或 Chrome，或在 VARO App 分享。",
    trimTitle: "選要分享的片段",
    start: "開始",
    length: "長度",
    seconds: (s: number) => `${s} 秒`,
    detailsTitle: "這次爬得怎麼樣？",
    sent: "完攀",
    flash: "Flash",
    attempted: "還在嘗試",
    dateLabel: "攀爬日期",
    consent:
      "這是我本人，或我拍攝並有權分享的影片。影片裡如果有其他人，我已經取得同意。影片會公開在這條路線的 beta，之後可以在 App 刪除。",
    submit: "上傳 beta",
    processing: "處理影片中",
    processingNote: "在你的裝置上壓縮，不要關閉這個頁面。",
    uploading: "上傳中",
    publishing: "發布中",
    cancel: "取消",
    doneTitle: "你的 beta 上線了",
    doneFirst: "你是第一個分享這條 beta 的人！",
    doneBody: "有人看了你的 beta 之後完攀、或幫你碰拳，VARO App 會通知你。",
    viewRoute: "看這條路線",
    share: "分享連結",
    copied: "已複製連結",
    another: "再上傳一支",
    mine: "看我分享過的 beta",
    getApp: "下載 VARO 收通知",
    retry: "再試一次",
    errors: {
      rate_limited_day: "今天上傳太多支了，明天再來。",
      rate_limited_route: "同一條路線最多分享 3 支 beta。",
      route_gone: "這條路線已經換掉了，沒辦法再上傳。",
      too_big: "影片太大了（超過 50 MB），請剪短一點，或改用 Chrome。",
      unsupported:
        "這支影片在這個瀏覽器處理不了。請改用 iPhone 的 Safari（iOS 16.4 以上）或 Chrome，或在 VARO App 分享。",
      unreadable: "讀不到這支影片，換一支試試。",
      unreadableInApp:
        "在 IG 這類 App 裡讀不到影片。請點右上角「⋯」用 Safari 開啟再上傳，或在 VARO App 分享。",
      network: "網路不穩，上傳沒有完成。",
      generic: "出了點問題，再試一次。",
    },
  },
  en: {
    metaTitle: "Upload beta | VARO",
    title: "Upload your beta",
    lead: "Share your video of this route. Nothing plays until someone taps, so no spoilers.",
    steps: ["Sign in", "Pick", "Trim", "Confirm"],
    signInTitle: "Sign in to upload",
    signInBody:
      "If you use Google in the VARO app, it's the same account here. No app yet? Signing in creates your VARO account.",
    google: "Sign in with Google",
    apple: "Sign in with Apple",
    sameMethodNote:
      "Pick the one you use in the VARO app, and your beta shows up there too.",
    inAppTitle: "Open this in Safari or Chrome",
    inAppBody:
      'Google doesn\'t allow sign-in inside Instagram, LINE or Threads. Tap "⋯" and open in your browser, or copy the link into Safari.',
    copyLink: "Copy link",
    appClipsTitle: "You logged this route in the app",
    appClipsBody:
      "Share that video as beta instead: no second upload and no extra visit in your log.",
    appClipsShared: "Your video is already this route's beta.",
    appClipDate: (iso: string) =>
      `Video from ${new Date(Date.parse(iso) + 8 * 3600_000).toLocaleDateString("en", { month: "short", day: "numeric", timeZone: "UTC" })}`,
    appClipNotUp: "Still on your phone; share it once the app has uploaded it",
    appClipShare: "Share as beta",
    appClipSharing: "Sharing…",
    appClipIsBeta: "Beta",
    appClipsOr:
      "Or upload another video below. Uploading again adds another visit to your log.",
    inAppPickTitle: "Picking a video may not work here",
    inAppPickBody:
      'Pages opened inside Instagram, LINE or Threads often can\'t read videos from your library. Tap "⋯" and open in your browser, or copy the link into Safari.',
    reading: "Reading the video…",
    appleNote:
      "If you use Apple in the app, Google here makes a separate account. In the latest app, link Google under Settings › Sign-in methods to keep one account.",
    signInFailed: "Sign-in didn't finish. Try again.",
    signingIn: "Signing in…",
    loading: "Loading…",
    profileTitle: "New to VARO",
    profileBody:
      "Pick a name climbers will see on your beta. The rest can wait for the app.",
    nameLabel: "Display name",
    namePlaceholder: "e.g. Alex",
    agree: ["I have read and agree to VARO's ", "privacy policy", "."],
    createAccount: "Create account and continue",
    usedApp: "I sign in to the app with Apple →",
    usedAppHint:
      "Continuing makes a new account, separate from the app's. Sharing this beta from the VARO app is better. Tap again to sign out.",
    uploadingTo: "Your beta goes to this account",
    switchAccount: "Switch",
    pickTitle: "Pick a video",
    pickBody:
      "From your phone or computer. Up to 60 seconds, and you can trim it.",
    pickButton: "Choose video",
    pickAgain: "Choose another",
    unsupportedBrowser:
      "This browser can't process video. Try Safari on iPhone (iOS 16.4+) or Chrome, or share from the VARO app.",
    trimTitle: "Pick the part to share",
    start: "Start",
    length: "Length",
    seconds: (s: number) => `${s}s`,
    detailsTitle: "How did it go?",
    sent: "Sent",
    flash: "Flash",
    attempted: "Working it",
    dateLabel: "Date climbed",
    consent:
      "This is me, or I filmed it and may share it. Anyone else in it has agreed. It will be public as this route's beta; I can delete it in the app.",
    submit: "Upload beta",
    processing: "Processing video",
    processingNote: "Compressing on your device. Keep this page open.",
    uploading: "Uploading",
    publishing: "Publishing",
    cancel: "Cancel",
    doneTitle: "Your beta is live",
    doneFirst: "You're the first to share beta for this route!",
    doneBody:
      "When someone sends after watching it, or fist-bumps it, the VARO app will tell you.",
    viewRoute: "See the route",
    share: "Share link",
    copied: "Link copied",
    another: "Upload another",
    mine: "See all my beta",
    getApp: "Get VARO for alerts",
    retry: "Try again",
    errors: {
      rate_limited_day:
        "That's a lot of uploads for today. Try again tomorrow.",
      rate_limited_route: "You can share up to 3 beta videos per route.",
      route_gone: "This route has been taken down, so it can't take new beta.",
      too_big: "That video is over 50 MB. Trim it shorter, or use Chrome.",
      unsupported:
        "This browser can't process that video. Try Safari on iPhone (iOS 16.4+) or Chrome, or share from the VARO app.",
      unreadable: "Couldn't read that video. Try another one.",
      unreadableInApp:
        'This in-app browser couldn\'t read the video. Tap "⋯" and open in Safari to upload, or share from the VARO app.',
      network: "The connection dropped before the upload finished.",
      generic: "Something went wrong. Try again.",
    },
  },
};

export type UploadCopy = (typeof uploadCopy)["zh-TW"];
