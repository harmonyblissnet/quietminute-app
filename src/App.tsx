import { useState, useEffect, useRef } from "react";
import { palette } from "./theme";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import { DailyPracticeRoot } from "./practice/DailyPracticeRoot";
import { WaitlistModal } from "./practice/WaitlistModal";
import { dailyPracticeLaunched } from "./practice/config";
import { PrivacyStatement } from "./PrivacyStatement";
import { LanguageProvider, useT, T } from "./i18n/LanguageContext";
import { LanguageSwitcher } from "./i18n/LanguageSwitcher";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: ${palette.bg}; font-family: 'Jost', sans-serif; color: ${palette.textDark}; -webkit-font-smoothing: antialiased; }
  #root { width: 100%; }

  .page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 64px 24px 80px;
  }

  .page-header {
    text-align: center;
    margin-bottom: 48px;
  }
  .page-eyebrow {
    font-size: 10px; font-weight: 400; letter-spacing: 0.36em; text-transform: uppercase;
    color: ${palette.accent}; margin-bottom: 16px;
  }
  .page-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(32px, 5vw, 52px);
    font-weight: 300; color: ${palette.textDark}; line-height: 1.2;
    margin-bottom: 16px;
  }
  .page-sub {
    font-size: 15px; font-weight: 300; color: ${palette.textMid};
    line-height: 1.85; max-width: 380px; margin: 0 auto;
  }
  .page-divider {
    width: 40px; height: 1px; margin: 24px auto 0;
    background: linear-gradient(90deg, transparent, ${palette.accentLight}, transparent);
  }

  .home { display: flex; flex-direction: column; align-items: center; gap: 44px; width: 100%; max-width: 360px; }
  .home-header { text-align: center; }
  .eyebrow { font-size: 10px; font-weight: 400; letter-spacing: 0.28em; text-transform: uppercase; color: ${palette.accent}; margin-bottom: 16px; }
  .home-title { font-family: 'Cormorant Garamond', serif; font-size: 34px; font-weight: 300; color: ${palette.textDark}; line-height: 1.35; }
  .gold-line { width: 40px; height: 1px; background: linear-gradient(90deg, transparent, ${palette.accentLight}, transparent); margin: 0 auto; }
  .mode-list { display: flex; flex-direction: column; gap: 10px; width: 100%; }
  .mode-card { background: #fff; border: 1px solid ${palette.border}; border-radius: 16px; padding: 18px 22px; cursor: pointer; display: flex; align-items: center; gap: 16px; text-align: left; transition: all 0.25s ease; width: 100%; position: relative; overflow: hidden; }
  .mode-card::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: linear-gradient(180deg, ${palette.accentSoft}, ${palette.accent}); opacity: 0; transition: opacity 0.25s; border-radius: 16px 0 0 16px; }
  .mode-card:hover::before { opacity: 1; }
  .mode-card:hover { background: #fffdf8; border-color: ${palette.accentLight}; transform: translateY(-1px); box-shadow: 0 6px 24px ${palette.accentGlow}; }
  .mode-icon { font-size: 16px; color: ${palette.accent}; min-width: 24px; text-align: center; }
  .mode-label { font-family: 'Cormorant Garamond', serif; font-size: 17px; font-weight: 400; color: ${palette.textDark}; margin-bottom: 2px; }
  .mode-sub { font-size: 12px; font-weight: 300; color: ${palette.textLight}; letter-spacing: 0.03em; }
  .flow { display: flex; flex-direction: column; align-items: center; gap: 28px; padding: 24px 0; width: 100%; max-width: 360px; animation: fadeIn 0.5s ease; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  .flow-eyebrow { font-size: 10px; letter-spacing: 0.24em; text-transform: uppercase; color: ${palette.accent}; font-weight: 400; text-align: center; }
  .flow-title { font-family: 'Cormorant Garamond', serif; font-size: 26px; font-weight: 300; color: ${palette.textDark}; line-height: 1.5; text-align: center; }
  .flow-body { font-size: 14px; font-weight: 300; color: ${palette.textMid}; line-height: 1.78; text-align: center; }
  .btn-primary { background: linear-gradient(135deg, ${palette.accentLight}, ${palette.accent}); color: #fff; border: none; border-radius: 40px; padding: 14px 40px; font-family: 'Jost', sans-serif; font-size: 13px; font-weight: 400; letter-spacing: 0.08em; cursor: pointer; transition: all 0.25s; box-shadow: 0 4px 16px ${palette.accentGlow}; }
  .btn-primary:hover { background: linear-gradient(135deg, ${palette.accent}, ${palette.accentHover}); transform: translateY(-1px); }
  .btn-primary:disabled { background: ${palette.border}; box-shadow: none; cursor: default; transform: none; }
  .btn-ghost { background: none; border: 1px solid ${palette.cardBorder}; border-radius: 40px; padding: 12px 32px; font-family: 'Jost', sans-serif; font-size: 13px; font-weight: 300; color: ${palette.textMid}; cursor: pointer; transition: all 0.2s; }
  .btn-ghost:hover { border-color: ${palette.accentLight}; color: ${palette.accent}; }
  .btn-deeper { background: none; border: none; font-size: 12px; letter-spacing: 0.06em; color: ${palette.accentLight}; cursor: pointer; font-family: 'Jost', sans-serif; font-weight: 300; padding: 4px 0; transition: color 0.2s; text-decoration: underline; text-underline-offset: 3px; }
  .btn-deeper:hover { color: ${palette.accent}; }
  .btn-back { background: none; border: none; font-size: 11px; letter-spacing: 0.12em; color: ${palette.accentSoft}; cursor: pointer; font-family: 'Jost', sans-serif; font-weight: 300; text-transform: uppercase; padding: 4px 0; transition: color 0.2s; }
  .btn-back:hover { color: ${palette.textMid}; }
  textarea { width: 100%; min-height: 140px; background: #fff; border: 1px solid ${palette.border}; border-radius: 14px; color: ${palette.textDark}; font-size: 15px; font-family: 'Cormorant Garamond', serif; font-weight: 300; padding: 16px 18px; resize: none; outline: none; line-height: 1.7; transition: border-color 0.25s, box-shadow 0.25s; }
  textarea:focus { border-color: ${palette.accentLight}; box-shadow: 0 0 0 3px ${palette.accentSoft}44; }
  textarea::placeholder { color: ${palette.accentSoft}; }
  .privacy-note { font-size: 11px; color: ${palette.textLight}; letter-spacing: 0.04em; text-align: center; font-style: italic; font-family: 'Cormorant Garamond', serif; }
  .breath-wrap { display: flex; flex-direction: column; align-items: center; gap: 32px; }
  .breath-outer { position: relative; display: flex; align-items: center; justify-content: center; width: 180px; height: 180px; }
  @keyframes pulse-ring { 0% { transform: scale(1); opacity: 0.5; } 50% { transform: scale(1.22); opacity: 0.15; } 100% { transform: scale(1); opacity: 0.5; } }
  @keyframes pulse-ring-slow { 0% { transform: scale(1); opacity: 0.3; } 50% { transform: scale(1.38); opacity: 0.08; } 100% { transform: scale(1); opacity: 0.3; } }
  .pulse-ring-1 { position: absolute; border-radius: 50%; border: 1px solid ${palette.accentLight}; animation: pulse-ring 2.4s ease-in-out infinite; }
  .pulse-ring-2 { position: absolute; border-radius: 50%; border: 1px solid ${palette.accentSoft}; animation: pulse-ring-slow 2.4s ease-in-out infinite 0.4s; }
  .breath-circle { border-radius: 50%; background: radial-gradient(circle at 38% 32%, #fff8ee 0%, ${palette.accentSoft} 55%, ${palette.accentLight} 100%); border: 1px solid ${palette.accentLight}; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 2px; transition: width 1.3s ease-in-out, height 1.3s ease-in-out, box-shadow 1.3s ease-in-out; position: relative; z-index: 1; }
  .breath-count { font-family: 'Cormorant Garamond', serif; font-size: 32px; font-weight: 300; color: ${palette.textDark}; line-height: 1; }
  .breath-phase { font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; color: ${palette.accent}; font-weight: 400; }
  .final-icon { font-size: 34px; color: ${palette.accent}; filter: drop-shadow(0 2px 8px ${palette.accentGlow}); }
  .final-title { font-family: 'Cormorant Garamond', serif; font-size: 30px; font-weight: 300; color: ${palette.textDark}; text-align: center; line-height: 1.4; }
  .final-sub { font-size: 13px; color: ${palette.textLight}; font-style: italic; font-family: 'Cormorant Garamond', serif; text-align: center; }
  .final-actions { display: flex; flex-direction: column; align-items: center; gap: 12px; margin-top: 8px; }
  .action-grid { display: flex; flex-direction: column; gap: 8px; width: 100%; }
  .action-card { background: #fff; border: 1px solid ${palette.border}; border-radius: 12px; padding: 14px 18px; cursor: pointer; display: flex; align-items: center; gap: 14px; text-align: left; transition: all 0.2s; font-family: 'Cormorant Garamond', serif; font-size: 15px; color: ${palette.textDark}; font-weight: 300; width: 100%; }
  .action-card:hover { border-color: ${palette.accentLight}; background: ${palette.bgCard}; box-shadow: 0 2px 12px ${palette.accentGlow}; }
  .action-emoji { font-size: 18px; }

  .site-footer {
    margin-top: 64px;
    text-align: center;
    font-size: 11px;
    color: ${palette.border};
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }
  .site-footer a {
    color: ${palette.textLight};
    text-decoration: none;
    transition: color 0.2s;
  }
  .site-footer a:hover { color: ${palette.accent}; }

  /* members / premium */
  .enter-premium { display: flex; flex-direction: column; align-items: center; gap: 12px; margin-top: 8px; }
  .enter-premium-link { background: none; border: none; font-family: 'Cormorant Garamond', serif; font-size: 16px; font-weight: 400; color: ${palette.accent}; cursor: pointer; letter-spacing: 0.01em; padding: 4px; transition: color 0.2s; }
  .enter-premium-link:hover { color: ${palette.accentHover}; }
  .enter-premium-note { font-size: 11px; color: ${palette.textLight}; font-style: italic; font-family: 'Cormorant Garamond', serif; letter-spacing: 0.02em; }
  .account-bar { display: flex; align-items: center; justify-content: space-between; gap: 12px; width: 100%; font-size: 12px; color: ${palette.textLight}; background: ${palette.bgCard}; border: 1px solid ${palette.border}; border-radius: 12px; padding: 10px 14px; }
  .account-bar span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .btn-link { background: none; border: none; color: ${palette.accent}; cursor: pointer; font-family: 'Jost', sans-serif; font-size: 12px; letter-spacing: 0.04em; text-decoration: underline; text-underline-offset: 3px; padding: 0; white-space: nowrap; }
  .btn-link:hover { color: ${palette.accentHover}; }

  /* The Daily Practice */
  .practice { display: flex; flex-direction: column; align-items: center; gap: 22px; width: 100%; max-width: 380px; animation: fadeIn 0.5s ease; }
  .practice-back { align-self: flex-start; margin-bottom: 4px; }
  .practice-mark { font-size: 22px; color: ${palette.accent}; filter: drop-shadow(0 2px 8px ${palette.accentGlow}); }
  .practice-eyebrow { font-size: 10px; letter-spacing: 0.28em; text-transform: uppercase; color: ${palette.accent}; font-weight: 400; text-align: center; }
  .practice-rule { width: 48px; height: 1px; background: linear-gradient(90deg, transparent, ${palette.accentLight}, transparent); }
  .welcome { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; text-align: center; padding: 60px 12px; min-height: 260px; cursor: default; animation: fadeIn 0.8s ease; }
  .welcome-text { font-family: 'Cormorant Garamond', serif; font-size: 21px; font-weight: 300; color: ${palette.textDark}; line-height: 1.5; }
  .welcome-word { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 18px; color: ${palette.accent}; }
  .breath-guide { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 14px; color: ${palette.accent}; text-align: center; max-width: 280px; min-height: 21px; line-height: 1.5; }

  .wi-intro { font-family: 'Cormorant Garamond', serif; font-size: 19px; font-weight: 300; line-height: 1.6; color: ${palette.textDark}; text-align: center; }
  .wi-body { font-size: 14px; font-weight: 300; color: ${palette.textMid}; line-height: 1.8; text-align: center; }
  .wi-list { display: flex; flex-direction: column; gap: 16px; width: 100%; }
  .wi-item { display: flex; gap: 12px; align-items: flex-start; text-align: left; }
  .wi-ic { color: ${palette.accent}; font-size: 14px; line-height: 1.7; }
  .wi-item-title { font-family: 'Cormorant Garamond', serif; font-size: 16px; color: ${palette.textDark}; font-weight: 400; margin-bottom: 2px; }
  .wi-item-sub { font-size: 12.5px; color: ${palette.textLight}; font-weight: 300; line-height: 1.6; }
  .wi-forever { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 17px; color: ${palette.textMid}; text-align: center; }
  .wi-price { font-family: 'Cormorant Garamond', serif; font-size: 24px; color: ${palette.textDark}; font-weight: 400; }
  .wi-free { font-size: 11px; color: ${palette.textLight}; font-style: italic; font-family: 'Cormorant Garamond', serif; }
  .wi-note { font-size: 13px; color: ${palette.textMid}; font-family: 'Cormorant Garamond', serif; font-style: italic; text-align: center; }

  .dash-prompt { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 22px; line-height: 1.5; color: ${palette.textDark}; text-align: center; padding: 4px; }
  .dash-cards { display: flex; flex-direction: column; gap: 10px; width: 100%; }
  .dash-upsell { display: flex; flex-direction: column; align-items: center; gap: 10px; text-align: center; border-top: 1px solid ${palette.border}; padding-top: 20px; margin-top: 4px; width: 100%; }
  .dash-upsell p { font-size: 13px; color: ${palette.textMid}; font-style: italic; font-family: 'Cormorant Garamond', serif; line-height: 1.6; }
  .dash-upsell-row { display: flex; gap: 18px; align-items: center; }
  .dash-upsell-close { background: none; border: none; color: ${palette.textLight}; cursor: pointer; font-size: 11px; font-family: 'Jost', sans-serif; letter-spacing: 0.04em; }
  .dash-upsell-close:hover { color: ${palette.textMid}; }

  .cal { gap: 16px; }
  .cal-month { font-family: 'Cormorant Garamond', serif; font-size: 18px; color: ${palette.textDark}; }
  .cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; width: 100%; max-width: 300px; }
  .cal-dow { font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: ${palette.textLight}; text-align: center; padding-bottom: 4px; }
  .cal-cell { aspect-ratio: 1; display: flex; align-items: center; justify-content: center; font-size: 12px; color: ${palette.textLight}; font-family: 'Jost', sans-serif; border-radius: 50%; }
  .cal-cell.is-marked { color: ${palette.accent}; background: radial-gradient(circle, ${palette.accentSoft}66, transparent 70%); border: 1px solid ${palette.accentLight}; }
  .cal-cell.is-today { font-weight: 500; color: ${palette.textDark}; }

  .release-text { font-family: 'Cormorant Garamond', serif; font-size: 15px; font-weight: 300; color: ${palette.textMid}; line-height: 1.7; text-align: center; white-space: pre-wrap; max-height: 168px; overflow-y: auto; width: 100%; opacity: 1; transition: opacity 0.25s ease; }
  .release-text.is-fading { opacity: 0; transition: opacity 2s ease; }
  .release-question { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 20px; color: ${palette.textDark}; text-align: center; line-height: 1.5; }
  .release-hint { font-size: 12px; color: ${palette.textLight}; font-style: italic; font-family: 'Cormorant Garamond', serif; text-align: center; }
  .release-hold { touch-action: none; user-select: none; -webkit-user-select: none; }

  /* Pre-launch waitlist modal */
  .modal-overlay { position: fixed; inset: 0; background: rgba(42, 28, 16, 0.4); backdrop-filter: blur(2px); display: flex; align-items: center; justify-content: center; padding: 24px; z-index: 50; animation: fadeIn 0.3s ease; }
  .modal { position: relative; background: ${palette.bgCard}; border-radius: 22px; box-shadow: 0 24px 70px rgba(42, 28, 16, 0.28); padding: 40px 26px 30px; width: 100%; max-width: 380px; display: flex; flex-direction: column; align-items: center; gap: 16px; text-align: center; animation: fadeIn 0.4s ease; }
  .modal-close { position: absolute; top: 12px; right: 16px; background: none; border: none; font-size: 22px; line-height: 1; color: ${palette.textLight}; cursor: pointer; transition: color 0.2s; }
  .modal-close:hover { color: ${palette.textMid}; }
  .modal-mark { font-size: 22px; color: ${palette.accent}; filter: drop-shadow(0 2px 8px ${palette.accentGlow}); }
  .modal-title { font-family: 'Cormorant Garamond', serif; font-size: 27px; font-weight: 300; color: ${palette.textDark}; line-height: 1.3; }
  .modal-body { font-size: 14px; font-weight: 300; color: ${palette.textMid}; line-height: 1.8; }
  .modal-form { display: flex; flex-direction: column; gap: 12px; width: 100%; margin-top: 4px; }
  .modal-input { width: 100%; background: #fff; border: 1px solid ${palette.border}; border-radius: 14px; color: ${palette.textDark}; font-size: 15px; font-family: 'Jost', sans-serif; font-weight: 300; padding: 14px 16px; outline: none; transition: border-color 0.25s, box-shadow 0.25s; }
  .modal-input:focus { border-color: ${palette.accentLight}; box-shadow: 0 0 0 3px ${palette.accentSoft}44; }
  .modal-input::placeholder { color: ${palette.accentSoft}; }
  .modal-error { font-size: 12.5px; color: #9A3B2F; font-family: 'Cormorant Garamond', serif; font-style: italic; }
  .modal-foot { font-size: 11px; color: ${palette.textLight}; font-style: italic; font-family: 'Cormorant Garamond', serif; }

  /* Footer links + legal page */
  .footer-links { display: block; margin-top: 10px; }
  .footer-links a { margin: 0 2px; }
  .footer-kvk { display: block; margin-top: 8px; }
  .lang-switch { display: flex; gap: 10px; justify-content: center; margin-bottom: 16px; }
  .lang-btn { background: none; border: none; font-family: 'Jost', sans-serif; font-size: 10px; letter-spacing: 0.14em; color: ${palette.border}; cursor: pointer; padding: 2px 0; transition: color 0.2s; }
  .lang-btn:hover { color: ${palette.textLight}; }
  .lang-btn.is-active { color: ${palette.accent}; }
  .legal { width: 100%; max-width: 620px; text-align: left; animation: fadeIn 0.5s ease; }
  .legal h1 { font-family: 'Cormorant Garamond', serif; font-size: 30px; font-weight: 300; color: ${palette.textDark}; line-height: 1.3; margin-top: 8px; }
  .legal h2 { font-family: 'Cormorant Garamond', serif; font-size: 20px; font-weight: 400; color: ${palette.textDark}; margin: 26px 0 6px; }
  .legal p { font-size: 14px; font-weight: 300; color: ${palette.textMid}; line-height: 1.85; margin-bottom: 10px; }
  .legal strong { font-weight: 500; color: ${palette.textDark}; }
  .legal a { color: ${palette.accent}; text-decoration: underline; text-underline-offset: 3px; }
  .legal a:hover { color: ${palette.accentHover}; }
  .legal p.legal-meta { font-size: 12px; color: ${palette.textLight}; font-style: italic; font-family: 'Cormorant Garamond', serif; margin-bottom: 16px; }
  .legal-rule { height: 1px; background: linear-gradient(90deg, transparent, ${palette.accentLight}, transparent); margin: 44px 0 8px; }

  @media (max-width: 480px) {
    .page { padding: 48px 20px 64px; }
  }
`;

function BreathingCircle({ onComplete }: { onComplete: () => void }) {
  const { t } = useT();
  const [phase, setPhase] = useState("inhale");
  const [count, setCount] = useState(4);
  const phaseRef = useRef("inhale");
  const countRef = useRef(4);
  const cycleRef = useRef(0);

  useEffect(() => {
    const timer = setInterval(() => {
      countRef.current -= 1;
      if (countRef.current <= 0) {
        let nextPhase;
        if (phaseRef.current === "inhale") { nextPhase = "hold"; countRef.current = 4; }
        else if (phaseRef.current === "hold") { nextPhase = "exhale"; countRef.current = 4; }
        else {
          nextPhase = "inhale"; countRef.current = 4;
          cycleRef.current += 1;
          if (cycleRef.current >= 5) { clearInterval(timer); setTimeout(onComplete, 700); return; }
        }
        phaseRef.current = nextPhase;
        setPhase(nextPhase);
      }
      setCount(countRef.current);
    }, 1000);
    return () => clearInterval(timer);
  }, [onComplete]);

  const size = phase === "inhale" ? 134 : phase === "hold" ? 112 : 72;
  const glow = phase === "inhale" ? `0 0 48px ${palette.accentGlow}` : phase === "hold" ? `0 0 28px ${palette.accentGlow}` : `0 0 8px ${palette.accentGlow}`;
  const label = phase === "inhale" ? t("breath.in") : phase === "hold" ? t("breath.hold") : t("breath.out");

  return (
    <div className="breath-wrap">
      <div className="breath-outer">
        <div className="pulse-ring-2" style={{ width: size + 44, height: size + 44 }} />
        <div className="pulse-ring-1" style={{ width: size + 22, height: size + 22 }} />
        <div className="breath-circle" style={{ width: size, height: size, boxShadow: glow }}>
          <span className="breath-count">{count}</span>
          <span className="breath-phase">{label}</span>
        </div>
      </div>
    </div>
  );
}

function FinalActions({ onHome }: { onHome: () => void }) {
  const { t } = useT();
  return (
    <div className="final-actions">
      <a href="https://naomietnel.com" className="btn-deeper">{t("final.learnMore")}</a>
      <button className="btn-back" onClick={onHome}>{t("final.backHome")}</button>
    </div>
  );
}

function NoSpaceFlow({ onBack }: { onBack: () => void }) {
  const { t } = useT();
  const [step, setStep] = useState(0);
  const actions = [
    { icon: "☕", k: "ns.action.coffee" },
    { icon: "🌬️", k: "ns.action.breathe" },
    { icon: "🚪", k: "ns.action.outside" },
    { icon: "✦", k: "ns.action.own" },
  ];
  return (
    <div className="flow">
      {step === 0 && (<>
        <p className="flow-eyebrow">{t("ns.0.eyebrow")}</p>
        <h2 className="flow-title"><T k="ns.0.title" /></h2>
        <p className="flow-body"><T k="ns.0.body" /></p>
        <button className="btn-primary" onClick={() => setStep(1)}>{t("ns.0.cta")}</button>
        <button className="btn-back" onClick={onBack}>{t("common.back")}</button>
      </>)}
      {step === 1 && (<>
        <p className="flow-eyebrow">{t("ns.1.eyebrow")}</p>
        <p className="flow-body"><T k="ns.1.body" /></p>
        <BreathingCircle onComplete={() => setStep(2)} />
        <button className="btn-back" onClick={onBack}>{t("common.back")}</button>
      </>)}
      {step === 2 && (<>
        <p className="flow-eyebrow">{t("ns.2.eyebrow")}</p>
        <p className="flow-body"><T k="ns.2.body" /></p>
        <div className="action-grid">
          {actions.map((a) => (
            <button key={a.k} className="action-card" onClick={() => setStep(3)}>
              <span className="action-emoji">{a.icon}</span>{t(a.k)}
            </button>
          ))}
        </div>
        <button className="btn-back" onClick={onBack}>{t("common.back")}</button>
      </>)}
      {step === 3 && (<>
        <span className="final-icon">✦</span>
        <h2 className="final-title">{t("ns.3.title")}</h2>
        <p className="final-sub">{t("ns.3.sub")}</p>
        <FinalActions onHome={onBack} />
      </>)}
    </div>
  );
}

function HeadFullFlow({ onBack }: { onBack: () => void }) {
  const { t } = useT();
  const [step, setStep] = useState(0);
  const [text, setText] = useState("");
  return (
    <div className="flow">
      {step === 0 && (<>
        <p className="flow-eyebrow">{t("hf.0.eyebrow")}</p>
        <h2 className="flow-title"><T k="hf.0.title" /></h2>
        <p className="flow-body"><T k="hf.0.body" /></p>
        <button className="btn-primary" onClick={() => setStep(1)}>{t("hf.0.cta")}</button>
        <button className="btn-back" onClick={onBack}>{t("common.back")}</button>
      </>)}
      {step === 1 && (<>
        <p className="flow-body" style={{ fontStyle: "italic", fontFamily: "'Cormorant Garamond', serif" }}>
          {t("hf.1.prompt")}
        </p>
        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder={t("hf.1.placeholder")} />
        <p className="privacy-note"><T k="hf.1.privacy" /></p>
        <button className="btn-primary" onClick={() => setStep(2)} disabled={!text.trim()}>{t("hf.1.cta")}</button>
        <button className="btn-back" onClick={onBack}>{t("common.back")}</button>
      </>)}
      {step === 2 && (<>
        <p className="flow-eyebrow">{t("hf.2.eyebrow")}</p>
        <p className="flow-body"><T k="hf.2.body" /></p>
        <BreathingCircle onComplete={() => setStep(3)} />
        <button className="btn-back" onClick={onBack}>{t("common.back")}</button>
      </>)}
      {step === 3 && (<>
        <span className="final-icon">◈</span>
        <h2 className="final-title"><T k="hf.3.title" /></h2>
        <p className="final-sub">{t("hf.3.sub")}</p>
        <FinalActions onHome={onBack} />
      </>)}
    </div>
  );
}

function EndOfDayFlow({ onBack }: { onBack: () => void }) {
  const { t } = useT();
  const [step, setStep] = useState(0);
  const [gratitude, setGratitude] = useState("");
  const [thought, setThought] = useState("");
  return (
    <div className="flow">
      {step === 0 && (<>
        <p className="flow-eyebrow">{t("eod.0.eyebrow")}</p>
        <h2 className="flow-title"><T k="eod.0.title" /></h2>
        <p className="flow-body"><T k="eod.0.body" /></p>
        <textarea value={gratitude} onChange={(e) => setGratitude(e.target.value)} placeholder={t("eod.0.placeholder")} style={{ minHeight: 100 }} />
        <button className="btn-primary" onClick={() => setStep(1)} disabled={!gratitude.trim()}>{t("eod.0.cta")}</button>
        <button className="btn-back" onClick={onBack}>{t("common.back")}</button>
      </>)}
      {step === 1 && (<>
        <p className="flow-eyebrow">{t("eod.1.eyebrow")}</p>
        <h2 className="flow-title"><T k="eod.1.title" /></h2>
        <p className="flow-body"><T k="eod.1.body" /></p>
        <textarea value={thought} onChange={(e) => setThought(e.target.value)} placeholder={t("eod.1.placeholder")} style={{ minHeight: 100 }} />
        <button className="btn-primary" onClick={() => setStep(2)} disabled={!thought.trim()}>{t("eod.1.cta")}</button>
        <button className="btn-back" onClick={onBack}>{t("common.back")}</button>
      </>)}
      {step === 2 && (<>
        <p className="flow-eyebrow">{t("eod.2.eyebrow")}</p>
        <p className="flow-body"><T k="eod.2.body" /></p>
        <BreathingCircle onComplete={() => setStep(3)} />
        <button className="btn-back" onClick={onBack}>{t("common.back")}</button>
      </>)}
      {step === 3 && (<>
        <span className="final-icon">◯</span>
        <h2 className="final-title">{t("eod.3.title")}</h2>
        <p className="final-sub">{t("eod.3.sub")}</p>
        <FinalActions onHome={onBack} />
      </>)}
    </div>
  );
}

function JustBreatheFlow({ onBack }: { onBack: () => void }) {
  const { t } = useT();
  const [step, setStep] = useState(0);
  return (
    <div className="flow">
      {step === 0 && (<>
        <BreathingCircle onComplete={() => setStep(1)} />
        <button className="btn-back" onClick={onBack}>{t("common.back")}</button>
      </>)}
      {step === 1 && (<>
        <span className="final-icon">◌</span>
        <h2 className="final-title">{t("jb.title")}</h2>
        <p className="final-sub">{t("jb.sub")}</p>
        <FinalActions onHome={onBack} />
      </>)}
    </div>
  );
}

const modes = [
  { id: "no-space", icon: "✦" },
  { id: "head-full", icon: "◈" },
  { id: "end-of-day", icon: "◯" },
  { id: "just-breathe", icon: "◌" },
];

function QuietMinuteTool({ onEnterPremium }: { onEnterPremium: () => void }) {
  const { configured } = useAuth();
  const { t } = useT();
  const [selected, setSelected] = useState<string | null>(null);
  const goHome = () => setSelected(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", maxWidth: 380 }}>
      {!selected && (
        <div className="home">
          <div className="home-header">
            <p className="eyebrow">The Quiet Minute</p>
            <h2 className="home-title"><T k="home.title" /></h2>
          </div>
          <div className="gold-line" />
          <div className="mode-list">
            {modes.map((m) => (
              <button key={m.id} className="mode-card" onClick={() => setSelected(m.id)}>
                <span className="mode-icon">{m.icon}</span>
                <div>
                  <p className="mode-label">{t(`mode.${m.id}.label`)}</p>
                  <p className="mode-sub">{t(`mode.${m.id}.sub`)}</p>
                </div>
              </button>
            ))}
          </div>
          {(configured || !dailyPracticeLaunched) && (
            <div className="enter-premium">
              <div className="gold-line" />
              <button className="enter-premium-link" onClick={onEnterPremium}>
                {t("enter.link")}
              </button>
              <span className="enter-premium-note">{t("enter.note")}</span>
            </div>
          )}
        </div>
      )}
      {selected === "no-space" && <NoSpaceFlow onBack={goHome} />}
      {selected === "head-full" && <HeadFullFlow onBack={goHome} />}
      {selected === "end-of-day" && <EndOfDayFlow onBack={goHome} />}
      {selected === "just-breathe" && <JustBreatheFlow onBack={goHome} />}
    </div>
  );
}

function AppShell() {
  const { t } = useT();
  const [view, setView] = useState<"home" | "premium">("home");
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [hash, setHash] = useState(window.location.hash);

  // A tiny hash route so the privacy page has a shareable URL (/#privacy).
  useEffect(() => {
    const onHash = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  const showPrivacy = hash === "#privacy";

  // Before launch, the entry point opens the waitlist popup; once
  // VITE_DAILY_PRACTICE_LAUNCHED is "true", it opens the real members area.
  const enterPremium = () => {
    if (dailyPracticeLaunched) setView("premium");
    else setShowWaitlist(true);
  };

  return (
    <>
      <style>{css}</style>
      <div className="page">
        <header className="page-header">
          <p className="page-eyebrow">{t("header.eyebrow")}</p>
          <h1 className="page-title">The Quiet Minute</h1>
          <p className="page-sub">{t("header.sub")}</p>
          <div className="page-divider" />
        </header>
        {showPrivacy ? (
          <PrivacyStatement onBack={() => { window.location.hash = ""; }} />
        ) : view === "home" ? (
          <QuietMinuteTool onEnterPremium={enterPremium} />
        ) : (
          <DailyPracticeRoot onExit={() => setView("home")} />
        )}
        <footer className="site-footer">
          <LanguageSwitcher />
          {t("footer.by")} <a href="https://naomietnel.com">Naomi Etnel</a>
          <span className="footer-links">
            <a href="#privacy">{t("footer.privacy")}</a>
            <span aria-hidden="true"> · </span>
            <a href="mailto:hello@naomietnel.com">{t("footer.contact")}</a>
          </span>
          <span className="footer-kvk">KvK 42083997</span>
        </footer>
      </div>
      {showWaitlist && <WaitlistModal onClose={() => setShowWaitlist(false)} />}
    </>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </LanguageProvider>
  );
}
