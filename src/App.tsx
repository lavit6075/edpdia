import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { Home } from "./pages/Home";
import { Directory } from "./pages/Directory";
import { SchoolProfile } from "./pages/SchoolProfile";
import { About } from "./pages/About";
import { Admissions } from "./pages/Admissions";
import { Resources } from "./pages/Resources";
import { Faq } from "./pages/Faq";
import { Contact } from "./pages/Contact";
import { NotFound } from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="schools" element={<Directory />} />
          <Route path="schools/:slug" element={<SchoolProfile />} />
          <Route path="about" element={<About />} />
          <Route path="admissions" element={<Admissions />} />
          <Route path="resources" element={<Resources />} />
          <Route path="faq" element={<Faq />} />
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
