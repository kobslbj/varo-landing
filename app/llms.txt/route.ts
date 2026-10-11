import { faq as faqEn } from "../[lang]/support/content.en";
import { faq as faqZh } from "../[lang]/support/content.zh-TW";

import { siteConfig } from "@/config/site";
import en from "@/dictionaries/en";
import zhTW from "@/dictionaries/zh-TW";
import { absoluteUrl, nodeText } from "@/lib/seo";

export const dynamic = "force-static";

const qa = (items: typeof faqEn) =>
  items.map(({ q, a }) => `### ${q}\n\n${nodeText(a)}`).join("\n\n");

/** A plain-text brief of the site for LLMs and answer engines (llmstxt.org). */
export function GET() {
  const body = `# ${siteConfig.name}

> ${en.meta.description}

${zhTW.meta.description}

- Name: VARO (also written Varo). Tagline: "Every attempt counts." The name stands for ${siteConfig.tagline}.
- What it is: an iOS app for logging indoor bouldering sessions — each climb's grade, hold colour, wall angle, number of attempts and whether it was sent or flashed — plus photos and videos, and the projects you're working on.
- Who it's for: boulderers in Taiwan. Available in Traditional Chinese and English.
- Platform: iOS. ${siteConfig.appStoreUrl ? `App Store: ${siteConfig.appStoreUrl}` : "Coming soon to the App Store."}
- Sign-in: Sign in with Apple.
- Privacy: logs are private by default; videos stay on the device and are never uploaded.
- Made in Taiwan by Justin Li. Contact: ${siteConfig.contactEmail}

## Pages

Each page is in Traditional Chinese at the unprefixed URL and in English under /en.

- Home: [中文](${absoluteUrl("/")}) · [English](${absoluteUrl("/en")})
- Philosophy, the meaning of the name: [中文](${absoluteUrl("/philosophy")}) · [English](${absoluteUrl("/en/philosophy")}) — ${en.philosophy.meta.description}
- Support & FAQ: [中文](${absoluteUrl("/support")}) · [English](${absoluteUrl("/en/support")}) — frequently asked questions and contact
- Privacy Policy: [中文](${absoluteUrl("/privacy")}) · [English](${absoluteUrl("/en/privacy")}) — what data VARO collects and how to delete it

## FAQ

${qa(faqEn)}

## 常見問題

${qa(faqZh)}
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
