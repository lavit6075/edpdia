import { useState } from "react";
import type { School } from "../../types/school";
import { PlaceholderLogo } from "./PlaceholderLogo";

interface SchoolLogoProps {
  school: Pick<School, "nameEn" | "curriculum" | "slug" | "logoUrl">;
  /** Rendered box size in px — used for width/height so the image reserves space (no CLS). */
  size?: number;
  className?: string;
}

/** Renders the school's real logo (hotlinked from their own site) when available and
 *  loadable; falls back to a generated placeholder otherwise — never a blank/broken image.
 *
 *  object-contain + inner padding keeps every logo fully visible and correctly proportioned,
 *  including wide wordmarks (e.g. Nord Anglia is 286x48) which would otherwise be cropped. */
export function SchoolLogo({ school, size = 44, className = "" }: SchoolLogoProps) {
  const [failed, setFailed] = useState(false);

  if (!school.logoUrl || failed) {
    return (
      <PlaceholderLogo
        nameEn={school.nameEn}
        curriculum={school.curriculum}
        seed={school.slug}
        className={className}
      />
    );
  }

  return (
    <img
      src={school.logoUrl}
      alt={`${school.nameEn} logo`}
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={`h-full w-full object-contain p-1 ${className}`}
    />
  );
}
