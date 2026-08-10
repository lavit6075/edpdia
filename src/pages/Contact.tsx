import { useState, type FormEvent } from "react";
import { useLanguage } from "../i18n/LanguageContext";

const CONTACT_EMAIL = "hello@edpdia.hk";

export function Contact() {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(`Edpdia contact form — ${name || "no name given"}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  }

  return (
    <div>
      <section className="border-b border-neutral-200 bg-neutral-50">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
          <h1 className="text-4xl font-semibold tracking-tight text-neutral-900">
            {t("contactPage.heroTitle")}
          </h1>
          <p className="mt-3 text-neutral-600">{t("contactPage.heroSubtitle")}</p>
        </div>
      </section>

      <div className="mx-auto max-w-xl px-4 py-12 sm:px-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="text-sm font-semibold text-neutral-900">
              {t("contactPage.formName")}
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="email" className="text-sm font-semibold text-neutral-900">
              {t("contactPage.formEmail")}
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="message" className="text-sm font-semibold text-neutral-900">
              {t("contactPage.formMessage")}
            </label>
            <textarea
              id="message"
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-2 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-800 sm:w-auto"
          >
            {t("contactPage.formSubmit")}
          </button>
          <p className="text-xs text-neutral-500">{t("contactPage.formNote")}</p>
        </form>

        <div className="mt-10 border-t border-neutral-200 pt-6">
          <h2 className="text-sm font-semibold text-neutral-900">{t("contactPage.directEmailTitle")}</h2>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="mt-1 inline-block text-sm text-brand-700 hover:underline"
          >
            {t("contactPage.directEmailAddress")}
          </a>
        </div>

        <div className="mt-6 rounded-md bg-neutral-50 p-4">
          <h2 className="text-sm font-semibold text-neutral-900">{t("contactPage.disclaimerTitle")}</h2>
          <p className="mt-1 text-xs leading-relaxed text-neutral-600">
            {t("contactPage.disclaimerBody")}
          </p>
        </div>
      </div>
    </div>
  );
}
