import { getVisitDates, todayKey } from "./practiceStorage";

const DOW = ["S", "M", "T", "W", "T", "F", "S"];

export function SilentCalendar({ onBack }: { onBack: () => void }) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const monthName = now.toLocaleString("en-US", { month: "long" });
  const firstDow = new Date(year, month, 1).getDay(); // 0 = Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const marked = getVisitDates();
  const today = todayKey(now);

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  function keyFor(day: number) {
    const m = String(month + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    return `${year}-${m}-${dd}`;
  }

  return (
    <div className="practice cal">
      <button className="btn-back practice-back" onClick={onBack}>← back</button>
      <p className="practice-eyebrow">The days you came back</p>
      <p className="cal-month">{monthName} {year}</p>
      <div className="cal-grid">
        {DOW.map((d, i) => (
          <div className="cal-dow" key={`dow-${i}`}>{d}</div>
        ))}
        {cells.map((d, i) => {
          if (d === null) return <div key={`pad-${i}`} />;
          const k = keyFor(d);
          const cls =
            "cal-cell" + (marked.has(k) ? " is-marked" : "") + (k === today ? " is-today" : "");
          return (
            <div className={cls} key={k}>
              {d}
            </div>
          );
        })}
      </div>
    </div>
  );
}
