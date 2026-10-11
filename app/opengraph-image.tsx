import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

export const alt = "Varo — 為每一次抱石而生的攀岩紀錄 App";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function dataUri(path: string) {
  const file = await readFile(join(process.cwd(), "public", path));

  return `data:image/png;base64,${file.toString("base64")}`;
}

export default async function OpengraphImage() {
  const [wordmark, mascot] = await Promise.all([
    dataUri("brand/varo-wordmark-white.png"),
    dataUri("mascot/jug-lime.png"),
  ]);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#101112",
        padding: "0 96px",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <img height={98} src={wordmark} width={570} />
        <div
          style={{
            display: "flex",
            width: 120,
            height: 10,
            background: "#D4FF5A",
            borderRadius: 4,
          }}
        />
        <div
          style={{
            display: "flex",
            fontSize: 44,
            color: "#F5F3EE",
            letterSpacing: -1,
          }}
        >
          One move closer.
        </div>
      </div>
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <img height={380} src={mascot} width={380} />
    </div>,
    size,
  );
}
