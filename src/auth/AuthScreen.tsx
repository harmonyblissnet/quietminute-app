import { useState } from "react";
import type { FormEvent } from "react";
import { palette } from "../theme";
import { useAuth } from "./AuthContext";

// Auth-specific styles. Shared chrome (.btn-primary, .flow-eyebrow, .flow-title,
// the fadeIn keyframe) comes from the global stylesheet injected by App.
const authCss = `
  .auth { width: 100%; max-width: 360px; display: flex; flex-direction: column; align-items: center; gap: 22px; animation: fadeIn 0.5s ease; }
  .auth-head { text-align: center; }
  .auth-tabs { display: flex; gap: 4px; background: ${palette.bgCard}; border: 1px solid ${palette.border}; border-radius: 40px; padding: 4px; }
  .auth-tab { border: none; background: none; padding: 9px 22px; border-radius: 40px; font-family: 'Jost', sans-serif; font-size: 12px; letter-spacing: 0.05em; color: ${palette.textLight}; cursor: pointer; transition: all 0.2s; }
  .auth-tab.is-active { background: #fff; color: ${palette.accent}; box-shadow: 0 2px 8px ${palette.accentGlow}; }
  .auth-form { display: flex; flex-direction: column; gap: 12px; width: 100%; }
  .auth-input { width: 100%; background: #fff; border: 1px solid ${palette.border}; border-radius: 14px; color: ${palette.textDark}; font-size: 15px; font-family: 'Jost', sans-serif; font-weight: 300; padding: 14px 16px; outline: none; transition: border-color 0.25s, box-shadow 0.25s; }
  .auth-input:focus { border-color: ${palette.accentLight}; box-shadow: 0 0 0 3px ${palette.accentSoft}44; }
  .auth-input::placeholder { color: ${palette.accentSoft}; }
  .auth-switch { font-size: 12px; color: ${palette.textLight}; text-align: center; font-weight: 300; }
  .auth-switch button { background: none; border: none; color: ${palette.accentLight}; cursor: pointer; font-family: 'Jost', sans-serif; font-size: 12px; text-decoration: underline; text-underline-offset: 3px; padding: 0; }
  .auth-switch button:hover { color: ${palette.accent}; }
  .auth-notice { font-size: 13.5px; line-height: 1.6; text-align: center; font-family: 'Cormorant Garamond', serif; max-width: 300px; }
  .auth-notice.info { color: ${palette.textMid}; }
  .auth-notice.error { color: #9A3B2F; }
  .auth-foot { font-size: 11px; color: ${palette.textLight}; text-align: center; font-style: italic; font-family: 'Cormorant Garamond', serif; line-height: 1.7; max-width: 280px; }
`;

type Tab = "magic" | "password";
type Notice = { kind: "info" | "error"; text: string };

export function AuthScreen() {
  const { signInWithMagicLink, signInWithPassword, signUpWithPassword } = useAuth();
  const [tab, setTab] = useState<Tab>("magic");
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);

  const isMagic = tab === "magic";

  function switchTab(next: Tab) {
    setTab(next);
    setNotice(null);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    setNotice(null);
    setBusy(true);
    try {
      if (isMagic) {
        const { error } = await signInWithMagicLink(email.trim());
        setNotice(
          error
            ? { kind: "error", text: error }
            : { kind: "info", text: "check your inbox — a sign-in link is on its way." },
        );
      } else if (isSignUp) {
        const { error, needsConfirmation } = await signUpWithPassword(email.trim(), password);
        if (error) setNotice({ kind: "error", text: error });
        else if (needsConfirmation)
          setNotice({ kind: "info", text: "check your inbox to confirm your account." });
        // Otherwise the session updates and this screen is replaced automatically.
      } else {
        const { error } = await signInWithPassword(email.trim(), password);
        if (error) setNotice({ kind: "error", text: error });
        // On success the session updates and this screen is replaced automatically.
      }
    } finally {
      setBusy(false);
    }
  }

  const cta = isMagic ? "send me a link" : isSignUp ? "create account" : "sign in";

  return (
    <div className="auth">
      <style>{authCss}</style>

      <div className="auth-head">
        <p className="flow-eyebrow">The Quiet Minute · members</p>
        <h2 className="flow-title">Come inside.</h2>
      </div>

      <div className="auth-tabs">
        <button
          type="button"
          className={`auth-tab ${isMagic ? "is-active" : ""}`}
          onClick={() => switchTab("magic")}
        >
          magic link
        </button>
        <button
          type="button"
          className={`auth-tab ${!isMagic ? "is-active" : ""}`}
          onClick={() => switchTab("password")}
        >
          password
        </button>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          className="auth-input"
          type="email"
          required
          autoComplete="email"
          placeholder="your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {!isMagic && (
          <input
            className="auth-input"
            type="password"
            required
            minLength={6}
            autoComplete={isSignUp ? "new-password" : "current-password"}
            placeholder="your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        )}
        <button className="btn-primary" type="submit" disabled={busy}>
          {busy ? "one moment…" : cta}
        </button>
      </form>

      {notice && <p className={`auth-notice ${notice.kind}`}>{notice.text}</p>}

      {isMagic ? (
        <p className="auth-foot">
          no password needed — we'll email you a link that signs you in.
        </p>
      ) : (
        <p className="auth-switch">
          {isSignUp ? "already have an account? " : "new here? "}
          <button type="button" onClick={() => { setIsSignUp((v) => !v); setNotice(null); }}>
            {isSignUp ? "sign in" : "create one"}
          </button>
        </p>
      )}
    </div>
  );
}
