"use client";

import type { ReactNode } from "react";

import { track } from "@vercel/analytics";

import { CtaLink } from "./ui";

/**
 * The partnership mailto, counted in Vercel Analytics so we can see how many
 * page views turn into an email. `place` says which button on the page.
 */
export function PartnerCta({
  href,
  place,
  children,
}: {
  href: string;
  place: "hero" | "contact";
  children: ReactNode;
}) {
  return (
    <span onClickCapture={() => track("partner_cta_click", { place })}>
      <CtaLink href={href}>{children}</CtaLink>
    </span>
  );
}
