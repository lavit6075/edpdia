import type { SchoolPhoto } from "../../types/school";
import { useLanguage } from "../../i18n/LanguageContext";

/** Attribution shown under every photo — author + licence, both linked to source, plus the
 *  explicit statement that the licence covers that photograph and nothing around it. */
export function PhotoCredit({ photo, compact = false }: { photo: SchoolPhoto; compact?: boolean }) {
  const { t } = useLanguage();
  return (
    <figcaption
      className={`${compact ? "mt-1.5 text-[11px]" : "mt-2 text-xs"} leading-relaxed text-neutral-500`}
    >
      <span>
        {`${t("profile.photoCreditPrefix")} `}
        <a
          href={photo.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-700 hover:underline"
        >
          {photo.author}
        </a>
        {" · "}
        {photo.licenceUrl ? (
          <a
            href={photo.licenceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-700 hover:underline"
          >
            {photo.licence}
          </a>
        ) : (
          photo.licence
        )}
        {!compact && (
          <>{` · ${t("profile.photoViaCommons")}`}</>
        )}
      </span>
      <span className="mt-0.5 block text-neutral-400">{t("profile.photoLicenceScope")}</span>
    </figcaption>
  );
}
