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

const LOGOS: Record<string, GymLogo> = {
  "corner-huashan": CORNER,
  "corner-zhongshan": CORNER,
  "flow-neihu": FLOW,
};

export function gymLogoFor(directoryId: string): GymLogo | null {
  return LOGOS[directoryId] ?? null;
}
