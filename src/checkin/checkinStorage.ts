// The daily check-in's local store. This is the SECOND privacy promise: unlike
// the flows (never saved), a check-in is deliberately kept — but only on this
// device, never sent anywhere, and the user can clear it anytime. No network,
// no account, offline-first.

export type Energy = "low" | "steady" | "full";

export type CheckIn = {
  date: string; // local YYYY-MM-DD (one entry per day)
  moods: string[]; // mood ids, max 2
  feeling?: string; // free-text, when their feeling isn't in the chips
  energy?: Energy;
  note?: string;
  ts: number; // epoch ms
};

const KEY = "tqm_checkins";
const ONBOARD_KEY = "tqm_checkin_onboarded";

export function checkinToday(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function getCheckIns(): CheckIn[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as CheckIn[]) : [];
  } catch {
    return [];
  }
}

// One entry per day: a new check-in for today replaces today's.
export function saveCheckIn(entry: CheckIn): void {
  try {
    const rest = getCheckIns().filter((c) => c.date !== entry.date);
    rest.push(entry);
    rest.sort((a, b) => a.date.localeCompare(b.date));
    localStorage.setItem(KEY, JSON.stringify(rest));
  } catch {
    // localStorage unavailable (private mode) — the check-in just won't persist.
  }
}

export function clearCheckIns(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}

export function todaysCheckIn(): CheckIn | null {
  const today = checkinToday();
  return getCheckIns().find((c) => c.date === today) ?? null;
}

export function isOnboarded(): boolean {
  try {
    return localStorage.getItem(ONBOARD_KEY) === "1";
  } catch {
    return false;
  }
}

export function markOnboarded(): void {
  try {
    localStorage.setItem(ONBOARD_KEY, "1");
  } catch {
    // ignore
  }
}
