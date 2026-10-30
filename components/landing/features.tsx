import type { ReactNode } from "react";

import clsx from "clsx";
import Image from "next/image";

import { CountUp } from "./count-up";
import { DownloadCta } from "./download-cta";
import { HoldShape, ROUTE } from "./holds";
import { Phone3D } from "./phone-3d";
import {
  LogScreen,
  ProgressScreen,
  ProjectScreen,
  ShareScreen,
} from "./screens";
import { Card, Container, Tag } from "./ui";
import { project, projectAttempts } from "./data";

import { getI18n } from "@/lib/i18n";

type FeatureKey = "log" | "progress" | "project" | "share";

const SCREENS: Record<FeatureKey, ReactNode> = {
  log: <LogScreen />,
  project: <ProjectScreen />,
  progress: <ProgressScreen />,
  share: <ShareScreen />,
};

/**
 * What the app does, as a bento grid. Copy lives in the dictionary under
 * `features[key]`; the lime tile is the one loud spot on the page.
 */
export async function Features() {
  const { locale, t } = await getI18n();
  const en = locale === "en";
  const tile = (key: FeatureKey, className?: string, i = 0) => (
    <FeatureTile
      className={className}
      i={i}
      locale={locale}
      screen={SCREENS[key]}
      {...t.features[key]}
    />
  );

  return (
    <section className="theme-dark relative bg-ink">
      <Container className="py-20 sm:py-28">
        <div className="reveal flex flex-wrap items-end justify-between gap-6">
          <h2
            className={clsx(
              "max-w-[16ch] text-[44px] sm:text-[72px]",
              headingClass(locale),
            )}
          >
            {en ? "Built for the wall." : "為岩牆打造。"}
          </h2>
          <p className="max-w-[24rem] text-[16px] leading-[1.8] text-mute">
            {en
              ? "Log a route in two taps, chase a project, watch the grades move. Then share it."
              : "兩下記好一條路線、追著 Project 跑、看著難度往上，再把完攀貼上限動。"}
          </p>
        </div>

        <div className="mt-12 grid gap-3 lg:grid-cols-12">
          {tile("log", "lg:col-span-7")}
          <AttemptsTile className="reveal lift lg:col-span-5" en={en} />
          {tile("project", "lg:col-span-4", 0)}
          {tile("progress", "lg:col-span-4", 1)}
          {tile("share", "lg:col-span-4", 2)}
        </div>
      </Container>
    </section>
  );
}

/** One feature: copy on top, the phone rising from the bottom edge. */
function FeatureTile({
  eyebrow,
  title,
  body,
  label,
  screen,
  locale,
  className,
  i,
}: {
  eyebrow: string;
  title: readonly string[];
  body: string;
  label: string;
  screen: ReactNode;
  locale: string;
  className?: string;
  /** Position in its row, to stagger the reveal. */
  i: number;
}) {
  return (
    <Card
      className={clsx("reveal lift group flex flex-col", className)}
      style={{ ["--i" as string]: i }}
    >
      <div className="p-6 sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <Tag>{eyebrow}</Tag>
        </div>
        <h3
          className={clsx(
            "mt-6 text-[30px] sm:text-[36px]",
            headingClass(locale),
          )}
        >
          {title[0]}
          <br />
          <span className="text-mute">{title[1]}</span>
        </h3>
        <p className="mt-4 max-w-[34rem] text-[15px] leading-[1.8] text-mute [text-wrap:pretty]">
          {body}
        </p>
      </div>

      {/* Fixed-height window; the card clips the bottom of the phone. */}
      <div className="relative mt-auto h-[340px] sm:h-[400px]">
        <div className="absolute left-1/2 top-2 w-[240px] -translate-x-1/2 transition-transform duration-500 ease-out group-hover:-translate-y-4 sm:w-[260px]">
          <Phone3D label={label} tilt="flat">
            {screen}
          </Phone3D>
        </div>
      </div>
    </Card>
  );
}

/**
 * The brand idea in numbers, from the illustrative project: every attempt
 * that led to the send.
 */
function AttemptsTile({ en, className }: { en: boolean; className?: string }) {
  const hold = ROUTE[2];

  return (
    <Card className={clsx("flex flex-col p-6 sm:p-8", className)} tone="lime">
      <div className="flex items-center justify-between gap-4">
        <Tag>{en ? "The point" : "重點是"}</Tag>
      </div>

      <p className="mt-10 font-display text-[120px] leading-[0.8] tracking-[-0.06em] tabular sm:text-[168px]">
        <CountUp value={projectAttempts} />
      </p>
      <p className="mt-3 text-[20px] font-semibold leading-snug sm:text-[24px]">
        {en
          ? `attempts on a ${project.grade}, across ${project.timeline.length} days.`
          : `次嘗試，${project.timeline.length} 天，一條 ${project.grade}。`}
      </p>

      <div className="mt-auto flex items-end justify-between gap-6 pt-12">
        <p className="max-w-[18rem] text-[15px] font-medium leading-[1.7]">
          {en
            ? "Flash, send or still working it: every attempt counts."
            : "Flash、完攀或還在努力，每一次嘗試都算數。"}
        </p>
        <span aria-hidden className="relative mb-4 mr-6 block size-0">
          <HoldShape hold={hold} scale={2.6} />
        </span>
      </div>
    </Card>
  );
}

export async function Closing() {
  const { locale, t } = await getI18n();
  const copy = t.features.closing;

  return (
    <section className="on-paper border-y-2 border-night bg-lime text-night">
      <Container className="reveal grid items-end gap-10 py-20 sm:py-28 lg:grid-cols-[1fr_auto]">
        <div>
          {/* The mascot is lime too, so it sits on a black tile here */}
          <span className="inline-grid size-[92px] place-items-center rounded-[22px] bg-night">
            <Image
              aria-hidden
              alt={t.images.mascot}
              className="bob w-[64px]"
              height={512}
              sizes="64px"
              src="/mascot/jug-lime.png"
              width={512}
            />
          </span>
          <h2
            className={clsx(
              "mt-6 text-[48px] sm:text-[96px]",
              headingClass(locale),
            )}
          >
            {copy.title[0]}
            <br />
            {/* Inverted highlighter: black block, lime type */}
            <span className="inline-block bg-night px-[0.08em] text-lime">
              {copy.title[1]}
            </span>
          </h2>
          <p className="mt-6 max-w-[30rem] text-[18px] font-medium leading-[1.7]">
            {copy.body}
          </p>
        </div>
        <DownloadCta className="text-left" source="closing" variant="dark" />
      </Container>
    </section>
  );
}

/** Space Grotesk for English; Chinese gets a heavy sans with tighter leading. */
function headingClass(locale: string) {
  return locale === "en" ? "font-display leading-[0.98]" : "display-zh";
}
