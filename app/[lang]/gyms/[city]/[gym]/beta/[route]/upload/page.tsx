import type { Metadata } from "next";

import Link from "next/link";
import { notFound } from "next/navigation";

import { GradeChip } from "@/components/beta/grade-chip";
import { BetaUploader } from "@/components/beta/uploader";
import { WallCrop } from "@/components/beta/wall-crop";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";
import { Container } from "@/components/landing/ui";
import {
  betaClips,
  betaGymFor,
  routeById,
  zones as loadZones,
} from "@/lib/beta/data";
import { holdName } from "@/lib/beta/holds";
import { directoryGym, pinOf, zonePhoto } from "@/lib/beta/load";
import { uploadCopy } from "@/lib/beta/upload-copy";
import { absoluteUrl } from "@/lib/seo";

// Per person (sign-in state lives in the browser), so never cached as a page.
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ city: string; gym: string; route: string }> };

async function load(params: Props["params"]) {
  const base = await directoryGym(params);
  const { route: routeId } = await params;
  const app = await betaGymFor(base.raw);

  if (!app) notFound();
  const route = await routeById(app.id, routeId);

  if (!route || route.retired) notFound();
  const [walls, clips] = await Promise.all([
    loadZones(app.id),
    betaClips({ routeId: route.id }),
  ]);

  return {
    ...base,
    app,
    route,
    clips,
    photo: zonePhoto(walls.find((z) => z.name === route.wall)),
    u: uploadCopy[base.zh ? "zh-TW" : "en"],
    routePath: `${base.betaPath}/${route.id}`,
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { u } = await load(params);

  // A tool, not content: kept out of search.
  return { title: u.metaTitle, robots: { index: false, follow: false } };
}

export default async function UploadPage({ params }: Props) {
  const { gym, app, route, clips, photo, u, href, zh, betaPath, routePath } =
    await load(params);
  const color = holdName(route.holdColor, zh);

  return (
    <>
      <SiteHeader path={`${routePath}/upload`} />
      <main>
        <Container className="pb-20 pt-28 sm:pt-36">
          <Link
            className="flex items-center gap-3 rounded-[20px] border border-line bg-ink-2 p-2.5 pr-4 transition-colors hover:bg-ink-3 sm:mx-auto sm:max-w-[560px]"
            href={href(routePath)}
          >
            <WallCrop
              aspect={1}
              className="size-14 shrink-0 rounded-[14px]"
              color={route.holdColor}
              photo={photo}
              pin={pinOf(route)}
              ring="sm"
              zoom={2.4}
            />
            <GradeChip color={route.holdColor} grade={route.gradeLabel} />
            <span className="min-w-0">
              <span className="block truncate text-[15px] font-bold">
                {zh ? `${color}色路線` : `${color} route`}
              </span>
              <span className="block truncate text-[13px] text-mute">
                {gym.name} · {route.wall}
              </span>
            </span>
          </Link>

          <header className="mx-auto mt-10 max-w-[560px]">
            <p className="flex items-center gap-2.5">
              <span
                aria-hidden
                className="size-3 rounded-[3px] bg-lime ring-2 ring-night"
              />
              <span className="label-wide text-[12px]">BETA</span>
            </p>
            <h1 className="display-zh mt-3 text-[36px] sm:text-[48px]">
              {u.title}
            </h1>
            <p className="mt-3 text-[16px] leading-[1.75] text-mute">
              {u.lead}
            </p>
          </header>

          <div className="mt-8">
            <BetaUploader
              lang={zh ? "zh-TW" : "en"}
              route={{
                id: route.id,
                gymId: app.id,
                routeHref: href(routePath),
                routeUrl: absoluteUrl(href(routePath)),
                hubPath: betaPath,
                callbackPath: href("/auth/callback"),
                privacyPath: href("/privacy"),
                minePath: href("/beta/mine"),
                clipsBefore: clips.length,
              }}
            />
          </div>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
