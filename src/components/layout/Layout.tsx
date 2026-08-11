import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { CompareBar } from "./CompareBar";
import { useLanguage } from "../../i18n/LanguageContext";

export function Layout() {
  const { t } = useLanguage();
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only rounded-md bg-brand-700 px-4 py-2 text-sm font-semibold text-white focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50"
      >
        {t("a11y.skipToContent")}
      </a>
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1 pb-16">
        <Outlet />
      </main>
      <Footer />
      <CompareBar />
    </div>
  );
}
