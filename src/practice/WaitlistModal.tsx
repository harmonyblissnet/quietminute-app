import { useEffect, useState } from "react";
import type { FormEvent } from "react";

type Status = "idle" | "busy" | "done" | "error";

// Pre-launch waitlist. Posts the email to /api/waitlist (a serverless function
// that adds it to the MailerLite list — the API key stays server-side).
export function WaitlistModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

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
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (!res.ok) throw new Error();
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="close">×</button>
        <span className="modal-mark">✦</span>

        {status === "done" ? (
          <>
            <h2 className="modal-title">You're on the list.</h2>
            <p className="modal-body">
              I'll write to you when The Daily Practice opens.<br />
              Until then — the four free modes are always here.
            </p>
            <button className="btn-primary" onClick={onClose}>close</button>
          </>
        ) : (
          <>
            <h2 className="modal-title">Something quiet<br />is on its way.</h2>
            <p className="modal-body">
              The Daily Practice is almost ready —<br />
              a deeper space to come home to.
            </p>
            <p className="modal-body">
              Leave your email and you'll be the first to know when it opens.
              No spam. Just one quiet message.
            </p>
            <form className="modal-form" onSubmit={submit}>
              <input
                className="modal-input"
                type="email"
                required
                autoComplete="email"
                placeholder="your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button className="btn-primary" type="submit" disabled={status === "busy"}>
                {status === "busy" ? "one moment…" : "notify me →"}
              </button>
            </form>
            {status === "error" && (
              <p className="modal-error">something didn't go through. please try again in a moment.</p>
            )}
            <p className="modal-foot">The rest of The Quiet Minute is always free.</p>
          </>
        )}
      </div>
    </div>
  );
}
