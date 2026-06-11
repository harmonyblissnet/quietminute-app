// The Quiet Minute — privacy statement. Reachable at /#privacy and from the
// footer. English first, Dutch below (the app itself is English).
//
// NOTE for Naomi — please confirm/adjust before relying on this:
//   • the controller name ("Naomi Etnel" — add a business/KvK number if you have one)
//   • the "last updated" date
//   • the analytics sentence — keep it only if you enable Vercel Web Analytics;
//     otherwise delete that one line in both languages.
// It's an honest, GDPR-minded draft, not formal legal advice — a quick glance
// from a lawyer is wise for full coverage.

const CONTACT = "hello@naomietnel.com";
const UPDATED_EN = "Last updated: 11 June 2026";
const UPDATED_NL = "Laatst bijgewerkt: 11 juni 2026";

export function PrivacyStatement({ onBack }: { onBack: () => void }) {
  return (
    <div className="legal">
      <button className="btn-back" onClick={onBack}>← back</button>

      <h1>Privacy &amp; your data</h1>
      <p className="legal-meta">{UPDATED_EN}</p>
      <p>
        The Quiet Minute (thequietminute.app) is a small mindfulness practice by
        Naomi Etnel. This page explains, in plain language, what happens with
        your data. The short version: the words you write in the exercises never
        leave your device.
      </p>

      <h2>What you write in the exercises is never saved</h2>
      <p>
        Anything you type inside a practice — what's on your mind, what you're
        letting go of, what you're grateful for — lives only in your browser, for
        that moment. It is never sent to us, never stored, never logged, and
        never shared. When you leave the screen, it's gone. There is no analytics
        or tracking on the content of your practice. This is the heart of The
        Quiet Minute, and we won't break it.
      </p>

      <h2>The only data we process</h2>
      <p>
        <strong>A members account (optional).</strong> If you create an account,
        we store your email address and what's needed to sign you in, through
        Supabase (our authentication and database provider). We use it only to
        give you access to your account.
      </p>
      <p>
        <strong>The waitlist (optional).</strong> If you join the waitlist for
        The Daily Practice, we store your email address so we can tell you when
        it opens, through MailerLite. You can unsubscribe anytime via the link in
        any email.
      </p>
      <p>
        <strong>Payments (when available).</strong> When the paid layer opens,
        payments are handled by Lemon Squeezy, acting as Merchant of Record (the
        seller on record). They process your payment securely; we receive
        confirmation of your purchase, not your card details.
      </p>
      <p>
        <strong>Running the site.</strong> The site is hosted by Vercel. As with
        any website, their servers process basic technical information (such as
        your IP address and browser) to deliver and secure the site. We may use
        privacy-friendly, cookieless analytics to count visits — this records no
        personal data and does not profile you.
      </p>

      <h2>Cookies</h2>
      <p>
        We use no advertising or cross-site tracking cookies. If you sign in, a
        small amount of functional storage keeps you signed in — nothing more.
      </p>

      <h2>Who processes data for us</h2>
      <p>
        Supabase (accounts), MailerLite (waitlist), Vercel (hosting), and Lemon
        Squeezy (payments). Each is bound to protect your data and has its own
        privacy policy.
      </p>

      <h2>Your rights</h2>
      <p>
        You can ask to see the data we hold about you, correct it, delete it, or
        stop its use, and withdraw consent at any time. Just email{" "}
        <a href={`mailto:${CONTACT}`}>{CONTACT}</a> and we'll take care of it. If
        you're in the EU/EEA and aren't satisfied, you may complain to your data
        protection authority (in the Netherlands, the Autoriteit
        Persoonsgegevens).
      </p>

      <h2>Keeping your data</h2>
      <p>
        We keep your waitlist email until you unsubscribe or we close the list,
        and your account data for as long as you have an account. Ask us to
        delete it sooner and we will.
      </p>

      <h2>Children</h2>
      <p>The Quiet Minute isn't directed at children under 16.</p>

      <h2>Changes</h2>
      <p>If this statement changes, we'll update the date above.</p>

      <h2>Contact</h2>
      <p>
        Naomi Etnel — <a href={`mailto:${CONTACT}`}>{CONTACT}</a>
      </p>

      <div className="legal-rule" />

      <div lang="nl">
        <h1>Privacy &amp; je gegevens</h1>
        <p className="legal-meta">{UPDATED_NL}</p>
        <p>
          The Quiet Minute (thequietminute.app) is een kleine mindfulness-praktijk
          van Naomi Etnel. Deze pagina legt in gewone taal uit wat er met je
          gegevens gebeurt. Kort gezegd: wat je in de oefeningen schrijft, verlaat
          je apparaat nooit.
        </p>

        <h2>Wat je in de oefeningen schrijft, wordt nooit opgeslagen</h2>
        <p>
          Alles wat je in een oefening typt — wat je bezighoudt, wat je loslaat,
          waar je dankbaar voor bent — bestaat alleen in je browser, voor dat
          moment. Het wordt nooit naar ons verstuurd, nooit opgeslagen, nooit
          gelogd en nooit gedeeld. Sluit je het scherm, dan is het weg. Er is geen
          analyse of tracking op de inhoud van je oefening. Dit is het hart van
          The Quiet Minute, en die belofte breken we niet.
        </p>

        <h2>De enige gegevens die we verwerken</h2>
        <p>
          <strong>Een ledenaccount (optioneel).</strong> Maak je een account, dan
          bewaren we je e-mailadres en wat nodig is om je in te loggen, via
          Supabase (onze provider voor authenticatie en database). We gebruiken
          het alleen om je toegang te geven tot je account.
        </p>
        <p>
          <strong>De wachtlijst (optioneel).</strong> Schrijf je je in voor de
          wachtlijst van The Daily Practice, dan bewaren we je e-mailadres om je
          te laten weten wanneer het opengaat, via MailerLite. Je kunt je altijd
          uitschrijven via de link in elke e-mail.
        </p>
        <p>
          <strong>Betalingen (zodra beschikbaar).</strong> Als de betaalde laag
          opengaat, verlopen betalingen via Lemon Squeezy, dat optreedt als
          Merchant of Record (de officiële verkoper). Zij verwerken je betaling
          veilig; wij ontvangen een bevestiging van je aankoop, niet je
          kaartgegevens.
        </p>
        <p>
          <strong>De site draaiende houden.</strong> De site wordt gehost door
          Vercel. Zoals bij elke website verwerken hun servers basale technische
          gegevens (zoals je IP-adres en browser) om de site te tonen en te
          beveiligen. We gebruiken mogelijk privacyvriendelijke, cookieloze
          statistieken om bezoeken te tellen — dit legt geen persoonsgegevens vast
          en maakt geen profiel van je.
        </p>

        <h2>Cookies</h2>
        <p>
          We gebruiken geen advertentie- of trackingcookies. Log je in, dan wordt
          een klein beetje functionele opslag gebruikt om je ingelogd te houden —
          meer niet.
        </p>

        <h2>Wie gegevens voor ons verwerkt</h2>
        <p>
          Supabase (accounts), MailerLite (wachtlijst), Vercel (hosting) en Lemon
          Squeezy (betalingen). Elk is verplicht je gegevens te beschermen en
          heeft een eigen privacybeleid.
        </p>

        <h2>Je rechten</h2>
        <p>
          Je kunt vragen welke gegevens we van je hebben, ze laten corrigeren of
          verwijderen, het gebruik laten stoppen, en je toestemming altijd
          intrekken. Mail hiervoor{" "}
          <a href={`mailto:${CONTACT}`}>{CONTACT}</a> en we regelen het. Ben je
          niet tevreden, dan kun je een klacht indienen bij de Autoriteit
          Persoonsgegevens.
        </p>

        <h2>Hoelang we gegevens bewaren</h2>
        <p>
          We bewaren je wachtlijst-e-mail tot je je uitschrijft of we de lijst
          sluiten, en je accountgegevens zolang je een account hebt. Vraag je ons
          het eerder te verwijderen, dan doen we dat.
        </p>

        <h2>Kinderen</h2>
        <p>The Quiet Minute is niet gericht op kinderen onder de 16.</p>

        <h2>Wijzigingen</h2>
        <p>Verandert deze verklaring, dan passen we de datum hierboven aan.</p>

        <h2>Contact</h2>
        <p>
          Naomi Etnel — <a href={`mailto:${CONTACT}`}>{CONTACT}</a>
        </p>
      </div>

      <button className="btn-back" onClick={onBack} style={{ marginTop: 32 }}>← back</button>
    </div>
  );
}
