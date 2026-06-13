import { LANGS, useT } from "./LanguageContext";

// A quiet row of language codes (EN · NL · DE · FR · ES) for the footer.
export function LanguageSwitcher() {
  const { lang, setLang } = useT();
  return (
    <div className="lang-switch">
      {LANGS.map((l) => (
        <button
          key={l.code}
          type="button"
          className={`lang-btn${l.code === lang ? " is-active" : ""}`}
          onClick={() => setLang(l.code)}
          aria-label={l.label}
          aria-pressed={l.code === lang}
        >
          {l.code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
