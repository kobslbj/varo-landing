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
  /** Inbox for gym partnership enquiries. The 場館合作 CTA is hidden until this is set. */
  partnerEmail: string | null;
  contactEmail: string | null;
  privacyUrl: string | null;
  termsUrl: string | null;
  /** Real App Store screenshots. When empty, the page renders labelled HTML previews instead. */
  screenshots: Screenshot[];
}

export const siteConfig: SiteConfig = {
  name: "Varo",
  title: "VARO：抱石紀錄",
  description:
    "Varo 是為台灣抱石者打造的攀岩紀錄 App。記下每次攀爬與嘗試、追蹤正在挑戰的 Project，回頭看見自己的進步。",
  tagline: "Venture · Attempt · Resilience · Overcome",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  appStoreUrl: null,
  partnerEmail: process.env.NEXT_PUBLIC_PARTNER_EMAIL ?? null,
  contactEmail: null,
  privacyUrl: null,
  termsUrl: null,
  screenshots: [],
};

export const partnerHref = siteConfig.partnerEmail
  ? `mailto:${siteConfig.partnerEmail}?subject=${encodeURIComponent("Varo 場館合作")}`
  : null;
