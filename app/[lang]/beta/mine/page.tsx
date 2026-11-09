import type { Metadata } from "next";

import { MyBeta } from "@/components/beta/my-beta";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";
import { Container } from "@/components/landing/ui";
import { getI18n, siteLocale } from "@/lib/i18n";

const copy = {
  "zh-TW": {
    title: "我分享的 beta",
    lead: "每一支 beta 被看了幾次、收到幾個碰拳，還有幫幾個人完攀。",
  },
  en: {
    title: "My beta",
    lead: "How often each beta was watched, the fist bumps it got, and how many people sent after watching.",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = await getI18n();

  // Personal: kept out of search.
  return {
    title: `${copy[siteLocale(locale)].title}｜VARO`,
    robots: { index: false, follow: false },
  };
}

export default async function MyBetaPage() {
  const { locale, href } = await getI18n();
  const lang = siteLocale(locale);
  const c = copy[lang];

  return (
    <>
      <SiteHeader path="/beta/mine" />
      <main>
        <Container className="pb-20 pt-28 sm:pt-36">
          <div className="mx-auto max-w-[720px]">
            <p className="flex items-center gap-2.5">
              <span
                aria-hidden
                className="size-3 rounded-[3px] bg-lime ring-2 ring-night"
              />
              <span className="label-wide text-[12px]">BETA</span>
            </p>
            <h1 className="display-zh mt-3 text-[36px] sm:text-[48px]">
              {c.title}
            </h1>
            <p className="mt-3 text-[16px] leading-[1.75] text-mute">
              {c.lead}
            </p>
            <div className="mt-8">
              <MyBeta
                gymsHref={href("/gyms")}
                lang={lang}
                shortHref={href("/beta/r")}
              />
            </div>
          </div>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
