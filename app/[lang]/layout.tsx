import "@/styles/globals.css";
import type { Metadata, Viewport } from "next";

import { Inter, Russo_One } from "next/font/google";
import clsx from "clsx";

import { siteConfig } from "@/config/site";
import { alternates, getI18n, locales } from "@/lib/i18n";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const russo = Russo_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-russo",
  display: "swap",
});

// Unknown locales are unmatched routes, served by app/global-not-found.tsx.
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  const { locale, t, href } = await getI18n();

  return {
    metadataBase: new URL(siteConfig.siteUrl),
    title: t.meta.title,
    description: t.meta.description,
    applicationName: siteConfig.name,
    keywords: t.meta.keywords,
    alternates: alternates(locale, "/"),
    openGraph: {
      type: "website",
      locale: t.ogLocale,
      siteName: siteConfig.name,
      title: t.meta.title,
      description: t.meta.description,
      url: href("/"),
    },
    twitter: {
      card: "summary_large_image",
      title: t.meta.title,
      description: t.meta.description,
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#101112",
  colorScheme: "dark",
};

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  const { t } = await getI18n();

  return (
    <html
      className={clsx("dark", inter.variable, russo.variable)}
      data-theme="dark"
      lang={t.htmlLang}
    >
      <body className="min-h-dvh font-sans antialiased">{children}</body>
    </html>
  );
}
