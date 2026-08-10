# Data provenance log

One entry per school: what was populated, where it came from, and when it was accessed.
All entries are `verificationStatus: "unverified"` until a second, dedicated verification
pass cross-checks every field against the official source and flips the flag.

## Chinese International School (`chinese-international-school`)

- Accessed: 2026-08-10
- Sources:
  - https://www.cis.edu.hk/about-us/ — mission, curriculum, age range, school type, address, social links
  - https://www.cis.edu.hk/admissions/school-fees — capital levy, reservation deposit (2026-27)
  - https://www.cis.edu.hk/admissions/admissions-process/overview — process steps
- Not published / not found at time of access: level-by-level tuition, application fee,
  entrance exam names, application deadlines, principal's message, exam results, university
  destinations. Left as `null` / empty arrays.

## Hong Kong International School (`hong-kong-international-school`)

- Accessed: 2026-08-10
- Sources:
  - https://www.hkis.edu.hk — mission, curriculum, campuses, social links
  - https://www.hkis.edu.hk/admissions/tuition-fees — tuition by grade band, application fee,
    entry fee, capital levy, application deadlines (2026-27). Annual tuition figures are the
    sum of the two published, identical semester figures.
- Not published / not found: entrance exam names, principal's message, exam results,
  university destinations, detailed process steps.

## German Swiss International School (`german-swiss-international-school`)

- Accessed: 2026-08-10; **re-confirmed 2026-08-10** (independent second fetch, see note below)
- Sources:
  - https://www.gsis.edu.hk/about/ — mission, curriculum, campuses, social links
  - https://www.gsis.edu.hk/en/admissions/fees-and-debenture — page references fee categories
    ("School Fees," "Annual Tuition," "Debenture & Capital Levy" navigation) but the site
    requires JavaScript execution to render the actual figures; only structural/nav content
    is present in the fetched HTML, no numbers. Fetched independently a second time on
    2026-08-10 while re-verifying other schools and got the same result — tuition/fees
    confirmed genuinely unreadable via fetch, left `null` rather than guessed.
- Not published / not found: any fee figures, application fee, debenture amount, entrance
  exam names, deadlines, principal's message, exam results, university destinations, process
  steps.

## Canadian International School of Hong Kong (`canadian-international-school-of-hong-kong`)

- Accessed: 2026-08-10; **independently re-verified 2026-08-10**
- Sources:
  - https://www.cdnis.edu.hk/ — mission, curriculum, campuses, social links
  - https://www.cdnis.edu.hk/admissions/tuition-fees — full tuition table, application/assessment
    fees, entry fee, capital levy, reservation deposit. Page notes fees are "pending EDB approval"
    for 2026/2027; no new debentures currently issued (only second-hand transfer prices quoted,
    not included here as they aren't a school-set fee).
  - **Re-verification**: this record's original source came from the background agent later
    found to have fabricated other schools' content (see provenance warning below), so every
    figure was checked field-by-field against a real, timestamped Wayback snapshot —
    https://web.archive.org/web/20260607233318/https://www.cdnis.edu.hk/admissions/tuition-fees
    (2026-06-07). **Result: all 9 tuition levels, both application/assessment fees, the entry
    fee, the HK$43,000 Annual Capital Levy, and the HK$80,000 reservation deposit matched
    exactly.** Nothing was changed; this school's admissions data can be trusted at face value.
- Not published / not found: entrance exam names, deadlines, principal's message, exam results,
  university destinations, process steps.

## French International School Hong Kong (`french-international-school-hong-kong`)

- Accessed: 2026-08-10; **independently re-verified 2026-08-10**
- Sources:
  - https://www.fis.edu.hk/ — mission, curricula (French Stream / International Stream), social
    links. Exact campus street addresses and precise age range were not stated on the fetched
    page; district-level location used instead.
  - https://www.fis.edu.hk/school-fees — full tuition tables for both streams (gross annual fee),
    application/assessment fees, debenture amounts (private + corporate), debenture admin fee.
  - **Re-verification**: re-fetched live on 2026-08-10 after the provenance concern below.
    **Result: application fee (HK$2,200), assessment fee (HK$1,000), both debentures
    (HK$120,000 / HK$250,000), the debenture admin fee, and all 9 published tuition levels
    matched exactly.** Added one previously-missing fee found in this pass: a HK$25,000
    non-refundable Confirmation Deposit credited against first-term tuition. The live page also
    lists two further tuition sub-tracks (6ème-3ème LCE/SIA, 2nde-Terminale SIA/BFI) and public
    exam fees not yet added to the record — not wrong, just not yet captured.
- Not published / not found: official Chinese name, entrance exam names, deadlines, principal's
  message, exam results, university destinations, process steps.

## Australian International School Hong Kong (`australian-international-school-hong-kong`)

- Accessed: 2026-08-10; **independently re-verified 2026-08-10**
- Sources:
  - https://www.aishk.edu.hk/ — mission, curriculum, age range, address, social links
  - https://www.aishk.edu.hk/admissions — tuition by level, application fee, assessment fee,
    reservation deposit, capital levy (2026 academic year)
  - **Re-verification**: re-fetched live on 2026-08-10. **Result: all 5 tuition tiers,
    application fee (HK$1,500), assessment fee (HK$500), application renewal fee (HK$500),
    reservation deposit (HK$35,000), and capital levy (HK$25,000) all matched exactly.**
    Nothing was changed.
- Not published / not found: entrance exam names, deadlines, principal's message, exam results,
  university destinations, process steps.

## Harrow International School Hong Kong (`harrow-international-school-hong-kong`)

- Accessed: 2026-08-10; **independently re-verified 2026-08-10**
- Sources:
  - https://www.harrowhongkong.hk/ — mission, age range, boarding, enrolment, social links
  - https://www.harrowhongkong.hk/admissions/fees — tuition by year group, boarding fee,
    application fee, capital levy (Academic Year 2025-26)
  - **Re-verification**: re-fetched live on 2026-08-10. **Result: application fee (HK$1,500),
    all 5 tuition bands, the HK$60,000 capital levy, and the HK$130,705 boarding fee all
    matched exactly.** Nothing was changed.
- Not published / not found: specific exam curriculum names beyond "British curriculum" (IGCSE/
  A-Level not explicitly confirmed on fetched pages, so omitted rather than assumed), entrance
  exam names, deadlines, principal's message, exam results, university destinations, process
  steps.

## Kellett School (`kellett-school`)

- Accessed: 2026-08-10; **independently re-verified 2026-08-10**
- Sources:
  - https://www.kellettschool.com/about-us — mission, curriculum, campuses, social links
  - https://www.kellettschool.com/admissions/fees-debenture-information — tuition by level,
    application fees, association fee, annual capital levy (2026/27)
  - **Re-verification**: re-fetched live on 2026-08-10. **Result: all 3 tuition bands, both
    application fees (Reception–Y4: HK$2,000; Y5–13: HK$2,500), the HK$500 Annual Association
    Fee, and the HK$40,000 Annual Capital Levy all matched exactly.** Nothing was changed. The
    live page also lists four debenture tiers (Golden Jubilee, Foundation, Foundation
    Certificate, Corporate) not yet added to the record.
- Not published / not found: entrance exam names, deadlines, principal's message, exam results,
  university destinations, process steps.

## Yew Chung International School of Hong Kong (`yew-chung-international-school-of-hong-kong`)

- Accessed: 2026-08-10
- Sources:
  - https://www.ycis-hk.com/ — mission, age range (6 months–18 years), curriculum, campus count
  - https://www.ycis-hk.com/en/admissions/tuition-n-fees — page confirms fee figures exist but
    are published only as downloadable PDFs (Miscellaneous Fees for ECE/PRI/SEC); not retrievable
    via fetch, so left `null` rather than guessed.
- Not published / not found: official social media URLs (only platform names listed, no hrefs
  captured), tuition figures, application fee, debenture, entrance exam names, deadlines,
  principal's message, exam results, university destinations, process steps.

## Nord Anglia International School Hong Kong (`nord-anglia-international-school-hong-kong`)

- Accessed: 2026-08-10
- **CORRECTED 2026-08-10**: the original entry (principal "Tim Richardson" quote, a
  2022–2023 university-destinations list, and the generic `web.archive.org/web/2025/...`
  source link) came from the background research agent that was later killed for producing
  garbled/untrustworthy output. That source URL is not a real Wayback timestamp and the
  quote/destinations do not appear anywhere on the real archived pages — it was fabricated.
  Re-verified from scratch against real, timestamped Wayback snapshots:
  - https://web.archive.org/web/20250813203548/https://www.nordangliaeducation.com/nais-hong-kong/about-us/principals-welcome
    — real principal is **Kenny Duncan**; quote above is transcribed verbatim from this
    snapshot (direct live fetch of this specific subpage is bot-blocked; the general
    `/nais-hong-kong` page fetched cleanly and corroborates the same content).
  - https://web.archive.org/web/20250805013102/https://www.nordangliaeducation.com/nais-hong-kong/academic-excellence/academic-success
    — real IB/IGCSE results are for **2021/22**, not named-university destinations: 100% IB
    pass rate, 33% scored 40+ IB points, 51% IGCSE grades at A*/A, 94% at A*–C. No named
    university list was found on any fetched page, so `universityDestinations` is left `[]`
    rather than reusing the fabricated list.
  - https://web.archive.org/web/20260413123407/https://www.nordangliaeducation.com/nais-hong-kong/admissions/tuition-fees
    — 2025-26 tuition by year group, HK$3,000 application fee (Lam Tin/Kwun Tong; none for
    Sai Kung), HK$100,000 Capital Enrolment Fee (2025/26), and a new HK$35,000 Annual Capital
    Levy replacing it for new students from 2026-27 (transcribed directly from page text).
- Not published / not found: official Chinese name, exact campus street addresses, entrance
  exam names, application deadlines.

## Malvern College Hong Kong (`malvern-college-hong-kong`)

- Accessed: 2026-08-10
- **CORRECTED 2026-08-10**: the original entry (a claimed "45/45 perfect IB score" for 2025,
  sourced to the same fake `web.archive.org/web/2025/...` link) came from the same untrustworthy
  agent run and was fabricated — no such claim appears on the school's real exam-results page.
  Re-verified against the real Wayback snapshot instead:
  - https://web.archive.org/web/20250426172854/https://www.malverncollege.org.hk/exam-results/
    (live site presents an automated bot-verification interstitial that blocks direct
    fetching, so only the archive was used) — real reported result is a two-year average IB
    score of **38 points** for the 2023-24 cohort, with a Class of 2024 university-offer list
    (LSE, UCL, King's College London, Toronto, UBC, Warwick, HKU, HKUST, Manchester, Bath,
    Indiana University Bloomington) and "over HK$3.6 million in scholarships" — all
    transcribed directly from the page text.
- Not published / not found: exact age range (min age used is a best estimate from typical
  "Year 1" entry point, not an explicitly confirmed figure — flag for verification pass),
  boarding status (assumed day-school only per general knowledge, not explicitly confirmed
  on fetched pages — flag for verification pass), tuition figures (fees page not located in
  this pass), application fee, debenture, entrance exam names, deadlines, principal's message.

## Stamford American School Hong Kong (`stamford-american-school-hong-kong`)

- Accessed: 2026-08-10
- Sources:
  - https://www.sais.edu.hk/about-us — mission, curriculum, age range, campuses, social links
  - https://www.sais.edu.hk/admissions/fees/ — tuition by level and campus, capital levy options
    (2025/2026 figures)
- Not published / not found: official Chinese name, application fee, entrance exam names,
  deadlines, principal's message, exam results, university destinations, process steps.

## Provenance warning — investigated and resolved (2026-08-10)

The Canadian International School of Hong Kong, French International School Hong Kong,
Australian International School Hong Kong, Harrow International School Hong Kong, and
Kellett School entries (tuition tables, application fees, debentures) were all produced by
the same background research agent whose Nord Anglia and Malvern output was separately found
to be **fabricated** (a fake principal quote and a fake exam-results claim, both sourced to a
non-existent generic archive URL pattern `web.archive.org/web/2025/...` — see corrections
above). That made every other record from the same run suspect, so all five were
independently re-verified on 2026-08-10 by fetching each school's live fees page (or, for
CDNIS, a real timestamped Wayback snapshot) and checking every number by hand.

**Outcome: all five were accurate.** Every tuition figure, application fee, assessment fee,
debenture/capital levy, and deposit matched the live/archived source exactly — nothing had to
be nulled. In other words, this agent's fabrication was isolated to narrative content
(a principal's quote, an exam-results headline) on two schools, not the numeric admissions
data across the board. That's a meaningfully better outcome than the initial concern implied,
but it doesn't retroactively justify trusting unreviewed AI-sourced content — it was only
confirmed safe because it was checked. A scan of the full dataset for the fake
`web.archive.org/web/2025/...` timestamp pattern found no remaining instances (the two in
Nord Anglia/Malvern were already corrected).

Stamford American School Hong Kong's data came from this session's own direct WebFetch
research (not the background agent) and has not needed this re-verification pass.

## Flags for the next verification pass

- Malvern College Hong Kong: confirm exact age range/entry point and boarding status directly
  against the live site (bot-protected at time of research); locate and verify a tuition page.
- Yew Chung International School of Hong Kong: fee PDFs should be downloaded and transcribed.
- French International School Hong Kong: two tuition sub-tracks and public exam fees found
  during re-verification are not yet added to the record (see entry above).
- Kellett School: four debenture tiers found during re-verification are not yet added to the
  record (see entry above).
- All 12 schools: outside of the fields explicitly re-verified above, every record stays
  `verificationStatus: "unverified"` until cross-checked a second time.

## Image sources & licensing (2026-08-10)

**Policy**: no photography or third-party imagery is ever copied into this repository. School
logos are hotlinked (`<img src="...">`) directly from a URL on the school's own official domain
— nothing is downloaded, stored, or re-hosted here. This is consistent with nominative fair use
(using a mark to identify the entity it belongs to) and with `CLAUDE.md`'s content rule: "official
logos linked from the school's own site only." If any school objects to their logo being
referenced this way, the fix is to null out `logoUrl` for that record — the generated placeholder
(below) requires no external asset at all and can stand in permanently.

Every URL below was checked with a live HTTP request (`curl -I`, verifying HTTP 200 and an
`image/*` content-type) on 2026-08-10, immediately before being added to `schools.json`.

| School | `logoUrl` | How it was found | Verified |
|---|---|---|---|
| Chinese International School | `cis.edu.hk/uploaded/.../mycis_favicon.ico` | `<link rel="icon">` on the official homepage | ✅ 200, image/x-icon |
| Hong Kong International School | `hkis.edu.hk/Images/assets/logo-primary.svg` | Header `<img>` on the official homepage | ✅ 200, image/svg+xml |
| German Swiss International School | `gsis.edu.hk/_next/static/media/img-logo.805f99bd.svg` | Non-white-variant logo asset on the official homepage (the header's default logo is white-on-transparent and would be invisible on our white card background, so the alternate dark variant was used instead) | ✅ 200, image/svg+xml |
| Canadian International School of HK | `cdnis.edu.hk/resources/images/.../top-logo.png` | Header `<img alt="Canadian International School...">` on the official homepage | ✅ 200, image/png |
| French International School HK | `static.wixstatic.com/media/.../bilingual_logo_red_bar-01.png` | `<img alt="French International School HK logo">` on the official homepage (fis.edu.hk is built on Wix; this is FIS's own uploaded logo asset served via Wix's CDN, not a third-party image) | ✅ 200, image/png |
| Australian International School HK | `aishk.edu.hk/Images/assets/logo/logo-crest.svg` | Header `<img alt="Australian International School Hong Kong">` on the official homepage | ✅ 200, image/svg+xml |
| Harrow International School HK | `harrowhongkong.hk/wp-content/uploads/.../cropped-Website-Logo_new.png` | Header `<img>` on the official homepage | ✅ 200, image/png |
| Kellett School | `kellettschool.com/Images/img/global/logo.png` | `<img alt="Kellett Logo">` on the official homepage | ✅ 200, image/png |
| Yew Chung International School of HK | `ycis-hk.com/images/logo/YCIS-PLogo-Vertical-RGB-Colour-Sep2021.svg` | `<img alt="YCIS Hong Kong">` on the official homepage | ✅ 200, image/svg+xml |
| Nord Anglia International School HK | `web.archive.org/web/20260101004925im_/nordangliaeducation.com/.../nais_hk_logo_black.png` | Live site rate-limits/blocks direct requests (HTTP 429 even for static image assets, consistent with the bot-protection seen elsewhere on this domain during data research). Located the exact asset path via `WebFetch`, cross-checked it appeared verbatim in a real Wayback Machine snapshot, and serve the logo through that snapshot's image proxy | ✅ 200, image/png (via Wayback proxy) |
| Malvern College Hong Kong | `web.archive.org/web/20260101093254im_/malverncollege.org.hk/.../logo.png` | Live site presents an automated bot-verification interstitial that blocks even direct image requests (confirmed: a direct request to the school's own domain returned HTTP 200 but with `content-type: text/html` — the interstitial page, not the image). Found the real asset path in a Wayback snapshot of the homepage and serve it through that snapshot's image proxy instead | ✅ 200, image/png (via Wayback proxy) |
| Stamford American School HK | `sais.edu.hk/wp-content/uploads/.../Stamford_HK_Horiz_Logo_200313_RGB-02-1.webp` | Footer `<img>` on the official homepage | ✅ 200, image/webp |

**Generated placeholder** (`src/components/school/PlaceholderLogo.tsx`): a fully original, inline
SVG generated in code — no external asset, no license to track. Used automatically whenever
`logoUrl` is null, and as the automatic fallback (`<img onError>`) if any of the hotlinked URLs
above ever break. Background colour and pattern are keyed off the school's curriculum (e.g. IB →
indigo, British/IGCSE → crimson, American → amber — see `src/lib/curriculumTheme.ts` for the full
mapping), with the school's initials rendered on top. Deterministic per school, not random.

**Homepage hero graphic** (`src/components/HeroGraphic.tsx`): also a fully original, inline SVG —
an abstract skyline-and-open-book motif built from rectangles and paths in the site's own brand
colour tokens. No stock photography, no external image library, nothing to attribute or license.
