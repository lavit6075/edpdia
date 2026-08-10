import { getCurriculumTheme, getInitials } from "../../lib/curriculumTheme";

interface PlaceholderLogoProps {
  nameEn: string;
  curriculum: string[];
  seed: string;
  className?: string;
}

/** Fully generated (no external asset) — an original SVG, never a photo or a copied logo. */
export function PlaceholderLogo({ nameEn, curriculum, seed, className = "" }: PlaceholderLogoProps) {
  const theme = getCurriculumTheme(curriculum, seed);
  const initials = getInitials(nameEn);
  const patternId = `pat-${seed.replace(/[^a-z0-9]/gi, "")}`;

  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-label={`${nameEn} (logo not available)`}
      className={className}
    >
      <defs>
        <pattern id={patternId} width="10" height="10" patternUnits="userSpaceOnUse">
          {theme.pattern === "dots" && <circle cx="2" cy="2" r="1.4" fill={theme.fg} opacity="0.18" />}
          {theme.pattern === "stripes" && (
            <path d="M-2 8 L8 -2" stroke={theme.fg} strokeWidth="2" opacity="0.16" />
          )}
          {theme.pattern === "grid" && (
            <path d="M0 0 H10 M0 0 V10" stroke={theme.fg} strokeWidth="1" opacity="0.16" />
          )}
          {theme.pattern === "waves" && (
            <path d="M0 5 Q2.5 2 5 5 T10 5" stroke={theme.fg} strokeWidth="1.2" fill="none" opacity="0.2" />
          )}
        </pattern>
      </defs>
      <rect width="64" height="64" rx="12" fill={theme.bg} />
      <rect width="64" height="64" rx="12" fill={`url(#${patternId})`} />
      <text
        x="32"
        y="32"
        textAnchor="middle"
        dominantBaseline="central"
        fill={theme.fg}
        fontSize={initials.length > 3 ? "17" : "21"}
        fontWeight="700"
        fontFamily="var(--font-sans)"
      >
        {initials}
      </text>
    </svg>
  );
}
