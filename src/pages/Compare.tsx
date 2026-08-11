import { useEffect, useMemo } from "react";
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

  const urlSlugs = useMemo(() => parseSlugs(searchParams.get("schools")), [searchParams]);

  // If arriving with no URL state but a saved selection exists, promote it into the URL
  // so the comparison becomes shareable immediately.
  useEffect(() => {
    if (urlSlugs.length === 0 && compareList.length > 0) {
      setSearchParams({ schools: compareList.join(",") }, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the persisted selection in sync with whatever's in the URL (e.g. a shared link).
  useEffect(() => {
    if (urlSlugs.length > 0) {
      setCompareList(urlSlugs);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      render: (s) => s.curriculum.join(", "),
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
          <div className="overflow-x-auto rounded-lg border border-neutral-200">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50 text-left">
                  <th className="w-40 py-3 pl-4 pr-2 font-medium text-neutral-500"></th>
                  {selected.map((school) => (
                    <th key={school.slug} className="min-w-[200px] px-4 py-3 align-top">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Link
                            to={`/schools/${school.slug}`}
                            className="font-semibold text-neutral-900 hover:text-brand-700"
                          >
                            {localizeSchoolName(school, language).text}
                          </Link>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeSchool(school.slug)}
                          aria-label={t("compare.removeAria")}
                          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-200 hover:text-neutral-700"
                        >
                          ×
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
              <tbody>
                {rows.map((row) => (
                  <tr key={row.label} className="border-b border-neutral-100 align-top">
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

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {selected.length < MAX_COMPARE ? (
              <label className="flex w-full flex-col gap-2 text-sm text-neutral-700 sm:w-auto sm:flex-row sm:items-center">
                {t("compare.addSchool")}
                <select
                  onChange={(e) => {
                    addSchool(e.target.value);
                    e.target.value = "";
                  }}
                  defaultValue=""
                  className="w-full min-w-0 max-w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm focus:border-brand-500 focus:outline-none sm:w-auto"
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

            <button
              type="button"
              onClick={() => updateUrl([])}
              className="text-sm font-medium text-neutral-500 hover:text-neutral-700"
            >
              {t("compare.clearAll")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
