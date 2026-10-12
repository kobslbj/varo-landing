import { CtaLink } from "./ui";
import { WaitlistForm } from "./waitlist-form";

import { siteConfig } from "@/config/site";
import { getI18n } from "@/lib/i18n";
import { getWaitlistCount } from "@/lib/waitlist-count";

/** App Store button, or the launch waitlist until the listing is live. */
export async function DownloadCta({
  source,
  className,
}: {
  source: "hero" | "closing";
  className?: string;
}) {
  const { locale, t } = await getI18n();

  if (siteConfig.appStoreUrl) {
    return (
      <CtaLink href={siteConfig.appStoreUrl}>
        <AppleIcon />
        {t.hero.download}
      </CtaLink>
    );
  }

  // Functions can't cross to the client component, so the count line is built here.
  const { count: countLine, ...copy } = t.waitlist;
  const count = await getWaitlistCount();

  return (
    <WaitlistForm
      className={className}
      copy={copy}
      countLabel={count ? countLine(count) : null}
      locale={locale}
      source={source}
    />
  );
}

function AppleIcon() {
  return (
    <svg
      aria-hidden
      className="size-[18px]"
      fill="currentColor"
      viewBox="0 0 17 20"
    >
      <path d="M14.1 10.6c0-2.6 2.1-3.8 2.2-3.9-1.2-1.8-3.1-2-3.7-2-1.6-.2-3.1.9-3.9.9-.8 0-2.1-.9-3.4-.9-1.7 0-3.3 1-4.2 2.6-1.8 3.1-.5 7.7 1.3 10.2.8 1.2 1.8 2.6 3.1 2.6 1.3-.1 1.7-.8 3.3-.8 1.5 0 1.9.8 3.3.8 1.4 0 2.2-1.2 3-2.5 1-1.4 1.3-2.8 1.4-2.9-.1 0-2.6-1-2.4-4.1ZM11.6 3c.7-.8 1.2-2 1-3.1-1 0-2.2.7-2.9 1.5-.6.7-1.2 1.9-1 3 1.1.1 2.2-.6 2.9-1.4Z" />
    </svg>
  );
}
