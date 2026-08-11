import { Link } from "react-router-dom";
import { schools, localizeSchoolName } from "../lib/schools";
import { useLanguage } from "../i18n/LanguageContext";

/**
 * Homepage band of real campus photography — every school in the directory, in directory
 * order, scrolling horizontally.
 *
 * Deliberately NOT a "featured" selection: picking a subset would imply an editorial ranking
 * we can't source and don't want to imply, which would cut against the no-rankings principle.
 * Every school gets in; the row scrolls rather than curating.
 */
export function CampusStrip() {
  const { language, t } = useLanguage();

  return (
    <section className="border-y border-neutral-200 bg-neutral-50 py-6" aria-label={t("home.campusStripLabel")}>
      <ul className="mx-auto flex max-w-6xl gap-3 overflow-x-auto px-4 pb-2 sm:px-6">
        {schools.map((school) => {
          const photo = school.photos[0];
          if (!photo) return null;
          const name = localizeSchoolName(school, language).text;
          return (
            <li key={school.id} className="shrink-0">
              <Link to={`/schools/${school.slug}`} className="group block w-44 sm:w-56">
                <div className="aspect-[4/3] w-full overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100">
                  <img
                    src={photo.thumbUrl}
                    width={photo.thumbWidth}
                    height={photo.thumbHeight}
                    loading="lazy"
                    decoding="async"
                    alt=""
                    aria-hidden="true"
                    className="h-full w-full object-cover transition-transform duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-[1.03]"
                  />
                </div>
                <p className="mt-2 truncate text-xs font-medium text-neutral-700 group-hover:text-brand-700">
                  {name}
                </p>
                <p className="text-[11px] leading-tight text-neutral-400">
                  {photo.author} · {photo.licence}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
      <p className="mx-auto max-w-6xl px-4 text-[11px] text-neutral-400 sm:px-6">
        {t("profile.photoLicenceScope")}
      </p>
    </section>
  );
}
