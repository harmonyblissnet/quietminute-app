import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { AuthScreen } from "../auth/AuthScreen";
import { useDailyAccess } from "./useDailyAccess";
import { WhatsInside } from "./WhatsInside";
import { Dashboard } from "./Dashboard";
import { BreathingSession } from "./BreathingSession";
import { TheRelease } from "./TheRelease";
import { SilentCalendar } from "./SilentCalendar";

type Screen = "dashboard" | "breathing" | "release" | "calendar";

// The gated entry point for The Daily Practice. Decides, in order:
//   accounts off → gentle note · loading → wait · signed out → sign in ·
//   no entitlement → What's Inside (the offer) · entitled → the practice itself.
export function DailyPracticeRoot({ onExit }: { onExit: () => void }) {
  const { configured, loading: authLoading, user } = useAuth();
  const { hasAccess, loading: accessLoading } = useDailyAccess();
  const [screen, setScreen] = useState<Screen>("dashboard");

  if (!configured) {
    return (
      <div className="flow">
        <p className="flow-eyebrow">Daily practice</p>
        <h2 className="flow-title">This space is<br />being prepared.</h2>
        <p className="flow-body">
          Member accounts aren't switched on just yet.<br />
          The practice above is always open to you.
        </p>
        <button className="btn-back" onClick={onExit}>← back</button>
      </div>
    );
  }

  if (authLoading || accessLoading) {
    return (
      <div className="flow">
        <p className="flow-body">one moment…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flow">
        <AuthScreen />
        <button className="btn-back" onClick={onExit}>← back to the free practice</button>
      </div>
    );
  }

  if (!hasAccess) {
    return <WhatsInside onBack={onExit} />;
  }

  const back = () => setScreen("dashboard");
  if (screen === "breathing") return <BreathingSession onBack={back} />;
  if (screen === "release") return <TheRelease onBack={back} />;
  if (screen === "calendar") return <SilentCalendar onBack={back} />;
  return <Dashboard onOpen={(s) => setScreen(s)} onExit={onExit} />;
}
