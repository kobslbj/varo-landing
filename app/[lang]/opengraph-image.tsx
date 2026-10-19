import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

import { subtitle } from "./og-copy.mjs";

import { siteLocales } from "@/lib/i18n/config";

// Lives under [lang] so the og:image tag is attached to every page (root-level
// metadata files sit outside the [lang] root layout and get dropped).
export const alt = "VARO — Every attempt counts.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return siteLocales.map((lang) => ({ lang }));
}

async function dataUri(path: string) {
  const file = await readFile(join(process.cwd(), "public", path));

  return `data:image/png;base64,${file.toString("base64")}`;
}

/**
 * Font files subset to the image's text, read from disk so the build never
 * depends on reaching Google Fonts. Regenerate with `node scripts/og-fonts.mjs`.
 */
async function font(file: string) {
  return readFile(join(process.cwd(), "assets/og", file));
}

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const sub = subtitle[lang === "en" ? "en" : "zh-TW"];

  const [wordmark, mascot, display, body] = await Promise.all([
    dataUri("brand/varo-wordmark-white.png"),
    dataUri("mascot/jug-lime.png"),
    font("russo-one-subset.ttf"),
    font("noto-sans-tc-700-subset.ttf"),
  ]);

  // Centered and stacked: chat apps (Instagram DMs) crop the card to a square
  // around the middle, so everything that matters sits in the center 630px.
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(circle at 50% 38%, #26301a 0%, #101112 46%)",
      }}
    >
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <img height={180} src={mascot} width={180} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: 18,
          fontFamily: "Russo One",
          fontSize: 80,
          lineHeight: 1.04,
          color: "#F5F3EE",
        }}
      >
        <span>Every attempt</span>
        <span style={{ color: "#D4FF5A" }}>counts.</span>
      </div>
      <div
        style={{
          display: "flex",
          marginTop: 30,
          fontFamily: "Noto Sans TC",
          fontSize: 28,
          color: "#A5A39D",
        }}
      >
        {sub}
      </div>
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <img
        height={34}
        src={wordmark}
        style={{ position: "absolute", top: 44, left: 56 }}
        width={198}
      />
    </div>,
    {
      ...size,
      fonts: [
        { name: "Russo One", data: display, weight: 400 },
        { name: "Noto Sans TC", data: body, weight: 700 },
      ],
    },
  );
}
