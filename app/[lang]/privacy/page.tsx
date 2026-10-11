import type { Metadata } from "next";

import PrivacyEn, { meta as metaEn } from "./content.en";
import PrivacyZh, { meta as metaZh } from "./content.zh-TW";

import { getI18n } from "@/lib/i18n";
import { JsonLd, pageMetadata, webPage } from "@/lib/seo";

// A legal/support text reads better translated as a whole than as dictionary keys.
const content = {
  "zh-TW": { Body: PrivacyZh, meta: metaZh },
  en: { Body: PrivacyEn, meta: metaEn },
};

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = await getI18n();

  return pageMetadata("/privacy", content[locale].meta);
}

export default async function PrivacyPage() {
  const { locale } = await getI18n();
  const { Body, meta } = content[locale];

  return (
    <>
      <JsonLd
        graph={[
          webPage(locale, "/privacy", {
            name: meta.title,
            description: meta.description,
          }),
        ]}
      />
      <Body />
    </>
  );
}
