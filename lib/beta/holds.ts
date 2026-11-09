/** Hold colours as the app names them (`routes.hold_color`), with a fill and a readable ink on it. */
const HOLDS: Record<
  string,
  { fill: string; ink: string; zh: string; en: string }
> = {
  red: { fill: "#E5484D", ink: "#ffffff", zh: "紅", en: "Red" },
  orange: { fill: "#F2994A", ink: "#111111", zh: "橘", en: "Orange" },
  yellow: { fill: "#F5D90A", ink: "#111111", zh: "黃", en: "Yellow" },
  green: { fill: "#30A46C", ink: "#ffffff", zh: "綠", en: "Green" },
  teal: { fill: "#12A594", ink: "#ffffff", zh: "青", en: "Teal" },
  blue: { fill: "#3E8BFF", ink: "#ffffff", zh: "藍", en: "Blue" },
  purple: { fill: "#8E4EC6", ink: "#ffffff", zh: "紫", en: "Purple" },
  pink: { fill: "#E93D82", ink: "#ffffff", zh: "粉紅", en: "Pink" },
  black: { fill: "#111111", ink: "#ffffff", zh: "黑", en: "Black" },
  white: { fill: "#ffffff", ink: "#111111", zh: "白", en: "White" },
  gray: { fill: "#8B8D98", ink: "#ffffff", zh: "灰", en: "Grey" },
  brown: { fill: "#A0703C", ink: "#ffffff", zh: "咖啡", en: "Brown" },
};

const UNKNOWN = { fill: "#dfdfd9", ink: "#111111", zh: "", en: "" };

export function hold(color: string | null | undefined) {
  return (color && HOLDS[color]) || UNKNOWN;
}

export function holdName(color: string | null | undefined, zh: boolean) {
  const h = hold(color);

  return zh ? h.zh : h.en;
}

/**
 * Where to draw a wall photo so a pin sits as near the middle of a frame as
 * the photo allows, zoomed in `zoom` times, without showing past its edges.
 * All values are percentages of the frame, for absolutely placed CSS.
 */
export function wallCrop(
  photo: { width: number; height: number },
  frameAspect: number,
  pin: { x: number; y: number },
  zoom: number,
) {
  // Cover the frame first, then zoom.
  const photoAspect = photo.width / photo.height;
  // Height in frame heights is w · frameAspect / photoAspect, so covering
  // needs w ≥ 1 and w ≥ photoAspect / frameAspect.
  const coverW = Math.max(1, photoAspect / frameAspect);
  const w = coverW * zoom; // photo width in frame widths
  const h = (w * frameAspect) / photoAspect; // photo height in frame heights
  const clamp = (v: number, min: number) => Math.min(0, Math.max(min, v));
  const left = clamp(0.5 - pin.x * w, 1 - w);
  const top = clamp(0.5 - pin.y * h, 1 - h);

  return {
    img: {
      width: `${w * 100}%`,
      height: `${h * 100}%`,
      left: `${left * 100}%`,
      top: `${top * 100}%`,
    },
    pin: {
      left: `${(left + pin.x * w) * 100}%`,
      top: `${(top + pin.y * h) * 100}%`,
    },
  };
}

/** Short duration, "0:27". */
export function clipLength(ms: number | null) {
  if (!ms) return null;
  const s = Math.round(ms / 1000);

  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}
