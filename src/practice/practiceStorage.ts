// Gentle, non-sensitive UX state for The Daily Practice, kept in localStorage.
// This is NOT the access gate (that is account-based, in Supabase) — only the
// "days you came back" calendar marks and the one-time upsell dismissal. Being
// per-device is fine for these.

const VISITS_KEY = "tqm_practice_visits";
const UPSELL_KEY = "tqm_practice_upsell_dismissed";

function todayKey(date = new Date()): string {
  // Local date as YYYY-MM-DD (not UTC, so "today" matches the user's day).
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function read(key: string): string[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function recordVisit(date = new Date()): void {
  try {
    const key = todayKey(date);
    const days = read(VISITS_KEY);
    if (!days.includes(key)) {
      days.push(key);
      localStorage.setItem(VISITS_KEY, JSON.stringify(days));
    }
  } catch {
    // localStorage may be unavailable (private mode); the calendar simply stays empty.
  }
}

export function getVisitDates(): Set<string> {
  return new Set(read(VISITS_KEY));
}

export function isUpsellDismissed(): boolean {
  try {
    return localStorage.getItem(UPSELL_KEY) === "1";
  } catch {
    return true; // if we can't tell, don't nag.
  }
}

export function dismissUpsell(): void {
  try {
    localStorage.setItem(UPSELL_KEY, "1");
  } catch {
    // ignore
  }
}

export { todayKey };
