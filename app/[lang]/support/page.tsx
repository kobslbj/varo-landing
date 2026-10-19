import type { Metadata } from "next";

import SupportEn, { faq as faqEn, meta as metaEn } from "./content.en";
import SupportZh, { faq as faqZh, meta as metaZh } from "./content.zh-TW";

import { getI18n, siteLocale } from "@/lib/i18n";
import { faqQuestions, JsonLd, pageMetadata, webPage } from "@/lib/seo";

// A legal/support text reads better translated as a whole than as dictionary keys.
const content = {
  "zh-TW": { Body: SupportZh, meta: metaZh, faq: faqZh },
  en: { Body: SupportEn, meta: metaEn, faq: faqEn },
};

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = await getI18n();

  return pageMetadata("/support", content[siteLocale(locale)].meta);
}

export default async function SupportPage() {
  const { locale } = await getI18n();
  const { Body, faq, meta } = content[siteLocale(locale)];

  return (
    <>
      <JsonLd
        graph={[
          webPage(locale, "/support", {
            type: "FAQPage",
            name: meta.title,
            description: meta.description,
            mainEntity: faqQuestions(faq),
          }),
        ]}
      />
      <Body />
    </>
  );
}
