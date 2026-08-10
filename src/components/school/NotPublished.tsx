import { useLanguage } from "../../i18n/LanguageContext";

export function NotPublished({ label }: { label?: string }) {
  const { t } = useLanguage();
  return <span className="text-neutral-400 italic">{label ?? t("profile.notPublished")}</span>;
}

export function formatHKD(amount: number | null): React.ReactNode {
  if (amount === null) return <NotPublished />;
  return `HK$${amount.toLocaleString("en-HK")}`;
}
