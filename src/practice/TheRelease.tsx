// The Release — the deeper, members-only version of Mind Racing (reflection
// question → "hold to release" fade → one breath → breathing). Built out in the
// next update; placeholder keeps the dashboard card whole.
export function TheRelease({ onBack }: { onBack: () => void }) {
  return (
    <div className="practice">
      <button className="btn-back practice-back" onClick={onBack}>← back</button>
      <span className="practice-mark">◇</span>
      <p className="practice-eyebrow">The Release</p>
      <p className="wi-body">
        a deeper version of Mind Racing.<br />
        this opens in the next update.
      </p>
    </div>
  );
}
