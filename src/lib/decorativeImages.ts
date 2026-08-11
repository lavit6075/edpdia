/**
 * Decorative (non-school-specific) imagery.
 *
 * Every entry is a freely-licensed photo whose licence was positively identified via the
 * Openverse API (which surfaces the machine-readable licence for each item) and then
 * confirmed to resolve as an image. Nothing here is copied into this repository — all are
 * hotlinked from the original host.
 *
 * Hard rule: these are GENERIC images. They are never captioned or presented as a specific
 * school's campus. School-specific photography lives on the `photo` field of each school
 * record instead. See data/SOURCES.md → "Image sources & licensing".
 */
export interface DecorativeImage {
  url: string;
  width: number;
  height: number;
  licence: string;
  licenceUrl: string;
  author: string;
  sourceUrl: string;
  /** Short descriptive title from the source, used for the alt text. */
  title: string;
}

export const DECORATIVE_IMAGES = {
  /** Admissions Guide header — generic study imagery, CC0. */
  admissions: {
    url: "/img/decor-d16ce1668e15.jpg",
    width: 960,
    height: 640,
    licence: "CC0 1.0",
    licenceUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    author: "Green Chameleon",
    sourceUrl: "https://stocksnap.io/photo/writing-drawing-8Y0EDX4VP9",
    title: "Writing at a desk",
  },
  /** Resources header — generic note-taking imagery, CC0. */
  resources: {
    url: "/img/decor-9c1060734843.jpg",
    width: 1024,
    height: 683,
    licence: "CC0 1.0",
    licenceUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    author: "Image Catalog",
    sourceUrl: "https://www.flickr.com/photos/133061897@N02/18692128651",
    title: "Writing in a notebook at a desk",
  },
} satisfies Record<string, DecorativeImage>;
