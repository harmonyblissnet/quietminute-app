import { useEffect, useState } from "react";
import { todaysPrompt } from "./data";
import { recordVisit, isUpsellDismissed, dismissUpsell } from "./practiceStorage";

type Screen = "breathing" | "release" | "calendar";

const cards: { id: Screen; label: string; sub: string }[] = [
  { id: "breathing", label: "Breathing session", sub: "Choose your pattern, sound & duration" },
  { id: "release", label: "The Release", sub: "Mind Racing — deeper" },
  { id: "calendar", label: "Your calendar", sub: "The days you came back" },
];

export function Dashboard({
  onOpen,
  onExit,
}: {
  onOpen: (screen: Screen) => void;
  onExit: () => void;
}) {
  const [showUpsell, setShowUpsell] = useState(false);

  // Mark today on the silent calendar, and decide whether to show the one-time
  // upsell. Runs once when the dashboard opens.
  useEffect(() => {
    recordVisit();
    if (!isUpsellDismissed()) setShowUpsell(true);
  }, []);

  function closeUpsell() {
    dismissUpsell();
    setShowUpsell(false);
  }

  return (
    <div className="practice">
      <button className="btn-back practice-back" onClick={onExit}>← back to the free practice</button>

      <span className="practice-mark">✦</span>
      <p className="practice-eyebrow">The Daily Practice</p>
      <p className="dash-prompt">{todaysPrompt()}</p>

      <div className="practice-rule" />

      <div className="dash-cards">
        {cards.map((c) => (
          <button key={c.id} className="mode-card" onClick={() => onOpen(c.id)}>
            <span className="mode-icon">◇</span>
            <div>
              <p className="mode-label">{c.label}</p>
              <p className="mode-sub">{c.sub}</p>
            </div>
          </button>
        ))}
      </div>

      {showUpsell && (
        <div className="dash-upsell">
          <p>
            If you feel ready for more than moments —<br />
            there's a place where we go deeper, together.
          </p>
          <div className="dash-upsell-row">
            <a className="btn-deeper" href="https://naomietnel.com" target="_blank" rel="noreferrer">
              learn more →
            </a>
            <button className="dash-upsell-close" onClick={closeUpsell}>dismiss</button>
          </div>
        </div>
      )}
    </div>
  );
}
