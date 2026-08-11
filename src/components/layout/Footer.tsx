import { Link } from "react-router-dom";
import { useLanguage } from "../../i18n/LanguageContext";

export function Footer() {
  const { t } = useLanguage();

  const footerNav = [
    {
      heading: t("footer.directoryGroup"),
      links: [
        { to: "/schools", label: t("footer.browseSchools") },
        { to: "/admissions", label: t("footer.admissionsGuide") },
        { to: "/resources", label: t("footer.resourcesNews") },
      ],
    },
    {
      heading: t("footer.aboutGroup"),
      links: [
        { to: "/about", label: t("footer.aboutUs") },
        { to: "/faq", label: t("footer.faq") },
        { to: "/contact", label: t("footer.contactUs") },
      ],
    },
  ];

  return (
    <footer className="border-t border-neutral-200 bg-neutral-50">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-700 text-sm font-bold text-white">
                E
              </span>
              <span className="text-base font-semibold text-neutral-900">{t("header.brand")}</span>
            </div>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-neutral-600">
              {t("footer.tagline")}
            </p>
          </div>

          {footerNav.map((group) => (
            <div key={group.heading}>
              <h3 className="text-sm font-semibold text-neutral-900">{group.heading}</h3>
              <ul className="mt-3 space-y-2">
                {group.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-sm text-neutral-600 hover:text-brand-700"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-neutral-200 pt-6">
          <p className="text-xs leading-relaxed text-neutral-500">
            {`${t("footer.disclaimer")}\u00a0`}
            <span className="font-medium text-warn-700">{t("footer.pendingVerification")}</span>.
          </p>
          <p className="mt-2 text-xs text-neutral-500">{t("footer.languageNote")}</p>
          <p className="mt-4 text-xs text-neutral-400">
            {`© ${new Date().getFullYear()} ${t("footer.copyright")}`}
          </p>
        </div>
      </div>
    </footer>
  );
}
