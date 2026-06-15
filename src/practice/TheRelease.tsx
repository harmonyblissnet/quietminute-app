import { useEffect, useRef, useState } from "react";
import { pickReleaseQuestion } from "./data";
import { useT, T } from "../i18n/LanguageContext";

type Step = "write" | "reflect" | "breath";

// The Release — the members' deeper Mind Racing. Write it out, meet one gentle
// question, then *hold to release*: the words fade as you hold, a single breath
// settles you, and you flow into a full breathing session.
// (The reflection question is core content — kept in English for now.)
export function TheRelease({
  onBack,
  onToBreathing,
}: {
  onBack: () => void;
  onToBreathing: () => void;
}) {
  const { t } = useT();
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
        <button className="btn-back practice-back" onClick={onBack}>{t("common.back")}</button>
      )}

      {step === "write" && (
        <>
          <p className="practice-eyebrow">The Release</p>
          <p className="wi-body" style={{ fontStyle: "italic", fontFamily: "'Cormorant Garamond', serif" }}>
            {t("tr.prompt")}
          </p>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t("tr.placeholder")}
          />
          <p className="privacy-note"><T k="hf.1.privacy" /></p>
          <button className="btn-primary" disabled={!text.trim()} onClick={() => setStep("reflect")}>
            {t("tr.continue")}
          </button>
        </>
      )}

      {step === "reflect" && (
        <>
          <p className="practice-eyebrow">{t("tr.before")}</p>
          <p className={`release-text${fading ? " is-fading" : ""}`}>{text}</p>
          <div className="practice-rule" />
          <p className="release-question">{question}</p>
          <p className="release-hint">{t("tr.hint")}</p>
          <button
            className="btn-primary release-hold"
            onPointerDown={startHold}
            onPointerUp={cancelHold}
            onPointerLeave={cancelHold}
            onPointerCancel={cancelHold}
          >
            {t("tr.hold")}
          </button>
        </>
      )}

      {step === "breath" && (
        <>
          <p className="practice-eyebrow">{t("tr.oneBreath")}</p>
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
