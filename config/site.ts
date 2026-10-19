export interface Screenshot {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface SiteConfig {
  name: string;
  title: string;
  description: string;
  tagline: string;
  /** Canonical origin, used for metadataBase / OG URLs. */
  siteUrl: string;
  /** Public App Store listing. The download button is hidden until this is set. */
  appStoreUrl: string | null;
  /** Inbox for gym partnership enquiries, used by the /partners page. */
  partnerEmail: string | null;
  contactEmail: string | null;
  privacyUrl: string | null;
  termsUrl: string | null;
  /** Real App Store screenshots. When empty, the page renders labelled HTML previews instead. */
  screenshots: Screenshot[];
}

export const siteConfig: SiteConfig = {
  name: "VARO",
  title: "VARO｜抱石紀錄 App，為台灣攀岩者打造",
  description:
    "Varo 是為台灣抱石者打造的攀岩紀錄 App。記下每次攀爬與嘗試、追蹤正在挑戰的 Project，回頭看見自己的進步。",
  tagline: "Venture · Attempt · Resilience · Overcome",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://getvaro.app",
  appStoreUrl:
    "https://apps.apple.com/tw/app/varo-bouldering-climbing/id6821378123",
  partnerEmail: process.env.NEXT_PUBLIC_PARTNER_EMAIL ?? "support@getvaro.app",
  contactEmail: "support@getvaro.app",
  privacyUrl: "/privacy",
  termsUrl: null,
  screenshots: [],
};

/** Mailto for gym enquiries, with an optional pre-filled body, or null when no inbox is set. */
export const partnerHref = (subject: string, body?: string) =>
  siteConfig.partnerEmail
    ? `mailto:${siteConfig.partnerEmail}?subject=${encodeURIComponent(subject)}${
        body ? `&body=${encodeURIComponent(body)}` : ""
      }`
    : null;
