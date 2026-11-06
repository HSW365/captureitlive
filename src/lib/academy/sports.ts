export type SportId =
  | "basketball" | "volleyball" | "track" | "golf" | "tennis"
  | "boxing" | "kungfu" | "stretching" | "meditation";
export type TierId = "basic" | "varsity" | "pro";
export type LevelId = "middle" | "high" | "amateur";

export interface Sport { id: SportId; name: string; tagline: string; gear: string; accent: string }
export const SPORTS: Sport[] = [
  { id: "basketball", name: "Basketball", tagline: "Handles, footwork, finishing.", gear: "A ball and a hoop or wall", accent: "#FF7A1A" },
  { id: "volleyball", name: "Volleyball", tagline: "Pass, set, attack, serve.", gear: "A ball and a wall or net", accent: "#FFD400" },
  { id: "track", name: "Track", tagline: "Start, drive, stride, finish.", gear: "Open space and a timer", accent: "#FF3B30" },
  { id: "golf", name: "Golf", tagline: "Grip, tempo, strike, putt.", gear: "A club and a ball or mat", accent: "#34C759" },
  { id: "tennis", name: "Tennis", tagline: "Groundstrokes, serve, volley.", gear: "A racquet, ball and a wall", accent: "#C6F135" },
  { id: "boxing", name: "Boxing", tagline: "Stance, jab, defense, combos.", gear: "Open space, optional bag", accent: "#FF2D55" },
  { id: "kungfu", name: "Kung Fu", tagline: "Stances, forms, balance, power.", gear: "Open space", accent: "#E8B24A" },
  { id: "stretching", name: "Stretching", tagline: "Mobility that keeps you playing.", gear: "A mat or towel", accent: "#5AC8FA" },
  { id: "meditation", name: "Meditation", tagline: "Focus, breath, calm under pressure.", gear: "A quiet spot", accent: "#BF5AF2" },
];
export const TIERS: { id: TierId; name: string; blurb: string }[] = [
  { id: "basic", name: "Basic", blurb: "Learn the fundamentals and build clean habits." },
  { id: "varsity", name: "Varsity", blurb: "Add speed, power and game-like reps." },
  { id: "pro", name: "Pro", blurb: "Compete, refine and train under pressure." },
];
export const LEVELS: { id: LevelId; name: string; blurb: string }[] = [
  { id: "middle", name: "Middle school", blurb: "Ages 11 to 14. Short sessions, lots of technique." },
  { id: "high", name: "High school", blurb: "Ages 14 to 18. Build for tryouts and varsity." },
  { id: "amateur", name: "Amateur adult", blurb: "Train on your own schedule." },
];
export const sportById = (id: string) => SPORTS.find((s) => s.id === id);
export const tierById = (id: string) => TIERS.find((t) => t.id === id);
