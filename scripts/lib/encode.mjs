/**
 * Shared encoding helpers: SSIM measurement and a quality search that targets a fidelity floor
 * rather than a fixed quality number.
 *
 * Why SSIM rather than "just use q75": a fixed quality number means something different in every
 * codec and on every image. A flat sky and a tree canopy at the same nominal quality land in
 * wildly different places both for size and for visible damage. Searching for the smallest file
 * that still clears an SSIM floor gives one honest guarantee across 117 mixed images.
 *
 * NOTE ON THE SOURCE: the JPEGs/PNGs in public/img are already lossy output from the Phase 1
 * downscale, and the pre-downscale originals were not retained. So SSIM here measures fidelity to
 * *what is currently shipped*, not to the camera original. That is the right target — the goal is
 * to store the approved image in fewer bytes, not to recover detail that is already gone.
 */
import sharp from "sharp";

/**
 * Mean SSIM over the luma plane, 8x8 windows.
 * Standard constants for 8-bit data: C1 = (0.01*255)^2, C2 = (0.03*255)^2.
 */
export async function ssim(bufA, bufB) {
  const toGray = async (b) => {
    const img = sharp(b).greyscale().raw();
    const { data, info } = await img.toBuffer({ resolveWithObject: true });
    return { data, w: info.width, h: info.height };
  };
  const [a, b] = await Promise.all([toGray(bufA), toGray(bufB)]);
  if (a.w !== b.w || a.h !== b.h) throw new Error(`dimension mismatch ${a.w}x${a.h} vs ${b.w}x${b.h}`);

  const C1 = 6.5025, C2 = 58.5225, W = 8;
  let total = 0, windows = 0;

  for (let y = 0; y + W <= a.h; y += W) {
    for (let x = 0; x + W <= a.w; x += W) {
      let sa = 0, sb = 0, saa = 0, sbb = 0, sab = 0;
      for (let j = 0; j < W; j++) {
        const row = (y + j) * a.w + x;
        for (let i = 0; i < W; i++) {
          const va = a.data[row + i], vb = b.data[row + i];
          sa += va; sb += vb; saa += va * va; sbb += vb * vb; sab += va * vb;
        }
      }
      const n = W * W;
      const ma = sa / n, mb = sb / n;
      const va = saa / n - ma * ma, vb = sbb / n - mb * mb, cov = sab / n - ma * mb;
      total += ((2 * ma * mb + C1) * (2 * cov + C2)) / ((ma * ma + mb * mb + C1) * (va + vb + C2));
      windows++;
    }
  }
  return windows ? total / windows : 1;
}

const ENCODERS = {
  avif: (img, q, effort) => img.avif({ quality: q, effort, chromaSubsampling: "4:2:0" }).toBuffer(),
  webp: (img, q, effort) => img.webp({ quality: q, effort: Math.min(effort, 6) }).toBuffer(),
};

/** Lossless encode — for flat-colour graphics (logos) where lossy codecs mangle hard edges. */
export async function encodeLossless(input, format) {
  const img = sharp(input);
  const buf =
    format === "avif"
      ? await img.avif({ lossless: true, effort: 9 }).toBuffer()
      : await img.webp({ lossless: true, effort: 6 }).toBuffer();
  return { buf, quality: "lossless", ssim: 1 };
}

/**
 * Smallest encoding of `input` in `format` whose SSIM against the source clears `floor`.
 * Binary search over quality; returns null if even `max` can't reach the floor.
 *
 * The search runs at a low effort setting and only the winning quality is re-encoded at full
 * effort. Effort changes how hard the encoder works at a given quality, not the quality target,
 * so the chosen q is stable between the two — and this turns ~8 slow encodes into 7 fast ones
 * plus 1 slow one. The final buffer is re-checked against the floor in case the effort change
 * moved SSIM at all; if it dipped, the search result stands.
 */
export async function encodeToFloor(input, format, floor, { min = 20, max = 95, searchEffort = 3, finalEffort = 9 } = {}) {
  const encode = ENCODERS[format];
  if (!encode) throw new Error(`unknown format ${format}`);

  const top = await encode(sharp(input), max, searchEffort);
  if ((await ssim(input, top)) < floor) return null;

  let lo = min, hi = max, bestQ = max, bestBuf = top;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    const buf = await encode(sharp(input), mid, searchEffort);
    if ((await ssim(input, buf)) >= floor) {
      if (buf.length < bestBuf.length) { bestBuf = buf; bestQ = mid; }
      hi = mid - 1;
    } else {
      lo = mid + 1;
    }
  }

  const finalBuf = await encode(sharp(input), bestQ, finalEffort);
  const finalSsim = await ssim(input, finalBuf);
  if (finalSsim >= floor && finalBuf.length <= bestBuf.length) {
    return { buf: finalBuf, quality: bestQ, ssim: finalSsim };
  }
  return { buf: bestBuf, quality: bestQ, ssim: await ssim(input, bestBuf) };
}
