import type { ReactNode } from "react";

import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { Container } from "./ui";

import { getI18n } from "@/lib/i18n";

/** Shared shell for long-form text pages (privacy, support). */
export async function LegalPage({
  path,
  eyebrow,
  title,
  updated,
  intro,
  children,
}: {
  /** Unprefixed path of the page, for the language switch. */
  path: string;
  eyebrow: string;
  title: string;
  /** Shown as 最後更新, e.g. "2026.10.11". */
  updated?: string;
  intro?: ReactNode;
  children: ReactNode;
}) {
  const { t } = await getI18n();

  return (
    <>
      <SiteHeader path={path} />
      <main className="relative">
        <Container className="pb-24 pt-32 sm:pt-40">
          <div className="max-w-[44rem]">
            <p className="text-[14px] font-semibold tracking-[0.12em] text-lime-ink">
              {eyebrow}
            </p>
            <h1 className="mt-4 text-[36px] font-extrabold leading-tight sm:text-[48px]">
              {title}
            </h1>
            {updated ? (
              <p className="mt-3 text-[14px] text-mute tabular">
                {t.legal.updated}
                {updated}
              </p>
            ) : null}
            {intro ? (
              <div className="mt-8 text-[17px] leading-[1.85] text-cream/90 [text-wrap:pretty]">
                {intro}
              </div>
            ) : null}
            <div className="mt-6">{children}</div>
          </div>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}

export function Section({
  id,
  title,
  children,
}: {
  id?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="scroll-mt-24 border-t border-line py-8" id={id}>
      <h2 className="text-[21px] font-bold leading-snug text-cream sm:text-[23px]">
        {title}
      </h2>
      <div className="mt-4 flex flex-col gap-4 text-[16px] leading-[1.85] text-mute [text-wrap:pretty] [&_a]:text-cream [&_a]:underline [&_a]:decoration-line [&_a]:underline-offset-4 hover:[&_a]:text-lime-ink [&_strong]:font-semibold [&_strong]:text-cream [&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:pl-5">
        {children}
      </div>
    </section>
  );
}
