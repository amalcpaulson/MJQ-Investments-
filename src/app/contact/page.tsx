import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import { getT } from "@/i18n/server";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Contact" };

export default async function ContactPage() {
  const { t } = await getT();
  return (
    <main id="main" className="section container content-page">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">{t("common.home")}</Link> <span>/</span> <span>{t("contact.title")}</span>
      </nav>

      <div className="page-head">
        <span className="eyebrow">{t("contact.eyebrow")}</span>
        <h1>{t("contact.title")}</h1>
        <p>{t("contact.desc")}</p>
      </div>

      <div className="contact-layout">
        <div className="contact-details">
          <div className="contact-block">
            <h4>{t("contact.phone")}</h4>
            <a href="tel:+97148804005">04 880 4005</a>
          </div>
          <div className="contact-block">
            <h4>{t("contact.whatsapp")}</h4>
            <a href="https://wa.me/971522885649">+971 52 288 5649</a>
          </div>
          <div className="contact-block">
            <h4>{t("contact.email")}</h4>
            <a href="mailto:mk@mjqinvestment.com">mk@mjqinvestment.com</a>
          </div>
          <div className="contact-block">
            <h4>{t("contact.office")}</h4>
            <p style={{ whiteSpace: "pre-line" }}>{t("contact.officeVal")}</p>
          </div>
          <div className="contact-block">
            <h4>{t("contact.wholesale")}</h4>
            <p>{t("contact.wholesaleVal")}</p>
          </div>
        </div>

        <div className="contact-form-wrap">
          <ContactForm />
        </div>
      </div>
    </main>
  );
}
