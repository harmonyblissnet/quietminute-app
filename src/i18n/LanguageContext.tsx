import { createContext, useContext, useEffect, useMemo, useState, Fragment } from "react";
import type { ReactNode } from "react";
import { translations } from "./translations";
import type { Lang } from "./translations";

export const LANGS: { code: Lang; label: string }[] = [
  { code: "en", label: "English" },
  { code: "nl", label: "Nederlands" },
  { code: "de", label: "Deutsch" },
  { code: "fr", label: "Français" },
  { code: "es", label: "Español" },
];

const STORAGE_KEY = "tqm_lang";

function isLang(value: string): value is Lang {
  return value in translations;
}

function detectLang(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && isLang(saved)) return saved;
  } catch {
    // ignore
  }
  const nav = typeof navigator !== "undefined" ? navigator.language.slice(0, 2) : "en";
  return isLang(nav) ? nav : "en";
}

type LanguageContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  // Plain string (English fallback for missing keys).
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(detectLang);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore
    }
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      setLang,
      t: (key) => translations[lang][key] ?? translations.en[key] ?? key,
    }),
    [lang],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useT() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useT must be used within a LanguageProvider");
  return ctx;
}

// Renders a translated string, turning "\n" into <br /> so the gentle line
// breaks survive translation.
export function T({ k }: { k: string }) {
  const { t } = useT();
  const parts = t(k).split("\n");
  return (
    <>
      {parts.map((line, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          {line}
        </Fragment>
      ))}
    </>
  );
}
