import { useEffect, useRef, useState } from "react";
import { pickReleaseQuestion } from "./data";

type Step = "write" | "reflect" | "breath";

// The Release — the members' deeper Mind Racing. Write it out, meet one gentle
// question, then *hold to release*: the words fade as you hold, a single breath
// settles you, and you flow into a full breathing session.
export function TheRelease({
  onBack,
  onToBreathing,
}: {
  onBack: () => void;
  onToBreathing: () => void;
}) {
  const [step, setStep] = useState<Step>("write");
  const [text, setText] = useState("");
  const [question] = useState(() => pickReleaseQuestion());
  const [fading, setFading] = useState(false);
  const [breathSize, setBreathSize] = useState(74);
  const holdRef = useRef<number | null>(null);
  const onToBreathingRef = useRef(onToBreathing);
  onToBreathingRef.current = onToBreathing;

  // Hold-to-release: holding for ~2s fades the words out, then moves on. Letting
  // go early gently restores them.
  function startHold() {
    setFading(true);
    holdRef.current = window.setTimeout(() => goBreath(), 2100);
  }
  function cancelHold() {
    if (holdRef.current) {
      clearTimeout(holdRef.current);
      holdRef.current = null;
    }
    setFading(false);
  }
  function goBreath() {
    if (holdRef.current) {
      clearTimeout(holdRef.current);
      holdRef.current = null;
    }
    setStep("breath");
  }

  // The single settling breath, then hand off to the breathing session.
  useEffect(() => {
    if (step !== "breath") return;
    const t1 = window.setTimeout(() => setBreathSize(150), 60); // inhale
    const t2 = window.setTimeout(() => setBreathSize(74), 4300); // exhale
    const t3 = window.setTimeout(() => onToBreathingRef.current(), 8800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [step]);

  // Tidy the hold timer if we leave mid-hold.
  useEffect(() => {
    return () => {
      if (holdRef.current) clearTimeout(holdRef.current);
    };
  }, []);

  return (
    <div className="practice">
      {step !== "breath" && (
        <button className="btn-back practice-back" onClick={onBack}>← back</button>
      )}

      {step === "write" && (
        <>
          <p className="practice-eyebrow">The Release</p>
          <p className="wi-body" style={{ fontStyle: "italic", fontFamily: "'Cormorant Garamond', serif" }}>
            Leave it here. Whatever is sitting too heavy — write it out. All of it.
          </p>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Just type. No one is reading this."
          />
          <p className="privacy-note">
            What you write here is never saved or stored.<br />
            It disappears when you let go.
          </p>
          <button className="btn-primary" disabled={!text.trim()} onClick={() => setStep("reflect")}>
            continue
          </button>
        </>
      )}

      {step === "reflect" && (
        <>
          <p className="practice-eyebrow">Before you let go</p>
          <p className={`release-text${fading ? " is-fading" : ""}`}>{text}</p>
          <div className="practice-rule" />
          <p className="release-question">{question}</p>
          <p className="release-hint">You don't have to answer. Just let it land.</p>
          <button
            className="btn-primary release-hold"
            onPointerDown={startHold}
            onPointerUp={cancelHold}
            onPointerLeave={cancelHold}
            onPointerCancel={cancelHold}
          >
            hold to release
          </button>
        </>
      )}

      {step === "breath" && (
        <>
          <p className="practice-eyebrow">One breath</p>
          <div className="breath-wrap">
            <div className="breath-outer">
              <div
                className="breath-circle"
                style={{
                  width: breathSize,
                  height: breathSize,
                  transition: "width 4s ease-in-out, height 4s ease-in-out",
                }}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
