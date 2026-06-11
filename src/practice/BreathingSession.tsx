// Full breathing session (pattern + sound + duration picker, animated circle,
// Web Audio tones and ambient loop) lands in the next build. This keeps the
// dashboard card working and on-brand in the meantime.
export function BreathingSession({ onBack }: { onBack: () => void }) {
  return (
    <div className="practice">
      <button className="btn-back practice-back" onClick={onBack}>← back</button>
      <span className="practice-mark">◇</span>
      <p className="practice-eyebrow">Breathing session</p>
      <p className="wi-body">
        choose your pattern, your sound, your duration.<br />
        this opens in the next update.
      </p>
    </div>
  );
}
