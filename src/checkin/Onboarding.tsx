import { useT, T } from "../i18n/LanguageContext";

// One quiet screen, shown once (first time), before the check-in.
export function Onboarding({ onBegin }: { onBegin: () => void }) {
  const { t } = useT();
  return (
    <div className="checkin">
      <span className="practice-mark">✦</span>
      <h2 className="flow-title">{t("checkin.onboard.title")}</h2>
      <p className="flow-body"><T k="checkin.onboard.body" /></p>
      <p className="checkin-privacy"><T k="checkin.onboard.privacy" /></p>
      <button className="btn-primary" onClick={onBegin}>{t("checkin.onboard.begin")}</button>
    </div>
  );
}
