import { Link, useParams } from "react-router-dom";
import type { School } from "../types/school";
import { getSchoolBySlug, localizeAddress, localizeIntro, localizeSchoolName } from "../lib/schools";
import { Tag } from "../components/school/Tag";
import { VerificationBadge } from "../components/school/VerificationBadge";
import { NotPublished } from "../components/school/NotPublished";
import { AdmissionsSection } from "../components/school/AdmissionsSection";
import { AchievementsSection } from "../components/school/AchievementsSection";
import { SchoolLogo } from "../components/school/SchoolLogo";
import { CampusPhoto } from "../components/school/CampusPhoto";
import { PhotoStrip } from "../components/school/PhotoStrip";
import { useLanguage } from "../i18n/LanguageContext";
import { useSeo } from "../hooks/useSeo";
import { SITE_URL } from "../lib/seo";

/**
 * Split in two so hooks are never called conditionally: the outer component resolves the slug
 * and renders the not-found state, the inner one only ever runs with a school in hand.
 */
export function SchoolProfile() {
  const { slug } = useParams();
  const school = slug ? getSchoolBySlug(slug) : undefined;
  if (!school) return <SchoolNotFound />;
  return <SchoolProfileView school={school} />;
}

function SchoolNotFound() {
  const { t } = useLanguage();
  useSeo({
    title: `${t("profile.notFoundTitle")} — ${t("header.brand")}`,
    description: t("profile.notFoundBody"),
    path: "/schools",
  });
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
      <h1 className="text-2xl font-semibold text-neutral-900">{t("profile.notFoundTitle")}</h1>
      <p className="mt-2 text-neutral-600">{t("profile.notFoundBody")}</p>
      <Link
        to="/schools"
        className="mt-6 inline-block rounded-md bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800"
      >
        {t("profile.backToDirectoryButton")}
      </Link>
    </div>
  );
}

function SchoolProfileView({ school }: { school: School }) {
  const { language, t } = useLanguage();

  const name = localizeSchoolName(school, language);
  const intro = localizeIntro(school, language);
  const address = localizeAddress(school, language);
  const secondaryName = language === "en" ? school.nameZh : name.isFallback ? null : school.nameEn;

  const lead = school.photos[0];
  const schoolLd = {
    "@context": "https://schema.org",
    "@type": "School",
    name: school.nameEn,
    ...(school.nameZh ? { alternateName: school.nameZh } : {}),
    description: school.introEn,
    url: `${SITE_URL}/schools/${school.slug}`,
    sameAs: [school.officialWebsite, ...school.officialSocial].filter(Boolean),
    ...(lead ? { image: `${SITE_URL}${lead.url}` } : {}),
    address: {
      "@type": "PostalAddress",
      streetAddress: school.address.lineEn,
      addressLocality: school.district,
      addressRegion: school.region,
      addressCountry: "HK",
    },
  };

  const sections = [
    { id: "overview", label: t("profile.sectionOverview") },
    { id: "admissions", label: t("profile.sectionAdmissions") },
    { id: "principal", label: t("profile.sectionPrincipal") },
    { id: "achievements", label: t("profile.sectionAchievements") },
    { id: "sources", label: t("profile.sectionSources") },
  ];

  useSeo({
    title: `${name.text} — ${t("header.brand")}`,
    description: intro.text.slice(0, 155),
    path: `/schools/${school.slug}`,
    image: lead?.url,
    type: "article",
    jsonLd: schoolLd,
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <Link to="/schools" className="text-sm text-brand-700 hover:underline">
        {t("profile.backToDirectory")}
      </Link>

      {/* Header */}
      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-neutral-200 bg-white p-1">
            <SchoolLogo school={school} size={80} />
          </div>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">{name.text}</h1>
            {secondaryName && <p className="mt-1 text-lg text-neutral-500">{secondaryName}</p>}
          </div>
        </div>
        <VerificationBadge status={school.verificationStatus} />
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {school.curriculum.map((c) => (
          <Tag key={c} variant="brand">
            {c}
          </Tag>
        ))}
        <Tag variant="neutral">{t(`regions.${school.region}`)}</Tag>
        <Tag variant="neutral">{school.district}</Tag>
      </div>

      {/* Quick facts */}
      <dl className="mt-6 grid grid-cols-2 gap-4 rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-sm sm:grid-cols-4">
        <div>
          <dt className="font-medium text-neutral-500">{t("profile.ageRange")}</dt>
          <dd className="mt-0.5 text-neutral-900">
            {`${school.ageRange.min}–${school.ageRange.max}`}
          </dd>
        </div>
        <div>
          <dt className="font-medium text-neutral-500">{t("profile.gradeLevels")}</dt>
          <dd className="mt-0.5 text-neutral-900">{school.gradeLevels}</dd>
        </div>
        <div>
          <dt className="font-medium text-neutral-500">{t("profile.schoolType")}</dt>
          <dd className="mt-0.5 text-neutral-900">{t(`schoolType.${school.schoolType}`)}</dd>
        </div>
        <div>
          <dt className="font-medium text-neutral-500">{t("profile.boarding")}</dt>
          <dd className="mt-0.5 text-neutral-900">
            {school.boarding ? t("profile.yes") : t("profile.no")}
          </dd>
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
          {t("profile.officialWebsite")}
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

      <div className="mt-8 space-y-16">
        <section id="overview" aria-labelledby="overview-heading" className="scroll-mt-24">
          <h2 id="overview-heading" className="text-xl font-semibold text-neutral-900">
            {t("profile.introHeading")}
          </h2>
          {school.photos.length > 0 && (
            <CampusPhoto photo={school.photos[0]} schoolName={name.text} />
          )}

          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-neutral-700">{intro.text}</p>
          {intro.isFallback && (
            <p className="mt-2 text-xs text-neutral-400">{t("profile.englishOnlyNote")}</p>
          )}

          <div className="mt-6">
            <h3 className="text-sm font-semibold text-neutral-700">{t("profile.addressHeading")}</h3>
            <p className="mt-1 text-sm text-neutral-800">{address.text}</p>
          </div>

          {/* Last in the section: when a school has only one photo this renders nothing and
              Overview simply closes on the address block. */}
          <PhotoStrip photos={school.photos.slice(1)} schoolName={name.text} />
        </section>

        <div id="admissions">
          <AdmissionsSection admissions={school.admissions} />
        </div>

        <section id="principal" aria-labelledby="principal-heading" className="scroll-mt-24">
          <h2 id="principal-heading" className="text-xl font-semibold text-neutral-900">
            {t("profile.principalHeading")}
          </h2>
          {school.principalMessage ? (
            <figure className="mt-4 border-l-4 border-brand-200 pl-4">
              <blockquote className="text-sm italic leading-relaxed text-neutral-700">
                {`“${school.principalMessage.quote}”`}
              </blockquote>
              <figcaption className="mt-2 text-sm text-neutral-500">
                {`— ${school.principalMessage.name}, `}
                <a
                  href={school.principalMessage.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-700 hover:underline"
                >
                  {t("profile.source")}
                </a>
              </figcaption>
            </figure>
          ) : (
            <p className="mt-3 text-sm">
              <NotPublished label={t("profile.noPrincipalMessage")} />
            </p>
          )}
        </section>

        <div id="achievements">
          <AchievementsSection achievements={school.achievements} />
        </div>

        <section id="sources" aria-labelledby="sources-heading" className="scroll-mt-24 border-t border-neutral-200 pt-8">
          <h2 id="sources-heading" className="text-lg font-semibold text-neutral-900">
            {t("profile.sourcesHeading")}
          </h2>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-neutral-600">
            <VerificationBadge status={school.verificationStatus} />
            <span>
              {school.lastVerified ? (
                `${t("profile.lastVerified")} ${school.lastVerified}`
              ) : (
                <>
                  {`${t("profile.lastVerified")} `}
                  <NotPublished />
                </>
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
                <span className="text-neutral-400">
                  {` — ${t("profile.accessedLabel")} ${source.accessedDate}`}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-neutral-500">{t("profile.verificationFootnote")}</p>
        </section>
      </div>
    </div>
  );
}
