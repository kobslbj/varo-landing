import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

import { betaClips, betaGymFor, routeById, zones } from "@/lib/beta/data";
import { hold, holdName, wallCrop } from "@/lib/beta/holds";
import { cityBySlug, gymsIn } from "@/lib/gyms/cities";

export const alt = "VARO beta";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 3600;

type Params = Promise<{
  lang: string;
  city: string;
  gym: string;
  route: string;
}>;

/**
 * A font cut down to `text` by Google Fonts, so Chinese gym and wall names
 * render without shipping the whole CJK font. Null if it can't be fetched:
 * the image then falls back to the default font rather than failing.
 */
async function googleFont(family: string, weight: number, text: string) {
  try {
    const css = await (
      await fetch(
        `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&text=${encodeURIComponent(text)}`,
        { next: { revalidate: 86400 } },
      )
    ).text();
    const url = /src: url\((.+?)\) format/.exec(css)?.[1];

    if (!url) return null;
    const res = await fetch(url);

    return res.ok ? await res.arrayBuffer() : null;
  } catch {
    return null;
  }
}

async function wordmark() {
  const file = await readFile(
    join(process.cwd(), "public", "brand/varo-wordmark-white.png"),
  );

  return `data:image/png;base64,${file.toString("base64")}`;
}

export default async function RouteOgImage({ params }: { params: Params }) {
  const { lang, city: slug, gym: gymId, route: routeId } = await params;
  const zh = lang !== "en";
  const city = cityBySlug(slug);
  const gym = city && gymsIn(city.name).find((g) => g.id === gymId);
  const app = gym ? await betaGymFor(gym) : null;
  const route = app ? await routeById(app.id, routeId) : null;
  const [walls, clips, logo] = await Promise.all([
    app ? zones(app.id) : Promise.resolve([]),
    route ? betaClips({ routeId: route.id }) : Promise.resolve([]),
    wordmark(),
  ]);
  const zone = walls.find((z) => z.name === route?.wall);
  const h = hold(route?.holdColor);
  const color = holdName(route?.holdColor, zh);
  const grade = route?.gradeLabel ?? "?";
  const gymName = gym?.name ?? "VARO";
  const wall = route?.wall ?? "";
  const line = clips.length
    ? zh
      ? `${clips.length} 支 beta 影片`
      : `${clips.length} beta ${clips.length === 1 ? "video" : "videos"}`
    : zh
      ? "等你分享第一支 beta"
      : "Be the first to share beta";
  const colorLine = zh ? `${color}色路線` : `${color} route`;
  const text = `${gymName}${wall}${line}${colorLine}BETA${grade}`;
  const [black, bold] = await Promise.all([
    googleFont("Noto+Sans+TC", 900, text),
    googleFont("Noto+Sans+TC", 700, text),
  ]);

  // The wall photo, zoomed toward where the route starts.
  const panel = { w: 500, h: 630 };
  const pin =
    route?.pinX != null && route.pinY != null
      ? { x: route.pinX, y: route.pinY }
      : null;
  const photo =
    zone?.photoUrl && zone.photoWidth && zone.photoHeight
      ? { url: zone.photoUrl, width: zone.photoWidth, height: zone.photoHeight }
      : null;
  const crop = photo
    ? wallCrop(photo, panel.w / panel.h, pin ?? { x: 0.5, y: 0.5 }, pin ? 2 : 1)
    : null;
  const px = (pct: string, of: number) => (parseFloat(pct) / 100) * of;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: "#111111",
        fontFamily: "Noto Sans TC",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: 700,
          padding: "64px 64px 56px",
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.08) 1.5px, transparent 1.5px)",
          backgroundSize: "26px 26px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: 5,
                background: "#C6FF00",
              }}
            />
            <span
              style={{
                fontSize: 26,
                fontWeight: 700,
                letterSpacing: "0.14em",
                color: "#C6FF00",
              }}
            >
              BETA
            </span>
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: 40,
              fontWeight: 700,
              color: "#9b9b9b",
            }}
          >
            {gymName}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 6,
              fontSize: 44,
              fontWeight: 700,
              color: "#F5F5F5",
            }}
          >
            {wall}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 26,
              marginTop: 40,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: 132,
                minWidth: 190,
                padding: "0 40px",
                borderRadius: 999,
                background: h.fill,
                color: h.ink,
                fontSize: 84,
                fontWeight: 900,
                letterSpacing: "-0.03em",
              }}
            >
              {grade}
            </div>
            <span style={{ fontSize: 56, fontWeight: 900, color: "#F5F5F5" }}>
              {colorLine}
            </span>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              display: "flex",
              padding: "12px 24px",
              borderRadius: 999,
              background: "#C6FF00",
              color: "#111111",
              fontSize: 30,
              fontWeight: 900,
            }}
          >
            {line}
          </span>
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <img height={40} src={logo} width={150} />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          position: "relative",
          width: panel.w,
          height: panel.h,
          overflow: "hidden",
          background: "#1a1a1a",
          borderLeft: "4px solid #C6FF00",
        }}
      >
        {photo && crop ? (
          // eslint-disable-next-line jsx-a11y/alt-text
          <img
            src={photo.url}
            style={{
              position: "absolute",
              left: px(crop.img.left, panel.w),
              top: px(crop.img.top, panel.h),
              width: px(crop.img.width, panel.w),
              height: px(crop.img.height, panel.h),
            }}
          />
        ) : null}
        {crop && pin ? (
          <div
            style={{
              position: "absolute",
              left: px(crop.pin.left, panel.w) - 34,
              top: px(crop.pin.top, panel.h) - 34,
              width: 68,
              height: 68,
              borderRadius: 999,
              border: "7px solid #C6FF00",
              boxShadow: "0 0 0 4px rgba(0,0,0,0.6)",
            }}
          />
        ) : null}
      </div>
    </div>,
    {
      ...size,
      fonts: [
        ...(black
          ? [{ name: "Noto Sans TC", data: black, weight: 900 as const }]
          : []),
        ...(bold
          ? [{ name: "Noto Sans TC", data: bold, weight: 700 as const }]
          : []),
      ],
    },
  );
}
