import { useState } from "react";
import { PRICE } from "./data";
import { useT, T } from "../i18n/LanguageContext";

const items = ["prompt", "breathing", "release", "calendar"] as const;

// `onUnlock` is wired to Lemon Squeezy checkout in Phase 2. Until then the button
// shows a gentle note so the page is complete and reviewable.
export function WhatsInside({ onBack, onUnlock }: { onBack: () => void; onUnlock?: () => void }) {
  const { t } = useT();
  const [notice, setNotice] = useState<string | null>(null);

  function handleUnlock() {
    if (onUnlock) {
      onUnlock();
      return;
    }
    setNotice(t("wi.note"));
  }

  return (
    <div className="practice">
      <button className="btn-back practice-back" onClick={onBack}>{t("common.backFree")}</button>

      <span className="practice-mark">✦</span>
      <p className="wi-intro"><T k="wi.intro" /></p>
      <p className="wi-body"><T k="wi.body" /></p>

      <div className="practice-rule" />
      <p className="practice-eyebrow">{t("wi.inside")}</p>

      <div className="wi-list">
        {items.map((id) => (
          <div className="wi-item" key={id}>
            <span className="wi-ic">✦</span>
            <div>
              <p className="wi-item-title">{t(`wi.item.${id}.title`)}</p>
              <p className="wi-item-sub">{t(`wi.item.${id}.sub`)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="practice-rule" />
      <p className="wi-forever">{t("wi.forever")}</p>
      <p className="wi-price">{PRICE}</p>
      <button className="btn-primary" onClick={handleUnlock}>{t("wi.unlock")}</button>
      {notice && <p className="wi-note">{notice}</p>}
      <p className="wi-free">{t("wi.free")}</p>
    </div>
  );
}
