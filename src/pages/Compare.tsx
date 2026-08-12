import React, { useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useCompare, MAX_COMPARE } from "../context/CompareContext";
import { useLanguage } from "../i18n/LanguageContext";
import {
  getSchoolBySlug,
  getTuitionRange,
  localizeSchoolName,
  schools,
} from "../lib/schools";
import type { School } from "../types/school";
import { formatHKD, NotPublished } from "../components/school/NotPublished";
import { VerificationBadge } from "../components/school/VerificationBadge";
import { useSeo } from "../hooks/useSeo";

function parseSlugs(param: string | null): string[] {
  return (param ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function Compare() {
  const { t, language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const { compareList, setCompareList } = useCompare();

  useSeo({
    title: `${t("compare.title")} — ${t("header.brand")}`,
    description: t("compare.subtitle"),
    path: "/compare",
    noIndex: true,
  });

  const urlSlugs = useMemo(() => parseSlugs(searchParams.get("schools")), [searchParams]);

  useEffect(() => {
    if (urlSlugs.length === 0 && compareList.length > 0) {
      setSearchParams({ schools: compareList.join(",") }, { replace: true });
    }
  }, [urlSlugs.length, compareList, setSearchParams]);

  useEffect(() => {
    if (urlSlugs.length > 0) {
      setCompareList(urlSlugs);
    }
  }, [urlSlugs, setCompareList]);

  const selected = urlSlugs
    .map((slug) => getSchoolBySlug(slug))
    .filter((s): s is NonNullable<typeof s> => Boolean(s))
    .slice(0, MAX_COMPARE);

  function updateUrl(slugs: string[]) {
    if (slugs.length === 0) {
      setSearchParams({}, { replace: true });
    } else {
      setSearchParams({ schools: slugs.join(",") });
    }
  }

  function removeSchool(slug: string) {
    updateUrl(selected.map((s) => s.slug).filter((s) => s !== slug));
  }

  function addSchool(slug: string) {
    if (!slug) return;
    updateUrl([...selected.map((s) => s.slug), slug]);
  }

  const availableToAdd = schools.filter((s) => !selected.some((sel) => sel.slug === s.slug));

  const sections = [
    {
      title: "General",
      rows: [
        { label: t("compare.rowRegion") || "Region", render: (s: School) => t(`regions.${s.region}`) || s.region },
        { label: t("compare.rowDistrict") || "District", render: (s: School) => s.district },
        { label: t("compare.rowAgeRange") || "Age Range", render: (s: School) => `${s.ageRange.min}–${s.ageRange.max}` },
        { label: t("compare.rowGradeLevels") || "Grade Levels", render: (s: School) => s.gradeLevels },
        { label: t("compare.rowSchoolType") || "School Type", render: (s: School) => t(`schoolType.${s.schoolType}`) || s.schoolType },
        { label: t("compare.rowBoarding") || "Boarding", render: (s: School) => (s.boarding ? t("profile.yes") || "Yes" : t("profile.no") || "No") },
      ],
    },
    {
      title: "Academics",
      rows: [
        {
          label: t("compare.rowCurriculum") || "Curriculum",
          render: (s: School) => (
            <div className="flex flex-wrap gap-1">
              {s.curriculum.map((c: string) => (
                <span key={c} className="inline-block rounded bg-neutral-100 px-1.5 py-0.5 text-[11px] font-medium text-neutral-600">
                  {c}
                </span>
              ))}
            </div>
          ),
        },
      ],
    },
    {
      title: "Admissions",
      rows: [
        { label: t("compare.rowApplicationFee") || "Application Fee", render: (s: School) => formatHKD(s.admissions.applicationFee) },
        {
          label: t("compare.rowEntranceExams") || "Entrance Exams",
          render: (s: School) =>
            s.admissions.entranceExams.length > 0 ? s.admissions.entranceExams.join(", ") : <NotPublished />,
        },
      ],
    },
    {
      title: "Financials",
      rows: [
        {
          label: t("compare.rowTuitionRange") || "Tuition Range",
          render: (s: School) => {
            const range = getTuitionRange(s);
            if (!range) return <NotPublished />;
            return range.min === range.max
              ? formatHKD(range.min)
              : `${formatHKD(range.min)} – ${formatHKD(range.max)}`;
          },
        },
        { label: t("compare.rowDebenture") || "Debenture", render: (s: School) => formatHKD(s.admissions.debentureOrCapitalLevy) },
      ],
    },
    {
      title: "Status",
      rows: [
        { label: t("compare.rowVerification") || "Verification", render: (s: School) => <VerificationBadge status={s.verificationStatus} /> },
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="text-center mb-20">
        <h1 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-6xl mb-4">
          {t("compare.title")}
        </h1>
        <p className="text-lg text-neutral-500 max-w-2xl mx-auto">
          {t("compare.subtitle")}
        </p>
      </div>

      {selected.length === 0 ? (
        <div className="rounded-3xl border border-neutral-200 bg-neutral-50 px-6 py-24 text-center">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-2">{t("compare.emptyTitle")}</h2>
          <p className="text-neutral-500 mb-8">{t("compare.emptyBody")}</p>
          <Link
            to="/schools"
            className="inline-block rounded-full bg-brand-700 px-8 py-3 text-sm font-semibold text-white hover:bg-brand-800 transition-all transform hover:scale-105"
          >
            {t("compare.browseDirectory")}
          </Link>
        </div>
      ) : (
        <div className="relative">
          <div className="overflow-x-auto pb-10">
            <table className="w-full min-w-[800px] border-collapse text-left">
              <thead className="sticky top-0 z-20 bg-white/80 backdrop-blur-md">
                <tr className="border-b border-neutral-100">
                  <th className="w-64 py-12 pl-6 pr-4 font-medium text-neutral-400 uppercase tracking-widest text-[11px]">
                    {t("compare.attribute") || "Attribute"}
                  </th>
                  {selected.map((school) => (
                    <th key={school.slug} className="px-6 py-12 align-top relative group">
                      <div className="flex flex-col items-start gap-4">
                        <div className="relative w-full">
                          <button
                            type="button"
                            onClick={() => removeSchool(school.slug)}
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-neutral-100 text-neutral-400 opacity-0 group-hover:opacity-100 hover:bg-neutral-200 transition-all text-xs leading-none"
                          >
                            ×
                          </button>
                          <Link
                            to={`/schools/${school.slug}`}
                            className="text-2xl font-bold text-neutral-900 hover:text-brand-700 transition-colors block leading-tight"
                          >
                            {localizeSchoolName(school, language).text}
                          </Link>
                        </div>
                        <Link
                          to={`/schools/${school.slug}`}
                          className="text-xs font-semibold text-brand-700 hover:underline transition-opacity opacity-70 hover:opacity-100"
                        >
                          {t("compare.viewProfile") || "View full profile"}
                        </Link>
                      </div>
                    </th>
                  ))}
                  
                  {selected.length < MAX_COMPARE && (
                    <th className="px-6 py-12 align-top min-w-[200px]">
                      <div className="flex flex-col items-center justify-center border-2 border-dashed border-neutral-200 rounded-2xl p-4 h-full min-h-[140px] hover:border-brand-300 transition-colors group cursor-pointer">
                        <span className="text-xs font-medium text-neutral-400 mb-3 group-hover:text-brand-500 transition-colors">Add a school</span>
                        <select
                          onChange={(e) => {
                            addSchool(e.target.value);
                            e.target.value = "";
                          }}
                          defaultValue=""
                          className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none bg-white shadow-sm"
                        >
                          <option value="" disabled>Select...</option>
                          {availableToAdd.map((s) => (
                            <option key={s.slug} value={s.slug}>
                              {localizeSchoolName(s, language).text}
                            </option>
                          ))}
                        </select>
                      </div>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {sections.map((section) => (
                  <React.Fragment key={section.title}>
                    <tr className="bg-neutral-50/40">
                      <td colSpan={selected.length + (selected.length < MAX_COMPARE ? 1 : 0) + 1} className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-neutral-400 border-y border-neutral-100">
                        {section.title}
                      </td>
                    </tr>
                    {section.rows.map((row) => (
                      <tr key={row.label} className="hover:bg-neutral-50/20 transition-colors align-middle group">
                        <td className="py-6 pl-6 pr-4 text-sm font-medium text-neutral-500 group-hover:text-neutral-800 transition-colors">
                          {row.label}
                        </td>
                        {selected.map((school) => (
                          <td key={school.slug} className="px-6 py-6 text-sm font-semibold text-neutral-900">
                            {row.render(school)}
                          </td>
                        ))}
                        {selected.length < MAX_COMPARE && <td className="px-6 py-6" />}
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-16 flex justify-center">
            <button
              type="button"
              onClick={() => updateUrl([])}
              className="text-sm font-medium text-neutral-400 hover:text-neutral-600 transition-colors underline underline-offset-4"
            >
              {t("compare.clearAll") || "Clear all"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
