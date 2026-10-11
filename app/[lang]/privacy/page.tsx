import type { Metadata } from "next";

import PrivacyEn, { meta as metaEn } from "./content.en";
import PrivacyZh, { meta as metaZh } from "./content.zh-TW";

import { alternates, getI18n } from "@/lib/i18n";

// A legal/support text reads better translated as a whole than as dictionary keys.
const content = {
  "zh-TW": { Body: PrivacyZh, meta: metaZh },
  en: { Body: PrivacyEn, meta: metaEn },
};

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = await getI18n();

  return {
    ...content[locale].meta,
    alternates: alternates(locale, "/privacy"),
  };
}

export default async function PrivacyPage() {
  const { locale } = await getI18n();
  const { Body } = content[locale];

  return <Body />;
}
