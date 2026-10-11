import type { Dictionary } from "@/lib/i18n";

const en: Dictionary = {
  htmlLang: "en",
  ogLocale: "en_US",
  meta: {
    title: "VARO: Bouldering Log",
    description:
      "Varo is a climbing log app built for boulderers in Taiwan. Record every session and attempt, track the projects you’re working on, and look back to see how far you’ve come.",
    keywords: ["bouldering", "climbing", "climbing log", "Taiwan", "Varo"],
  },
  nav: {
    philosophy: "Philosophy",
    partner: "For gyms",
    switchLabel: "中文",
    switchAria: "切換為中文",
  },
  partnerSubject: "Varo gym partnership",
  footer: {
    support: "Support",
    privacy: "Privacy",
    flag: "Flag of Taiwan",
  },
  hero: {
    eyebrow: "The bouldering log & community app, made in Taiwan",
    lead: "Log every attempt. Watch yourself progress.",
    body: "From your first look at a problem to the day you finally send it, share the moments worth remembering with your crew.",
    download: "Download on the App Store",
    comingSoon: "Coming soon to the App Store",
    demo: "Illustration",
    finishLabel: "Illustration of the Varo session-complete screen",
    sessionLabel: (gym, routes) =>
      `Illustration of a Varo session log: ${gym}, ${routes} routes`,
  },
  screens: {
    gym: "VARO Bouldering",
    duration: (minutes) => `${Math.floor(minutes / 60)}h ${minutes % 60}m`,
    topSend: "Top send",
    climbs: "climbs",
    sends: "sends",
    flash: "Flash",
    routes: "Routes",
    walls: {
      slab: "Slab",
      vertical: "Vertical",
      overhang: "Overhang",
      roof: "Roof",
    },
    attempts: (n) => `${n} ${n === 1 ? "attempt" : "attempts"}`,
    sent: "Sent",
    attempting: "Projecting",
    finishTitle: "One move closer",
    finishSummary: (sends, flashes) => `${sends} sends · ${flashes} flash`,
    share: "Share",
    viewSession: "View session",
  },
  philosophy: {
    meta: {
      title: "The VARO philosophy: Venture · Attempt · Resilience · Overcome",
      description:
        "Every route is an adventure. Keep attempting, get back on with resilience, until you overcome. The send lasts a second; VARO remembers every attempt that got you there.",
    },
    eyebrow: "THE NAME",
    opening: (w) => (
      <>
        Every route is a {w("Venture")}.
        <br />
        We {w("Attempt")}, and get back on with {w("Resilience")}
        <br className="hidden sm:block" /> until we {w("Overcome")}.
      </>
    ),
    steps: [
      {
        line: "Every new route is an unknown.",
        sub: "Stand at the base, read the line, then commit.",
      },
      {
        line: "Reach, pull on, try new beta, reach again.",
        sub: "No attempt is wasted. Each one brings the next a little closer.",
      },
      {
        line: "Fall off, chalk up, get back on.",
        sub: "Adjust your breathing, your feet, yourself.",
      },
      {
        line: "At last, you stick the move you once couldn’t.",
        sub: "The moment you top out belongs to every try before it.",
      },
    ],
    closing: (
      <>
        The send lasts a moment.
        <br />
        VARO wants to remember every attempt that made it happen.
      </>
    ),
  },
  images: {
    mascot: "The VARO mascot, a lime-green jug hold",
    climbPhoto: "A climber bouldering at an indoor gym",
  },
  legal: {
    updated: "Last updated: ",
  },
};

export default en;
