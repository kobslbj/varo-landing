"use client";

import { useEffect } from "react";

/** Where /beta keeps the last gym a climber opened, for one-tap return. */
export const LAST_GYM_KEY = "varo.lastBetaGym";

export interface LastGym {
  /** Localized path to the gym's beta page. */
  href: string;
  name: string;
}

/** Remembers this gym in the browser. Renders nothing. */
export function RememberGym({ href, name }: LastGym) {
  useEffect(() => {
    try {
      localStorage.setItem(LAST_GYM_KEY, JSON.stringify({ href, name }));
    } catch {
      // Private mode or blocked storage: the page works without it.
    }
  }, [href, name]);

  return null;
}

/** The remembered gym, or null when there is none or storage is blocked. */
export function readLastGym(): LastGym | null {
  try {
    const raw = localStorage.getItem(LAST_GYM_KEY);
    const v = raw ? (JSON.parse(raw) as Partial<LastGym>) : null;

    return v &&
      typeof v.href === "string" &&
      typeof v.name === "string" &&
      v.href.startsWith("/") &&
      !v.href.startsWith("//")
      ? { href: v.href, name: v.name }
      : null;
  } catch {
    return null;
  }
}
