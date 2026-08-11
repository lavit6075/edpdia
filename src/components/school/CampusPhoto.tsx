import { useState } from "react";
import type { SchoolPhoto } from "../../types/school";
import { useLanguage } from "../../i18n/LanguageContext";
import { PhotoCredit } from "./PhotoCredit";

interface CampusPhotoProps {
  photo: SchoolPhoto;
  schoolName: string;
}

/**
 * The LEAD campus photo — identical treatment for every school regardless of how many photos
 * that school has. This slot is always filled (all 12 schools have at least one), which is what
 * lets a one-photo profile read as complete rather than as a gap.
 *
 * Fixed 3:2 box + object-cover so wildly different source aspects (a 3923x5941 portrait, a
 * 1200x467 ultrawide aerial) all present consistently. object-fit is a display property, not an
 * adaptation: the file served is complete and unmodified, so ShareAlike never attaches to
 * anything around it. It sits in its own bordered <figure> with attribution scoped to the photo.
 */
export function CampusPhoto({ photo, schoolName }: CampusPhotoProps) {
  const { t } = useLanguage();
  const [failed, setFailed] = useState(false);

  if (failed) return null;

  return (
    <figure className="mt-6">
      <div className="aspect-[3/2] w-full overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100">
        <img
          src={photo.url}
          width={photo.width}
          height={photo.height}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          alt={photo.caption || t("profile.photoAlt").replace("{school}", schoolName)}
          className="h-full w-full object-cover"
        />
      </div>
      <PhotoCredit photo={photo} />
    </figure>
  );
}
