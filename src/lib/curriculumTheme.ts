/** Deterministic, curriculum-keyed visual theme for the generated placeholder logo —
 *  used whenever a school has no logo, or its hotlinked logo fails to load. */

export interface CurriculumTheme {
  bg: string;
  fg: string;
  pattern: "dots" | "stripes" | "grid" | "waves";
}

const FAMILIES: { keywords: string[]; theme: CurriculumTheme }[] = [
  {
    keywords: ["baccalaureate", " ib ", "ibdp", "ibmyp", "ibpyp", "ibcp"],
    theme: { bg: "#4338CA", fg: "#EEF2FF", pattern: "dots" },
  },
  {
    keywords: ["british", "english national", "a-level", "a level", "igcse", "gcse", "iseb"],
    theme: { bg: "#B3364A", fg: "#FDF2F4", pattern: "stripes" },
  },
  {
    keywords: ["american", "advanced placement", " ap "],
    theme: { bg: "#B8860B", fg: "#FFFBEB", pattern: "grid" },
  },
  {
    keywords: ["ontario", "canadian", "ossd"],
    theme: { bg: "#1F7A6C", fg: "#ECFDF5", pattern: "waves" },
  },
  {
    keywords: ["australian", "hsc", "new south wales"],
    theme: { bg: "#2E6F9E", fg: "#EFF8FF", pattern: "grid" },
  },
  {
    keywords: ["french", "aefe"],
    theme: { bg: "#7C3AED", fg: "#F5F3FF", pattern: "stripes" },
  },
  {
    keywords: ["german", "abitur", "dia"],
    theme: { bg: "#2F7D4F", fg: "#F0FDF4", pattern: "dots" },
  },
];

const FALLBACK_THEMES: CurriculumTheme[] = [
  { bg: "#55606E", fg: "#F1F4F7", pattern: "dots" },
  { bg: "#6D5A46", fg: "#FBF6EF", pattern: "grid" },
  { bg: "#4A5568", fg: "#F0F2F5", pattern: "waves" },
];

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export function getCurriculumTheme(curriculum: string[], seed: string): CurriculumTheme {
  const haystack = ` ${curriculum.join(" ").toLowerCase()} `;
  for (const family of FAMILIES) {
    if (family.keywords.some((kw) => haystack.includes(kw))) {
      return family.theme;
    }
  }
  return FALLBACK_THEMES[hashString(seed) % FALLBACK_THEMES.length];
}

const STOP_WORDS = new Set(["of", "the", "and", "&"]);

export function getInitials(nameEn: string): string {
  const letters = nameEn
    .split(/\s+/)
    .filter((w) => w.length > 0 && !STOP_WORDS.has(w.toLowerCase()))
    .slice(0, 4)
    .map((w) => w[0]?.toUpperCase())
    .join("");
  return letters || nameEn.slice(0, 2).toUpperCase();
}
