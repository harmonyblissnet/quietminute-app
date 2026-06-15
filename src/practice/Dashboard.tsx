import { useEffect, useState } from "react";
import { todaysPrompt } from "./data";
import { recordVisit, isUpsellDismissed, dismissUpsell } from "./practiceStorage";
import { useT, T } from "../i18n/LanguageContext";

type Screen = "breathing" | "release" | "calendar";

const cardIds: Screen[] = ["breathing", "release", "calendar"];

export function Dashboard({
  onOpen,
  onExit,
}: {
  onOpen: (screen: Screen) => void;
  onExit: () => void;
}) {
  const { t } = useT();
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
      <button className="btn-back practice-back" onClick={onExit}>{t("common.backFree")}</button>

      <span className="practice-mark">✦</span>
      <p className="practice-eyebrow">The Daily Practice</p>
      {/* The daily prompt is core content — kept in English for now. */}
      <p className="dash-prompt">{todaysPrompt()}</p>

      <div className="practice-rule" />

      <div className="dash-cards">
        {cardIds.map((id) => (
          <button key={id} className="mode-card" onClick={() => onOpen(id)}>
            <span className="mode-icon">◇</span>
            <div>
              <p className="mode-label">{t(`dash.${id}.label`)}</p>
              <p className="mode-sub">{t(`dash.${id}.sub`)}</p>
            </div>
          </button>
        ))}
      </div>

      {showUpsell && (
        <div className="dash-upsell">
          <p><T k="dash.upsell" /></p>
          <div className="dash-upsell-row">
            <a className="btn-deeper" href="https://naomietnel.com" target="_blank" rel="noreferrer">
              {t("dash.learnMore")}
            </a>
            <button className="dash-upsell-close" onClick={closeUpsell}>{t("dash.dismiss")}</button>
          </div>
        </div>
      )}
    </div>
  );
}
