import { useState } from "react";
import type { DecorativeImage } from "../lib/decorativeImages";
import { Picture } from "./Picture";

interface DecorativeBannerProps {
  image: DecorativeImage;
  /** Tailwind height classes — the wrapper reserves this space before the image loads. */
  heightClass?: string;
  className?: string;
}

/** Generic decorative photo band. Explicit width/height + a fixed-height wrapper mean the
 *  image never shifts layout as it loads. Credit is rendered as a small overlay because the
 *  licences here require attribution (and CC0 ones get it anyway). */
export function DecorativeBanner({
  image,
  heightClass = "h-40 sm:h-56",
  className = "",
}: DecorativeBannerProps) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;

  return (
    <div className={`relative w-full overflow-hidden bg-neutral-100 ${heightClass} ${className}`}>
      <Picture
        src={image.url}
        width={image.width}
        height={image.height}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        alt={image.title}
        className="h-full w-full object-cover"
      />
      <p className="absolute bottom-0 right-0 bg-black/45 px-2 py-0.5 text-[10px] leading-tight text-white/90">
        <a
          href={image.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          {image.author}
        </a>
        {" · "}
        <a
          href={image.licenceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          {image.licence}
        </a>
      </p>
    </div>
  );
}
