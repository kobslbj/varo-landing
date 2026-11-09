import type { BetaCopy } from "@/lib/beta/copy";

import { CtaLink } from "@/components/landing/ui";
import { siteConfig } from "@/config/site";

/** The way into the app: sharing beta happens there (web upload comes later). */
export function AppCta({ c }: { c: BetaCopy }) {
  if (!siteConfig.appStoreUrl) return null;

  return (
    <section className="theme-dark relative overflow-hidden rounded-[28px] bg-night px-6 py-10 sm:px-12 sm:py-14">
      <div aria-hidden className="bolt-grid absolute inset-0 opacity-60" />
      <div
        aria-hidden
        className="absolute -right-16 -top-16 size-64 rounded-full bg-lime/20 blur-3xl"
      />
      <div className="relative max-w-[38rem]">
        <p className="label-wide text-[12px] text-lime">VARO</p>
        <h2 className="display-zh mt-4 text-[32px] text-cream sm:text-[44px]">
          {c.ctaTitle[0]}
          <br />
          <span className="text-lime">{c.ctaTitle[1]}</span>
        </h2>
        <p className="mt-4 text-[16px] leading-[1.8] text-mute sm:text-[17px]">
          {c.ctaBody}
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <CtaLink href={siteConfig.appStoreUrl}>{c.ctaButton}</CtaLink>
          <span className="text-[14px] text-mute">{c.ctaNote}</span>
        </div>
      </div>
    </section>
  );
}
