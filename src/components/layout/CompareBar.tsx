import { Link, useLocation } from "react-router-dom";
import { useCompare } from "../../context/CompareContext";
import { useLanguage } from "../../i18n/LanguageContext";
import { getSchoolBySlug, localizeSchoolName } from "../../lib/schools";

export function CompareBar() {
  const { compareList, toggleCompare, clearCompare } = useCompare();
  const { language, t } = useLanguage();
  const location = useLocation();

  if (compareList.length === 0 || location.pathname === "/compare") return null;

  const schools = compareList
    .map((slug) => getSchoolBySlug(slug))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-neutral-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
        {/* Compact summary on small screens; full chip list from sm up. */}
        <p className="flex-1 text-sm font-medium text-neutral-700 sm:hidden">
          {`${compareList.length} ${t("compareBar.selected")}`}
        </p>
        <div className="hidden flex-1 flex-wrap items-center gap-2 sm:flex">
          {schools.map((school) => (
            <span
              key={school.slug}
              className="inline-flex max-w-[220px] items-center gap-1.5 rounded-full bg-neutral-100 py-1 pl-3 pr-1.5 text-xs font-medium text-neutral-700"
            >
              <span className="truncate">{localizeSchoolName(school, language).text}</span>
              <button
                type="button"
                onClick={() => toggleCompare(school.slug)}
                aria-label={t("compareBar.clear")}
                className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-200 hover:text-neutral-700"
              >
                ×
              </button>
            </span>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-3">
          {compareList.length < 2 ? (
            <span className="text-xs text-neutral-500">{t("compareBar.needMore")}</span>
          ) : (
            <Link
              to={`/compare?schools=${compareList.join(",")}`}
              className="rounded-md bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800"
            >
              {`${t("compareBar.compareButton")} (${compareList.length})`}
            </Link>
          )}
          <button
            type="button"
            onClick={clearCompare}
            className="text-sm font-medium text-neutral-500 hover:text-neutral-700"
          >
            {t("compareBar.clear")}
          </button>
        </div>
      </div>
    </div>
  );
}
