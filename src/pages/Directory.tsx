import { useMemo, useState } from "react";
import { schools, getDistricts, getCurricula, getRegions } from "../lib/schools";
import { SchoolCard } from "../components/school/SchoolCard";

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export function Directory() {
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
          School Directory
        </h1>
        <p className="mt-2 text-neutral-600">
          Browse Hong Kong international schools by curriculum, district, and age range.
          Information is compiled from public sources — always verify directly with the
          school.
        </p>
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
              Filters
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
                  Search
                </label>
                <input
                  id="search"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="School name…"
                  className="mt-2 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
                />
              </div>

              <FilterGroup
                title="Region"
                options={allRegions}
                selected={regions}
                onToggle={(v) => setRegions((r) => toggle(r, v))}
              />

              <FilterGroup
                title="District"
                options={allDistricts}
                selected={districts}
                onToggle={(v) => setDistricts((d) => toggle(d, v))}
              />

              <FilterGroup
                title="Curriculum"
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
                  Clear all filters
                </button>
              ) : null}
            </div>
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1">
          <p className="mb-4 text-sm text-neutral-500">
            {results.length} school{results.length === 1 ? "" : "s"} found
          </p>

          {results.length === 0 ? (
            <div className="rounded-lg border border-dashed border-neutral-300 bg-neutral-50 px-6 py-16 text-center">
              <h2 className="text-lg font-semibold text-neutral-900">No schools match your filters</h2>
              <p className="mt-2 text-sm text-neutral-600">
                Try removing a filter or searching a different term.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 rounded-md bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
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
  selected: string[];
  onToggle: (value: string) => void;
}

function FilterGroup({ title, options, selected, onToggle }: FilterGroupProps) {
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
            <span>{option}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
