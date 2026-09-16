import { useState } from "react";
import { Onboarding } from "./Onboarding";
import { CheckInScreen } from "./CheckInScreen";
import { Confirmation } from "./Confirmation";
import { isOnboarded, markOnboarded, saveCheckIn, todaysCheckIn } from "./checkinStorage";
import type { CheckIn } from "./checkinStorage";

type View = "form" | "done";

// The free daily check-in: onboarding (once) → the check-in form → a gentle
// confirmation with a rule-based insight and the 7 witnessing dots. If you've
// already checked in today, it opens straight to that confirmation.
export function CheckInRoot({ onExit }: { onExit: () => void }) {
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

  return <Confirmation onBack={onExit} />;
}
