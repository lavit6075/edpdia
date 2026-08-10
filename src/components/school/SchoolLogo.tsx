import { useState } from "react";
import type { School } from "../../types/school";
import { PlaceholderLogo } from "./PlaceholderLogo";

interface SchoolLogoProps {
  school: Pick<School, "nameEn" | "curriculum" | "slug" | "logoUrl">;
  className?: string;
}

/** Renders the school's real logo (hotlinked from their own site) when available and
 *  loadable; falls back to a generated placeholder otherwise — never a blank/broken image. */
export function SchoolLogo({ school, className = "" }: SchoolLogoProps) {
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
      loading="lazy"
      onError={() => setFailed(true)}
      className={`object-contain ${className}`}
    />
  );
}
