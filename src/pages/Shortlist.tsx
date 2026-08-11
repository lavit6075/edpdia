import { Link } from "react-router-dom";
import { useShortlist } from "../context/ShortlistContext";
import { getSchoolBySlug } from "../lib/schools";
import { SchoolCard } from "../components/school/SchoolCard";
import { useLanguage } from "../i18n/LanguageContext";
import { useSeo } from "../hooks/useSeo";

export function Shortlist() {
  const { t } = useLanguage();

  // noIndex: contents come from the visitor's own localStorage, so the prerendered version is an
  // empty list. Indexing that would list a permanently empty page against a useful-sounding title.
  useSeo({
    title: `${t("shortlist.title")} — ${t("header.brand")}`,
    description: t("shortlist.subtitle"),
    path: "/shortlist",
    noIndex: true,
  });
  const { shortlist } = useShortlist();
  const schools = shortlist
    .map((slug) => getSchoolBySlug(slug))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
          {t("shortlist.title")}
        </h1>
        <p className="mt-2 text-neutral-600">{t("shortlist.subtitle")}</p>
      </div>

      {schools.length === 0 ? (
        <div className="mt-8 rounded-lg border border-dashed border-neutral-300 bg-neutral-50 px-6 py-16 text-center">
          <h2 className="text-lg font-semibold text-neutral-900">{t("shortlist.emptyTitle")}</h2>
          <p className="mt-2 text-sm text-neutral-600">{t("shortlist.emptyBody")}</p>
          <Link
            to="/schools"
            className="mt-4 inline-block rounded-md bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800"
          >
            {t("shortlist.browseDirectory")}
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {schools.map((school) => (
            <SchoolCard key={school.id} school={school} />
          ))}
        </div>
      )}
    </div>
  );
}
