import type { ReactNode } from "react";

import Link from "next/link";

import { Container } from "./ui";

import { siteConfig } from "@/config/site";
import { getI18n } from "@/lib/i18n";

export async function SiteFooter() {
  const { t, href } = await getI18n();

  return (
    <Container className="relative">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-line py-6 text-[13px] text-[#7a7a7a]">
        <p>
          © {new Date().getFullYear()} VARO · Made by{" "}
          <a
            className="text-cream/80 underline decoration-line underline-offset-4 transition-colors hover:text-lime-ink hover:decoration-lime"
            href="https://www.justinli.blog/"
            rel="noopener noreferrer"
            target="_blank"
          >
            Justin Li
          </a>{" "}
          from Taiwan <TaiwanFlag label={t.footer.flag} />
        </p>
        <nav className="flex flex-wrap items-center gap-5">
          <Link
            className="transition-colors hover:text-cream"
            href={href("/articles")}
          >
            {t.nav.articles}
          </Link>
          <Link
            className="transition-colors hover:text-cream"
            href={href("/agents")}
          >
            For agents
          </Link>
          <Link
            className="transition-colors hover:text-cream"
            href={href("/support")}
          >
            {t.footer.support}
          </Link>
          <Link
            className="transition-colors hover:text-cream"
            href={href("/privacy")}
          >
            {t.footer.privacy}
          </Link>
          {/* VARO's own accounts */}
          <span className="flex items-center gap-2">
            <SocialLink href={siteConfig.social.instagram} label="Instagram">
              <svg
                aria-hidden
                className="size-[15px]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <rect height="18" rx="5" width="18" x="3" y="3" />
                <circle cx="12" cy="12" r="4" />
                <circle
                  cx="17.5"
                  cy="6.5"
                  fill="currentColor"
                  r="1"
                  stroke="none"
                />
              </svg>
            </SocialLink>
            <SocialLink href={siteConfig.social.threads} label="Threads">
              <svg
                aria-hidden
                className="size-[14px]"
                fill="currentColor"
                viewBox="0 0 440 511.43"
              >
                <path d="M342.382 237.037a175.843 175.843 0 00-6.707-3.045c-3.947-72.737-43.692-114.379-110.428-114.805-38.505-.256-72.972 15.445-94.454 48.041l36.702 25.178c15.265-23.159 39.221-28.097 56.864-28.097.203 0 .408 0 .61.003 21.973.139 38.555 6.528 49.287 18.987 7.81 9.071 13.034 21.606 15.62 37.425-19.482-3.312-40.552-4.329-63.077-3.039-63.449 3.656-104.24 40.661-101.5 92.081 1.39 26.083 14.384 48.522 36.586 63.18 18.773 12.391 42.95 18.451 68.078 17.08 33.183-1.819 59.214-14.48 77.376-37.631 13.793-17.579 22.516-40.362 26.368-69.068 15.814 9.543 27.535 22.103 34.007 37.2 11.007 25.665 11.648 67.84-22.764 102.222-30.15 30.121-66.392 43.151-121.164 43.554-60.757-.45-106.707-19.934-136.582-57.914-27.976-35.563-42.434-86.93-42.973-152.675.539-65.745 14.997-117.113 42.973-152.675 29.875-37.979 75.824-57.464 136.581-57.914 61.197.455 107.948 20.033 138.967 58.195 15.21 18.713 26.677 42.248 34.236 69.688l43.011-11.476c-9.163-33.775-23.581-62.881-43.203-87.017C357.031 25.59 298.872.519 223.935 0h-.3C148.851.518 91.343 25.683 52.709 74.794 18.331 118.498.598 179.308.002 255.534l-.002.18.002.18c.596 76.226 18.329 137.037 52.707 180.741 38.634 49.11 96.142 74.277 170.926 74.794h.3c66.487-.462 113.352-17.868 151.96-56.442 50.511-50.463 48.991-113.717 32.342-152.548-11.944-27.847-34.716-50.464-65.855-65.402zm-114.795 107.93c-27.809 1.566-56.7-10.917-58.124-37.652-1.056-19.823 14.108-41.942 59.83-44.577 5.237-.302 10.375-.45 15.422-.45 16.609 0 32.146 1.613 46.272 4.702-5.268 65.798-36.173 76.483-63.4 77.977z" />
              </svg>
            </SocialLink>
          </span>
          <span className="hidden font-display tracking-[0.06em] md:inline">
            {siteConfig.tagline}
          </span>
        </nav>
      </div>
    </Container>
  );
}

/** A round icon link to one of VARO's social accounts, opening in a new tab. */
function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <a
      aria-label={label}
      className="grid size-9 place-items-center rounded-full border-2 border-line text-cream transition-colors hover:border-night hover:bg-lime hover:text-night"
      href={href}
      rel="noopener noreferrer"
      target="_blank"
      title={label}
    >
      {children}
    </a>
  );
}

/** Drawn as SVG: flag emoji don't render on Windows (they show "TW"). */
function TaiwanFlag({ label }: { label: string }) {
  return (
    <svg
      aria-label={label}
      className="ml-1 inline-block h-[0.8em] w-auto -translate-y-px rounded-[2px] align-baseline"
      role="img"
      viewBox="0 0 120 80"
    >
      <rect fill="#FE0000" height="80" width="120" />
      <rect fill="#000095" height="40" width="60" />
      {/* 12-ray sun centred in the canton (path drawn around 60,40 at r=30) */}
      <path
        d="M60.00,10.00 L64.30,23.97 L75.00,14.02 L71.74,28.26 L85.98,25.00 L76.03,35.70 L90.00,40.00 L76.03,44.30 L85.98,55.00 L71.74,51.74 L75.00,65.98 L64.30,56.03 L60.00,70.00 L55.70,56.03 L45.00,65.98 L48.26,51.74 L34.02,55.00 L43.97,44.30 L30.00,40.00 L43.97,35.70 L34.02,25.00 L48.26,28.26 L45.00,14.02 L55.70,23.97 Z"
        fill="#FFFFFF"
        transform="translate(30 20) scale(0.5) translate(-60 -40)"
      />
      <circle cx="30" cy="20" fill="#000095" r="8.5" />
      <circle cx="30" cy="20" fill="#FFFFFF" r="7.5" />
    </svg>
  );
}
