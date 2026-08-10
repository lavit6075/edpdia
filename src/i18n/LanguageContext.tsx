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

function getInitialLanguage(): Language {
  if (typeof window === "undefined") return "en";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "zh-HK" ? "zh-HK" : "en";
}

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (path: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
    window.localStorage.setItem(STORAGE_KEY, language);
  }, [language]);

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
