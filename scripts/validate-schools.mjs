#!/usr/bin/env node
// Sanity-checks src/data/schools.json against the content rules in CLAUDE.md:
// every non-null admissions/achievements figure must carry a source, slugs/ids
// must be unique, and required fields must be present. Does not validate
// against the TypeScript type — just the rules that are easy to violate by hand.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.join(__dirname, "..", "src", "data", "schools.json");
const schools = JSON.parse(readFileSync(dataPath, "utf-8"));

const errors = [];
const warnings = [];
const seenIds = new Set();
const seenSlugs = new Set();

const REQUIRED_STRING_FIELDS = [
  "id",
  "nameEn",
  "slug",
  "district",
  "region",
  "gradeLevels",
  "schoolType",
  "introEn",
  "officialWebsite",
];

const VALID_REGIONS = ["Hong Kong Island", "Kowloon", "New Territories"];
const VALID_SCHOOL_TYPES = ["co-ed", "boys", "girls"];

for (const [i, school] of schools.entries()) {
  const label = school.nameEn ?? `schools[${i}]`;

  for (const field of REQUIRED_STRING_FIELDS) {
    if (typeof school[field] !== "string" || school[field].trim() === "") {
      errors.push(`${label}: missing/empty required field "${field}"`);
    }
  }

  if (school.id) {
    if (seenIds.has(school.id)) errors.push(`${label}: duplicate id "${school.id}"`);
    seenIds.add(school.id);
  }
  if (school.slug) {
    if (seenSlugs.has(school.slug)) errors.push(`${label}: duplicate slug "${school.slug}"`);
    seenSlugs.add(school.slug);
  }

  if (school.region && !VALID_REGIONS.includes(school.region)) {
    errors.push(`${label}: invalid region "${school.region}"`);
  }
  if (school.schoolType && !VALID_SCHOOL_TYPES.includes(school.schoolType)) {
    errors.push(`${label}: invalid schoolType "${school.schoolType}"`);
  }

  if (!school.ageRange || typeof school.ageRange.min !== "number" || typeof school.ageRange.max !== "number") {
    errors.push(`${label}: missing/invalid ageRange`);
  } else if (school.ageRange.min > school.ageRange.max) {
    errors.push(`${label}: ageRange.min > ageRange.max`);
  }

  if (!Array.isArray(school.curriculum) || school.curriculum.length === 0) {
    warnings.push(`${label}: no curriculum listed`);
  }

  if (!Array.isArray(school.sources) || school.sources.length === 0) {
    warnings.push(`${label}: no sources listed`);
  } else {
    for (const s of school.sources) {
      if (!s.url || !s.accessedDate) {
        errors.push(`${label}: source missing url/accessedDate — ${JSON.stringify(s)}`);
      }
    }
  }

  // Every non-null fee figure should be backed by at least one source on the record.
  const hasSources = Array.isArray(school.sources) && school.sources.length > 0;
  const admissions = school.admissions ?? {};
  const feeFieldsPresent =
    (admissions.tuitionByLevel ?? []).some((t) => t.annualFeeHKD !== null) ||
    (admissions.otherFees ?? []).some((f) => f.amountHKD !== null) ||
    admissions.applicationFee !== null ||
    admissions.debentureOrCapitalLevy !== null;
  if (feeFieldsPresent && !hasSources) {
    errors.push(`${label}: has fee figures but no sources[] entries`);
  }

  if (!Array.isArray(school.photos) || school.photos.length === 0) {
    warnings.push(`${label}: no photos`);
  } else {
    for (const [i, p] of school.photos.entries()) {
      for (const field of ["url", "thumbUrl", "licence", "author", "sourceUrl"]) {
        if (!p[field]) errors.push(`${label}: photos[${i}] missing ${field}`);
      }
      for (const field of ["url", "thumbUrl"]) {
        if (p[field] && !/^(\/img\/|https:\/\/)/.test(p[field])) {
          errors.push(`${label}: photos[${i}].${field} must be a /img/ path or https:// URL`);
        }
      }
    }
  }

  if (!["verified", "unverified"].includes(school.verificationStatus)) {
    errors.push(`${label}: invalid verificationStatus "${school.verificationStatus}"`);
  }

  if (school.logoUrl !== null) {
    // Images are self-hosted under /img/. Remote https:// is still accepted so a newly added
    // school can be committed before the localise step runs.
    if (typeof school.logoUrl !== "string" || !/^(\/img\/|https:\/\/).+/.test(school.logoUrl)) {
      errors.push(`${label}: logoUrl must be null, a /img/ path, or an https:// URL`);
    }
  } else {
    warnings.push(`${label}: no logoUrl — will render the generated placeholder only`);
  }
}

console.log(`Checked ${schools.length} schools.`);

const regionCounts = schools.reduce((acc, s) => {
  acc[s.region] = (acc[s.region] ?? 0) + 1;
  return acc;
}, {});
console.log("Region spread:", regionCounts);

if (warnings.length) {
  console.log(`\n${warnings.length} warning(s):`);
  warnings.forEach((w) => console.log(`  ⚠ ${w}`));
}

if (errors.length) {
  console.log(`\n${errors.length} error(s):`);
  errors.forEach((e) => console.log(`  ✗ ${e}`));
  process.exit(1);
}

console.log("\nNo errors.");
