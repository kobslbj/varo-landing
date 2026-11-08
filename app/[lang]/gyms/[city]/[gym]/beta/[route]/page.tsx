import type { Metadata } from "next";

import Link from "next/link";
import { notFound } from "next/navigation";

import { AppCta } from "@/components/beta/app-cta";
import { AskFriend } from "@/components/beta/ask-friend";
import { ClipCard } from "@/components/beta/clip-card";
import { GradeChip } from "@/components/beta/grade-chip";
import { WallCrop } from "@/components/beta/wall-crop";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";
import { Container, CtaLink } from "@/components/landing/ui";
import { siteConfig } from "@/config/site";
import {
  activeRoutes,
  betaClips,
  betaGymFor,
  routeById,
  zones as loadZones,
} from "@/lib/beta/data";
import { holdName } from "@/lib/beta/holds";
import { directoryGym, gradeRank, pinOf, zonePhoto } from "@/lib/beta/load";
import { cityPath } from "@/lib/gyms/cities";
import { absoluteUrl, JsonLd, pageMetadata, webPage } from "@/lib/seo";

export const revalidate = 300;
export const dynamicParams = true;

export function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ city: string; gym: string; route: string }> };

async function load(params: Props["params"]) {
  const base = await directoryGym(params);
  const { route: routeId } = await params;
  const app = await betaGymFor(base.raw);

  if (!app) notFound();
  const route = await routeById(app.id, routeId);

  if (!route) notFound();
  const [clips, walls, siblings] = await Promise.all([
    betaClips({ routeId: route.id }),
    loadZones(app.id),
    activeRoutes(app.id),
  ]);
  const zone = walls.find((z) => z.name === route.wall);
  const colorName = holdName(route.holdColor, base.zh);
  const grade = route.gradeLabel ?? "?";
  const wall = route.wall ?? "";

  return {
    ...base,
    route,
    clips,
    photo: zonePhoto(zone),
    path: `${base.betaPath}/${route.id}`,
    colorName,
    title: base.c.routeMetaTitle(grade, colorName, wall, base.gym.name),
    description: base.c.routeMetaDescription(
      grade,
      wall,
      base.gym.name,
      clips.length,
    ),
    sameWall: siblings
      .filter((r) => r.wall === route.wall && r.id !== route.id)
      .sort((a, b) => gradeRank(a.gradeLabel) - gradeRank(b.gradeLabel)),
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { path, title, description, route } = await load(params);
  const meta = await pageMetadata(path, { title, description });

  return {
    ...meta,
    // A retired route stays reachable for old links, but leaves the index.
    ...(route.retired ? { robots: { index: false, follow: true } } : {}),
    itunes: { appId: siteConfig.appStoreId, appArgument: absoluteUrl(path) },
  };
}

export default async function RouteBetaPage({ params }: Props) {
  const {
    gym,
    c,
    t,
    href,
    locale,
    zh,
    gymPath,
    betaPath,
    path,
    route,
    clips,
    photo,
    colorName,
    title,
    description,
    sameWall,
  } = await load(params);
  const cities = t.gyms.cities as Record<string, string>;
  const cityName = cities[gym.city] ?? gym.city;
  const pin = pinOf(route);
  // The chip beside it already says the grade.
  const heading = colorName
    ? zh
      ? `${colorName}色路線`
      : `${colorName} route`
    : (route.name ?? c.eyebrow);
  // Search engines get colour and grade together.
  const label = [colorName, route.gradeLabel]
    .filter(Boolean)
    .join(zh ? "" : " ");

  return (
    <>
      <JsonLd
        graph={[
          webPage(locale, path, {
            name: title,
            description,
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: t.gyms.title,
                  item: absoluteUrl(href("/gyms")),
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: cityName,
                  item: absoluteUrl(href(cityPath(gym.city))),
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: gym.name,
                  item: absoluteUrl(href(gymPath)),
                },
                {
                  "@type": "ListItem",
                  position: 4,
                  name: c.eyebrow,
                  item: absoluteUrl(href(betaPath)),
                },
                {
                  "@type": "ListItem",
                  position: 5,
                  name: label,
                  item: absoluteUrl(href(path)),
                },
              ],
            },
          }),
          ...clips.map((clip) => ({
            "@type": "VideoObject",
            name: `${gym.name} ${route.wall ?? ""} ${label} beta`,
            description,
            uploadDate: clip.createdAt,
            ...(clip.posterUrl ? { thumbnailUrl: clip.posterUrl } : {}),
            ...(clip.durationMs
              ? { duration: `PT${Math.round(clip.durationMs / 1000)}S` }
              : {}),
          })),
        ]}
      />
      <SiteHeader path={path} />
      <main>
        <Container className="pb-20 pt-20 sm:pt-28">
          <nav
            aria-label={t.gyms.breadcrumb}
            className="flex flex-wrap items-center gap-2 text-[14px] text-mute"
          >
            <Link
              className="underline underline-offset-4 hover:text-lime-ink"
              href={href(gymPath)}
            >
              {gym.name}
            </Link>
            <span aria-hidden>/</span>
            <Link
              className="underline underline-offset-4 hover:text-lime-ink"
              href={href(betaPath)}
            >
              {c.eyebrow}
            </Link>
            {route.wall ? (
              <>
                <span aria-hidden>/</span>
                <Link
                  className="underline underline-offset-4 hover:text-lime-ink"
                  href={`${href(betaPath)}?zone=${encodeURIComponent(route.wall)}`}
                >
                  {route.wall}
                </Link>
              </>
            ) : null}
          </nav>

          <div className="mt-8 grid items-start gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
            {/* The wall, with where the route starts */}
            <figure className="rise hidden lg:sticky lg:top-28 lg:block">
              <div className="overflow-hidden rounded-[24px] border border-line bg-night lg:rounded-[28px] lg:">
                {/* Phones: a short, wide look so the beta stays near the top. */}
                <WallCrop
                  aspect={16 / 10}
                  className="lg:hidden"
                  color={route.holdColor}
                  photo={photo}
                  pin={pin}
                  zoom={2}
                />
                <WallCrop
                  aspect={
                    photo ? Math.max(3 / 4, photo.width / photo.height) : 4 / 5
                  }
                  className="hidden lg:block"
                  color={route.holdColor}
                  photo={photo}
                  pin={pin}
                  ring="lg"
                  zoom={1.35}
                />
              </div>
              <figcaption className="sr-only">
                {route.wall ?? c.wall}
              </figcaption>
            </figure>

            <div>
              <header
                className="rise"
                style={{ "--rise-delay": "80ms" } as React.CSSProperties}
              >
                <p className="flex items-center gap-2.5">
                  <span
                    aria-hidden
                    className="size-3 rounded-[3px] bg-lime ring-2 ring-night"
                  />
                  <span className="label-wide text-[12px]">
                    {route.wall ?? c.eyebrow}
                  </span>
                </p>
                <div className="mt-4 flex items-center gap-4 sm:mt-5">
                  <div className="w-[88px] shrink-0 overflow-hidden rounded-2xl border border-line bg-night lg:hidden">
                    <WallCrop
                      aspect={1}
                      color={route.holdColor}
                      photo={photo}
                      pin={pin}
                      ring="sm"
                      zoom={2}
                    />
                  </div>
                  <GradeChip
                    color={route.holdColor}
                    grade={route.gradeLabel}
                    size="lg"
                  />
                  <h1
                    className="text-[28px] font-black leading-tight tracking-[-0.02em] sm:text-[48px]"
                    lang="zh-Hant"
                  >
                    {heading}
                    {route.name ? (
                      <span className="mt-2 block text-[20px] font-bold tracking-normal text-mute sm:text-[22px]">
                        {route.name}
                      </span>
                    ) : null}
                  </h1>
                </div>
                <p className="mt-5 flex flex-wrap gap-x-4 gap-y-1 text-[15px] text-mute">
                  <span>{gym.name}</span>
                  {route.setDate ? (
                    <span>{c.setOn(c.date(route.setDate))}</span>
                  ) : null}
                  {clips.length ? (
                    <span className="font-semibold text-lime-ink">
                      {c.clips(clips.length)}
                    </span>
                  ) : null}
                </p>
                {route.retired ? (
                  <p className="mt-5 rounded-2xl border-2 border-hold-orange/60 bg-hold-orange/10 px-4 py-3 font-semibold text-[#9a4a00]">
                    {c.retired}
                  </p>
                ) : null}
              </header>

              {clips.length ? (
                <section className="mt-6 sm:mt-10">
                  <p className="mb-4 flex items-center gap-2 text-[14px] text-mute">
                    {c.spoiler}
                  </p>
                  <ul className="grid gap-6 sm:grid-cols-2">
                    {clips.map((clip, i) => (
                      <li
                        key={clip.id}
                        className="rise"
                        style={
                          {
                            "--rise-delay": `${140 + i * 70}ms`,
                          } as React.CSSProperties
                        }
                      >
                        <ClipCard c={c} clip={clip} />
                      </li>
                    ))}
                  </ul>
                </section>
              ) : (
                <section className="bolt-grid relative mt-10 overflow-hidden rounded-[28px] border border-dashed border-mute/40 bg-ink-2 px-6 py-12 text-center sm:px-10">
                  {/* eslint-disable-next-line @next/next/no-img-element -- the mascot, a small static PNG */}
                  <img
                    alt=""
                    className="mx-auto size-16"
                    height={64}
                    src="/mascot/sloper-lime.png"
                    width={64}
                  />
                  <h2 className="mt-6 text-[24px] font-extrabold">
                    {c.firstTitle}
                  </h2>
                  <p className="mx-auto mt-3 max-w-[26rem] text-[16px] leading-[1.8] text-mute">
                    {c.firstBody}
                  </p>
                  {route.retired ? null : (
                    <div className="mt-7 flex flex-col items-center gap-3">
                      <div className="flex flex-wrap justify-center gap-3">
                        <CtaLink href={`${href(path)}/upload`}>
                          {c.uploadCta}
                        </CtaLink>
                        {/* Most climbers can't film themselves: ask whoever's on the mat. */}
                        <AskFriend
                          copied={c.askCopied}
                          label={c.askFriend}
                          routeId={route.id}
                          text={c.askText(
                            [heading, route.gradeLabel]
                              .filter(Boolean)
                              .join(" "),
                            gym.name,
                          )}
                          url={absoluteUrl(href(path))}
                        />
                      </div>
                      {siteConfig.appStoreUrl ? (
                        <a
                          className="text-[14px] text-mute underline underline-offset-4"
                          href={siteConfig.appStoreUrl}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          {c.orApp}
                        </a>
                      ) : null}
                    </div>
                  )}
                </section>
              )}
              {clips.length && !route.retired ? (
                <Link
                  className="group mt-8 flex items-center justify-between gap-4 rounded-[22px] border border-dashed border-mute/40 bg-ink-2 px-5 py-4 transition-colors hover:bg-lime/15"
                  href={`${href(path)}/upload`}
                >
                  <span>
                    <span className="block text-[16px] font-bold">
                      {c.uploadCta}
                    </span>
                    <span className="block text-[13px] text-mute">
                      {c.uploadSub}
                    </span>
                  </span>
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-lime text-[20px] font-bold transition-transform">
                    +
                  </span>
                </Link>
              ) : null}
            </div>
          </div>

          {sameWall.length ? (
            <section className="mt-20">
              <h2 className="text-[22px] font-extrabold tracking-tight sm:text-[26px]">
                {c.sameWall}
              </h2>
              <ul className="-mx-4 mt-5 flex snap-x gap-3 overflow-x-auto px-4 pb-4 [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 [&::-webkit-scrollbar]:hidden">
                {sameWall.map((r) => (
                  <li
                    key={r.id}
                    className="w-[38vw] max-w-[170px] shrink-0 snap-start sm:w-[170px]"
                  >
                    <Link
                      className="lift block overflow-hidden rounded-[18px] border border-line bg-ink-2"
                      href={href(`${betaPath}/${r.id}`)}
                    >
                      <WallCrop
                        color={r.holdColor}
                        photo={photo}
                        pin={pinOf(r)}
                        ring="sm"
                      />
                      <span className="flex items-center gap-2 border-t border-line px-2.5 py-2">
                        <GradeChip
                          color={r.holdColor}
                          grade={r.gradeLabel}
                          size="sm"
                        />
                        <span className="truncate text-[13px] font-bold">
                          {holdName(r.holdColor, zh)}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <Link
            className="mt-10 inline-flex items-center gap-2 text-[15px] font-semibold underline underline-offset-4 hover:text-lime-ink"
            href={href(betaPath)}
          >
            ← {c.backToGym(gym.name)}
          </Link>

          <div className="mt-16">
            <AppCta c={c} />
          </div>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
