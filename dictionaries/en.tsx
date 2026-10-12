import type { Dictionary } from "@/lib/i18n";

const en: Dictionary = {
  htmlLang: "en",
  ogLocale: "en_US",
  meta: {
    title: "VARO | Bouldering Log App",
    description:
      "Varo is a climbing log app for boulderers. Record every session and attempt, track the projects you’re working on, and look back to see how far you’ve come.",
    keywords: ["bouldering", "climbing", "climbing log", "Taiwan", "Varo"],
  },
  nav: {
    philosophy: "Philosophy",
    partner: "For gyms",
    switchLabel: "中文",
    switchAria: "切換為中文",
  },
  partnerSubject: "Varo gym partnership",
  waitlist: {
    label: "Email",
    placeholder: "Your email",
    button: "Notify me",
    sending: "Sending…",
    count: (n) =>
      `${n.toLocaleString("en")} ${n === 1 ? "climber has" : "climbers have"} joined`,
    joined: "You’re on the list! You’ll be the first to know.",
    already: "This email is already on the list. We’ll let you know.",
    invalid: "Please enter a valid email.",
    toast: {
      joined: {
        title: "You’re on the waitlist!",
        body: "You’ll be the first to know when VARO is out.",
      },
      already: {
        title: "You’re already on the list",
        body: "We’ll email you at launch, no need to sign up again.",
      },
      invalid: {
        title: "That email doesn’t look right",
        body: "Check it and try again.",
      },
      error: {
        title: "Couldn’t sign you up",
        body: "The connection may be unstable. Please try again in a moment.",
      },
    },
  },
  partners: {
    meta: {
      title: "For gyms | VARO is looking for its first partner gyms",
      description:
        "VARO wants to help climbing gyms organise their routes and resets, so climbers see what’s new on the wall right in the app. We’re looking for our first partner gyms to shape it with us.",
    },
    eyebrow: "For gyms · Founding partners",
    title: ["Let climbers know", "what’s new on the wall."],
    intro:
      "VARO is a logging app for boulderers. Next, we want to help gyms keep their routes and resets organised and in climbers’ hands. It’s still being planned, and we want to hear from gyms first.",
    cta: "I’m interested",
    problem: {
      heading: "How it works today",
      items: [
        {
          title: "Reset news disappears in 24 hours",
          body: "Resets are usually announced in an Instagram story. Miss it, and climbers miss the news.",
        },
        {
          title: "Climbers don’t know which wall changed",
          body: "They find out at the gym that a whole wall is new, or that the problem they were projecting is gone.",
        },
        {
          title: "Route info isn’t in one place",
          body: "Grade, color, which wall: you have to see it in person or ask the front desk.",
        },
      ],
    },
    plan: {
      heading: "What we want to build",
      badge: "Planned",
      items: [
        {
          title: "Your routes, organised",
          body: "Your gym’s problems (grade, hold color, wall) live in VARO. Climbers pick them when they log instead of typing them in.",
        },
        {
          title: "Reset announcements",
          body: "Which wall resets and when, right in the app, with a notification for climbers.",
        },
      ],
    },
    pilot: {
      heading: "Become a founding partner",
      items: [
        "Shape how it works, so it fits the way your gym actually resets",
        "Be one of the first gyms live on VARO",
        "No commitment. Let’s just talk",
      ],
    },
    contact: {
      heading: "Interested? Email us",
      body: "The button opens an email with a few questions already in it. Fill in a couple of lines and we’ll reply personally.",
      button: "Email VARO",
      or: "or write to",
    },
    mailBody: [
      "Hi, I’d like to hear more about partnering with VARO.",
      "",
      "Gym name:",
      "City:",
      "How you announce resets today (Instagram, Facebook, in the gym…):",
      "How often you reset:",
      "Contact name and phone (optional):",
    ].join("\n"),
  },
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
    partnerLink: "Run a climbing gym? Partner with us →",
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
    addRoute: "Add route",
    grade: "Grade",
    gradeScale: "V scale",
    notSure: "Not sure",
    holdColor: "Hold color",
    holdNames: {
      red: "Red",
      orange: "Orange",
      yellow: "Yellow",
      green: "Green",
      blue: "Blue",
      purple: "Purple",
      pink: "Pink",
      black: "Black",
    },
    wall: "Wall",
    tapHint: "Tap a result to log it",
    me: "Me",
    tabs: ["History", "Progress", "Projects", "Videos"],
    thisWeek: "This week",
    daysClimbing: (n) => `${n} days climbing`,
    week: "Week",
    month: "Month",
    sessions: "Sessions",
    monthLabel: (m) =>
      new Date(2026, m - 1).toLocaleString("en", { month: "short" }),
    gradeSpread: "Grades",
    allTime: "All time",
    project: "Project",
    inProgress: "In progress",
    projectName: "Purple cave V6",
    daysTried: "Days tried",
    totalAttempts: "Total attempts",
    daysSoFar: "Days so far",
    timeline: "Timeline",
    tryAgain: "Try again",
    storyAgo: "2h",
  },
  features: {
    log: {
      eyebrow: "Log as you climb",
      title: ["Two taps.", "Route logged."],
      body: "Pick the grade, hold color and wall, then tap how it went. Flash, send or still working on it, every attempt counts.",
      label:
        "Illustration of the Varo add-route screen: grade, hold color and wall",
    },
    progress: {
      eyebrow: "See your progress",
      title: ["A little higher", "every week."],
      body: "See how many days you climbed, what you sent and what you flashed this week. Grades are counted per grading system, so you know exactly where you plateau.",
      label:
        "Illustration of the Varo progress screen: weekly sessions and grade spread",
    },
    project: {
      eyebrow: "Projects",
      title: ["Keep trying.", "Send it."],
      body: "Turn the problem you’re stuck on into a Project and log every day and every attempt. When you finally send it, the whole story is there.",
      label:
        "Illustration of a Varo Project: attempts on a V6 over three weeks",
    },
    share: {
      eyebrow: "Share stickers",
      title: ["Sent it?", "Post it."],
      body: "Every send gets its own grade sticker. Drop it on your climbing photo or video and share it straight to your story.",
      label: "Illustration of a Varo share sticker: a V5 send on a story",
    },
    closing: {
      title: ["Your next session", "starts here."],
      body: "VARO remembers every attempt that made the send happen.",
    },
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
