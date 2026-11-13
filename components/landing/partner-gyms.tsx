import clsx from "clsx";
import Link from "next/link";

import { partnerGyms } from "@/lib/beta/gym-logos";
import { allGyms, gymPath } from "@/lib/gyms/cities";

/**
 * The gyms we work with, as a quiet row of their logos. The files are white
 * (made for dark photos), so on the light page they are drawn black. Each one
 * links to its gym: the beta page when `betaPaths` has it, else the gym page.
 */
export function PartnerGyms({
  label,
  href,
  betaPaths,
  className,
}: {
  label: string;
  href: (path: string) => string;
  /** Unprefixed gym paths that have route data. */
  betaPaths?: Set<string>;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "flex flex-col items-center gap-x-10 gap-y-5 sm:flex-row sm:justify-center",
        className,
      )}
    >
      <p className="shrink-0 text-[13px] font-bold text-mute">{label}</p>
      <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-5 sm:gap-x-12">
        {partnerGyms.map(({ id, logo }) => {
          const gym = allGyms.find((g) => g.id === id);
          const path = gym ? gymPath(gym) : null;
          const wide = logo.width / logo.height;
          const img = (
            // eslint-disable-next-line @next/next/no-img-element -- the gym's logo, a static PNG
            <img
              alt={logo.name}
              className={clsx(
                "w-auto brightness-0",
                // Even the optical weight: the squarer the logo, the taller.
                wide > 3
                  ? "h-7 sm:h-8"
                  : wide > 2
                    ? "h-9 sm:h-11"
                    : "h-12 sm:h-14",
              )}
              height={logo.height}
              loading="lazy"
              src={logo.src}
              width={logo.width}
            />
          );

          return (
            <li key={id}>
              {path ? (
                <Link
                  className="block opacity-75 transition-opacity hover:opacity-100"
                  href={href(betaPaths?.has(path) ? `${path}/beta` : path)}
                >
                  {img}
                </Link>
              ) : (
                <span className="block opacity-75">{img}</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
