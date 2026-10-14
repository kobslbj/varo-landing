import type { Locale } from "@/lib/i18n/config";

import { siteConfig } from "@/config/site";

/** Shared by the visible homepage, JSON-LD and the plain-text agent brief. */
export function productFaq(locale: Locale) {
  const en = locale === "en";

  return [
    {
      q: en ? "What is Varo?" : "Varo 是什麼？",
      a: en
        ? "Varo is an iOS bouldering log for climbers in Taiwan. Record attempts and sends, track projects, and look back on your progress. Available in Traditional Chinese and English."
        : "Varo 是為台灣抱石者打造的 iOS 攀岩紀錄 App，支援繁體中文與英文。記錄每條路線的嘗試與完攀、追蹤 Project，回顧自己的進步。",
    },
    {
      q: en ? "Can I download it now?" : "現在可以下載嗎？",
      a: siteConfig.appStoreUrl
        ? en
          ? "Varo is available on the App Store for iOS."
          : "Varo 已在 App Store 上架，適用於 iOS。"
        : en
          ? "Varo is coming soon to the App Store. Join the waitlist for a launch email. The Taiwan gym directory is available on this website now, without an account."
          : "Varo 尚未在 App Store 上架，可以留下 email 接收上架通知。網站的全台岩館地圖現在就能使用，不需要帳號。",
    },
    {
      q: en ? "Are my climbing logs public?" : "我的攀爬紀錄會公開嗎？",
      a: en
        ? "Logs are private by default. Photos are stored privately and videos stay on your device. Other people only see what you choose to share."
        : "紀錄預設只有你自己看得到。照片存放在私人空間，影片留在你的手機；其他人只會看到你主動分享的內容。",
    },
    {
      q: en
        ? "Can I book a gym through Varo?"
        : "可以直接透過 Varo 預約岩館嗎？",
      a: en
        ? "The directory helps you find gyms and their official contact links. Varo does not currently handle bookings. Confirm current prices, hours and availability with the gym."
        : "岩館名錄提供場館資訊與官方聯絡入口，目前不提供代訂服務。價格、營業時間與體驗名額，請向場館確認。",
    },
  ];
}
