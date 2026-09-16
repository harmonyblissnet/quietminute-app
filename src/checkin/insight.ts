import { getCheckIns } from "./checkinStorage";

// Rule-based, local pattern recognition — no AI, no network. Returns ONE gentle
// mirror-sentence based on recent check-ins, in the app's voice. A witness, not
// advice or a diagnosis. The caller passes `t` so the line is localized.

const HEAVY = new Set(["down", "frustrated", "overwhelmed", "agitated", "restless", "foggy"]);
const LIGHT = new Set(["okay", "calm", "hopeful"]);

export function getInsight(t: (key: string) => string): string {
  const all = getCheckIns();
  // Not enough to see a pattern yet — invite, don't force.
  if (all.length < 3) return t("checkin.insight.gathering");

  const recent = all.slice(-7); // last up to 7 days
  const n = recent.length;

  const counts: Record<string, number> = {};
  let heavyDays = 0;
  let lightDays = 0;
  let lowEnergy = 0;
  let energyKnown = 0;

  for (const c of recent) {
    let hasHeavy = false;
    let hasLight = false;
    for (const m of c.moods) {
      counts[m] = (counts[m] ?? 0) + 1;
      if (HEAVY.has(m)) hasHeavy = true;
      if (LIGHT.has(m)) hasLight = true;
    }
    if (hasHeavy) heavyDays++;
    else if (hasLight) lightDays++;
    if (c.energy) {
      energyKnown++;
      if (c.energy === "low") lowEnergy++;
    }
  }

  // 1) One feeling keeps recurring — name it (using the translated label).
  let topId = "";
  let topCount = 0;
  for (const [id, cnt] of Object.entries(counts)) {
    if (cnt > topCount) {
      topCount = cnt;
      topId = id;
    }
  }
  if (topId && topCount >= 2 && topCount >= Math.ceil(n / 2)) {
    return t("checkin.insight.frequentMood").replace("{mood}", t(`checkin.mood.${topId}`));
  }

  // 2) A heavier stretch — gentle, caring.
  if (heavyDays >= 3 && heavyDays >= Math.ceil(n * 0.6)) {
    return t("checkin.insight.heavyStretch");
  }

  // 3) Low energy lately.
  if (energyKnown >= 2 && lowEnergy >= 2 && lowEnergy >= Math.ceil(energyKnown / 2)) {
    return t("checkin.insight.lowEnergy");
  }

  // 4) More ease than heaviness.
  if (lightDays >= 2 && lightDays >= heavyDays && lightDays >= Math.ceil(n / 2)) {
    return t("checkin.insight.moreEase");
  }

  // Otherwise, simply witness the returning.
  return t("checkin.insight.cameBack");
}
