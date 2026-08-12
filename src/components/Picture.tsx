import variants from "../data/image-variants.json";

type Variants = Record<string, { avif?: string; webp?: string }>;
const VARIANTS = variants as Variants;

type PictureProps = Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  /** Path to the ORIGINAL JPEG/PNG. Modern siblings are looked up, never guessed. */
  src: string;
};

/**
 * <picture> with AVIF and WebP sources ahead of the original JPEG/PNG.
 *
 * The variant list is a build-time manifest (src/data/image-variants.json, written by
 * scripts/modernise-images.mjs) rather than a filename convention. That matters: a <source> whose
 * file doesn't exist is a broken image, not a graceful fallback — the browser commits to the first
 * type it supports and does not retry the next one on a 404. Since some images legitimately have
 * no AVIF (four logos where lossless AVIF came out larger than the PNG) and one has no WebP, a
 * convention like "swap the extension" would have shipped exactly that bug.
 *
 * The <img> keeps every attribute passed in — sizing, loading, fetchPriority, alt, className — so
 * this is a drop-in for a plain <img>. Lazy/eager and priority hints belong on the <img>; the
 * browser applies them to whichever <source> it picks.
 */
export function Picture({ src, ...imgProps }: PictureProps) {
  const v = VARIANTS[src];
  return (
    // `contents` removes the <picture> box from layout entirely. Without it the element is an
    // inline box, and every `h-full w-full` image inside an aspect-ratio container would resolve
    // its height against the <picture> rather than the container — silently collapsing photos.
    <picture className="contents">
      {v?.avif && <source srcSet={v.avif} type="image/avif" />}
      {v?.webp && <source srcSet={v.webp} type="image/webp" />}
      <img src={src} {...imgProps} />
    </picture>
  );
}
