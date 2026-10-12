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
  gyms: {
    meta: {
      title: (n, year) =>
        `Bouldering & climbing gyms in Taiwan (${year}): map of ${n} gyms | VARO`,
      description: (n) =>
        `${n} gyms where you can boulder in Taiwan, from Taipei to Kaohsiung: addresses, opening hours, prices and booking, on one map.`,
    },
    nav: "Gym map",
    title: "Bouldering gyms in Taiwan",
    lead: (n, cities) =>
      `${n} gyms where you can boulder, across ${cities} cities and counties. Every hold on the map is a gym; pick a city to see that area.`,
    all: "All",
    mapLabel: "Map of bouldering gyms in Taiwan",
    kinds: {
      boulder: "Bouldering",
      mixed: "Bouldering + ropes",
      rope: "Mostly roped",
      kids: "Kids / small wall",
      outdoor: "Outdoor / semi-outdoor",
    },
    unconfirmed: "Not confirmed open",
    unconfirmedHint: "Hollow hold: not confirmed open",
    weekday: "Weekday",
    weekend: "Weekend",
    shoes: "Shoes",
    currency: "NT$",
    directions: "Directions",
    website: "Website",
    call: "Call",
    more: "Hours and details (in Chinese)",
    hours: "Hours",
    courses: "Intro sessions & courses",
    facilities: "Facilities",
    booking: "Booking",
    address: "Address",
    notes: "Before you go",
    showAll: "Show all cities",
    caveat: {
      title: "Check before you go",
      body: (date) =>
        `This list is compiled from public information, last checked ${date}. Most hours and prices haven’t been confirmed with the gyms, so check the gym’s own page before you go.`,
      report: "Spotted a mistake, or run one of these gyms?",
      reportLink: "Email us",
      reportSubject: "VARO gym listing correction",
    },
    closing: {
      title: ["Found a gym to try?", "Log every attempt."],
    },
    date: (iso) =>
      new Date(`${iso}T00:00:00`).toLocaleDateString("en", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    cities: {
      台北市: "Taipei",
      新北市: "New Taipei",
      桃園市: "Taoyuan",
      新竹市: "Hsinchu City",
      新竹縣: "Hsinchu County",
      台中市: "Taichung",
      彰化縣: "Changhua",
      南投縣: "Nantou",
      雲林縣: "Yunlin",
      嘉義市: "Chiayi City",
      台南市: "Tainan",
      高雄市: "Kaohsiung",
      宜蘭縣: "Yilan",
      花蓮縣: "Hualien",
      台東縣: "Taitung",
    },
  },
  gymsCity: {
    meta: {
      title: (f) =>
        `Bouldering & climbing gyms in ${f.city} (${f.year}): ${f.n} gyms | VARO`,
      description: (f) =>
        `${f.n} gyms where you can boulder in ${f.city}, with a map, opening hours, booking${f.priced.length ? " and prices" : ""}.`,
    },
    title: (city) => `Bouldering gyms in ${city}`,
    lead: (f, kind) =>
      `${f.city} has ${f.n} ${f.n === 1 ? "gym" : "gyms"} where you can boulder: ${f.kinds.map((k) => `${k.n} ${kind(k.kind).toLowerCase()}`).join(", ")}.`,
    faqTitle: "Questions",
    faq: {
      count: (f) => ({
        q: `How many bouldering gyms are there in ${f.city}?`,
        a: `We list ${f.n}:`,
        items: f.names,
      }),
      price: (f) =>
        f.priced.length
          ? {
              q: `How much does bouldering cost in ${f.city}?`,
              a: "These gyms publish prices. For the others, check their own pages:",
              items: f.priced.map(
                (p) =>
                  `${p.name}: ${[
                    p.weekday && `NT$${p.weekday} on weekdays`,
                    p.weekend && `NT$${p.weekend} on weekends`,
                    p.shoes && `shoe rental NT$${p.shoes}`,
                    p.notes,
                  ]
                    .filter(Boolean)
                    .join(", ")} (source: ${p.source})`,
              ),
            }
          : {
              q: `How much does bouldering cost in ${f.city}?`,
              a: "We haven’t found confirmed current prices. Check each gym’s own page.",
            },
      beginners: (f) => ({
        q: `Which gyms in ${f.city} have intro sessions or classes?`,
        a: "These gyms mention intro sessions or classes. Ask the gym for current times:",
        items: f.beginners.map((b) => `${b.name}: ${b.courses}`),
      }),
      kids: (f) => ({
        q: `Which gyms in ${f.city} are good for kids?`,
        a: "These gyms mention kids’ classes or a kids’ wall. Ask before you go:",
        items: f.kids,
      }),
    },
    otherCities: "Bouldering gyms in other cities",
    allGyms: "See the map of all gyms",
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
