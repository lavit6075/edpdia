import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useLanguage } from "../../i18n/LanguageContext";
import { useShortlist } from "../../context/ShortlistContext";
import { LanguageSwitcher } from "./LanguageSwitcher";

function navLinkClasses({ isActive }: { isActive: boolean }) {
  return [
    "rounded-md px-3 py-2 text-sm font-medium transition-colors",
    isActive
      ? "bg-brand-50 text-brand-700"
      : "text-neutral-600 hover:bg-neutral-50 hover:text-brand-700",
  ].join(" ");
}

function ShortlistLink({ label, onClick }: { label: string; onClick?: () => void }) {
  const { shortlist } = useShortlist();
  return (
    <NavLink to="/shortlist" className={navLinkClasses} onClick={onClick}>
      <span className="inline-flex items-center gap-1.5">
        {label}
        {shortlist.length > 0 && (
          <span className="rounded-full bg-accent-100 px-1.5 py-0.5 text-xs font-semibold text-accent-700">
            {shortlist.length}
          </span>
        )}
      </span>
    </NavLink>
  );
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useLanguage();

  const navItems = [
    { to: "/schools", label: t("nav.directory") },
    { to: "/admissions", label: t("nav.admissions") },
    { to: "/resources", label: t("nav.resources") },
    { to: "/about", label: t("nav.about") },
    { to: "/faq", label: t("nav.faq") },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <NavLink to="/" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-700 text-base font-bold text-white">
            E
          </span>
          <span className="text-lg font-semibold tracking-tight text-neutral-900">
            {t("header.brand")}
          </span>
        </NavLink>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={navLinkClasses}>
              {item.label}
            </NavLink>
          ))}
          <ShortlistLink label={t("header.shortlist")} />
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <LanguageSwitcher />
          <NavLink
            to="/contact"
            className="rounded-md bg-brand-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-800"
          >
            {t("nav.contact")}
          </NavLink>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitcher />
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-neutral-700 hover:bg-neutral-100"
            aria-expanded={menuOpen}
            aria-label="Toggle navigation menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="expand-in border-t border-neutral-200 bg-white px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={navLinkClasses}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
            <ShortlistLink label={t("header.shortlist")} onClick={() => setMenuOpen(false)} />
            <NavLink
              to="/contact"
              className="mt-2 rounded-md bg-brand-700 px-4 py-2 text-center text-sm font-semibold text-white"
              onClick={() => setMenuOpen(false)}
            >
              {t("nav.contact")}
            </NavLink>
          </div>
        </nav>
      )}
    </header>
  );
}
