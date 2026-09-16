import { useT } from "../i18n/LanguageContext";
import { getCheckIns, checkinToday } from "./checkinStorage";
import { getInsight } from "./insight";

// The confirmation after a check-in (also shown when you've already checked in
// today): a gentle rule-based insight + the last 7 days as witnessing dots
// (never a streak — a missed day is not a failure).
export function Confirmation({ onBack }: { onBack: () => void }) {
  const { t } = useT();
  const insight = getInsight(t);

  const marked = new Set(getCheckIns().map((c) => c.date));
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return checkinToday(d);
  });

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

      <button className="btn-back" onClick={onBack}>{t("common.back")}</button>
    </div>
  );
}
