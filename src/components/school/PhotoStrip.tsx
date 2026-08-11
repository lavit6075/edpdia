import type { SchoolPhoto } from "../../types/school";
import { useLanguage } from "../../i18n/LanguageContext";
import { galleryAlt } from "../../lib/photoAlt";

interface PhotoStripProps {
  photos: SchoolPhoto[];
  schoolName: string;
}

/**
 * Optional filmstrip of additional campus photos.
 *
 * Why this shape, given counts range 1–8 across the directory:
 * - It renders NOTHING when there are no extra photos. No empty state, no placeholder, no
 *   "1 of 1". Because it is the last element in the Overview section, its absence closes the
 *   section cleanly on the address block — a one-photo school looks finished, not short.
 * - It is a flex row of CONTENT-WIDTH items at a fixed height, not a grid. A grid has cells
 *   that can sit empty; a row of natural-width items cannot. So "broken" is not a reachable
 *   state — one item is a filmstrip with one entry, eight items scroll.
 * - No count is ever displayed. The moment a counter exists, 1 reads as a deficiency.
 *
 * Each thumbnail opens its Commons file page in a new tab — full resolution and full
 * attribution, without dropping a parent out of the profile they were reading.
 */
export function PhotoStrip({ photos, schoolName }: PhotoStripProps) {
  const { t } = useLanguage();
  if (photos.length === 0) return null;

  return (
    <section className="mt-8" aria-label={t("profile.morePhotos")}>
      <h3 className="text-sm font-semibold text-neutral-700">{t("profile.morePhotos")}</h3>
      <ul className="mt-3 flex gap-3 overflow-x-auto pb-2">
        {photos.map((photo) => (
          <li key={photo.sourceUrl} className="shrink-0">
            <a
              href={photo.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              title={`${photo.author} · ${photo.licence}`}
              className="group block"
            >
              <img
                src={photo.thumbUrl}
                width={photo.thumbWidth}
                height={photo.thumbHeight}
                loading="lazy"
                decoding="async"
                alt={galleryAlt(photo, schoolName, t("profile.photoAlt").replace("{school}", schoolName))}
                className="h-28 w-auto rounded-md border border-neutral-200 object-cover transition-opacity duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:opacity-85"
              />
              <span className="mt-1 block max-w-[15rem] text-[11px] leading-tight text-neutral-400">
                {photo.author} · {photo.licence}
              </span>
            </a>
          </li>
        ))}
      </ul>
      <p className="text-[11px] text-neutral-400">{t("profile.photoLicenceScope")}</p>
    </section>
  );
}
