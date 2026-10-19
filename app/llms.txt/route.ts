import { faq as faqEn } from "../[lang]/support/content.en";
import { faq as faqZh } from "../[lang]/support/content.zh-TW";

import { siteConfig } from "@/config/site";
import { cities, gymPath } from "@/lib/gyms/cities";
import { gyms, checkedAt } from "@/lib/gyms/data";
import { visitorFaq } from "@/lib/gyms/visitor-faq";
import { articlePath, articles } from "@/lib/articles";
import { productFaq } from "@/lib/product-faq";
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
- For agents, source limitations and gym index: [中文](${absoluteUrl("/agents")}) · [English](${absoluteUrl("/en/agents")})
- Bouldering gyms in Taiwan, a map and list with addresses, hours, prices and booking (compiled from public information; hours and prices mostly unconfirmed with the gyms): [中文](${absoluteUrl("/gyms")}) · [English](${absoluteUrl("/en/gyms")})
- Bouldering gyms by city: ${cities.map((c) => `[${c.name}](${absoluteUrl(`/gyms/${c.slug}`)})`).join(" · ")}
- Guides for beginners (Traditional Chinese only): [文章](${absoluteUrl("/articles")}) — ${articles.map((a) => `[${a.title}](${absoluteUrl(articlePath(a))})`).join(" · ")}
- Philosophy, the meaning of the name: [中文](${absoluteUrl("/philosophy")}) · [English](${absoluteUrl("/en/philosophy")}) — ${en.philosophy.meta.description}
- For gyms, recruiting the first partner gyms (the setter upload tool has a first version, reset notifications and route feedback are planned): [中文](${absoluteUrl("/partners")}) · [English](${absoluteUrl("/en/partners")}) — ${en.partners.meta.description}
- Support & FAQ: [中文](${absoluteUrl("/support")}) · [English](${absoluteUrl("/en/support")}) — frequently asked questions and contact
- Privacy Policy: [中文](${absoluteUrl("/privacy")}) · [English](${absoluteUrl("/en/privacy")}) — what data VARO collects and how to delete it

## Product facts & availability

${qa(productFaq("en"))}

## Climbing in Taiwan as a visitor

${visitorFaq((city) => en.gyms.cities[city] ?? city)
  .map(({ q, a }) => `### ${q}\n\n${a}`)
  .join("\n\n")}

## Gym data and citation guidance

- Dataset review date: ${checkedAt}. This is a directory-level review date, not verification of each gym or field by its operator.
- Cite the individual gym page. Preserve its source notes, conflicting information and unconfirmed operating status.
- Missing information means unknown, not free or unavailable. An omitted weekday does not mean the gym is closed.
- Official contact links are for checking current announcements, not proof that every field came from those pages.
- No live opening status, booking availability or reservation service is provided. Confirm current hours and prices with the gym.
- Public pages and this text brief are available. No public API, MCP server or access to personal climbing logs is currently provided.

## Individual gyms

${gyms.map((g) => `- [${g.name}](${absoluteUrl(gymPath(g))}) · [English](${absoluteUrl(`/en${gymPath(g)}`)}) — ${g.city}, ${g.category}${g.confirmed ? "" : "; operating status unconfirmed"}`).join("\n")}

## FAQ

${qa(faqEn)}

## 常見問題

${qa(faqZh)}
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
