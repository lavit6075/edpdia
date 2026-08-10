import { Link } from "react-router-dom";

const footerNav = [
  {
    heading: "Directory",
    links: [
      { to: "/schools", label: "Browse schools" },
      { to: "/admissions", label: "Admissions guide" },
      { to: "/resources", label: "Resources & news" },
    ],
  },
  {
    heading: "About Edpdia",
    links: [
      { to: "/about", label: "About us" },
      { to: "/faq", label: "FAQ" },
      { to: "/contact", label: "Contact us" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-50">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-700 text-sm font-bold text-white">
                E
              </span>
              <span className="text-base font-semibold text-neutral-900">Edpdia</span>
            </div>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-neutral-600">
              An independent, encyclopaedia-style directory of Hong Kong international
              schools — curricula, admissions information, and official sources in one
              place.
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
            Disclaimer: information on Edpdia is compiled from publicly available
            sources, including official school websites — always verify details
            directly with the school before making a decision. Data not yet
            cross-checked against an official source is marked&nbsp;
            <span className="font-medium text-warn-700">pending verification</span>.
          </p>
          <p className="mt-2 text-xs text-neutral-500">
            Available in English and 繁體中文 (Traditional Chinese).
          </p>
          <p className="mt-4 text-xs text-neutral-400">
            © {new Date().getFullYear()} Edpdia. Not affiliated with any school listed
            in this directory.
          </p>
        </div>
      </div>
    </footer>
  );
}
