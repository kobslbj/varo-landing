import "@/styles/globals.css";
import type { Metadata, Viewport } from "next";

import { Inter, Russo_One } from "next/font/google";
import clsx from "clsx";

import { siteConfig } from "@/config/site";

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

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: siteConfig.title,
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: ["抱石", "攀岩", "攀岩紀錄", "bouldering", "climbing log", "Varo"],
  openGraph: {
    type: "website",
    locale: "zh_TW",
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#101112",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      className={clsx("dark", inter.variable, russo.variable)}
      data-theme="dark"
      lang="zh-Hant-TW"
    >
      <body className="min-h-dvh font-sans antialiased">{children}</body>
    </html>
  );
}
