import Link from "next/link";

import { Container } from "./ui";

import { siteConfig } from "@/config/site";
import { getI18n } from "@/lib/i18n";

export async function SiteFooter() {
  const { t, href } = await getI18n();

  return (
    <Container className="relative">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-line py-6 text-[13px] text-[#7d7c78]">
        <p>
          © {new Date().getFullYear()} VARO · Made by{" "}
          <a
            className="text-cream/80 underline decoration-line underline-offset-4 transition-colors hover:text-lime hover:decoration-lime"
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
          <span className="hidden font-display tracking-[0.06em] md:inline">
            {siteConfig.tagline}
          </span>
        </nav>
      </div>
    </Container>
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
