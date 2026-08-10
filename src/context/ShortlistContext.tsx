import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const STORAGE_KEY = "edpdia-shortlist";

function getInitial(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : [];
  } catch {
    return [];
  }
}

interface ShortlistContextValue {
  shortlist: string[];
  isShortlisted: (slug: string) => boolean;
  toggleShortlist: (slug: string) => void;
}

const ShortlistContext = createContext<ShortlistContextValue | null>(null);

export function ShortlistProvider({ children }: { children: ReactNode }) {
  const [shortlist, setShortlist] = useState<string[]>(getInitial);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(shortlist));
  }, [shortlist]);

  function toggleShortlist(slug: string) {
    setShortlist((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
  }

  function isShortlisted(slug: string) {
    return shortlist.includes(slug);
  }

  return (
    <ShortlistContext.Provider value={{ shortlist, isShortlisted, toggleShortlist }}>
      {children}
    </ShortlistContext.Provider>
  );
}

export function useShortlist(): ShortlistContextValue {
  const ctx = useContext(ShortlistContext);
  if (!ctx) {
    throw new Error("useShortlist must be used within a ShortlistProvider");
  }
  return ctx;
}
