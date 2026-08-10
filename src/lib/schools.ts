import rawSchools from "../data/schools.json";
import type { School } from "../types/school";

export const schools: School[] = rawSchools as School[];

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
