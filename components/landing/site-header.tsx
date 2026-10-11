import Image from "next/image";
import Link from "next/link";

import { partnerHref } from "@/config/site";
import { getI18n, localizePath } from "@/lib/i18n";

const navLink =
  "flex h-11 items-center rounded-lg px-3.5 text-[15px] font-medium text-mute transition-colors hover:text-cream";

/**
 * Wordmark on the left; 理念, 場館合作 (when an inbox is set) and the language
 * switch on the right. `path` is the current page, unprefixed, e.g. "/privacy".
 */
export async function SiteHeader({ path }: { path: string }) {
  const { locale, t, href } = await getI18n();
  const partner = partnerHref(t.partnerSubject);
  const other = locale === "en" ? "zh-TW" : "en";

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <div className="mx-auto flex h-16 w-full max-w-[1240px] items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8">
        <Link
          aria-label="VARO"
          className="flex h-11 items-center"
          href={href("/")}
        >
          <Image
            priority
            alt="VARO"
            className="h-[20px] w-auto sm:h-[22px]"
            height={172}
            src="/brand/varo-wordmark-white.png"
            width={1000}
          />
        </Link>
        <nav className="flex items-center gap-1">
          <Link className={navLink} href={href("/philosophy")}>
            {t.nav.philosophy}
          </Link>
          {partner ? (
            <a className={navLink} href={partner}>
              {t.nav.partner}
            </a>
          ) : null}
          <Link
            aria-label={t.nav.switchAria}
            className={navLink}
            href={localizePath(other, path)}
            hrefLang={other}
          >
            {t.nav.switchLabel}
          </Link>
        </nav>
      </div>
    </header>
  );
}
