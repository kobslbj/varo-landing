import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";

import {
  getI18n,
  localesFor,
  localizePath,
  siteLocales,
  type Locale,
} from "@/lib/i18n";

/** Each language in its own name. */
const languageNames: Record<Locale, string> = {
  "zh-TW": "中文",
  en: "English",
  ja: "日本語",
  ko: "한국어",
};

const navLink =
  "flex h-11 items-center whitespace-nowrap rounded-lg px-2 text-[14px] font-medium text-mute transition-colors hover:text-cream max-[359px]:px-1.5 max-[359px]:text-[13px] sm:px-3.5 sm:text-[15px]";

/**
 * Wordmark on the left; 岩館, 文章, 理念, 場館合作 and the language
 * switch on the right. `path` is the current page, unprefixed, e.g. "/privacy".
 */
export async function SiteHeader({
  path,
  overPhoto = false,
}: {
  path: string;
  /** White logo and links, for pages that open on a dark photo. */
  overPhoto?: boolean;
}) {
  const { locale, t, href } = await getI18n();
  const other = locale === "en" ? "zh-TW" : "en";
  // Japanese and Korean have only the gym pages; the rest of the nav would
  // send them to English.
  const fullSite = siteLocales.includes(locale);
  const languages = localesFor(path);

  return (
    <header
      className={clsx(
        "absolute inset-x-0 top-0 z-50",
        overPhoto && "theme-dark",
      )}
    >
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
            src={
              overPhoto
                ? "/brand/varo-wordmark-white.png"
                : "/brand/varo-wordmark-black.png"
            }
            width={1000}
          />
        </Link>
        <nav className="flex items-center gap-1">
          <Link className={navLink} href={href("/gyms")}>
            {t.gyms.nav}
          </Link>
          {/* Not every link fits beside the logo on narrow phones: 理念 goes
              first, then 文章. The English labels are longer, so they need more room. */}
          {fullSite && (
            <>
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
            </>
          )}
          {languages.length > 2 ? (
            <details className="group relative">
              <summary
                aria-label={t.nav.switchAria}
                className={clsx(
                  navLink,
                  "cursor-pointer list-none gap-1.5 [&::-webkit-details-marker]:hidden",
                )}
              >
                <GlobeIcon />
                {languageNames[locale]}
              </summary>
              <ul className="absolute right-0 top-full mt-1 min-w-[9rem] overflow-hidden rounded-xl border border-line bg-ink py-1 shadow-xl">
                {languages.map((l) => (
                  <li key={l}>
                    <Link
                      aria-current={l === locale ? "true" : undefined}
                      className={clsx(
                        "flex h-11 items-center px-4 text-[15px] transition-colors hover:text-lime-ink",
                        l === locale
                          ? "font-semibold text-lime-ink"
                          : "text-cream",
                      )}
                      href={localizePath(l, path)}
                      hrefLang={l}
                      lang={l}
                    >
                      {languageNames[l]}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          ) : (
            <Link
              aria-label={t.nav.switchAria}
              className={navLink}
              href={localizePath(other, path)}
              hrefLang={other}
            >
              {t.nav.switchLabel}
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

function GlobeIcon() {
  return (
    <svg
      aria-hidden
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3Z" />
    </svg>
  );
}
