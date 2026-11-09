import type { Metadata } from "next";

import Link from "next/link";

import { AppCta } from "@/components/beta/app-cta";
import { LatestStrip } from "@/components/beta/latest-strip";
import { RememberGym } from "@/components/beta/remember-gym";
import { RouteBrowser } from "@/components/beta/route-browser";
import { FeedbackButton } from "@/components/beta/feedback-button";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";
import { Container } from "@/components/landing/ui";
import { siteConfig } from "@/config/site";
import { holdName } from "@/lib/beta/holds";
import { floorPlanFor } from "@/lib/beta/plans";
import {
  gradeRank,
  gymBeta,
  newest,
  pinOf,
  zonePhoto,
  type GymParams,
} from "@/lib/beta/load";
import { cityPath } from "@/lib/gyms/cities";
import { absoluteUrl, JsonLd, pageMetadata, webPage } from "@/lib/seo";

// Rendered per request; the Supabase reads are cached for 5 minutes (lib/beta/data.ts).
// No generateStaticParams: an empty list under the static [lang] layout made
// every beta URL a prerendered 404 in production builds (next dev was fine).
export const revalidate = 300;

type Props = { params: GymParams };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { gym, c, betaPath, routes, perRoute } = await gymBeta(params);
  const meta = await pageMetadata(betaPath, {
    title: c.hubMetaTitle(gym.name),
    description: c.hubMetaDescription(gym.name, routes.length, perRoute.size),
  });

  return {
    ...meta,
    // The App Store banner on iPhone Safari.
    itunes: {
      appId: siteConfig.appStoreId,
      appArgument: absoluteUrl(betaPath),
    },
  };
}

export default async function GymBetaPage({ params }: Props) {
  const {
    gym,
    c,
    t,
    href,
    locale,
    gymPath,
    betaPath,
    routes,
    walls,
    clips,
    perRoute,
    zh,
    app,
  } = await gymBeta(params);
  const cities = t.gyms.cities as Record<string, string>;
  const cityName = cities[gym.city] ?? gym.city;
  const routeById = new Map(routes.map((r) => [r.id, r]));
  // The newest set date on a route now up: says when routes last went up,
  // not that the whole gym was reset.
  const latestSet = routes.reduce<string | null>(
    (max, r) => (r.setDate && (!max || r.setDate > max) ? r.setDate : max),
    null,
  );
  const strip = newest(clips, 12).flatMap((clip) => {
    const r = routeById.get(clip.routeId);

    return r
      ? [
          {
            id: clip.id,
            href: href(`${betaPath}/${r.id}`),
            posterUrl: clip.posterUrl,
            grade: r.gradeLabel,
            color: r.holdColor,
            wall: r.wall,
            who: clip.owner?.name ?? "",
            gym: clip.source === "gym",
            durationMs: clip.durationMs,
          },
        ]
      : [];
  });

  return (
    <>
      <JsonLd
        graph={[
          webPage(locale, betaPath, {
            name: c.hubTitle(gym.name),
            description: c.hubMetaDescription(
              gym.name,
              routes.length,
              perRoute.size,
            ),
            // The gym itself, as its directory page describes it.
            about: { "@id": `${absoluteUrl(href(gymPath))}#gym` },
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
              ],
            },
          }),
        ]}
      />
      <SiteHeader path={betaPath} />
      <main>
        <Container className="pb-20 pt-20 sm:pt-24">
          <nav
            aria-label={t.gyms.breadcrumb}
            className="flex flex-wrap items-center gap-2 text-[14px] text-mute"
          >
            <Link
              className="underline underline-offset-4 hover:text-lime-ink"
              href={href("/gyms")}
            >
              {t.gyms.title}
            </Link>
            <span aria-hidden>/</span>
            <Link
              className="underline underline-offset-4 hover:text-lime-ink"
              href={href(cityPath(gym.city))}
            >
              {cityName}
            </Link>
            <span aria-hidden>/</span>
            <Link
              className="underline underline-offset-4 hover:text-lime-ink"
              href={href(gymPath)}
            >
              {gym.name}
            </Link>
          </nav>

          <RememberGym href={href(betaPath)} name={gym.name} />
          <header className="mt-6">
            <h1 className="text-[28px] font-black leading-tight tracking-[-0.02em] sm:text-[40px]">
              {gym.name}
              <span className="text-mute"> · Beta</span>
            </h1>
            <p className="mt-2 text-[15px] text-mute tabular">
              {c.hubSummary(routes.length, perRoute.size)}
              {latestSet ? (
                <>
                  <span aria-hidden> · </span>
                  {c.latestSet(c.fullDate(latestSet))}
                </>
              ) : null}
            </p>
          </header>

          {/* The point of the page: find the route you're on, then its beta. */}
          <section aria-labelledby="finder" className="mt-6">
            <h2
              className="text-[20px] font-extrabold tracking-tight sm:text-[24px]"
              id="finder"
            >
              {c.finderTitle}
            </h2>
            <p className="mb-4 mt-1 text-[14px] text-mute sm:text-[15px]">
              {c.finderLead}
            </p>
            {routes.length ? (
              <RouteBrowser
                colorNames={Object.fromEntries(
                  routes.flatMap((r) =>
                    r.holdColor
                      ? [
                          [
                            r.holdColor,
                            holdName(r.holdColor, zh) || r.holdColor,
                          ],
                        ]
                      : [],
                  ),
                )}
                labels={{
                  onlyBeta: c.onlyBeta,
                  noBetaYet: c.noBetaYet,
                  clips: c.clipsTpl,
                  wall: c.finderWall,
                  color: c.finderColor,
                  grade: c.finderGrade,
                  part: c.finderPart,
                  anyColor: c.finderAnyColor,
                  anyGrade: c.finderAnyGrade,
                  found: c.finderFound,
                  clear: c.finderClear,
                  none: c.finderNone,
                }}
                plan={floorPlanFor(app.id)}
                routes={routes.map((r) => ({
                  id: r.id,
                  href: href(`${betaPath}/${r.id}`),
                  wall: r.wall,
                  grade: r.gradeLabel,
                  system: r.gradeSystem,
                  color: r.holdColor,
                  colorName:
                    [holdName(r.holdColor, zh), r.name]
                      .filter(Boolean)
                      .join(zh ? "・" : " · ") ||
                    (r.gradeLabel ?? ""),
                  rank: gradeRank(r.gradeLabel),
                  pin: pinOf(r),
                  clips: perRoute.get(r.id) ?? 0,
                }))}
                zones={walls.map((z) => ({
                  name: z.name,
                  photo: zonePhoto(z),
                }))}
              />
            ) : (
              <p className="rounded-2xl border border-dashed border-line px-6 py-12 text-center text-mute">
                {c.noRoutes}
              </p>
            )}
          </section>

          {strip.length ? (
            <section className="mt-14">
              <h2 className="mb-5 flex items-center gap-3 text-[20px] font-extrabold tracking-tight sm:text-[24px]">
                {c.latest}
                <span className="rounded-full bg-ink-3 px-2.5 py-0.5 text-[13px] text-mute tabular">
                  {clips.length}
                </span>
              </h2>
              <LatestStrip c={c} items={strip} />
            </section>
          ) : null}

          <div className="mt-20">
            <AppCta c={c} />
          </div>
        </Container>
      </main>
      <FeedbackButton zh={zh} />
      <SiteFooter />
    </>
  );
}
