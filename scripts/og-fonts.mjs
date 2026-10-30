/**
 * Downloads the OG image's fonts from Google Fonts, subset to just the
 * characters the image draws, into assets/og/. The build reads them from
 * disk so it never depends on the network.
 *
 * Re-run after changing the headline or subtitles in
 * app/[lang]/opengraph-image.tsx or an article title in og-articles.mjs:
 *   node scripts/og-fonts.mjs
 */
import { writeFile } from "node:fs/promises";

import { headline, subtitle } from "../app/[lang]/og-copy.mjs";
import { articleOg } from "../app/[lang]/og-articles.mjs";

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

await subset(
  "Space+Grotesk",
  700,
  headline.join(""),
  "assets/og/space-grotesk-700-subset.ttf",
);
await subset(
  "Noto+Sans+TC",
  700,
  [
    ...Object.values(subtitle),
    ...Object.values(articleOg).flatMap((a) => [a.eyebrow, ...a.lines]),
    "VARO 文章",
  ].join(""),
  "assets/og/noto-sans-tc-700-subset.ttf",
);
