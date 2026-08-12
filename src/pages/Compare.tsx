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
  }, []);

  useEffect(() => {
    if (urlSlugs.length > 0) {
      setCompareList(urlSlugs);
    }
  }, [searchParams]);

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

  const rows: {
    label: string;
    render: (school: (typeof schools)[number]) => React.ReactNode;
  }[] = [
    { label: t("compare.rowRegion"), render: (s) => t(`regions.${s.region}`) },
    { label: t("compare.rowDistrict"), render: (s) => s.district },
    {
      label: t("compare.rowCurriculum"),
      render: (s) => (
        <div className="flex flex-wrap gap-1">
          {s.curriculum.map((c) => (
            <span key={c} className="inline-block rounded bg-neutral-100 px-1.5 py-0.5 text-[11px] font-medium text-neutral-600">
              {c}
            </span>
          ))}
        </div>
      ),
    },
    {
      label: t("compare.rowAgeRange"),
      render: (s) => `${s.ageRange.min}–${s.ageRange.max}`,
    },
    { label: t("compare.rowGradeLevels"), render: (s) => s.gradeLevels },
    {
      label: t("compare.rowSchoolType"),
      render: (s) => t(`schoolType.${s.schoolType}`),
    },
    {
      label: t("compare.rowBoarding"),
      render: (s) => (s.boarding ? t("profile.yes") : t("profile.no")),
    },
    {
      label: t("compare.rowTuitionRange"),
      render: (s) => {
        const range = getTuitionRange(s);
        if (!range) return <NotPublished />;
        return range.min === range.max
          ? formatHKD(range.min)
          : `${formatHKD(range.min)} – ${formatHKD(range.max)}`;
      },
    },
    {
      label: t("compare.rowApplicationFee"),
      render: (s) => formatHKD(s.admissions.applicationFee),
    },
    {
      label: t("compare.rowDebenture"),
      render: (s) => formatHKD(s.admissions.debentureOrCapitalLevy),
    },
    {
      label: t("compare.rowEntranceExams"),
      render: (s) =>
        s.admissions.entranceExams.length > 0 ? s.admissions.entranceExams.join(", ") : <NotPublished />,
    },
    {
      label: t("compare.rowVerification"),
      render: (s) => <VerificationBadge status={s.verificationStatus} />,
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">{t("compare.title")}</h1>
        <p className="mt-2 text-neutral-600">{t("compare.subtitle")}</p>
      </div>

      {selected.length === 0 ? (
        <div className="mt-8 rounded-lg border border-dashed border-neutral-300 bg-neutral-50 px-6 py-16 text-center">
          <h2 className="text-lg font-semibold text-neutral-900">{t("compare.emptyTitle")}</h2>
          <p className="mt-2 text-sm text-neutral-600">{t("compare.emptyBody")}</p>
          <Link
            to="/schools"
            className="mt-4 inline-block rounded-md bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800"
          >
            {t("compare.browseDirectory")}
          </Link>
        </div>
      ) : (
        <div className="mt-8">
          {selected.length > 1 && (
            <p className="mb-2 text-xs font-medium text-neutral-500 sm:hidden">
              {t("compare.swipeHint")}
            </p>
          )}
          <div className="overflow-x-auto rounded-xl border border-neutral-200 shadow-sm">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead className="bg-neutral-50">
                <tr className="border-b border-neutral-200 text-left">
                  <th className="w-48 py-4 pl-4 pr-2 font-semibold text-neutral-500 uppercase tracking-wider text-[11px]">
                    {t("compare.attribute") || "Attribute"}
                  </th>
                  {selected.map((school) => (
                    <th key={school.slug} className="min-w-[200px] px-4 py-4 align-top">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <Link
                            to={`/schools/${school.slug}`}
                            className="text-base font-bold text-neutral-900 hover:text-brand-700 transition-colors"
                          >
                            {localizeSchoolName(school, language).text}
                          </Link>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeSchool(school.slug)}
                          aria-label={t("compare.removeAria")}
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-200 hover:text-neutral-700"
                        >
                          <span className="text-lg">×</span>
                        </button>
                      </div>
                      <Link
                        to={`/schools/${school.slug}`}
                        className="mt-1 inline-block text-xs font-medium text-brand-700 hover:underline"
                      >
                        {t("compare.viewProfile")}
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {rows.map((row) => (
                  <tr key={row.label} className="hover:bg-neutral-50/50 transition-colors align-top">
                    <th className="py-3 pl-4 pr-2 text-left font-medium text-neutral-500">
                      {row.label}
                    </th>
                    {selected.map((school) => (
                      <td key={school.slug} className="px-4 py-3 text-neutral-800">
                        {row.render(school)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-1">
              {selected.length < MAX_COMPARE ? (
                <label className="flex items-center gap-3 text-sm text-neutral-700">
                  <span className="font-medium">{t("compare.addSchool")}</span>
                  <select
                    onChange={(e) => {
                      addSchool(e.target.value);
                      e.target.value = "";
                    }}
                    defaultValue=""
                    className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 bg-white"
                  >
                    <option value="" disabled>
                      {t("compare.addSchoolPlaceholder")}
                    </option>
                    {availableToAdd.map((s) => (
                      <option key={s.slug} value={s.slug}>
                        {localizeSchoolName(s, language).text}
                      </option>
                    ))}
                  </select>
                </label>
              ) : (
                <p className="text-sm text-neutral-500">{t("compare.maxReachedNote")}</p>
              )}
            </div>

            <button
              type="button"
              onClick={() => updateUrl([])}
              className="text-sm font-medium text-neutral-500 hover:text-neutral-700 underline underline-offset-4"
            >
              {t("compare.clearAll")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
