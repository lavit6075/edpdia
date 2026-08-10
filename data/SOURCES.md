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

- Accessed: 2026-08-10
- Sources:
  - https://www.gsis.edu.hk/about/ — mission, curriculum, campuses, social links
  - https://www.gsis.edu.hk/en/admissions/fees-and-debenture — page references fee categories
    but the site appears to render fee figures client-side; no numbers were retrievable via
    fetch. Tuition/fees left `null`; needs a manual check or a browser-rendered fetch.
- Not published / not found: any fee figures, application fee, debenture amount, entrance
  exam names, deadlines, principal's message, exam results, university destinations, process
  steps.

## Remaining 9 schools

Researched separately (CDNIS, French International School, AISHK, Harrow HK, Kellett,
YCIS, Nord Anglia HK, Malvern College HK, Stamford American HK) — see entries appended in
Phase 2 once merged into `schools.json`, with per-school sourcing noted here at that time.
