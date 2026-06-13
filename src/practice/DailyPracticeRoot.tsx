import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { AuthScreen } from "../auth/AuthScreen";
import { useT, T } from "../i18n/LanguageContext";
import { useDailyAccess } from "./useDailyAccess";
import { WhatsInside } from "./WhatsInside";
import { Dashboard } from "./Dashboard";
import { BreathingSession } from "./BreathingSession";
import { TheRelease } from "./TheRelease";
import { SilentCalendar } from "./SilentCalendar";
import { isWelcomed, markWelcomed } from "./practiceStorage";

type Screen = "dashboard" | "breathing" | "release" | "calendar";

// A brief, one-time welcome the first time someone opens The Daily Practice.
// Fades on its own after 4s, or on tap.
function WelcomeMoment({ onDone }: { onDone: () => void }) {
  const { t } = useT();
  useEffect(() => {
    const id = window.setTimeout(onDone, 4000);
    return () => clearTimeout(id);
  }, [onDone]);
  return (
    <div className="welcome" onClick={onDone}>
      <span className="practice-mark">✦</span>
      <p className="welcome-text"><T k="welcome.text" /></p>
      <p className="welcome-word">{t("welcome.word")}</p>
    </div>
  );
}

// The gated entry point for The Daily Practice. Decides, in order:
//   accounts off → gentle note · loading → wait · signed out → sign in ·
//   no entitlement → What's Inside · entitled → welcome (once) → the practice.
export function DailyPracticeRoot({ onExit }: { onExit: () => void }) {
  const { configured, loading: authLoading, user } = useAuth();
  const { hasAccess, loading: accessLoading } = useDailyAccess();
  const { t } = useT();
  const [screen, setScreen] = useState<Screen>("dashboard");
  const [welcomed, setWelcomed] = useState(isWelcomed);

  if (!configured) {
    return (
      <div className="flow">
        <p className="flow-eyebrow">The Daily Practice</p>
        <h2 className="flow-title"><T k="gate.title" /></h2>
        <p className="flow-body"><T k="gate.body" /></p>
        <button className="btn-back" onClick={onExit}>{t("common.back")}</button>
      </div>
    );
  }

  if (authLoading || accessLoading) {
    return (
      <div className="flow">
        <p className="flow-body">{t("gate.loading")}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flow">
        <AuthScreen />
        <button className="btn-back" onClick={onExit}>{t("common.backFree")}</button>
      </div>
    );
  }

  if (!hasAccess) {
    return <WhatsInside onBack={onExit} />;
  }

  if (!welcomed) {
    return <WelcomeMoment onDone={() => { markWelcomed(); setWelcomed(true); }} />;
  }

  const back = () => setScreen("dashboard");
  if (screen === "breathing") return <BreathingSession onBack={back} />;
  if (screen === "release")
    return <TheRelease onBack={back} onToBreathing={() => setScreen("breathing")} />;
  if (screen === "calendar") return <SilentCalendar onBack={back} />;
  return <Dashboard onOpen={(s) => setScreen(s)} onExit={onExit} />;
}
