import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

import { articleOg } from "../../og-articles.mjs";

export const alt = "VARO 抱石文章";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Listed for every locale (see ../page.tsx); only the Chinese pages link to it.
export function generateStaticParams() {
  return Object.keys(articleOg).map((slug) => ({ slug }));
}

/** The article's title over the brand's dark wall, with hold-coloured dots. */
export default async function ArticleOgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const og = articleOg[slug as keyof typeof articleOg];
  const [wordmark, mascot, body] = await Promise.all([
    readFile(join(process.cwd(), "public/brand/varo-wordmark-white.png")),
    readFile(join(process.cwd(), "public/mascot/jug-lime.png")),
    readFile(join(process.cwd(), "assets/og/noto-sans-tc-700-subset.ttf")),
  ]);
  const uri = (b: Buffer) => `data:image/png;base64,${b.toString("base64")}`;
  const holds = ["#E5484D", "#F2994A", "#F5D90A", "#30A46C", "#3E8BFF"];

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 88px",
        fontFamily: "Noto Sans TC",
        background:
          "radial-gradient(circle at 82% 30%, #26301a 0%, #101112 52%)",
      }}
    >
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <img
        height={34}
        src={uri(wordmark)}
        style={{ position: "absolute", top: 52, left: 88 }}
        width={198}
      />
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        {holds.map((c) => (
          <div
            key={c}
            style={{ width: 16, height: 16, borderRadius: 999, background: c }}
          />
        ))}
        <span style={{ marginLeft: 10, fontSize: 30, color: "#D4FF5A" }}>
          {og?.eyebrow ?? "VARO 文章"}
        </span>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: 26,
          fontSize: 68,
          lineHeight: 1.25,
          color: "#F5F3EE",
          letterSpacing: "-0.02em",
        }}
      >
        {(og?.lines ?? ["VARO 文章"]).map((line) => (
          <span key={line}>{line}</span>
        ))}
      </div>
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <img
        height={210}
        src={uri(mascot)}
        style={{ position: "absolute", right: 70, bottom: 48 }}
        width={210}
      />
    </div>,
    { ...size, fonts: [{ name: "Noto Sans TC", data: body, weight: 700 }] },
  );
}
