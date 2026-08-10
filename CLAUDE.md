# Edpdia — Project Guide

Bilingual (English + Traditional Chinese) international-school directory and admissions information hub for Hong Kong. Brand concept: Education + Wikipedia + Media — an open, encyclopaedia-style reference, **not** a marketing site. Scope is **international schools only** (no local mainstream kindergarten/primary/secondary).

Reference for structure/content: archived site at
https://web.archive.org/web/20251206035306/https://edpdia.com/en
(the live site returns 401; the archive is the source of truth for IA/nav/tone)

## Tech stack

- Vite + React + TypeScript + Tailwind CSS (v4, `@tailwindcss/vite` plugin)
- React Router (`react-router-dom`) for pages
- All school data lives in `src/data/schools.json`, typed by `src/types/school.ts`
- Client-side search/filtering only — data volume is small
- No backend, no auth, no CMS, no payments — static build, deployable to Vercel/Netlify

## Data model (`src/types/school.ts`)

Every school uses the exact same shape (required for filters/search/compare to work). See the file for the authoritative TypeScript types. Summary:

```
id, nameEn, nameZh, slug
district, region ("Hong Kong Island" | "Kowloon" | "New Territories")
curriculum[] (IB, British, American, Canadian, Australian, French, German, etc.)
ageRange { min, max }, gradeLevels
schoolType ("co-ed" | "boys" | "girls"), boarding: boolean
introEn, introZh   — objective, parent-readable, NOT marketing copy
officialWebsite, officialSocial[]
logoUrl | null   — hotlinked from the school's own official site (or a Wayback snapshot of
                   it), never copied into this repo; UI falls back to a generated placeholder
                   if null or if the image fails to load. See data/SOURCES.md → "Image sources
                   & licensing".
address { lineEn, lineZh, district }
admissions {
  tuitionByLevel[] { level, annualFeeHKD | null },
  otherFees[] { label, amountHKD | null, note },
  applicationFee, debentureOrCapitalLevy,
  entranceExams[] (ISEB, CAT4, MAP, 11+, 13+, school-specific, ...),
  applicationDeadlines[] { intakeYear, level, deadline },
  processSteps[]
}
principalMessage: { quote, name, sourceUrl } | null
achievements: {
  examResults[]: { qualification, year, metric, value, sourceUrl },
  universityDestinations[]: { year, institutions[], sourceUrl },
  awards[]
}
sources[]: { label, url, accessedDate }
lastVerified: ISO date string | null
verificationStatus: "verified" | "unverified"
```

## Non-negotiable content rules

- **Never fabricate data.** Every fee, deadline, exam result, and destination stat needs a `year` and a `sourceUrl`. If a value is unknown/unpublished, use `null` — the UI renders a neutral "Not published" state, never a guess.
- Prefer **official school websites** first, the **Wayback Machine archive** as fallback.
- Any record not yet checked against an official source stays `verificationStatus: "unverified"` and the UI shows a visible "pending verification" marker. Only flip to `"verified"` after a genuine source check.
- No star ratings, no rankings, no hype language. Neutral, encyclopaedic tone in `introEn`/`introZh` and everywhere else.
- No copyrighted image dumps — placeholders or official logos linked from the school's own site only where clearly permitted.
- Log data provenance in `data/SOURCES.md` (one entry per school: what was populated, where it came from, access date).

## Information architecture

`Home → Directory (/schools) → School Profile (/schools/:slug) → Guides (/admissions, /resources) → About → FAQ → Contact`

Footer on every page: nav, contact, disclaimer ("Information compiled from public sources — verify directly with schools"), language note.

## Bilingual approach

- Lightweight i18n: `src/i18n/en.json` + `src/i18n/zh-HK.json` + a React context/hook — no heavy library.
- **Traditional Chinese** (zh-HK), not Simplified.
- Language choice persists in `localStorage`; `<html lang>` set per language.
- Missing `...Zh` fields fall back to English with a small "English only" note rather than an empty block.

## Design direction

Clean, professional, trustworthy. Clear hierarchy, obvious CTAs, readable type, strong contrast, proper heading structure. Tables for fees/deadlines. Small reusable design system (tokens, School Card, School Profile modules) before styling pages individually. Mobile-first — QA directory/filters/profiles at 375px.

## Out of scope

Payments, user accounts/login, a full CMS, admin dashboards, proprietary exam paper libraries, heavy SEO/analytics work.

## Build phases (stop for review after each)

1. Scaffold, types, `schools.json` (3 sample schools), design tokens, layout shell + nav + footer
2. Homepage, Directory (filters + search), School Profile — plus remaining sample schools (12–15 total)
3. Bilingual layer across all main pages
4. Comparison + shortlist + admissions timeline
5. Remaining pages (About, Admissions Guide, Resources, FAQ, Contact), disclaimers, mobile QA, empty states
6. `README.md` — build decisions, what's AI-generated vs hand-written, how to verify data before publish

Run typecheck (`tsc -b`) and build (`npm run build`) after each phase; fix errors before moving on.
