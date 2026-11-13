/** A gym's own logo (white, for dark photos), by its directory id. Only partner gyms that gave us one. */
export interface GymLogo {
  src: string;
  width: number;
  height: number;
  /** How the gym writes its name in the logo, for alt text. */
  name: string;
}

const CORNER: GymLogo = {
  src: "/gym-logos/corner-white.png",
  width: 640,
  height: 242,
  name: "Corner Bouldering Gym",
};

const FLOW: GymLogo = {
  src: "/gym-logos/flow-white.png",
  width: 480,
  height: 377,
  name: "Flow",
};

const CAVE: GymLogo = {
  src: "/gym-logos/cave-white.png",
  width: 640,
  height: 185,
  name: "千手抱石 Cave Bouldering",
};

const LOGOS: Record<string, GymLogo> = {
  "cave-bouldering": CAVE,
  "corner-huashan": CORNER,
  "corner-zhongshan": CORNER,
  "flow-neihu": FLOW,
};

/** Gyms we work with, one entry per brand, in the order they joined. `id` is the branch its logo links to. */
export const partnerGyms: { id: string; logo: GymLogo }[] = [
  { id: "corner-huashan", logo: CORNER },
  { id: "flow-neihu", logo: FLOW },
  { id: "cave-bouldering", logo: CAVE },
];

export function gymLogoFor(directoryId: string): GymLogo | null {
  return LOGOS[directoryId] ?? null;
}
