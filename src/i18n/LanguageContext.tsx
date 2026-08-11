import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import en from "./en.json";
import zhHK from "./zh-HK.json";

export type Language = "en" | "zh-HK";

type Dict = typeof en;

const dictionaries: Record<Language, Dict> = {
  en,
  "zh-HK": zhHK as Dict,
};

const STORAGE_KEY = "edpdia-language";

function getByPath(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

/**
 * Prerendered HTML is always English, so the FIRST client render must be English too or
 * hydration mismatches for every returning zh-HK visitor. The stored preference is applied in
 * an effect immediately after hydration instead — a returning Chinese reader sees a brief
 * English frame, which is the standard trade for static generation.
 */
function readStoredLanguage(): Language | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(STORAGE_KEY) === "zh-HK" ? "zh-HK" : null;
}

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (path: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
  const [hydrated, setHydrated] = useState(false);

  // Runs once, after hydration has matched the prerendered English markup.
  useEffect(() => {
    const stored = readStoredLanguage();
    if (stored) setLanguage(stored);
    setHydrated(true);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    // Don't persist the placeholder "en" before the stored value has been read back,
    // or a returning zh-HK visitor's preference gets clobbered on every load.
    if (hydrated) window.localStorage.setItem(STORAGE_KEY, language);
  }, [language, hydrated]);

  function t(path: string): string {
    const value = getByPath(dictionaries[language], path);
    if (typeof value === "string") return value;
    const fallback = getByPath(dictionaries.en, path);
    if (typeof fallback === "string") return fallback;
    return path;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}
