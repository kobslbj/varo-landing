import type { Gym } from "@/lib/gyms/types";

import Link from "next/link";

import { GradeChip } from "./grade-chip";

import { betaCopy } from "@/lib/beta/copy";
import { activeRoutes, betaClips, betaGymFor } from "@/lib/beta/data";

/**
 * On a directory gym page: the way into its routes and beta, for gyms whose
 * routes are in VARO. Renders nothing for the rest.
 */
export async function GymBetaTeaser({
  gym,
  zh,
  href,
}: {
  gym: Gym;
  zh: boolean;
  /** Localized link to the gym's beta page. */
  href: string;
}) {
  // The directory page is built statically; a Supabase hiccup only hides this.
  const data = await (async () => {
    const app = await betaGymFor(gym);

    if (!app) return null;
    const [routes, clips] = await Promise.all([
      activeRoutes(app.id),
      betaClips({ gymId: app.id }),
    ]);

    return { routes, clips };
  })().catch(() => null);

  if (!data) return null;
  const { routes, clips } = data;

  if (!routes.length) return null;
  const c = betaCopy[zh ? "zh-TW" : "en"];
  const active = new Map(routes.map((r) => [r.id, r]));
  const live = clips.filter((cl) => active.has(cl.routeId));
  const withBeta = new Set(live.map((cl) => cl.routeId)).size;
  const posters = live.filter((cl) => cl.posterUrl).slice(0, 3);
  // Without beta yet, show a few of the routes instead.
  const chips = routes.slice(0, 6);

  return (
    <Link
      className="lift group mt-10 grid overflow-hidden rounded-[24px] border border-line bg-ink-2 sm:grid-cols-[minmax(0,1fr)_auto]"
      href={href}
    >
      <div className="p-6 sm:p-8">
        <p className="flex items-center gap-2.5">
          <span
            aria-hidden
            className="size-3 rounded-[3px] bg-lime ring-2 ring-night"
          />
          <span className="label-wide text-[12px]">{c.eyebrow}</span>
        </p>
        <h2 className="mt-3 text-[24px] font-extrabold tracking-tight sm:text-[28px]">
          {c.gymTeaserTitle}
        </h2>
        <p className="mt-2 text-[16px] leading-[1.7] text-mute">
          {c.gymTeaserBody(routes.length, withBeta)}
        </p>
        <span className="mt-5 inline-block rounded-full bg-lime px-5 py-2.5 text-[15px] font-bold text-night transition-transform">
          {c.gymTeaserLink}
        </span>
      </div>
      {posters.length ? (
        <div className="theme-dark relative hidden w-[300px] overflow-hidden border-l border-line bg-night sm:block">
          {posters.map((p, i) => (
            // eslint-disable-next-line @next/next/no-img-element -- a clip's poster, from storage
            <img
              key={p.id}
              alt=""
              className="absolute top-1/2 h-[78%] w-auto rounded-[14px] object-cover"
              loading="lazy"
              src={p.posterUrl!}
              style={{
                left: `${18 + i * 26}%`,
                transform: `translateY(-50%) rotate(${(i - 1) * 6}deg)`,
                aspectRatio: "9 / 16",
                zIndex: i,
              }}
            />
          ))}
        </div>
      ) : (
        <div className="bolt-grid hidden w-[300px] flex-wrap content-center items-center justify-center gap-2 border-l border-line bg-ink-3 p-6 sm:flex">
          {chips.map((r) => (
            <GradeChip
              key={r.id}
              color={r.holdColor}
              grade={r.gradeLabel}
              size="sm"
            />
          ))}
        </div>
      )}
    </Link>
  );
}
