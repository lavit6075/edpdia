import { Link } from "react-router-dom";
import { schools } from "../lib/schools";
import { SchoolCard } from "../components/school/SchoolCard";
import { HeroGraphic } from "../components/HeroGraphic";
import { CampusStrip } from "../components/CampusStrip";
import { useLanguage } from "../i18n/LanguageContext";

export function Home() {
  const { t } = useLanguage();
  const featured = schools.slice(0, 3);

  const stats = [
    { label: t("home.statSchools"), value: schools.length.toString() },
    { label: t("home.statCurricula"), value: t("home.statCurriculaValue") },
    { label: t("home.statCoverage"), value: t("home.statCoverageValue") },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-neutral-200 bg-neutral-50">
        <div className="mx-auto flex max-w-6xl items-center gap-8 px-4 py-16 sm:px-6 sm:py-24">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">
              {t("home.eyebrow")}
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl">
              {t("home.title")}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-neutral-600">
              {t("home.subtitle")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/schools"
                className="rounded-md bg-brand-700 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-800"
              >
                {t("home.browseSchools")}
              </Link>
              <Link
                to="/contact"
                className="rounded-md border border-neutral-300 px-5 py-3 text-sm font-semibold text-neutral-700 hover:bg-white"
              >
                {t("home.contactUs")}
              </Link>
            </div>
          </div>
          <HeroGraphic className="hidden h-72 w-64 shrink-0 lg:block" />
        </div>
      </section>

      {/* Real campus photography — every school in the directory, not a "featured" subset */}
      <CampusStrip />

      {/* Stats / value prop */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-lg border border-neutral-200 p-5">
              <p className="text-2xl font-semibold text-neutral-900">{stat.value}</p>
              <p className="mt-1 text-sm text-neutral-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Directory teaser */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">
              {t("home.featuredTitle")}
            </h2>
            <p className="mt-1 text-neutral-600">{t("home.featuredSubtitle")}</p>
          </div>
          <Link
            to="/schools"
            className="hidden shrink-0 text-sm font-semibold text-brand-700 hover:underline sm:block"
          >
            {t("home.viewAll")}
          </Link>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {featured.map((school) => (
            <SchoolCard key={school.id} school={school} />
          ))}
        </div>

        <Link
          to="/schools"
          className="mt-6 block text-center text-sm font-semibold text-brand-700 hover:underline sm:hidden"
        >
          {t("home.viewAll")}
        </Link>
      </section>

      {/* Neutrality commitment */}
      <section className="border-t border-neutral-200 bg-neutral-50">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="grid gap-8 sm:grid-cols-3">
            <div>
              <h3 className="text-base font-semibold text-neutral-900">{t("home.noRankingsTitle")}</h3>
              <p className="mt-2 text-sm text-neutral-600">{t("home.noRankingsBody")}</p>
            </div>
            <div>
              <h3 className="text-base font-semibold text-neutral-900">{t("home.sourcedTitle")}</h3>
              <p className="mt-2 text-sm text-neutral-600">{t("home.sourcedBody")}</p>
            </div>
            <div>
              <h3 className="text-base font-semibold text-neutral-900">{t("home.verifyTitle")}</h3>
              <p className="mt-2 text-sm text-neutral-600">{t("home.verifyBody")}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
