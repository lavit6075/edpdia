import { Link, useParams } from "react-router-dom";
import { getSchoolBySlug } from "../lib/schools";
import { Tag } from "../components/school/Tag";
import { VerificationBadge } from "../components/school/VerificationBadge";
import { NotPublished } from "../components/school/NotPublished";
import { AdmissionsSection } from "../components/school/AdmissionsSection";
import { AchievementsSection } from "../components/school/AchievementsSection";

export function SchoolProfile() {
  const { slug } = useParams();
  const school = slug ? getSchoolBySlug(slug) : undefined;

  if (!school) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
        <h1 className="text-2xl font-semibold text-neutral-900">School not found</h1>
        <p className="mt-2 text-neutral-600">
          We couldn't find a school at this address.
        </p>
        <Link
          to="/schools"
          className="mt-6 inline-block rounded-md bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800"
        >
          Back to directory
        </Link>
      </div>
    );
  }

  const sections = [
    { id: "overview", label: "Overview" },
    { id: "admissions", label: "Admissions" },
    { id: "principal", label: "Principal's message" },
    { id: "achievements", label: "Achievements" },
    { id: "sources", label: "Sources" },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <Link to="/schools" className="text-sm text-brand-700 hover:underline">
        ← Back to directory
      </Link>

      {/* Header */}
      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
            {school.nameEn}
          </h1>
          {school.nameZh && (
            <p className="mt-1 text-lg text-neutral-500">{school.nameZh}</p>
          )}
        </div>
        <VerificationBadge status={school.verificationStatus} />
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {school.curriculum.map((c) => (
          <Tag key={c} variant="brand">
            {c}
          </Tag>
        ))}
        <Tag variant="neutral">{school.region}</Tag>
        <Tag variant="neutral">{school.district}</Tag>
      </div>

      {/* Quick facts */}
      <dl className="mt-6 grid grid-cols-2 gap-4 rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-sm sm:grid-cols-4">
        <div>
          <dt className="font-medium text-neutral-500">Age range</dt>
          <dd className="mt-0.5 text-neutral-900">
            {school.ageRange.min}–{school.ageRange.max}
          </dd>
        </div>
        <div>
          <dt className="font-medium text-neutral-500">Grade levels</dt>
          <dd className="mt-0.5 text-neutral-900">{school.gradeLevels}</dd>
        </div>
        <div>
          <dt className="font-medium text-neutral-500">School type</dt>
          <dd className="mt-0.5 capitalize text-neutral-900">{school.schoolType}</dd>
        </div>
        <div>
          <dt className="font-medium text-neutral-500">Boarding</dt>
          <dd className="mt-0.5 text-neutral-900">{school.boarding ? "Yes" : "No"}</dd>
        </div>
      </dl>

      {/* Official links */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <a
          href={school.officialWebsite}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-md bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800"
        >
          Official website
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path d="M11 3a1 1 0 1 0 0 2h2.586L8.293 10.293a1 1 0 1 0 1.414 1.414L15 6.414V9a1 1 0 1 0 2 0V4a1 1 0 0 0-1-1h-5Z" />
            <path d="M5 5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-3a1 1 0 1 0-2 0v3H5V7h3a1 1 0 0 0 0-2H5Z" />
          </svg>
        </a>
        {school.officialSocial.map((url) => (
          <a
            key={url}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-brand-700 hover:underline"
          >
            {new URL(url).hostname.replace("www.", "")}
          </a>
        ))}
      </div>

      {/* Section nav */}
      <nav className="mt-8 flex flex-wrap gap-1 border-y border-neutral-200 py-2 text-sm">
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="rounded-md px-3 py-1.5 font-medium text-neutral-600 hover:bg-neutral-50 hover:text-brand-700"
          >
            {s.label}
          </a>
        ))}
      </nav>

      <div className="mt-8 space-y-12">
        <section id="overview" aria-labelledby="overview-heading" className="scroll-mt-24">
          <h2 id="overview-heading" className="text-xl font-semibold text-neutral-900">
            School Introduction
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-neutral-700">
            {school.introEn}
          </p>
          {!school.introZh && (
            <p className="mt-2 text-xs text-neutral-400">
              English only — Traditional Chinese translation not yet available.
            </p>
          )}

          <div className="mt-6">
            <h3 className="text-sm font-semibold text-neutral-700">Address</h3>
            <p className="mt-1 text-sm text-neutral-800">{school.address.lineEn}</p>
            {school.address.lineZh && (
              <p className="text-sm text-neutral-600">{school.address.lineZh}</p>
            )}
          </div>
        </section>

        <div id="admissions">
          <AdmissionsSection admissions={school.admissions} />
        </div>

        <section id="principal" aria-labelledby="principal-heading" className="scroll-mt-24">
          <h2 id="principal-heading" className="text-xl font-semibold text-neutral-900">
            Principal's Message
          </h2>
          {school.principalMessage ? (
            <figure className="mt-4 border-l-4 border-brand-200 pl-4">
              <blockquote className="text-sm italic leading-relaxed text-neutral-700">
                “{school.principalMessage.quote}”
              </blockquote>
              <figcaption className="mt-2 text-sm text-neutral-500">
                — {school.principalMessage.name}
                {", "}
                <a
                  href={school.principalMessage.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-700 hover:underline"
                >
                  source
                </a>
              </figcaption>
            </figure>
          ) : (
            <p className="mt-3 text-sm">
              <NotPublished label="No official principal's message published yet." />
            </p>
          )}
        </section>

        <div id="achievements">
          <AchievementsSection achievements={school.achievements} />
        </div>

        <section id="sources" aria-labelledby="sources-heading" className="scroll-mt-24 border-t border-neutral-200 pt-8">
          <h2 id="sources-heading" className="text-lg font-semibold text-neutral-900">
            Data sources &amp; verification
          </h2>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-neutral-600">
            <VerificationBadge status={school.verificationStatus} />
            <span>
              Last verified:{" "}
              {school.lastVerified ? (
                school.lastVerified
              ) : (
                <NotPublished />
              )}
            </span>
          </div>
          <ul className="mt-3 space-y-1.5 text-sm">
            {school.sources.map((source) => (
              <li key={source.url}>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-700 hover:underline"
                >
                  {source.label}
                </a>
                <span className="text-neutral-400"> — accessed {source.accessedDate}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-neutral-500">
            This profile is compiled from publicly available information. Fees, deadlines,
            and other details change — always confirm directly with the school before
            applying.
          </p>
        </section>
      </div>
    </div>
  );
}
