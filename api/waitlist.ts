// Vercel serverless function — adds a waitlist email to MailerLite.
//
// The MailerLite API key is read from a server-side env var (MAILERLITE_API_KEY)
// and never reaches the browser. Set these in Vercel → Settings → Environment
// Variables (NOT prefixed with VITE_):
//   MAILERLITE_API_KEY   — MailerLite → Integrations → API
//   MAILERLITE_GROUP_ID  — the "TQM Daily Practice Waitlist" group id
//
// The confirmation/welcome email is sent by a MailerLite automation triggered
// when a subscriber joins that group — no code needed here.

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const email = String(req.body?.email ?? "").trim();
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    res.status(400).json({ error: "Please enter a valid email." });
    return;
  }

  const apiKey = process.env.MAILERLITE_API_KEY;
  const groupId = process.env.MAILERLITE_GROUP_ID;
  if (!apiKey) {
    res.status(503).json({ error: "Waitlist is not configured yet." });
    return;
  }

  try {
    const r = await fetch("https://connect.mailerlite.com/api/subscribers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        email,
        ...(groupId ? { groups: [groupId] } : {}),
      }),
    });

    // MailerLite returns 200/201 for create/update; anything else is a failure.
    // Surface *why* (status + a short reason) so misconfiguration is diagnosable.
    if (r.status !== 200 && r.status !== 201) {
      const detail = await r.text().catch(() => "");
      console.error("MailerLite rejected:", r.status, detail.slice(0, 300));
      let message = "Couldn't reach the mailing list. Please try again.";
      if (r.status === 401 || r.status === 403) message = "The mailing list rejected the API key.";
      else if (r.status === 422) message = "The mailing list rejected the request — check the group id.";
      res.status(502).json({ error: message, code: r.status });
      return;
    }
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("waitlist function error:", err);
    res.status(502).json({ error: "Couldn't reach the mailing list.", code: "network" });
  }
}
