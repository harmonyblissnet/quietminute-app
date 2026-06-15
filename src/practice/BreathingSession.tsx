import { useEffect, useRef, useState } from "react";
import { palette } from "../theme";
import { breathingPatterns, sounds, durations } from "./data";
import type { BreathingPattern, Sound, BreathPhase } from "./data";
import { useT } from "../i18n/LanguageContext";

const BIG = 150;
const SMALL = 74;
const PHASE_KEY: Record<BreathPhase, string> = {
  inhale: "breath.in",
  hold: "breath.hold",
  exhale: "breath.out",
};

function getAudioContext(): AudioContext | null {
  try {
    return window.AudioContext ? new window.AudioContext() : null;
  } catch {
    return null;
  }
}

// The running session: animates the circle on the pattern's rhythm, plays a soft
// synthesised tone on each in/out breath, and loops the chosen ambient sound
// (when its MP3 is present). All audio is best-effort — a missing file or a
// browser that blocks audio simply means silence, never a broken session.
// (The per-phase guidance line is kept in English for now, like the prompts.)
function Session({
  pattern,
  sound,
  minutes,
  onComplete,
  onStop,
}: {
  pattern: BreathingPattern;
  sound: Sound;
  minutes: number;
  onComplete: () => void;
  onStop: () => void;
}) {
  const { t } = useT();
  const [phase, setPhase] = useState<BreathPhase>(pattern.cycle[0].phase);
  const [guide, setGuide] = useState(pattern.cycle[0].guide);
  const [size, setSize] = useState(SMALL);
  const [transMs, setTransMs] = useState(1000);
  const timerRef = useRef<number | null>(null);
  const elapsedRef = useRef(0);
  const ctxRef = useRef<AudioContext | null>(null);
  const ambientRef = useRef<HTMLAudioElement | null>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const total = minutes * 60;
    ctxRef.current = getAudioContext();
    if (sound.file && ambientRef.current) {
      ambientRef.current.volume = 0.22;
      void ambientRef.current.play().catch(() => {});
    }

    function tone(kind: "in" | "out") {
      const ctx = ctxRef.current;
      if (!ctx) return;
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = kind === "in" ? 392 : 294;
        const t0 = ctx.currentTime;
        gain.gain.setValueAtTime(0.0001, t0);
        gain.gain.exponentialRampToValueAtTime(0.1, t0 + 0.4);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.7);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t0);
        osc.stop(t0 + 1.8);
      } catch {
        // a tone is a nicety; never let it break the session
      }
    }

    function runPhase(index: number) {
      const s = pattern.cycle[index];
      setPhase(s.phase);
      setGuide(s.guide);
      setTransMs(s.seconds * 1000);
      if (s.phase === "inhale") {
        setSize(BIG);
        tone("in");
      } else if (s.phase === "exhale") {
        setSize(SMALL);
        tone("out");
      }
      timerRef.current = window.setTimeout(() => {
        elapsedRef.current += s.seconds;
        if (elapsedRef.current >= total) {
          onCompleteRef.current();
          return;
        }
        runPhase((index + 1) % pattern.cycle.length);
      }, s.seconds * 1000);
    }

    runPhase(0);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (ambientRef.current) ambientRef.current.pause();
      if (ctxRef.current) void ctxRef.current.close().catch(() => {});
    };
  }, [pattern, sound, minutes]);

  return (
    <div className="practice">
      <div className="breath-wrap">
        <div className="breath-outer">
          <div className="pulse-ring-2" style={{ width: size + 44, height: size + 44 }} />
          <div className="pulse-ring-1" style={{ width: size + 22, height: size + 22 }} />
          <div
            className="breath-circle"
            style={{
              width: size,
              height: size,
              transition: `width ${transMs}ms ease-in-out, height ${transMs}ms ease-in-out, box-shadow ${transMs}ms ease-in-out`,
              boxShadow: `0 0 ${Math.round(size / 4)}px ${palette.accentGlow}`,
            }}
          >
            <span className="breath-phase">{t(PHASE_KEY[phase])}</span>
          </div>
        </div>
      </div>
      <p className="breath-guide">{guide}</p>
      <button className="btn-back" onClick={onStop}>{t("bs.end")}</button>
      {sound.file && <audio ref={ambientRef} src={sound.file} loop preload="none" />}
    </div>
  );
}

type Step = "pattern" | "sound" | "duration" | "session" | "done";

export function BreathingSession({ onBack }: { onBack: () => void }) {
  const { t } = useT();
  const [step, setStep] = useState<Step>("pattern");
  const [pattern, setPattern] = useState<BreathingPattern | null>(null);
  const [sound, setSound] = useState<Sound | null>(null);
  const [minutes, setMinutes] = useState<number | null>(null);

  if (step === "session" && pattern && sound && minutes) {
    return (
      <Session
        pattern={pattern}
        sound={sound}
        minutes={minutes}
        onComplete={() => setStep("done")}
        onStop={onBack}
      />
    );
  }

  if (step === "done") {
    return (
      <div className="practice">
        <span className="practice-mark">✦</span>
        <h2 className="flow-title">{t("bs.stayed")}</h2>
        <button className="btn-back" onClick={onBack}>{t("bs.backPractice")}</button>
      </div>
    );
  }

  const goBack =
    step === "sound"
      ? () => setStep("pattern")
      : step === "duration"
        ? () => setStep("sound")
        : onBack;

  return (
    <div className="practice">
      <button className="btn-back practice-back" onClick={goBack}>{t("common.back")}</button>

      {step === "pattern" && (
        <>
          <p className="practice-eyebrow">{t("bs.title")}</p>
          <p className="wi-body">{t("bs.rhythm")}</p>
          <div className="dash-cards">
            {breathingPatterns.map((p) => (
              <button
                key={p.id}
                className="mode-card"
                onClick={() => {
                  setPattern(p);
                  setStep("sound");
                }}
              >
                <span className="mode-icon">◇</span>
                <div>
                  <p className="mode-label">{p.label}</p>
                  <p className="mode-sub">{t(`bs.pattern.${p.id}.detail`)} · {t(`bs.pattern.${p.id}.mood`)}</p>
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {step === "sound" && (
        <>
          <p className="practice-eyebrow">{t("bs.sound")}</p>
          <div className="dash-cards">
            {sounds.map((s) => (
              <button
                key={s.id}
                className="mode-card"
                onClick={() => {
                  setSound(s);
                  setStep("duration");
                }}
              >
                <span className="mode-icon">♪</span>
                <div>
                  <p className="mode-label">{t(`bs.sound.${s.id}`)}</p>
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {step === "duration" && (
        <>
          <p className="practice-eyebrow">{t("bs.duration")}</p>
          <div className="dash-cards">
            {durations.map((d) => (
              <button
                key={d}
                className="mode-card"
                onClick={() => {
                  setMinutes(d);
                  setStep("session");
                }}
              >
                <span className="mode-icon">◷</span>
                <div>
                  <p className="mode-label">{d} {t("bs.min")}</p>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
