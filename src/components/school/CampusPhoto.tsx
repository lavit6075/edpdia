import { useState } from "react";
import type { SchoolPhoto } from "../../types/school";
import { useLanguage } from "../../i18n/LanguageContext";
import { galleryAlt } from "../../lib/photoAlt";
import { PhotoCredit } from "./PhotoCredit";
import { Picture } from "../Picture";

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
        <Picture
          src={photo.url}
          width={photo.width}
          height={photo.height}
          // Eager + high priority, NOT lazy. This is the LCP element on every profile: a large
          // image high in the document. `loading="lazy"` defers it until layout has run and the
          // lazy-load threshold is evaluated, which on a throttled connection cost ~1.4s of LCP
          // for nothing — the image is above the fold, so it was never going to be skipped.
          // fetchpriority="high" additionally jumps it ahead of the CSS/JS the preload scanner
          // finds alongside it. Every OTHER image on the page stays lazy.
          fetchPriority="high"
          decoding="async"
          onError={() => setFailed(true)}
          alt={galleryAlt(photo, schoolName, t("profile.photoAlt").replace("{school}", schoolName))}
          className="h-full w-full object-cover"
        />
      </div>
      <PhotoCredit photo={photo} />
    </figure>
  );
}
