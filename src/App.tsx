import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./i18n/LanguageContext";
import { ShortlistProvider } from "./context/ShortlistContext";
import { CompareProvider } from "./context/CompareContext";
import { Layout } from "./components/layout/Layout";
import { Home } from "./pages/Home";
import { Directory } from "./pages/Directory";
import { SchoolProfile } from "./pages/SchoolProfile";
import { Compare } from "./pages/Compare";
import { Shortlist } from "./pages/Shortlist";
import { About } from "./pages/About";
import { Admissions } from "./pages/Admissions";
import { AdmissionsTimeline } from "./pages/AdmissionsTimeline";
import { Resources } from "./pages/Resources";
import { Faq } from "./pages/Faq";
import { Contact } from "./pages/Contact";
import { NotFound } from "./pages/NotFound";

function App() {
  return (
    <LanguageProvider>
      <ShortlistProvider>
        <CompareProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="schools" element={<Directory />} />
                <Route path="schools/:slug" element={<SchoolProfile />} />
                <Route path="compare" element={<Compare />} />
                <Route path="shortlist" element={<Shortlist />} />
                <Route path="about" element={<About />} />
                <Route path="admissions" element={<Admissions />} />
                <Route path="admissions/timeline" element={<AdmissionsTimeline />} />
                <Route path="resources" element={<Resources />} />
                <Route path="faq" element={<Faq />} />
                <Route path="contact" element={<Contact />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </CompareProvider>
      </ShortlistProvider>
    </LanguageProvider>
  );
}

export default App;
