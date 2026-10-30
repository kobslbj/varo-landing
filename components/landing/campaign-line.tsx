import type { ReactNode } from "react";

/** One campaign headline line, sliding up out of its own mask on load. */
export function CampaignLine({
  children,
  delay,
}: {
  children: ReactNode;
  delay: number;
}) {
  return (
    <span className="block overflow-hidden pb-[0.04em]">
      <span
        className="line-up"
        style={{ ["--line-delay" as string]: `${delay}ms` }}
      >
        {children}
      </span>
    </span>
  );
}
