// Mood chips in a gentle spectrum: heavy → settled → open. Labels come from the
// i18n dictionary (checkin.mood.<id>); the rules only ever use the ids.
export const MOODS = [
  "down",
  "frustrated",
  "overwhelmed",
  "agitated",
  "restless",
  "foggy",
  "okay",
  "calm",
  "hopeful",
] as const;

export const ENERGY = ["low", "steady", "full"] as const;
