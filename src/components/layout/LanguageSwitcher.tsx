import { useLanguage } from "../../i18n/LanguageContext";

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className={`inline-flex items-center rounded-md border border-neutral-300 p-0.5 text-sm ${className}`}
      role="group"
      aria-label="Language / 語言"
    >
      <button
        type="button"
        onClick={() => setLanguage("en")}
        aria-pressed={language === "en"}
        className={`rounded px-2 py-1 font-medium transition-colors ${
          language === "en"
            ? "bg-brand-700 text-white"
            : "text-neutral-600 hover:bg-neutral-100"
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLanguage("zh-HK")}
        aria-pressed={language === "zh-HK"}
        className={`rounded px-2 py-1 font-medium transition-colors ${
          language === "zh-HK"
            ? "bg-brand-700 text-white"
            : "text-neutral-600 hover:bg-neutral-100"
        }`}
      >
        中文
      </button>
    </div>
  );
}
