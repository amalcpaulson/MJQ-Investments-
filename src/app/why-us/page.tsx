import type { Metadata } from "next";
import Link from "next/link";
import { getT } from "@/i18n/server";
import { PAGES_AR } from "@/i18n/content-ar";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Why Us" };

const EN = {
  eyebrow: "The Luxury.ae difference",
  h1: "Why buy from Luxury.ae?",
  desc: "Everyday essentials become premium experiences through curated international brands built for the modern UAE lifestyle.",
  pillars: [
    { brand: "Marvis", title: "Premium Oral Care", body: "Bold flavours and elegant packaging that turn daily brushing into a refined ritual — from Jasmin Mint to Amarelli Licorice." },
    { brand: "Fino", title: "Japanese Hair Care", body: "Shiseido's Fino Premium Touch nourishes and restores damaged hair with masks, oils and treatments loved worldwide." },
    { brand: "Proraso", title: "Italian Grooming", body: "Traditional barber-quality shaving and beard care, made in Italy since 1948." },
    { brand: "Guaranteed", title: "Authenticity", body: "Every product is sourced through trusted, official distribution channels — no imitations, ever." },
  ],
  h2: "Our promise",
  promise: [
    "Authentic products through trusted distribution channels.",
    "Expert customer service and honest product recommendations.",
    "Fast, reliable UAE-wide shipping — typically 2–5 business days.",
    "Secure payment processing and a convenient shopping experience.",
  ],
  cta: "Start shopping",
};

export default async function WhyUsPage() {
  const { locale, t } = await getT();
  const c = locale === "ar" ? PAGES_AR.why : EN;

  return (
    <main id="main" className="section container content-page">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">{t("common.home")}</Link> <span>/</span> <span>{t("footer.why")}</span>
      </nav>

      <div className="page-head">
        <span className="eyebrow">{c.eyebrow}</span>
        <h1>{c.h1}</h1>
        <p>{c.desc}</p>
      </div>

      <div className="pillar-grid">
        {c.pillars.map((p) => (
          <div key={p.title} className="pillar">
            <span className="pillar-brand">{p.brand}</span>
            <h3>{p.title}</h3>
            <p>{p.body}</p>
          </div>
        ))}
      </div>

      <div className="rich-text prose">
        <h2>{c.h2}</h2>
        <ul>{c.promise.map((li, i) => <li key={i}>{li}</li>)}</ul>
      </div>

      <div className="content-cta">
        <Link href="/collections" className="btn btn-primary">{c.cta}</Link>
      </div>
    </main>
  );
}
