import { Link } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext";
import { useSeo } from "../hooks/useSeo";

export function NotFound() {
  const { t } = useLanguage();
  useSeo({
    title: `${t("notFound.title")} — ${t("header.brand")}`,
    description: t("notFound.body"),
    path: "/404",
  });
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
        {t("notFound.title")}
      </h1>
      <p className="mt-3 text-neutral-600">{t("notFound.body")}</p>
      <Link
        to="/"
        className="mt-6 inline-block rounded-md bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800"
      >
        {t("notFound.backHome")}
      </Link>
    </div>
  );
}
