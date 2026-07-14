import type { Metadata } from "next";
import Link from "next/link";
import { getT } from "@/i18n/server";
import { PAGES_AR } from "@/i18n/content-ar";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "FAQ" };

const EN = {
  eyebrow: "Help",
  h1: "Frequently asked questions",
  still: "Still have a question?",
  items: [
    { q: "What are your shipping options?", a: "We offer standard delivery across the UAE, with expedited options at checkout. Select international destinations are also available." },
    { q: "How long does delivery take?", a: "Orders within the UAE typically arrive in 2–5 business days. International orders may take longer depending on the destination." },
    { q: "What is your return policy?", a: "If you're not satisfied, contact us within 14 days of receiving your order to arrange a return or exchange. Items should be unused and in their original packaging." },
    { q: "Are your products authentic?", a: "Yes. Every product is sourced directly from the manufacturer or an authorised distributor, guaranteeing authenticity and quality." },
    { q: "How can I track my order?", a: "Once your order ships, you'll receive a confirmation email with tracking information so you can follow it to your door." },
    { q: "Can I cancel or modify my order?", a: "Orders can usually be modified or cancelled shortly after being placed. Contact us as soon as possible and we'll do our best to help." },
    { q: "How do I contact customer support?", a: "Call 04 880 4005, message +971 52 288 5649, or email mk@mjqinvestment.com. We're happy to help." },
  ],
};

export default async function FaqPage() {
  const { locale } = await getT();
  const c = locale === "ar" ? PAGES_AR.faq : EN;

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: c.items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <main id="main" className="section container content-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">{locale === "ar" ? "الرئيسية" : "Home"}</Link> <span>/</span> <span>{c.h1}</span>
      </nav>

      <div className="page-head">
        <span className="eyebrow">{c.eyebrow}</span>
        <h1>{c.h1}</h1>
      </div>

      <div className="faq-list">
        {c.items.map((f) => (
          <details key={f.q} className="faq-item">
            <summary>{f.q}</summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>

      <div className="content-cta">
        <Link href="/contact" className="btn btn-primary">{c.still}</Link>
      </div>
    </main>
  );
}
