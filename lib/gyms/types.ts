/** What kind of climbing a gym is for, which also picks its hold colour on the map. */
export type GymKind =
  /** Bouldering only. */
  | "boulder"
  /** Bouldering and roped climbing. */
  | "mixed"
  /** Mainly roped climbing; whether there's open bouldering isn't confirmed. */
  | "rope"
  /** Bouldering for kids, or only a small wall. */
  | "kids"
  /** Outdoor or semi-outdoor wall. */
  | "outdoor";

export interface Gym {
  id: string;
  name: string;
  /** As written in the data, e.g. "台北市". */
  city: string;
  district: string;
  address?: string;
  kind: GymKind;
  /** False when the research couldn't confirm the gym is still open. */
  confirmed: boolean;
  /** The research's own label, e.g. "抱石＋上攀". */
  category: string;
  /** One entry per line, e.g. "週一至五14:00–22:00". */
  hours?: string[];
  /** Where the hours come from and how sure they are. */
  hoursNote?: string;
  /** Only when the gym publishes a price; amounts in NTD. */
  price?: {
    /** Day pass. */
    weekday?: number;
    weekend?: number;
    shoes?: number;
    /** Other published prices: hourly, time slots, intro sessions. */
    notes?: string;
    /** Where the price comes from and how sure it is. */
    source: string;
  };
  courses?: string;
  facilities?: string;
  booking?: string;
  phone?: string;
  website?: string;
  instagram?: string;
  facebook?: string;
  notes?: string;
  lat?: number;
  lng?: number;
  mapsUrl?: string;
}
