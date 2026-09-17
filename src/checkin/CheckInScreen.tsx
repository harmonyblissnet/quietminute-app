import { useState } from "react";
import { useT } from "../i18n/LanguageContext";
import { MOODS, ENERGY } from "./data";
import { checkinToday } from "./checkinStorage";
import type { CheckIn, Energy } from "./checkinStorage";

const MAX_MOODS = 2;

export function CheckInScreen({
  onSubmit,
  onBack,
  onHistory,
}: {
  onSubmit: (entry: CheckIn) => void;
  onBack: () => void;
  onHistory: () => void;
}) {
  const { t } = useT();
  const [moods, setMoods] = useState<string[]>([]);
  const [feeling, setFeeling] = useState("");
  const [energy, setEnergy] = useState<Energy | null>(null);
  const [note, setNote] = useState("");

  function toggleMood(id: string) {
    setMoods((cur) =>
      cur.includes(id)
        ? cur.filter((m) => m !== id)
        : cur.length < MAX_MOODS
          ? [...cur, id]
          : cur,
    );
  }

  const canSubmit = moods.length > 0 || feeling.trim().length > 0;

  function submit() {
    if (!canSubmit) return;
    onSubmit({
      date: checkinToday(),
      moods,
      feeling: feeling.trim() || undefined,
      energy: energy ?? undefined,
      note: note.trim() || undefined,
      ts: Date.now(),
    });
  }

  return (
    <div className="checkin">
      <button className="btn-back practice-back" onClick={onBack}>{t("common.back")}</button>

      <p className="practice-eyebrow">{t("checkin.eyebrow")}</p>
      <h2 className="flow-title">{t("checkin.question")}</h2>

      <div className="chip-grid">
        {MOODS.map((id) => (
          <button
            key={id}
            type="button"
            className={`chip${moods.includes(id) ? " is-on" : ""}`}
            onClick={() => toggleMood(id)}
          >
            {t(`checkin.mood.${id}`)}
          </button>
        ))}
      </div>
      <p className="checkin-hint">{t("checkin.moodHint")}</p>

      <input
        className="modal-input"
        type="text"
        placeholder={t("checkin.feeling")}
        value={feeling}
        onChange={(e) => setFeeling(e.target.value)}
      />

      <p className="checkin-label">{t("checkin.energy")}</p>
      <div className="energy-row">
        {ENERGY.map((id) => (
          <button
            key={id}
            type="button"
            className={`chip${energy === id ? " is-on" : ""}`}
            onClick={() => setEnergy((cur) => (cur === id ? null : id))}
          >
            {t(`checkin.energy.${id}`)}
          </button>
        ))}
      </div>

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder={t("checkin.note")}
        style={{ minHeight: 90 }}
      />

      <button className="btn-primary" disabled={!canSubmit} onClick={submit}>
        {t("checkin.submit")}
      </button>
      <button className="btn-link" onClick={onHistory}>{t("checkin.history")}</button>
    </div>
  );
}
