import { Link } from "react-router-dom";
import type { School } from "../../types/school";
import { Tag } from "./Tag";
import { ShortlistButton } from "./ShortlistButton";
import { SchoolLogo } from "./SchoolLogo";
import { useLanguage } from "../../i18n/LanguageContext";
import { localizeIntro, localizeSchoolName } from "../../lib/schools";
import { useCompare } from "../../context/CompareContext";
import { useRevealOnScroll } from "../../hooks/useRevealOnScroll";

export function SchoolCard({ school }: { school: School }) {
  const { language, t } = useLanguage();
  const { isComparing, toggleCompare, maxReached } = useCompare();
  const name = localizeSchoolName(school, language);
  const intro = localizeIntro(school, language);
  const secondaryName = language === "en" ? school.nameZh : name.isFallback ? null : school.nameEn;
  const comparing = isComparing(school.slug);
  const revealRef = useRevealOnScroll<HTMLDivElement>();

  return (
    <div
      ref={revealRef}
      className="reveal group relative flex flex-col rounded-lg border border-neutral-200 bg-white p-5 transition-[box-shadow,transform,border-color] duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-md"
    >
      <ShortlistButton slug={school.slug} className="absolute right-3 top-3 z-10" />

      <Link to={`/schools/${school.slug}`} className="flex flex-col">
        <div className="flex items-start gap-3 pr-8">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md border border-neutral-100 bg-white">
            <SchoolLogo school={school} size={48} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-neutral-900 group-hover:text-brand-700">
              {name.text}
            </h3>
            {secondaryName && (
              <p className="mt-0.5 text-sm text-neutral-500">{secondaryName}</p>
            )}
          </div>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Tag variant="neutral">{t(`regions.${school.region}`)}</Tag>
          <span className="text-sm text-neutral-500">{school.district}</span>
        </div>

        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-neutral-600">
          {intro.text}
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {school.curriculum.map((c) => (
            <Tag key={c} variant="brand">
              {c}
            </Tag>
          ))}
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-2 border-t border-neutral-100 pt-3 text-xs text-neutral-500">
          <div>
            <dt className="font-medium text-neutral-400">{t("directory.ages")}</dt>
            <dd>
              {school.ageRange.min}–{school.ageRange.max}
            </dd>
          </div>
          <div>
            <dt className="font-medium text-neutral-400">{t("directory.type")}</dt>
            <dd className="capitalize">
              {t(`schoolType.${school.schoolType}`)}
              {school.boarding ? ` · ${t("directory.boardingSuffix")}` : ""}
            </dd>
          </div>
        </dl>
      </Link>

      <label className="mt-3 flex items-center gap-2 border-t border-neutral-100 pt-3 text-xs font-medium text-neutral-600">
        <input
          type="checkbox"
          checked={comparing}
          onChange={() => toggleCompare(school.slug)}
          disabled={!comparing && maxReached}
          className="h-3.5 w-3.5 rounded border-neutral-300 text-brand-700 focus:ring-brand-500 disabled:opacity-40"
        />
        {t("directory.compareLabel")}
      </label>
    </div>
  );
}
