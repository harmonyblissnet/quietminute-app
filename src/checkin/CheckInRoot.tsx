import { useState } from "react";
import { useT, T } from "../i18n/LanguageContext";
import { Onboarding } from "./Onboarding";
import { CheckInScreen } from "./CheckInScreen";
import { isOnboarded, markOnboarded, saveCheckIn, todaysCheckIn } from "./checkinStorage";
import type { CheckIn } from "./checkinStorage";

type View = "form" | "done";

// The free daily check-in. Step 1: onboarding (once) → the check-in form → save.
// The rich confirmation (rule-based insight + the 7 witnessing dots + a breath)
// arrives in the next slice; for now "done" is a gentle acknowledgment.
export function CheckInRoot({ onExit }: { onExit: () => void }) {
  const { t } = useT();
  const [onboarded, setOnboarded] = useState(isOnboarded);
  const [view, setView] = useState<View>(() => (todaysCheckIn() ? "done" : "form"));

  if (!onboarded) {
    return <Onboarding onBegin={() => { markOnboarded(); setOnboarded(true); }} />;
  }

  if (view === "form") {
    return (
      <CheckInScreen
        onBack={onExit}
        onSubmit={(entry: CheckIn) => {
          saveCheckIn(entry);
          setView("done");
        }}
      />
    );
  }

  return (
    <div className="checkin">
      <span className="practice-mark">✦</span>
      <h2 className="flow-title">{t("checkin.done.title")}</h2>
      <p className="flow-body"><T k="checkin.done.body" /></p>
      <button className="btn-back" onClick={onExit}>{t("common.back")}</button>
    </div>
  );
}
