/**
 * Floor plans VARO drew for gyms, the same drawings the app's log screen
 * shows (varo `src/features/zones/fixedPlans.ts`). Zone letters are printed
 * on the picture; the page lays a tappable spot over each one.
 */

/** One zone on a plan. Values are fractions of the picture (0,0 top-left). */
export interface PlanSpot {
  /** Where its printed letter sits. */
  x: number;
  y: number;
  /** The zone's shape, outlined when it's chosen. */
  outline?: [number, number][];
}

export interface FloorPlan {
  src: string;
  /** The picture's size in px. */
  width: number;
  height: number;
  /** By zone name, as the gym's routes name their wall ("A", "前牆"). */
  spots: Record<string, PlanSpot>;
}

/** Flow 心流抱石館: zones A–G along the long wall, H the box at the back. */
const FLOW: FloorPlan = {
  src: "/floor-plans/flow.png",
  width: 2400,
  height: 515,
  spots: {
    A: {
      x: 0.148,
      y: 0.7882,
      outline: [
        [0.0865, 0.8531],
        [0.1995, 0.7506],
        [0.1995, 0.8531],
      ],
    },
    B: {
      x: 0.2525,
      y: 0.7859,
      outline: [
        [0.1995, 0.7506],
        [0.301, 0.8042],
        [0.301, 0.8531],
        [0.1995, 0.8531],
      ],
    },
    C: {
      x: 0.351,
      y: 0.76,
      outline: [
        [0.301, 0.8042],
        [0.3825, 0.7203],
        [0.396, 0.7459],
        [0.396, 0.8531],
        [0.301, 0.8531],
      ],
    },
    D: {
      x: 0.4621,
      y: 0.7529,
      outline: [
        [0.396, 0.7459],
        [0.51, 0.7459],
        [0.525, 0.634],
        [0.525, 0.8531],
        [0.396, 0.8531],
      ],
    },
    E: {
      x: 0.5874,
      y: 0.6376,
      outline: [
        [0.525, 0.634],
        [0.6335, 0.634],
        [0.648, 0.5711],
        [0.648, 0.8531],
        [0.525, 0.8531],
      ],
    },
    F: {
      x: 0.701,
      y: 0.5741,
      outline: [
        [0.648, 0.5711],
        [0.7545, 0.5711],
        [0.7545, 0.8531],
        [0.648, 0.8531],
      ],
    },
    G: {
      x: 0.8056,
      y: 0.5176,
      outline: [
        [0.7545, 0.338],
        [0.856, 0.338],
        [0.856, 0.634],
        [0.8075, 0.8531],
        [0.7545, 0.8531],
      ],
    },
    H: {
      x: 0.2955,
      y: 0.24,
      outline: [
        [0.2335, 0.1026],
        [0.3565, 0.1026],
        [0.3565, 0.38],
        [0.2335, 0.38],
      ],
    },
  },
};

/** Keyed by the app's gym id (production, and dev where the gym exists there). */
const PLANS: Record<string, FloorPlan> = {
  // Flow 心流抱石館
  "734a7399-0d6d-463d-9fa5-346de5417274": FLOW,
  "005b9ef4-049b-4c19-9026-6870e91515ff": FLOW,
};

export function floorPlanFor(gymId: string): FloorPlan | null {
  return PLANS[gymId] ?? null;
}
