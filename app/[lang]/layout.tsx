import "@/styles/globals.css";
import type { Metadata, Viewport } from "next";

import { Archivo, Inter, Noto_Sans_TC, Space_Grotesk } from "next/font/google";
import clsx from "clsx";

import { Analytics } from "@/components/analytics";
import { Toaster } from "@/components/toaster";
import { siteConfig } from "@/config/site";
import { alternates, getI18n, locales } from "@/lib/i18n";
import { JsonLd, siteGraph } from "@/lib/seo";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-grotesk",
  display: "swap",
});

// Extra-wide caps for small labels, the way SCRAM uses Archivo.
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

// Black weight for Chinese headlines. Google serves it in unicode-range
// slices, so a page only downloads the characters it uses.
const notoTc = Noto_Sans_TC({
  weight: "900",
  preload: false,
  variable: "--font-noto-tc",
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
  themeColor: "#f4f4f1",
  colorScheme: "light",
};

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  const { locale, t } = await getI18n();

  return (
    <html
      className={clsx(
        inter.variable,
        grotesk.variable,
        archivo.variable,
        notoTc.variable,
      )}
      data-theme="light"
      lang={t.htmlLang}
    >
      <body className="min-h-dvh font-sans antialiased">
        <JsonLd graph={siteGraph(locale, t.meta.description)} />
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
