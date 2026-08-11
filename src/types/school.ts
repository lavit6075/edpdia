export type Region = "Hong Kong Island" | "Kowloon" | "New Territories";

export type SchoolType = "co-ed" | "boys" | "girls";

export type VerificationStatus = "verified" | "unverified";

export interface AgeRange {
  min: number;
  max: number;
}

export interface Address {
  lineEn: string;
  lineZh: string | null;
  district: string;
}

export interface TuitionEntry {
  level: string;
  annualFeeHKD: number | null;
}

export interface OtherFee {
  label: string;
  amountHKD: number | null;
  note: string | null;
}

export interface ApplicationDeadline {
  intakeYear: string;
  level: string;
  deadline: string | null;
}

export interface Admissions {
  tuitionByLevel: TuitionEntry[];
  otherFees: OtherFee[];
  applicationFee: number | null;
  debentureOrCapitalLevy: number | null;
  entranceExams: string[];
  applicationDeadlines: ApplicationDeadline[];
  processSteps: string[];
}

export interface PrincipalMessage {
  quote: string;
  name: string;
  sourceUrl: string;
}

export interface ExamResult {
  qualification: string;
  year: string;
  metric: string;
  value: string;
  sourceUrl: string;
}

export interface UniversityDestination {
  year: string;
  institutions: string[];
  sourceUrl: string;
}

export interface Achievements {
  examResults: ExamResult[];
  universityDestinations: UniversityDestination[];
  awards: string[];
}

export interface Source {
  label: string;
  url: string;
  accessedDate: string;
}

export interface SchoolPhoto {
  /** Direct (hotlinked) image URL on upload.wikimedia.org — the large render, used as lead. */
  url: string;
  /** Intrinsic size of the served image — set on the <img> to reserve space and avoid CLS. */
  width: number;
  height: number;
  /** Smaller render for the filmstrip, so a 112px-tall thumbnail doesn't pull a 6MP original. */
  thumbUrl: string;
  thumbWidth: number;
  thumbHeight: number;
  /** e.g. "CC BY-SA 4.0" — only positively-identified free licences are ever stored here. */
  licence: string;
  licenceUrl: string | null;
  /** Commons uploader/author, displayed as the required attribution. */
  author: string;
  /** Commons file description page — the canonical credit link. */
  sourceUrl: string;
  /** Commons image description, used for alt text where available. */
  caption: string | null;
}

export interface School {
  id: string;
  nameEn: string;
  nameZh: string | null;
  slug: string;

  district: string;
  region: Region;

  curriculum: string[];
  ageRange: AgeRange;
  gradeLevels: string;

  schoolType: SchoolType;
  boarding: boolean;

  introEn: string;
  introZh: string | null;

  officialWebsite: string;
  officialSocial: string[];
  /** Hotlinked directly from the school's own official site (or a Wayback snapshot of it) —
   *  never copied into this repository. Null if no usable logo was found; the UI falls back
   *  to a generated placeholder either way if this fails to load. See data/SOURCES.md. */
  logoUrl: string | null;

  /** Freely-licensed campus photos from Wikimedia Commons, hotlinked (never copied into this
   *  repo). Attribution is rendered beside every image, as the licences require.
   *
   *  photos[0] is the LEAD — always an exterior/main-building view where one exists, since
   *  that is what someone opening a profile actually wants to see. The remainder feed an
   *  optional filmstrip. Counts range 1–8 across the directory; the layout is built so a
   *  one-photo school renders as complete rather than as a gap (see CampusPhoto/PhotoStrip). */
  photos: SchoolPhoto[];

  address: Address;

  admissions: Admissions;

  principalMessage: PrincipalMessage | null;
  achievements: Achievements;

  sources: Source[];
  lastVerified: string | null;
  verificationStatus: VerificationStatus;
}
