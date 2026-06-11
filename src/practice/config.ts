// Pre-launch switch. While false (the default), clicking "enter the daily
// practice" opens the waitlist popup. Set VITE_DAILY_PRACTICE_LAUNCHED="true"
// (in Vercel) once payments are wired up to reveal the real members flow.
export const dailyPracticeLaunched =
  import.meta.env.VITE_DAILY_PRACTICE_LAUNCHED === "true";
