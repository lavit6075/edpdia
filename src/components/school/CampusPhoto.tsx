import { useState } from "react";
import type { SchoolPhoto } from "../../types/school";
import { useLanguage } from "../../i18n/LanguageContext";

interface CampusPhotoProps {
  photo: SchoolPhoto;
  schoolName: string;
}

/**
 * A freely-licensed Commons photo, hotlinked and displayed as a self-contained illustration.
 *
 * Licence hygiene (most of these are CC BY-SA):
 * - The image is shown **complete and unmodified** — `object-contain`, never `object-cover`.
 *   A CSS crop would be a visual adaptation; displaying the whole frame keeps this pure
 *   reproduction, so ShareAlike's adaptation clause is never engaged.
 * - It sits inside its own bordered <figure>, visually delineated from the surrounding page,
 *   so the photo reads as a discrete included work rather than part of a combined whole.
 * - The <figcaption> names the author and licence (both linked) and states explicitly that the
 *   licence covers the photograph only — nothing here implies ShareAlike over Edpdia's own
 *   surrounding content.
 *
 * Explicit width/height plus a fixed aspect-ratio box reserve the space, so loading never
 * shifts layout.
 */
export function CampusPhoto({ photo, schoolName }: CampusPhotoProps) {
  const { t } = useLanguage();
  const [failed, setFailed] = useState(false);

  if (failed) return null;

  return (
    <figure className="mt-6 max-w-2xl">
      <div
        className="flex items-center justify-center overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50"
        style={{ aspectRatio: `${photo.width} / ${photo.height}`, maxHeight: "20rem" }}
      >
        <img
          src={photo.url}
          width={photo.width}
          height={photo.height}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          alt={t("profile.photoAlt").replace("{school}", schoolName)}
          className="h-full w-full object-contain"
        />
      </div>
      <figcaption className="mt-2 text-xs leading-relaxed text-neutral-500">
        <span>
          {t("profile.photoCreditPrefix")}{" "}
          <a
            href={photo.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-700 hover:underline"
          >
            {photo.author}
          </a>
          {" · "}
          {photo.licenceUrl ? (
            <a
              href={photo.licenceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-700 hover:underline"
            >
              {photo.licence}
            </a>
          ) : (
            photo.licence
          )}
          {" · "}
          {t("profile.photoViaCommons")}
        </span>
        <span className="mt-0.5 block text-neutral-400">{t("profile.photoLicenceScope")}</span>
      </figcaption>
    </figure>
  );
}
