import clsx from "clsx";

import { hold } from "@/lib/beta/holds";

/** A route's grade on its hold colour, like a tag on the wall. */
export function GradeChip({
  grade,
  color,
  size = "md",
  className,
}: {
  grade: string | null;
  color: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const h = hold(color);

  return (
    <span
      className={clsx(
        "inline-flex shrink-0 items-center justify-center rounded-full font-display font-bold leading-none tabular",
        color === "white" && "ring-1 ring-inset ring-line",
        size === "sm" && "h-7 min-w-11 px-2.5 text-[14px]",
        size === "md" && "h-9 min-w-14 px-3.5 text-[18px]",
        size === "lg" &&
          "h-14 min-w-22 px-5 text-[30px] sm:h-16 sm:text-[34px]",
        className,
      )}
      style={{ backgroundColor: h.fill, color: h.ink }}
    >
      {grade ?? "?"}
    </span>
  );
}
