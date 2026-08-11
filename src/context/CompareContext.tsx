import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const STORAGE_KEY = "edpdia-compare";
export const MAX_COMPARE = 4;

/**
 * Prerendered HTML is generated with empty selection, so the first client render must be empty
 * too or hydration mismatches for every returning visitor. Stored state is applied in an
 * effect right after hydration, and persistence is gated on that read completing so the
 * placeholder empty value never clobbers what the visitor saved.
 */
function readStored(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((v): v is string => typeof v === "string").slice(0, MAX_COMPARE)
      : [];
  } catch {
    return [];
  }
}

interface CompareContextValue {
  compareList: string[];
  isComparing: (slug: string) => boolean;
  toggleCompare: (slug: string) => void;
  setCompareList: (slugs: string[]) => void;
  clearCompare: () => void;
  maxReached: boolean;
}

const CompareContext = createContext<CompareContextValue | null>(null);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [compareList, setCompareListState] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = readStored();
    if (stored.length) setCompareListState(stored);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(compareList));
  }, [compareList, hydrated]);

  function toggleCompare(slug: string) {
    setCompareListState((prev) => {
      if (prev.includes(slug)) return prev.filter((s) => s !== slug);
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, slug];
    });
  }

  function setCompareList(slugs: string[]) {
    const deduped = Array.from(new Set(slugs)).slice(0, MAX_COMPARE);
    setCompareListState((prev) =>
      prev.length === deduped.length && prev.every((s, i) => s === deduped[i]) ? prev : deduped,
    );
  }

  function isComparing(slug: string) {
    return compareList.includes(slug);
  }

  return (
    <CompareContext.Provider
      value={{
        compareList,
        isComparing,
        toggleCompare,
        setCompareList,
        clearCompare: () => setCompareListState([]),
        maxReached: compareList.length >= MAX_COMPARE,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare(): CompareContextValue {
  const ctx = useContext(CompareContext);
  if (!ctx) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return ctx;
}
