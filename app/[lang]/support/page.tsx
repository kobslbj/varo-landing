import type { Metadata } from "next";

import SupportEn, { meta as metaEn } from "./content.en";
import SupportZh, { meta as metaZh } from "./content.zh-TW";

import { alternates, getI18n } from "@/lib/i18n";

// A legal/support text reads better translated as a whole than as dictionary keys.
const content = {
  "zh-TW": { Body: SupportZh, meta: metaZh },
  en: { Body: SupportEn, meta: metaEn },
};

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = await getI18n();

  return {
    ...content[locale].meta,
    alternates: alternates(locale, "/support"),
  };
}

export default async function SupportPage() {
  const { locale } = await getI18n();
  const { Body } = content[locale];

  return <Body />;
}
