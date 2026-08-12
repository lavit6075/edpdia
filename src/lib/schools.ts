import rawSchools from "../data/schools.json";
import type { School } from "../types/school";
import type { Language } from "../i18n/LanguageContext";

export const schools: School[] = rawSchools as School[];

export interface Localized {
  text: string;
  isFallback: boolean;
}

/** Picks the zh-HK value when active and present; otherwise falls back to English and flags it. */
export function localize(en: string, zh: string | null, language: Language): Localized {
  if (language === "zh-HK" && zh) return { text: zh, isFallback: false };
  return { text: en, isFallback: language === "zh-HK" };
}

export function localizeSchoolName(school: School, language: Language): Localized {
  return localize(school.nameEn, school.nameZh, language);
}

export function localizeIntro(school: School, language: Language): Localized {
  return localize(school.introEn, school.introZh, language);
}

export function localizeAddress(school: School, language: Language): Localized {
  return localize(school.address.lineEn, school.address.lineZh, language);
}

export function getSchoolBySlug(slug: string): School | undefined {
  return schools.find((school) => school.slug === slug);
}

export function getDistricts(): string[] {
  return Array.from(new Set(schools.map((school) => school.district))).sort();
}

export function getCurricula(): string[] {
  return Array.from(new Set(schools.flatMap((school) => school.curriculum))).sort();
}

export function getRegions(): School["region"][] {
  return Array.from(new Set(schools.map((school) => school.region)));
}

export function getSchoolTypes(): string[] {
  return Array.from(new Set(schools.map((school) => school.schoolType))).sort();
}

export interface TuitionRange {
  min: number;
  max: number;
}

/** Range across published (non-null) tuition figures only; null if nothing is published. */
export function getTuitionRange(school: School): TuitionRange | null {
  const fees = school.admissions.tuitionByLevel
    .map((t) => t.annualFeeHKD)
    .filter((v): v is number => v !== null);
  if (fees.length === 0) return null;
  return { min: Math.min(...fees), max: Math.max(...fees) };
}
