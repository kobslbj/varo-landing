import "@/styles/globals.css";
import type { Metadata } from "next";

import { Russo_One } from "next/font/google";
import Link from "next/link";
import clsx from "clsx";

const russo = Russo_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-russo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "404｜VARO",
};

/** Unmatched URLs have no locale, so this page speaks both. */
export default function GlobalNotFound() {
  return (
    <html
      className={clsx("dark", russo.variable)}
      data-theme="dark"
      lang="zh-Hant-TW"
    >
      <body className="min-h-dvh font-sans antialiased">
        <main className="grid min-h-dvh place-items-center px-6 text-center">
          <div>
            <p className="font-display text-[72px] leading-none text-lime">
              404
            </p>
            <h1 className="mt-4 text-[24px] font-bold">找不到這個頁面</h1>
            <p className="mt-1 text-mute" lang="en">
              Page not found
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link
                className="inline-flex h-11 items-center rounded-lg bg-lime px-5 font-semibold text-ink"
                href="/"
              >
                回到首頁
              </Link>
              <Link
                className="inline-flex h-11 items-center rounded-lg border border-line px-5 font-semibold text-cream"
                href="/en"
                hrefLang="en"
              >
                Home (EN)
              </Link>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
