import { useShortlist } from "../../context/ShortlistContext";
import { useLanguage } from "../../i18n/LanguageContext";

export function ShortlistButton({ slug, className = "" }: { slug: string; className?: string }) {
  const { isShortlisted, toggleShortlist } = useShortlist();
  const { t } = useLanguage();
  const active = isShortlisted(slug);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleShortlist(slug);
      }}
      aria-pressed={active}
      aria-label={active ? t("directory.shortlistRemove") : t("directory.shortlistAdd")}
      title={active ? t("directory.shortlistRemove") : t("directory.shortlistAdd")}
      className={`press-sm inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] ${
        active
          ? "text-accent-600 hover:bg-accent-50"
          : "text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
      } ${className}`}
    >
      <svg viewBox="0 0 20 20" className="h-5 w-5" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.7">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10 17.25s-6.5-4.07-8.5-8.06C.36 6.4 1.9 3.5 4.86 3.5c1.7 0 3.1.9 3.9 2.25.8-1.35 2.2-2.25 3.9-2.25 2.96 0 4.5 2.9 3.36 5.69-2 3.99-8.02 8.06-8.02 8.06Z"
        />
      </svg>
    </button>
  );
}
