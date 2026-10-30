import type { CSSProperties, ReactNode } from "react";

import clsx from "clsx";

import { ScaledScreen } from "./scaled-screen";

/**
 * A titanium iPhone in 3D: a tilted body with a visible side edge, glass
 * glare and a soft contact shadow. Pure CSS, fixed aspect ratio, so the
 * page never shifts while images load.
 */
export function Phone3D({
  children,
  label,
  className,
  tilt = "left",
  style,
}: {
  children: ReactNode;
  /** Accessible description of what the preview shows. */
  label: string;
  className?: string;
  /** Which way the screen faces; "flat" faces the viewer. */
  tilt?: "left" | "right" | "flat";
  style?: CSSProperties;
}) {
  return (
    <figure
      aria-label={label}
      className={clsx(
        "phone3d",
        tilt === "right" && "phone3d--right",
        tilt === "flat" && "phone3d--flat",
        className,
      )}
      style={style}
    >
      <div className="phone3d__body">
        {/* side edge: the phone's thickness, seen because of the tilt */}
        <div aria-hidden className="phone3d__edge" />
        <div className="phone3d__frame">
          <div className="phone3d__screen theme-dark">
            <ScaledScreen>{children}</ScaledScreen>
            <div aria-hidden className="phone3d__island" />
            <div aria-hidden className="phone3d__glare" />
          </div>
        </div>
        {/* side buttons */}
        <span aria-hidden className="phone3d__btn phone3d__btn--a" />
        <span aria-hidden className="phone3d__btn phone3d__btn--b" />
        <span aria-hidden className="phone3d__btn phone3d__btn--c" />
      </div>
      <div aria-hidden className="phone3d__shadow" />
    </figure>
  );
}

export function StatusBar() {
  return (
    <div
      aria-hidden
      className="flex h-[38px] items-center justify-between px-[22px] pt-1 text-[12px] font-semibold text-white"
    >
      <span className="tabular">9:41</span>
      <span className="flex items-center gap-1">
        <svg
          className="h-[9px] w-[15px]"
          fill="currentColor"
          viewBox="0 0 17 11"
        >
          <rect height="4" rx="1" width="3" y="7" />
          <rect height="6" rx="1" width="3" x="4.5" y="5" />
          <rect height="8.5" rx="1" width="3" x="9" y="2.5" />
          <rect height="11" rx="1" width="3" x="13.5" />
        </svg>
        <svg className="h-[10px] w-[21px]" fill="none" viewBox="0 0 25 12">
          <rect
            height="11"
            rx="3"
            stroke="currentColor"
            strokeOpacity=".4"
            width="21"
            x=".5"
            y=".5"
          />
          <rect
            fill="currentColor"
            height="8"
            rx="1.6"
            width="16"
            x="2"
            y="2"
          />
          <path
            d="M23 4v4c.8-.3 1.3-1.1 1.3-2S23.8 4.3 23 4Z"
            fill="currentColor"
            fillOpacity=".4"
          />
        </svg>
      </span>
    </div>
  );
}
