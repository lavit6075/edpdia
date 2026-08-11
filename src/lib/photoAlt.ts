import type { SchoolPhoto } from "../types/school";

/**
 * Alt text for a gallery photo.
 *
 * Commons captions vary from genuinely descriptive ("CIS Main Entrance") to bare repetitions
 * of the school name ("Chinese International School"). Filmstrip photos sit well away from the
 * page heading, so a screen-reader user landing on one needs the school named. This prefixes
 * the school when the caption doesn't already identify it, and avoids stuttering when it does.
 *
 * Card and homepage-strip thumbnails are decorative — the adjacent text names the school — so
 * those keep alt="" and are marked aria-hidden rather than using this.
 */
export function galleryAlt(photo: SchoolPhoto, schoolName: string, fallback: string): string {
  const caption = photo.caption?.trim();
  if (!caption) return fallback;

  const normalise = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const nCaption = normalise(caption);
  const nSchool = normalise(schoolName);

  // Caption already names the school (or is an acronym-led variant of it) — use it as-is.
  if (nCaption.includes(nSchool) || nSchool.includes(nCaption)) return caption;

  const acronym = schoolName
    .split(/\s+/)
    .filter((w) => /^[A-Z]/.test(w))
    .map((w) => w[0])
    .join("");
  if (acronym.length >= 3 && nCaption.includes(acronym.toLowerCase())) return caption;

  return `${schoolName} — ${caption}`;
}
