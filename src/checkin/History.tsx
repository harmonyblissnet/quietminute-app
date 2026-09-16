import { useState } from "react";
import { useT } from "../i18n/LanguageContext";
import type { Lang } from "../i18n/translations";
import { getCheckIns, clearCheckIns } from "./checkinStorage";

const LOCALES: Record<Lang, string> = {
  en: "en-US",
  nl: "nl-NL",
  de: "de-DE",
  fr: "fr-FR",
  es: "es-ES",
};

export function History({ onBack }: { onBack: () => void }) {
  const { t, lang } = useT();
  const [entries, setEntries] = useState(() => getCheckIns().slice().reverse());
  const [confirming, setConfirming] = useState(false);
  const locale = LOCALES[lang];

  function fmt(date: string) {
    const [y, m, d] = date.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString(locale, {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  }

  function clearAll() {
    clearCheckIns();
    setEntries([]);
    setConfirming(false);
  }

  return (
    <div className="checkin">
      <button className="btn-back practice-back" onClick={onBack}>{t("common.back")}</button>
      <p className="practice-eyebrow">{t("checkin.historyTitle")}</p>

      {entries.length === 0 ? (
        <p className="flow-body">{t("checkin.empty")}</p>
      ) : (
        <div className="history-list">
          {entries.map((c) => {
            const line = [
              ...c.moods.map((m) => t(`checkin.mood.${m}`)),
              ...(c.feeling ? [c.feeling] : []),
            ];
            if (c.energy) line.push(t(`checkin.energy.${c.energy}`));
            return (
              <div className="history-item" key={c.date}>
                <p className="history-date">{fmt(c.date)}</p>
                <p className="history-moods">{line.join(" · ")}</p>
                {c.note && <p className="history-note">{c.note}</p>}
              </div>
            );
          })}
        </div>
      )}

      {entries.length > 0 && !confirming && (
        <button className="btn-link" onClick={() => setConfirming(true)}>{t("checkin.clear")}</button>
      )}
      {confirming && (
        <div className="clear-confirm">
          <p className="checkin-privacy">{t("checkin.clearConfirm")}</p>
          <div className="clear-row">
            <button className="btn-ghost" onClick={() => setConfirming(false)}>{t("checkin.clearCancel")}</button>
            <button className="btn-primary" onClick={clearAll}>{t("checkin.clearYes")}</button>
          </div>
        </div>
      )}
    </div>
  );
}
