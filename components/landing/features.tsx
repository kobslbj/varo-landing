import type { ReactNode } from "react";

import clsx from "clsx";
import Image from "next/image";

import { DownloadCta } from "./download-cta";
import { HoldShape, ROUTE, type Hold } from "./holds";
import { Phone3D } from "./phone-3d";
import {
  LogScreen,
  ProgressScreen,
  ProjectScreen,
  ShareScreen,
} from "./screens";
import { Container, DemoLabel } from "./ui";

import { getI18n } from "@/lib/i18n";

/** Page order. Copy lives in the dictionary under `features[key]`. */
const FEATURES: {
  key: "log" | "progress" | "project" | "share";
  screen: ReactNode;
}[] = [
  { key: "log", screen: <LogScreen /> },
  { key: "progress", screen: <ProgressScreen /> },
  { key: "project", screen: <ProjectScreen /> },
  { key: "share", screen: <ShareScreen /> },
];

/**
 * What the app does, one feature per row under the hero: copy on one side,
 * a tilted phone on the other, alternating down the page.
 */
export async function Features() {
  const { locale, t } = await getI18n();

  return (
    <section className="relative">
      {FEATURES.map(({ key, screen }, i) => {
        const copy = t.features[key];
        const flip = i % 2 === 1;
        const hold = ROUTE[i % ROUTE.length];

        return (
          <Container
            key={key}
            className="relative grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-2 lg:gap-16"
          >
            <div
              className={clsx(
                "max-w-[30rem]",
                flip && "lg:order-2 lg:justify-self-end",
              )}
            >
              <p className="flex items-center gap-2 text-[14px] font-semibold tracking-[0.08em] text-lime sm:text-[15px]">
                <span aria-hidden className="size-2 rounded-full bg-lime" />
                {copy.eyebrow}
              </p>
              <h2 className={clsx("mt-5 sm:text-[54px]", headingClass(locale))}>
                {copy.title[0]}
                <br />
                <span className="text-lime">{copy.title[1]}</span>
              </h2>
              <p className="mt-6 text-[17px] leading-[1.8] text-mute [text-wrap:pretty] sm:text-[18px]">
                {copy.body}
              </p>
            </div>

            <div
              className={clsx(
                "relative flex flex-col items-center",
                flip && "lg:order-1",
              )}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute top-1/2 h-[380px] w-[380px] -translate-y-1/2 rounded-full bg-lime/[0.07] blur-[100px]"
              />
              <div className="relative w-[250px] sm:w-[290px]">
                <DriftHold
                  delay={i * -1.3}
                  hold={hold}
                  left={flip ? "104%" : "-4%"}
                  scale={1.9}
                  top="30%"
                />
                <DriftHold
                  delay={i * -1.3 - 2}
                  hold={ROUTE[(i + 2) % ROUTE.length]}
                  left={flip ? "-6%" : "106%"}
                  scale={1.5}
                  top="74%"
                />
                <Phone3D label={copy.label} tilt={flip ? "right" : "left"}>
                  {screen}
                </Phone3D>
              </div>
              <div className="mt-10">
                <DemoLabel>{t.hero.demo}</DemoLabel>
              </div>
            </div>
          </Container>
        );
      })}

      <Closing />
    </section>
  );
}

async function Closing() {
  const { locale, t } = await getI18n();
  const copy = t.features.closing;

  return (
    <Container className="relative flex flex-col items-center pb-28 pt-16 text-center">
      <Image
        aria-hidden
        alt={t.images.mascot}
        className="bob w-[88px]"
        height={512}
        sizes="88px"
        src="/mascot/jug-lime.png"
        width={512}
      />
      <h2 className={clsx("mt-6 sm:text-[60px]", headingClass(locale))}>
        {copy.title[0]}
        <br />
        <span className="text-lime">{copy.title[1]}</span>
      </h2>
      <p className="mt-6 max-w-[30rem] text-[17px] leading-[1.8] text-mute sm:text-[18px]">
        {copy.body}
      </p>
      <div className="mt-9 flex w-full justify-center">
        <DownloadCta className="text-left" source="closing" />
      </div>
    </Container>
  );
}

/** Russo One for English; Chinese falls back to a heavy sans with tighter leading. */
function headingClass(locale: string) {
  return locale === "en"
    ? "font-display text-[40px] leading-[1.06]"
    : "display-zh text-[40px]";
}

/** A hold beside the phone, drifting like the hero's route. */
function DriftHold({
  hold,
  scale,
  left,
  top,
  delay,
}: {
  hold: Hold;
  scale: number;
  left: string;
  top: string;
  delay: number;
}) {
  return (
    <span aria-hidden className="absolute z-10" style={{ left, top }}>
      <span
        className="hold-drift block -translate-x-1/2 -translate-y-1/2"
        style={{ ["--drift-delay" as string]: `${delay}s` }}
      >
        <HoldShape
          hold={hold}
          scale={scale}
          style={{ position: "relative", transform: `rotate(${hold.rot}deg)` }}
        />
      </span>
    </span>
  );
}
