import { useState } from "react";
import { PRICE } from "./data";

const items = [
  {
    title: "A daily reflection prompt",
    sub: "one question, every day. Not to answer out loud. Just to carry with you.",
  },
  {
    title: "Breathing sessions",
    sub: "choose your pattern, your sound, your duration. Fully yours.",
  },
  {
    title: "The Release",
    sub: "a deeper version of Mind Racing. One gentle question before you let go.",
  },
  {
    title: "A silent calendar",
    sub: "not to track your progress, but to witness yourself.",
  },
];

// `onUnlock` is wired to Stripe Checkout in Phase 2. Until then the button shows
// a gentle note so the page is complete and reviewable.
export function WhatsInside({ onBack, onUnlock }: { onBack: () => void; onUnlock?: () => void }) {
  const [notice, setNotice] = useState<string | null>(null);

  function handleUnlock() {
    if (onUnlock) {
      onUnlock();
      return;
    }
    setNotice("checkout opens here once payments are switched on.");
  }

  return (
    <div className="practice">
      <button className="btn-back practice-back" onClick={onBack}>← back to the free practice</button>

      <span className="practice-mark">✦</span>
      <p className="wi-intro">
        This is the part where you stop just surviving the day —<br />
        and start returning to yourself.
      </p>
      <p className="wi-body">
        The Daily Practice is a quiet space inside The Quiet Minute.<br />
        It's yours. No streaks to chase. No performance.<br />
        Just a place to come back to.
      </p>

      <div className="practice-rule" />
      <p className="practice-eyebrow">What's inside</p>

      <div className="wi-list">
        {items.map((it) => (
          <div className="wi-item" key={it.title}>
            <span className="wi-ic">✦</span>
            <div>
              <p className="wi-item-title">{it.title}</p>
              <p className="wi-item-sub">{it.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="practice-rule" />
      <p className="wi-forever">One time. Yours forever.</p>
      <p className="wi-price">{PRICE}</p>
      <button className="btn-primary" onClick={handleUnlock}>Unlock The Daily Practice</button>
      {notice && <p className="wi-note">{notice}</p>}
      <p className="wi-free">The rest of The Quiet Minute is always free.</p>
    </div>
  );
}
