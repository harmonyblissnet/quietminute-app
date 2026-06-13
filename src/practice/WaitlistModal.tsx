import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useT, T } from "../i18n/LanguageContext";

type Status = "idle" | "busy" | "done" | "error";

// Pre-launch waitlist. Posts the email to /api/waitlist (a serverless function
// that adds it to the MailerLite list — the API key stays server-side).
export function WaitlistModal({ onClose }: { onClose: () => void }) {
  const { t } = useT();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Close on Escape.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (status === "busy") return;
    setStatus("busy");
    setErrorMsg(null);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (res.ok) {
        setStatus("done");
        return;
      }
      const data = (await res.json().catch(() => null)) as
        | { error?: string; code?: number | string }
        | null;
      const code = data?.code ? ` (${data.code})` : "";
      setErrorMsg((data?.error ?? t("wl.error")) + code);
      setStatus("error");
    } catch {
      setErrorMsg(t("wl.error"));
      setStatus("error");
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label={t("wl.close")}>×</button>
        <span className="modal-mark">✦</span>

        {status === "done" ? (
          <>
            <h2 className="modal-title">{t("wl.doneTitle")}</h2>
            <p className="modal-body"><T k="wl.doneBody" /></p>
            <button className="btn-primary" onClick={onClose}>{t("wl.close")}</button>
          </>
        ) : (
          <>
            <h2 className="modal-title"><T k="wl.title" /></h2>
            <p className="modal-body"><T k="wl.body1" /></p>
            <p className="modal-body">{t("wl.body2")}</p>
            <form className="modal-form" onSubmit={submit}>
              <input
                className="modal-input"
                type="email"
                required
                autoComplete="email"
                placeholder={t("wl.placeholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button className="btn-primary" type="submit" disabled={status === "busy"}>
                {status === "busy" ? t("wl.busy") : t("wl.submit")}
              </button>
            </form>
            {status === "error" && errorMsg && <p className="modal-error">{errorMsg}</p>}
            <p className="modal-foot">{t("wl.foot")}</p>
          </>
        )}
      </div>
    </div>
  );
}
