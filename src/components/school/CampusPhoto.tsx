import { useState } from "react";
import type { SchoolPhoto } from "../../types/school";
import { useLanguage } from "../../i18n/LanguageContext";

interface CampusPhotoProps {
  photo: SchoolPhoto;
  schoolName: string;
}

/** Hotlinked freely-licensed Commons photo. Renders the attribution the licence requires
 *  directly beneath the image. Explicit width/height + aspect-ratio reserve the space so
 *  the image loading never shifts layout. */
export function CampusPhoto({ photo, schoolName }: CampusPhotoProps) {
  const { t } = useLanguage();
  const [failed, setFailed] = useState(false);

  if (failed) return null;

  return (
    <figure className="mt-6">
      <div
        className="overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100"
        style={{ aspectRatio: `${photo.width} / ${photo.height}`, maxHeight: "22rem" }}
      >
        <img
          src={photo.url}
          width={photo.width}
          height={photo.height}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          alt={t("profile.photoAlt").replace("{school}", schoolName)}
          className="h-full w-full object-cover"
        />
      </div>
      <figcaption className="mt-2 text-xs text-neutral-500">
        {t("profile.photoCreditPrefix")}{" "}
        <a
          href={photo.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-700 hover:underline"
        >
          {photo.author}
        </a>
        {", "}
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
      </figcaption>
    </figure>
  );
}
