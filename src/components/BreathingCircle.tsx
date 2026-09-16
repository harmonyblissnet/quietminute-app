import { useEffect, useRef, useState } from "react";
import { palette } from "../theme";
import { useT } from "../i18n/LanguageContext";

// The free guided breath: 4-count inhale → hold → exhale, 5 cycles, then
// onComplete. Shared by the free flows and the daily check-in.
export function BreathingCircle({ onComplete }: { onComplete: () => void }) {
  const { t } = useT();
  const [phase, setPhase] = useState("inhale");
  const [count, setCount] = useState(4);
  const phaseRef = useRef("inhale");
  const countRef = useRef(4);
  const cycleRef = useRef(0);

  useEffect(() => {
    const timer = setInterval(() => {
      countRef.current -= 1;
      if (countRef.current <= 0) {
        let nextPhase;
        if (phaseRef.current === "inhale") { nextPhase = "hold"; countRef.current = 4; }
        else if (phaseRef.current === "hold") { nextPhase = "exhale"; countRef.current = 4; }
        else {
          nextPhase = "inhale"; countRef.current = 4;
          cycleRef.current += 1;
          if (cycleRef.current >= 5) { clearInterval(timer); setTimeout(onComplete, 700); return; }
        }
        phaseRef.current = nextPhase;
        setPhase(nextPhase);
      }
      setCount(countRef.current);
    }, 1000);
    return () => clearInterval(timer);
  }, [onComplete]);

  const size = phase === "inhale" ? 134 : phase === "hold" ? 112 : 72;
  const glow = phase === "inhale" ? `0 0 48px ${palette.accentGlow}` : phase === "hold" ? `0 0 28px ${palette.accentGlow}` : `0 0 8px ${palette.accentGlow}`;
  const label = phase === "inhale" ? t("breath.in") : phase === "hold" ? t("breath.hold") : t("breath.out");

  return (
    <div className="breath-wrap">
      <div className="breath-outer">
        <div className="pulse-ring-2" style={{ width: size + 44, height: size + 44 }} />
        <div className="pulse-ring-1" style={{ width: size + 22, height: size + 22 }} />
        <div className="breath-circle" style={{ width: size, height: size, boxShadow: glow }}>
          <span className="breath-count">{count}</span>
          <span className="breath-phase">{label}</span>
        </div>
      </div>
    </div>
  );
}
