// The Daily Practice — static content & shapes.

export type BreathPhase = "inhale" | "hold" | "exhale";
export type BreathStep = { phase: BreathPhase; seconds: number };
export type BreathingPattern = {
  id: string;
  label: string;
  detail: string;
  mood: string;
  cycle: BreathStep[];
};
export type Sound = { id: string; label: string; file: string | null };

export const PRICE = "€14,99";

export const breathingPatterns: BreathingPattern[] = [
  {
    id: "4-4",
    label: "4 – 4",
    detail: "In for 4, out for 4",
    mood: "Grounding",
    cycle: [
      { phase: "inhale", seconds: 4 },
      { phase: "exhale", seconds: 4 },
    ],
  },
  {
    id: "4-7-8",
    label: "4 – 7 – 8",
    detail: "In for 4, hold for 7, out for 8",
    mood: "Releasing",
    cycle: [
      { phase: "inhale", seconds: 4 },
      { phase: "hold", seconds: 7 },
      { phase: "exhale", seconds: 8 },
    ],
  },
  {
    id: "box",
    label: "Box breathing",
    detail: "In for 4, hold for 4, out for 4, hold for 4",
    mood: "Centering",
    cycle: [
      { phase: "inhale", seconds: 4 },
      { phase: "hold", seconds: 4 },
      { phase: "exhale", seconds: 4 },
      { phase: "hold", seconds: 4 },
    ],
  },
];

export const sounds: Sound[] = [
  { id: "bowls", label: "Singing bowls", file: "/audio/bowls.mp3" },
  { id: "flute", label: "Flute", file: "/audio/flute.mp3" },
  { id: "ocean", label: "Ocean waves", file: "/audio/ocean.mp3" },
  { id: "silence", label: "Silence", file: null },
];

export const durations = [5, 10, 15, 20]; // minutes

export const prompts: string[] = [
  "What are you waiting for permission to feel?",
  "When did you last do something just because you wanted to — not because it helped anyone?",
  "What would you say if you knew no one was going to judge you for it?",
  "What part of yourself have you been quietly apologizing for?",
  "Is the tiredness in your body, or is it something else?",
  "What did you swallow today instead of saying out loud?",
  "Who are you when no one needs anything from you?",
  "What have you been carrying that was never yours to carry?",
  "What does your body know that your mind keeps overruling?",
  "What would rest actually look like for you — not sleep, but real rest?",
  "Where in your life are you performing instead of living?",
  "What do you need right now that you haven't allowed yourself to ask for?",
  "What would you do differently today if no one was watching?",
  "What feeling have you been too busy to feel?",
  "What are you holding together that maybe doesn't need to be held?",
  "When did you last feel like yourself — and what was different then?",
  "What are you afraid will happen if you slow down?",
  "What story are you telling yourself about why you can't have what you want?",
  "What are you pretending not to want because wanting it feels too risky?",
  "Where are you shrinking yourself to make others comfortable?",
  "What would you reclaim if you knew it was allowed?",
  "What does the quietest part of you already know?",
  "Who were you before you learned to make yourself small?",
  "What would change if you trusted yourself completely — just for today?",
  "Where are you living on other people's terms without realizing it?",
  "What have you been postponing that has nothing to do with time?",
  "What would she say — the woman you're becoming — if she could speak to you right now?",
  "Which part of you is still waiting to be seen?",
  "What are you allowing that you no longer agree with?",
  "What would you protect in yourself if you loved yourself the way you love others?",
];

export const releaseQuestions: string[] = [
  "What are you actually afraid of underneath all of this?",
  "Whose voice is this — yours, or someone else's?",
  "What would you tell a friend who wrote this?",
  "What does this feeling want you to know?",
  "Is this yours to carry, or did you pick it up somewhere along the way?",
  "What would it feel like to put this down — just for now?",
  "What part of you is speaking right now?",
  "What do you need that you haven't asked for yet?",
];

// One prompt per day, rotating through the list by day-of-year.
export function todaysPrompt(date = new Date()): string {
  const start = new Date(date.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((date.getTime() - start.getTime()) / 86_400_000);
  return prompts[dayOfYear % prompts.length];
}

// A release question — stable for a given "seed" (so it doesn't flicker on
// re-render), but different each time the user enters the flow.
export function pickReleaseQuestion(seed = Math.random()): string {
  return releaseQuestions[Math.floor(seed * releaseQuestions.length) % releaseQuestions.length];
}
