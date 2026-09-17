import { useState } from "react";
import { useT } from "../i18n/LanguageContext";
import { getCheckIns, checkinToday } from "./checkinStorage";
import { getInsight } from "./insight";
import { BreathingCircle } from "../components/BreathingCircle";

type Phase = "insight" | "breathing" | "after";

// The confirmation after a check-in (also shown when you've already checked in
// today): a gentle rule-based insight + the last 7 days as witnessing dots, and
// an invitation to breathe. The breath here is the free basic one; a breath
// matched to the feeling lives in The Daily Practice (a soft, non-pushy note).
export function Confirmation({ onBack, onHistory }: { onBack: () => void; onHistory: () => void }) {
  const { t } = useT();
  const [phase, setPhase] = useState<Phase>("insight");
  const insight = getInsight(t);

  const marked = new Set(getCheckIns().map((c) => c.date));
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return checkinToday(d);
  });

  if (phase === "breathing") {
    return (
      <div className="checkin">
        <BreathingCircle onComplete={() => setPhase("after")} />
      </div>
    );
  }

  if (phase === "after") {
    return (
      <div className="checkin">
        <span className="practice-mark">✦</span>
        <h2 className="flow-title">{t("bs.stayed")}</h2>
        <button className="btn-back" onClick={onBack}>{t("common.back")}</button>
      </div>
    );
  }

  return (
    <div className="checkin">
      <span className="practice-mark">✦</span>
      <h2 className="flow-title">{t("checkin.done.title")}</h2>
      <p className="checkin-insight">{insight}</p>

      <div className="practice-rule" />

      <div className="week-dots">
        {days.map((day) => (
          <span key={day} className={`dot${marked.has(day) ? " is-on" : ""}`} />
        ))}
      </div>
      <p className="final-sub">{t("cal.title")}</p>

      <button className="btn-primary" onClick={() => setPhase("breathing")}>{t("checkin.breathe")}</button>
      <p className="checkin-privacy">{t("checkin.breathPremium")}</p>

      <button className="btn-link" onClick={onHistory}>{t("checkin.history")}</button>
      <button className="btn-back" onClick={onBack}>{t("common.back")}</button>
    </div>
  );
}
