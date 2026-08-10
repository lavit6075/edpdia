import { useState } from "react";
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/schools", label: "Directory" },
  { to: "/admissions", label: "Admissions Guide" },
  { to: "/resources", label: "Resources" },
  { to: "/about", label: "About" },
  { to: "/faq", label: "FAQ" },
];

function navLinkClasses({ isActive }: { isActive: boolean }) {
  return [
    "rounded-md px-3 py-2 text-sm font-medium transition-colors",
    isActive
      ? "bg-brand-50 text-brand-700"
      : "text-neutral-600 hover:bg-neutral-50 hover:text-brand-700",
  ].join(" ");
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <NavLink to="/" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-700 text-base font-bold text-white">
            E
          </span>
          <span className="text-lg font-semibold tracking-tight text-neutral-900">
            Edpdia
          </span>
        </NavLink>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={navLinkClasses}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <NavLink
            to="/contact"
            className="rounded-md bg-brand-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-800"
          >
            Contact
          </NavLink>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-neutral-700 hover:bg-neutral-100 md:hidden"
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

      {menuOpen && (
        <nav className="border-t border-neutral-200 bg-white px-4 py-3 md:hidden">
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
            <NavLink
              to="/contact"
              className="mt-2 rounded-md bg-brand-700 px-4 py-2 text-center text-sm font-semibold text-white"
              onClick={() => setMenuOpen(false)}
            >
              Contact
            </NavLink>
          </div>
        </nav>
      )}
    </header>
  );
}
