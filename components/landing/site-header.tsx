import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";

import { getI18n, localizePath } from "@/lib/i18n";

const navLink =
  "flex h-11 items-center whitespace-nowrap rounded-lg px-2 text-[14px] font-medium text-mute transition-colors hover:text-cream max-[359px]:px-1.5 max-[359px]:text-[13px] sm:px-3.5 sm:text-[15px]";

/**
 * Wordmark on the left; 岩館, 文章, 理念, 場館合作 and the language
 * switch on the right. `path` is the current page, unprefixed, e.g. "/privacy".
 */
export async function SiteHeader({ path }: { path: string }) {
  const { locale, t, href } = await getI18n();
  const other = locale === "en" ? "zh-TW" : "en";

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <div className="mx-auto flex h-16 w-full max-w-[1240px] items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8">
        <Link
          aria-label="VARO"
          className="flex h-11 shrink-0 items-center"
          href={href("/")}
        >
          <Image
            priority
            alt="VARO"
            className="h-[20px] w-auto max-[359px]:h-[16px] sm:h-[22px]"
            height={172}
            sizes="128px"
            src="/brand/varo-wordmark-white.png"
            width={1000}
          />
        </Link>
        <nav className="flex items-center gap-1">
          <Link className={navLink} href={href("/gyms")}>
            {t.gyms.nav}
          </Link>
          {/* Not every link fits beside the logo on narrow phones: 理念 goes
              first, then 文章. The English labels are longer, so they need more room. */}
          <Link
            className={clsx(
              navLink,
              locale === "en" ? "max-[419px]:hidden" : "max-[359px]:hidden",
            )}
            href={href("/articles")}
          >
            {t.nav.articles}
          </Link>
          <Link
            className={clsx(
              navLink,
              locale === "en" ? "max-[639px]:hidden" : "max-[479px]:hidden",
            )}
            href={href("/philosophy")}
          >
            {t.nav.philosophy}
          </Link>
          <Link className={navLink} href={href("/partners")}>
            {t.nav.partner}
          </Link>
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
