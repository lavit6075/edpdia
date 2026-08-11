import { useMemo, useState } from "react";
import { schools, getDistricts, getCurricula, getRegions } from "../lib/schools";
import { SchoolCard } from "../components/school/SchoolCard";
import { useLanguage } from "../i18n/LanguageContext";
import { useSeo } from "../hooks/useSeo";
import { SITE_URL } from "../lib/seo";

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export function Directory() {
  const { t, language } = useLanguage();
  useSeo({
    title: `${t("directory.title")} — ${t("header.brand")}`,
    description: t("directory.subtitle"),
    path: "/schools",
    // Deliberately the FULL set, not the filtered view. Filters are client state that never
    // changes the URL, so the canonical document at /schools is the whole directory; emitting the
    // filtered subset would describe a page no crawler can reach. Each entry is a plain url + name
    // pointing at the profile — the profile carries the School type and the sourced detail. No
    // rating, review or aggregate properties: schema.org offers them, we have nothing to put in
    // them, and inventing them is exactly the rankings-by-the-back-door the site refuses.
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `${t("directory.title")} — ${t("header.brand")}`,
      description: t("directory.subtitle"),
      url: `${SITE_URL}/schools`,
      numberOfItems: schools.length,
      itemListOrder: "https://schema.org/ItemListUnordered",
      itemListElement: schools.map((s, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${SITE_URL}/schools/${s.slug}`,
        name: s.nameEn,
      })),
    },
  });

  const [query, setQuery] = useState("");
  const [regions, setRegions] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [curricula, setCurricula] = useState<string[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const allRegions = useMemo(() => getRegions(), []);
  const allDistricts = useMemo(() => getDistricts(), []);
  const allCurricula = useMemo(() => getCurricula(), []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return schools.filter((school) => {
      if (q) {
        const haystack = `${school.nameEn} ${school.nameZh ?? ""}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (regions.length && !regions.includes(school.region)) return false;
      if (districts.length && !districts.includes(school.district)) return false;
      if (curricula.length && !school.curriculum.some((c) => curricula.includes(c))) {
        return false;
      }
      return true;
    });
  }, [query, regions, districts, curricula]);

  const activeFilterCount = regions.length + districts.length + curricula.length;

  function clearFilters() {
    setQuery("");
    setRegions([]);
    setDistricts([]);
    setCurricula([]);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
          {t("directory.title")}
        </h1>
        <p className="mt-2 text-neutral-600">{t("directory.subtitle")}</p>
      </div>

      <div className="mt-8 flex flex-col gap-8 lg:flex-row">
        {/* Filters */}
        <aside className="lg:w-64 lg:shrink-0">
          <div className="flex items-center justify-between lg:hidden">
            <button
              type="button"
              onClick={() => setFiltersOpen((open) => !open)}
              className="flex items-center gap-2 rounded-md border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-700"
              aria-expanded={filtersOpen}
            >
              {t("directory.filters")}
              {activeFilterCount > 0 && (
                <span className="rounded-full bg-brand-700 px-1.5 py-0.5 text-xs text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          <div className={`${filtersOpen ? "block" : "hidden"} mt-4 lg:mt-0 lg:block`}>
            <div className="sticky top-20 space-y-6">
              <div>
                <label htmlFor="search" className="text-sm font-semibold text-neutral-900">
                  {t("directory.search")}
                </label>
                <input
                  id="search"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t("directory.searchPlaceholder")}
                  className="mt-2 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
                />
              </div>

              <FilterGroup
                title={t("directory.region")}
                options={allRegions}
                optionLabel={(v) => t(`regions.${v}`)}
                selected={regions}
                onToggle={(v) => setRegions((r) => toggle(r, v))}
              />

              <FilterGroup
                title={t("directory.district")}
                options={allDistricts}
                selected={districts}
                onToggle={(v) => setDistricts((d) => toggle(d, v))}
              />

              <FilterGroup
                title={t("directory.curriculum")}
                options={allCurricula}
                selected={curricula}
                onToggle={(v) => setCurricula((c) => toggle(c, v))}
              />

              {activeFilterCount > 0 || query ? (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-sm font-medium text-brand-700 hover:text-brand-800"
                >
                  {t("directory.clearAll")}
                </button>
              ) : null}
            </div>
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1">
          <p className="mb-4 text-sm text-neutral-500">
            {`${results.length} ${t(
              results.length === 1 ? "directory.resultsFoundOne" : "directory.resultsFoundOther",
            )}`}
          </p>

          {results.length === 0 ? (
            <div className="rounded-lg border border-dashed border-neutral-300 bg-neutral-50 px-6 py-16 text-center">
              <h2 className="text-lg font-semibold text-neutral-900">{t("directory.noResultsTitle")}</h2>
              <p className="mt-2 text-sm text-neutral-600">{t("directory.noResultsBody")}</p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 rounded-md bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800"
              >
                {t("directory.clearAll")}
              </button>
            </div>
          ) : (
            <div
              key={`${language}|${query}|${regions.join()}|${districts.join()}|${curricula.join()}`}
              className="fade-swap grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
            >
              {results.map((school) => (
                <SchoolCard key={school.id} school={school} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface FilterGroupProps {
  title: string;
  options: string[];
  optionLabel?: (value: string) => string;
  selected: string[];
  onToggle: (value: string) => void;
}

function FilterGroup({ title, options, optionLabel, selected, onToggle }: FilterGroupProps) {
  if (options.length === 0) return null;
  return (
    <fieldset>
      <legend className="text-sm font-semibold text-neutral-900">{title}</legend>
      <div className="mt-2 max-h-56 space-y-1.5 overflow-y-auto pr-1">
        {options.map((option) => (
          <label key={option} className="flex items-start gap-2 text-sm text-neutral-700">
            <input
              type="checkbox"
              checked={selected.includes(option)}
              onChange={() => onToggle(option)}
              className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-brand-700 focus:ring-brand-500"
            />
            <span>{optionLabel ? optionLabel(option) : option}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
