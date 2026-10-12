/**
 * Downloads the OG image's fonts from Google Fonts, subset to just the
 * characters the image draws, into assets/og/. The build reads them from
 * disk so it never depends on the network.
 *
 * Re-run after changing the headline or subtitles in
 * app/[lang]/opengraph-image.tsx:  node scripts/og-fonts.mjs
 */
import { writeFile } from "node:fs/promises";

import { headline, subtitle } from "../app/[lang]/og-copy.mjs";

async function subset(family, weight, text, out) {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&text=${encodeURIComponent(text)}`,
  ).then((res) => res.text());
  const url = css.match(/src: url\((.+?)\) format/)?.[1];

  if (!url) throw new Error(`Couldn't load font ${family}`);
  const font = Buffer.from(await fetch(url).then((res) => res.arrayBuffer()));

  await writeFile(out, font);
  console.log(`${out} (${font.length} bytes)`);
}

await subset("Russo+One", 400, headline, "assets/og/russo-one-subset.ttf");
await subset(
  "Noto+Sans+TC",
  700,
  Object.values(subtitle).join(""),
  "assets/og/noto-sans-tc-700-subset.ttf",
);
