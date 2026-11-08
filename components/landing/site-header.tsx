import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";

import { siteConfig } from "@/config/site";
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
  "relative flex h-10 items-center whitespace-nowrap rounded-full px-2.5 text-[14px] font-semibold transition-colors max-[359px]:px-2 sm:px-3.5 sm:text-[15px]";

/** Which tab the page belongs to, from its unprefixed path. */
function section(path: string) {
  if (/(^|\/)beta(\/|$)/.test(path)) return "beta";
  if (path.startsWith("/gyms")) return "gyms";
  if (path.startsWith("/articles")) return "articles";

  return null;
}

/**
 * The tools first: 岩館, Beta and 文章, then the language switch and a small
 * download button. 理念 and 場館合作 live in the footer. `path` is the current
 * page, unprefixed, e.g. "/privacy".
 *
 * Fixed with a frosted bar, so the tools stay in reach while scrolling. Pages
 * that open on a dark photo get a transparent bar that scrolls away instead.
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
  const here = section(path);
  const tab = (name: string) =>
    clsx(
      navLink,
      here === name
        ? overPhoto
          ? "text-white"
          : "bg-ink-3 text-cream"
        : overPhoto
          ? "text-white/75 hover:text-white"
          : "text-mute hover:text-cream",
    );

  return (
    <header
      className={clsx(
        "inset-x-0 top-0 z-50",
        overPhoto
          ? "theme-dark absolute"
          : "fixed border-b border-line bg-ink/85 backdrop-blur-xl backdrop-saturate-150",
      )}
    >
      <div className="mx-auto flex h-14 w-full max-w-[1240px] items-center justify-between gap-2 px-4 sm:h-16 sm:px-6 lg:px-8">
        <Link
          aria-label="VARO"
          className="flex h-10 shrink-0 items-center"
          href={href("/")}
        >
          <Image
            priority
            alt="VARO"
            className="h-[17px] w-auto max-[359px]:h-[14px] sm:h-[19px]"
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
        <nav className="flex min-w-0 items-center gap-0.5 sm:gap-1">
          <Link
            aria-current={here === "gyms" ? "page" : undefined}
            className={tab("gyms")}
            href={href("/gyms")}
          >
            {t.gyms.nav}
          </Link>
          {fullSite && (
            <>
              <Link
                aria-current={here === "beta" ? "page" : undefined}
                className={tab("beta")}
                href={href("/beta")}
              >
                {t.nav.beta}
                <span
                  aria-hidden
                  className="absolute right-1 top-1.5 size-1.5 rounded-full bg-lime ring-2 ring-ink sm:right-2"
                />
              </Link>
              {/* Not every link fits beside the logo on narrow phones; 文章
                  is also in the footer. */}
              <Link
                aria-current={here === "articles" ? "page" : undefined}
                className={clsx(
                  tab("articles"),
                  locale === "en" ? "max-[479px]:hidden" : "max-[399px]:hidden",
                )}
                href={href("/articles")}
              >
                {t.nav.articles}
              </Link>
            </>
          )}
          {languages.length > 2 ? (
            <details className="group relative">
              <summary
                aria-label={t.nav.switchAria}
                className={clsx(
                  tab(""),
                  "cursor-pointer list-none gap-1.5 [&::-webkit-details-marker]:hidden",
                )}
              >
                <GlobeIcon />
                <span className="max-sm:hidden">{languageNames[locale]}</span>
              </summary>
              <ul className="absolute right-0 top-full mt-2 min-w-[9rem] overflow-hidden rounded-xl border border-line bg-ink-2 py-1 shadow-xl">
                {languages.map((l) => (
                  <li key={l}>
                    <Link
                      aria-current={l === locale ? "true" : undefined}
                      className={clsx(
                        "flex h-11 items-center px-4 text-[15px] transition-colors hover:bg-ink-3",
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
              className={tab("")}
              href={localizePath(other, path)}
              hrefLang={other}
            >
              {t.nav.switchLabel}
            </Link>
          )}
          {fullSite && siteConfig.appStoreUrl ? (
            <a
              className={clsx(
                "ml-1 flex h-9 items-center gap-1.5 rounded-full px-3 text-[13px] font-bold transition-colors sm:ml-2 sm:px-4 sm:text-[14px]",
                overPhoto
                  ? "bg-white text-night hover:bg-lime"
                  : "bg-night text-day hover:bg-night/85",
              )}
              href={siteConfig.appStoreUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              <AppleIcon />
              <span className="max-[519px]:hidden">{t.nav.getApp}</span>
              <span className="min-[520px]:hidden">App</span>
            </a>
          ) : null}
        </nav>
      </div>
    </header>
  );
}

function AppleIcon() {
  return (
    <svg
      aria-hidden
      className="size-3.5"
      fill="currentColor"
      viewBox="0 0 17 20"
    >
      <path d="M14.1 10.6c0-2.6 2.1-3.8 2.2-3.9-1.2-1.8-3.1-2-3.7-2-1.6-.2-3.1.9-3.9.9-.8 0-2.1-.9-3.4-.9-1.7 0-3.3 1-4.2 2.6-1.8 3.1-.5 7.7 1.3 10.2.8 1.2 1.8 2.6 3.1 2.6 1.3-.1 1.7-.8 3.3-.8 1.5 0 1.9.8 3.3.8 1.4 0 2.2-1.2 3-2.5 1-1.4 1.3-2.8 1.4-2.9-.1 0-2.6-1-2.4-4.1ZM11.6 3c.7-.8 1.2-2 1-3.1-1 0-2.2.7-2.9 1.5-.6.7-1.2 1.9-1 3 1.1.1 2.2-.6 2.9-1.4Z" />
    </svg>
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
