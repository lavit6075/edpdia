# Edpdia

An independent, encyclopaedia-style directory of Hong Kong international schools — curricula,
admissions information, and official sources in one neutral, searchable place. Built with
Vite + React + TypeScript + Tailwind CSS, deployable as a static site with no backend.

Live: see the URL Claude reported after deployment (Vercel project `edpdia`).

## Tech stack

- **Vite + React 19 + TypeScript** — client-rendered SPA, no server
- **Tailwind CSS v4** (`@tailwindcss/vite`) for styling, design tokens defined in `src/index.css`
- **React Router v7** for routing
- **No backend, no database, no auth** — all school data lives in a single JSON file
  (`src/data/schools.json`); shortlist/comparison state lives in `localStorage` and the URL

## Getting started

### Prerequisites: Node.js

You need Node 20+ and npm. If you already have them, skip to [Install & run](#install--run).

This project was originally built in a sandboxed environment with **no Node.js pre-installed
and no package manager (no Homebrew) available**, and without sudo access to run a system
installer. Rather than requiring elevated permissions, Node was installed as a self-contained
user-local binary:

```bash
# Pick the right platform suffix for your machine (darwin-arm64, darwin-x64, linux-x64, ...)
# and check https://nodejs.org/dist/ for the current LTS version.
curl -sL -o node.tar.gz https://nodejs.org/dist/v24.19.0/node-v24.19.0-darwin-arm64.tar.gz
mkdir -p ~/.local/tools
tar -xzf node.tar.gz -C ~/.local/tools
mv ~/.local/tools/node-v24.19.0-darwin-arm64 ~/.local/tools/node
rm node.tar.gz

mkdir -p ~/.local/bin
for b in node npm npx corepack; do
  ln -sf ~/.local/tools/node/bin/$b ~/.local/bin/$b
done
# Make sure ~/.local/bin is on PATH — add this to your shell profile if it isn't already:
# export PATH="$HOME/.local/bin:$PATH"
```

On a normal development machine, using [nvm](https://github.com/nvm-sh/nvm), Homebrew
(`brew install node`), or the official installer from nodejs.org is simpler — the approach
above was specifically to avoid needing sudo/admin rights in a locked-down environment.

### Install & run

```bash
npm install
npm run dev        # http://localhost:5173, hot reload
```

### Build & other scripts

| Script | What it does |
|---|---|
| `npm run build` | Typecheck (`tsc -b`) then production build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run oxlint |
| `npm run validate:data` | Check `src/data/schools.json` for structural issues — duplicate ids/slugs, missing required fields, fee figures without a `sources[]` entry, region spread. Run this after editing school data. |
| `npm run validate:i18n` | Check `src/i18n/en.json` and `src/i18n/zh-HK.json` have exactly matching key sets, so `t()` never silently falls back to English for a key that should have been translated. |

Run `validate:data`, `validate:i18n`, and `build` before committing any change to school data or
translations — CI doesn't exist yet, so these are the guardrails.

## Project structure

```
src/
  types/school.ts          School data model (TypeScript types)
  data/schools.json         All 12 schools — the single source of truth for content
  lib/
    schools.ts               Query/localization helpers over schools.json
    timelineSteps.ts          Admissions timeline content (bilingual, level-aware)
    admissionsGuideData.ts    Admissions Guide page content (process/exam types/checklist)
    faqData.ts, resourcesData.ts
  i18n/
    en.json, zh-HK.json       UI string dictionaries (216 keys each, checked for parity)
    LanguageContext.tsx       useLanguage() hook: language, setLanguage, t()
  context/
    ShortlistContext.tsx      Shortlist state, persisted to localStorage
    CompareContext.tsx        Compare-selection state, persisted to localStorage
  components/
    layout/                   Header, Footer, Layout, LanguageSwitcher, CompareBar
    school/                   SchoolCard, sections used on the profile page, badges
  pages/                      One file per route
scripts/
  validate-schools.mjs        npm run validate:data
  validate-i18n.mjs           npm run validate:i18n
data/SOURCES.md                Provenance log — where every school's data came from
CLAUDE.md                      Data model + content rules, written at project start
```

## Data model & content rules

The full data model and the non-negotiable content rules (never fabricate, use `null` for
anything unpublished, always attach a source) are documented in [`CLAUDE.md`](./CLAUDE.md) —
written at the start of the build specifically so they'd persist across sessions. In short:

- Every school record has a `verificationStatus` of `"verified"` or `"unverified"`, shown as a
  badge on its profile.
- Every fee, deadline, exam result, and destination stat that isn't `null` carries a `sources[]`
  entry with a URL and an access date.
- The UI renders `null` as a neutral "Not published" — never a guess.

### Images: nothing copied into this repo, nothing used without a known licence

Three kinds of imagery, all hotlinked from their original host — none stored here:

1. **School logos** (`logoUrl`) — from each school's own official site. If a logo is missing or
   fails to load (`<img onError>`), the UI falls back to a generated SVG placeholder
   (`src/components/school/PlaceholderLogo.tsx`), coloured and patterned deterministically by
   curriculum (`src/lib/curriculumTheme.ts`).
2. **Campus photos** (`photo`) — freely-licensed Wikimedia Commons photography, 12/12 schools.
   Each licence was read from Commons' machine-readable metadata, never assumed. Author and
   licence are displayed beneath the photo, both linked, as CC BY / BY-SA require.
3. **Decorative imagery** (`src/lib/decorativeImages.ts`) — generic education/Hong Kong photos
   sourced via the Openverse API, filtered to permissive licences (ND and NC excluded). These
   are never captioned as, or presented as, a specific school.

The homepage hero graphic (`src/components/HeroGraphic.tsx`) is an original, code-generated SVG —
not a photo at all.

**The rule that governs all of it**: if a licence can't be positively identified, the image isn't
used — the generated placeholder stands in instead. Every image's source, author, licence and
usage is logged in `data/SOURCES.md` under "Image sources & licensing."

All photos lazy-load with explicit `width`/`height` and a reserved aspect-ratio box, so images
never shift layout as they arrive.

### Bilingual content

UI strings live in `src/i18n/{en,zh-HK}.json` (parity enforced by `npm run validate:i18n`).
School-level Chinese content lives in the data: `nameZh` (11/12 — Stamford publishes no Chinese
name), `introZh` (12/12) and `address.lineZh` (12/12). Chinese names and addresses come from the
Education Bureau's official international-schools registry; intros were written for this project
from facts already present in `introEn`. Where a `...Zh` field is null, the UI falls back to
English with a small "English only" note rather than showing a blank.

### Motion

Deliberately restrained and centralised in `src/index.css`: 150–300ms, a single
`cubic-bezier(0.4, 0, 0.2, 1)` easing, no bounce or overshoot. Cards fade/slide up on entering
the viewport (`src/hooks/useRevealOnScroll.ts`, revealing once); hover, press, filter/language
swaps, FAQ answers and the mobile menu all get short transitions.

Two rules held throughout: **fee and admissions tables are never animated** — figures families
are making decisions on appear instantly and stay put — and everything is disabled under
`prefers-reduced-motion`, with `.reveal` content forced visible so nothing is ever left hidden.

## What's AI-generated vs hand-corrected

This entire codebase — every component, page, the data model, the i18n dictionaries, the
validation scripts, and this README — was generated by Claude (Claude Code) from a build brief,
across six phases with a human review checkpoint after each one. Nothing here was hand-written
from scratch by a human first and then adapted.

That doesn't mean it was unsupervised. The most consequential human intervention was in the
school data, described in detail below: a background research agent fabricated content on two
schools, a human caught it by being skeptical of the agent's own garbled output, and asked for
targeted re-verification rather than accepting the data as-is. That correction — and the broader
re-verification it triggered — is the most important "hand-corrected" part of this project, even
though the correcting *work* was still done by Claude; the decision to distrust the source and
demand verification was the human's.

Concretely:

- **Code**: 100% AI-generated, human-reviewed via the phase checkpoints (e.g. the mobile QA pass
  in Phase 5 was run with real Playwright screenshots at 375px and caught two genuine layout bugs
  before this was called done — a compare bar that wrapped awkwardly on mobile, and a
  comparison table with no scroll affordance — both fixed in-session).
- **UI copy** (headings, button labels, disclaimers, FAQ answers, Resources articles): AI-drafted.
  The Resources articles are explicitly placeholder editorial content written by Claude, not
  real reporting — labelled as such in the UI and in `resourcesData.ts`.
- **School data**: AI-researched from official sources (see the provenance story below) —
  **not** independently fact-checked by a human against each official page. It should not be
  treated as production-ready without the verification pass described in the next section.

## Data provenance & the fabrication incident

This is worth documenting in full, because it's the reason the data should still be treated as
`unverified` and it shaped how the rest of the dataset was checked.

**What happened.** While researching 9 of the 12 schools, a background research agent was
launched to fetch official data in parallel. Its first status update back was incoherent —
conversational text that didn't match the task ("Understood — I'll hold here... should I `git
init` or move to Phase 2?"), which was a message meant for a completely different point in the
conversation. It was given one more chance to return its actual findings; the follow-up came
back even more clearly broken, with the agent seemingly confused about its own identity
("Let me check on the background fork — since I completed this research myself, I should stop
it..."). At that point it was killed rather than trusted further.

What wasn't obvious immediately was that this same agent had, in the background, already written
detailed content directly into `schools.json` and `data/SOURCES.md` for all 9 schools —
including two fabrications that looked entirely plausible:

- A **fake principal's quote** for Nord Anglia International School Hong Kong, attributed to
  "Tim Richardson." The school's real principal, per the actual archived welcome page, is
  **Kenny Duncan**, and the real quote bears no resemblance to the invented one.
- A **fake IB result** for Malvern College Hong Kong — "one perfect score of 45/45" for 2025.
  The school's real, published result is a two-year average IB score of **38 points** for the
  2023-24 cohort, alongside a genuine (and different) list of university offers.

Both fabrications were cited to a source URL following the pattern
`web.archive.org/web/2025/https://...` — **this is not a real Wayback Machine timestamp.** A
real archived snapshot URL always has a 14-digit timestamp,
e.g. `web.archive.org/web/20250813203548/https://...`. The generic `/2025/` pattern was
essentially the agent inventing a citation that looked real without pointing at anything.

**How it was caught.** Not by an automated check — by the user being skeptical of data that had
come from an agent already shown to be unreliable, and explicitly asking for the principal quote,
the exam result, and two tuition tables to be re-verified against real sources, with instructions
to null anything that couldn't be traced.

**The correction.** Both fabricated fields were re-verified against real, timestamped Wayback
Machine snapshots (found via the CDX API, `web.archive.org/cdx/search/cdx`) and replaced with
the real data. The entire dataset was then grepped for the fake `web.archive.org/web/2025/...`
pattern to confirm no other instances existed — there were none.

**The wider check.** Because the same agent had also produced the admissions figures (tuition
tables, fees, debentures) for the other 5 schools it researched — Canadian International School
of Hong Kong, French International School Hong Kong, Australian International School Hong Kong,
Harrow International School Hong Kong, and Kellett School — all five were independently
re-verified too, field by field, against live official pages or real archived snapshots.

**The result was reassuring, but not a reason to lower the bar going forward**: every number in
all five records checked out exactly against the live/archived source. The fabrication turned out
to be isolated to narrative content (a quote, a results headline) on the two schools where the
agent apparently couldn't find real content and invented something instead of saying so — not a
systemic problem with the numeric data. `data/SOURCES.md` documents this investigation in full
under "Provenance warning — investigated and resolved," including per-school notes on exactly
what was re-confirmed.

**The lesson for anyone extending this dataset**: an agent's own conversational output can be a
useful tamper indicator — garbled, self-contradictory, or oddly out-of-context responses are
worth treating as a signal to distrust that agent's *other* work too, not just the response
itself. And a citation is only as good as its specificity — a source URL that doesn't point at
anything checkable (like a Wayback link missing its timestamp) should be treated as no citation
at all.

## Verifying data before publish

None of the 12 school records has been independently checked a second time in full — every one
is `verificationStatus: "unverified"`. Before treating any record as production-ready:

1. Open the school's entry in `data/SOURCES.md` and read what was and wasn't confirmed.
2. For each non-null field, open the cited source URL and confirm the figure still matches
   (fees and deadlines change year to year even when nothing was fabricated).
3. Fill in anything still `null` if you can find it published somewhere official, with a proper
   `sources[]` entry (label, url, accessedDate).
4. Run `npm run validate:data` — it'll flag missing sources, duplicate ids, and similar issues.
5. Update `lastVerified` and flip `verificationStatus` to `"verified"` only once you've actually
   done this for that record — the UI badge is meant to be trustworthy, not aspirational.

See `data/SOURCES.md` → "Flags for the next verification pass" for the specific known gaps
(Malvern's age range/boarding status, GSIS and YCIS's fee pages, which render fees client-side or
only as PDFs and so couldn't be transcribed by fetch).

## Known limitations

- **Resources articles are placeholder content** — generic, evergreen guidance written by
  Claude, not real reporting. Replace before treating this as a real news section.
- **Contact form has no backend** — it opens the visitor's email client via a `mailto:` link
  with the message pre-filled. Nothing is stored server-side because there is no server.
- **No accounts** — shortlist and comparison selections live in the browser's `localStorage`
  only; they don't sync across devices and are lost if browser data is cleared.
- **School data coverage**: admissions figures (tuition, fees, deadlines, entrance exams) are
  populated where they were findable via fetch; several fields are genuinely `null` because the
  school renders them client-side or only publishes them as PDFs (see `data/SOURCES.md`).
- Out of scope by design, per the original brief: payments, a CMS, admin dashboards, proprietary
  exam content, heavy SEO/analytics.

## Deployment

Static build (`npm run build` → `dist/`), deployable to any static host. Deployed here via the
Vercel CLI with the Vite framework preset auto-detected (build command `npm run build`, output
directory `dist`).
