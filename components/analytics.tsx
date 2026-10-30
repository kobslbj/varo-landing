"use client";

import { Analytics as VercelAnalytics } from "@vercel/analytics/next";

/** Friend invite tokens (/u/<token>) never reach analytics: they're credentials. */
const INVITE = /\/u\/[0-9a-f]{32}/gi;

export function Analytics() {
  return (
    <VercelAnalytics
      beforeSend={(event) => ({
        ...event,
        url: event.url.replace(INVITE, "/u/[token]"),
      })}
    />
  );
}
