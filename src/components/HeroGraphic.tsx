/** Fully original, generated SVG — no photography, no external image, no licence to track.
 *  An abstract skyline/book motif in the brand palette; purely decorative. */
export function HeroGraphic({ className = "" }: { className?: string }) {
  const bars = [
    { x: 0, w: 26, h: 120, fill: "var(--color-brand-200)" },
    { x: 30, w: 34, h: 170, fill: "var(--color-brand-400)" },
    { x: 68, w: 26, h: 90, fill: "var(--color-accent-200)" },
    { x: 98, w: 40, h: 210, fill: "var(--color-brand-600)" },
    { x: 142, w: 28, h: 130, fill: "var(--color-accent-400)" },
    { x: 174, w: 34, h: 160, fill: "var(--color-brand-300)" },
    { x: 212, w: 24, h: 100, fill: "var(--color-accent-300)" },
  ];
  const baseline = 260;

  return (
    <svg
      viewBox="0 0 240 280"
      role="presentation"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <radialGradient id="hero-glow" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="var(--color-accent-100)" stopOpacity="0.6" />
          <stop offset="100%" stopColor="var(--color-accent-100)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="240" height="280" fill="url(#hero-glow)" />
      {bars.map((bar) => (
        <rect
          key={bar.x}
          x={bar.x}
          y={baseline - bar.h}
          width={bar.w}
          height={bar.h}
          rx="4"
          fill={bar.fill}
        />
      ))}
      {/* windows */}
      {bars.flatMap((bar, bi) =>
        Array.from({ length: Math.floor(bar.h / 24) }).map((_, ri) => (
          <rect
            key={`${bi}-${ri}`}
            x={bar.x + bar.w / 2 - 3}
            y={baseline - bar.h + 14 + ri * 24}
            width="6"
            height="8"
            rx="1"
            fill="white"
            opacity="0.55"
          />
        )),
      )}
      <rect x="0" y={baseline} width="240" height="4" rx="2" fill="var(--color-neutral-200)" />
      {/* open-book motif, floating above the skyline */}
      <g transform="translate(60 20)">
        <path
          d="M0 14 C 18 4, 42 4, 60 14 L 60 44 C 42 34, 18 34, 0 44 Z"
          fill="var(--color-brand-700)"
        />
        <path
          d="M60 14 C 78 4, 102 4, 120 14 L 120 44 C 102 34, 78 34, 60 44 Z"
          fill="var(--color-accent-500)"
        />
        <line x1="60" y1="14" x2="60" y2="44" stroke="white" strokeWidth="1.5" opacity="0.5" />
      </g>
    </svg>
  );
}
