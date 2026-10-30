import type { ReactNode } from "react";

import clsx from "clsx";
import Link from "next/link";

import { Container, Tag } from "./ui";

import { siteConfig } from "@/config/site";
import { getI18n } from "@/lib/i18n";

/**
 * Who VARO is for, as two cards side by side: climbers (lime) and gyms
 * (dark). Same rhythm in each: label, a one-word title, what you do,
 * then the goal under a rule.
 */
export async function Sides() {
  const { locale, href } = await getI18n();
  const en = locale === "en";

  return (
    <section>
      <Container className="py-20 sm:py-28">
        <div className="reveal">
          <Tag>{en ? "Two sides" : "兩種角色"}</Tag>
          <h2 className="mt-5 font-display text-[44px] leading-[0.98] sm:text-[72px]">
            {en ? "Pick a side." : <span className="display-zh">選一邊。</span>}
          </h2>
        </div>

        <div className="mt-10 grid gap-3 lg:grid-cols-2">
          <Side
            cta={
              siteConfig.appStoreUrl
                ? {
                    href: siteConfig.appStoreUrl,
                    label: en
                      ? "Get it on the App Store →"
                      : "在 App Store 下載 →",
                  }
                : {
                    href: href("/gyms"),
                    label: en ? "Explore the gym map →" : "打開岩館地圖 →",
                  }
            }
            goal={
              en
                ? "Goal: send the one you couldn’t."
                : "目標：完攀那條曾經爬不上的線。"
            }
            label={en ? "Climbers" : "攀岩者 · Climbers"}
            title={en ? "Climb." : "上牆。"}
            tone="lime"
          >
            {en
              ? "Log every go in two taps, turn the problem you’re stuck on into a project, and watch your grades move week by week. Your logs are private unless you share them."
              : "兩下記好每一次嘗試，把卡關的線設成 Project，一週一週看見難度往上。紀錄預設只有你看得到，想分享再分享。"}
          </Side>

          <Side
            cta={{
              href: href("/partners"),
              label: en ? "Partner with VARO →" : "了解場館合作 →",
            }}
            goal={
              en
                ? "Goal: every reset brings climbers back."
                : "目標：每一次換線，都讓岩友想回來。"
            }
            i={1}
            label={en ? "Gyms" : "岩館 · Gyms"}
            title={en ? "Set." : "換線。"}
            tone="dark"
          >
            {en
              ? "After a reset, shoot the new problems on any phone. They show up on the wall photo in VARO, and climbers log them with one tap at the wall. No spreadsheets."
              : "換線後用手機拍下新線，馬上出現在 VARO 的牆面照片上，岩友在牆前點一下就記好。不用整理表格，也不用回到電腦前。"}
          </Side>
        </div>
      </Container>
    </section>
  );
}

function Side({
  tone,
  label,
  title,
  goal,
  cta,
  children,
  i = 0,
}: {
  tone: "lime" | "dark";
  i?: number;
  label: string;
  title: string;
  goal: string;
  cta: { href: string; label: string };
  children: ReactNode;
}) {
  const external = cta.href.startsWith("http");
  const linkClass = clsx(
    "mt-6 inline-flex w-fit text-[15px] font-semibold underline underline-offset-4 transition-[opacity,translate] duration-300 hover:opacity-70 group-hover:translate-x-1",
    tone === "lime" ? "decoration-night/40" : "decoration-lime",
  );

  return (
    <div
      className={clsx(
        "reveal lift group flex flex-col rounded-[var(--radius-card)] p-7 sm:p-10 lg:rounded-[var(--radius-card-lg)]",
        tone === "lime"
          ? "on-paper border-2 border-night bg-lime text-night"
          : "theme-dark border-2 border-night bg-ink",
      )}
      style={{ ["--i" as string]: i }}
    >
      <p
        className={clsx(
          "label-wide text-[13px] sm:text-[14px]",
          tone === "lime" ? "text-night/70" : "text-mute",
        )}
      >
        {label}
      </p>
      <h3 className="mt-4 font-display text-[52px] leading-none sm:text-[64px]">
        {title}
      </h3>
      <p
        className={clsx(
          "mt-5 max-w-[34rem] text-[16px] leading-[1.75] [text-wrap:pretty] sm:text-[17px]",
          tone === "lime" ? "font-medium" : "text-cream/85",
        )}
      >
        {children}
      </p>

      <div className="mt-auto pt-10">
        <div
          aria-hidden
          className={clsx("h-[2px]", tone === "lime" ? "bg-night" : "bg-cream")}
        />
        <p className="mt-5 text-[18px] font-bold leading-snug sm:text-[20px]">
          {goal}
        </p>
        {external ? (
          <a
            className={linkClass}
            href={cta.href}
            rel="noopener noreferrer"
            target="_blank"
          >
            {cta.label}
          </a>
        ) : (
          <Link className={linkClass} href={cta.href}>
            {cta.label}
          </Link>
        )}
      </div>
    </div>
  );
}
