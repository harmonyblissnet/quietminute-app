import { getVisitDates, todayKey } from "./practiceStorage";
import { useT } from "../i18n/LanguageContext";
import type { Lang } from "../i18n/translations";

const LOCALES: Record<Lang, string> = {
  en: "en-US",
  nl: "nl-NL",
  de: "de-DE",
  fr: "fr-FR",
  es: "es-ES",
};

export function SilentCalendar({ onBack }: { onBack: () => void }) {
  const { t, lang } = useT();
  const locale = LOCALES[lang];
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const monthName = now.toLocaleString(locale, { month: "long" });
  const firstDow = new Date(year, month, 1).getDay(); // 0 = Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const marked = getVisitDates();
  const today = todayKey(now);

  // Localized one-letter weekday headers, starting Sunday (Jan 1 2023 = Sunday).
  const narrow = new Intl.DateTimeFormat(locale, { weekday: "narrow" });
  const dow = Array.from({ length: 7 }, (_, i) => narrow.format(new Date(2023, 0, 1 + i)));

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
      <button className="btn-back practice-back" onClick={onBack}>{t("common.back")}</button>
      <p className="practice-eyebrow">{t("cal.title")}</p>
      <p className="cal-month">{monthName} {year}</p>
      <div className="cal-grid">
        {dow.map((d, i) => (
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
