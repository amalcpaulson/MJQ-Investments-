import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Why Us",
  description:
    "Why buy from Luxury.ae — authentic premium brands, expert curation, fast UAE-wide delivery and secure checkout.",
};

const PILLARS = [
  { title: "Premium Oral Care", brand: "Marvis", body: "Bold flavours and elegant packaging that turn daily brushing into a refined ritual — from Jasmin Mint to Amarelli Licorice." },
  { title: "Japanese Hair Care", brand: "Fino", body: "Shiseido's Fino Premium Touch nourishes and restores damaged hair with masks, oils and treatments loved worldwide." },
  { title: "Italian Grooming", brand: "Proraso", body: "Traditional barber-quality shaving and beard care, made in Italy since 1948." },
  { title: "Authenticity", brand: "Guaranteed", body: "Every product is sourced through trusted, official distribution channels — no imitations, ever." },
];

export default function WhyUsPage() {
  return (
    <main id="main" className="section container content-page">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link> <span>/</span> <span>Why Us</span>
      </nav>

      <div className="page-head">
        <span className="eyebrow">The Luxury.ae difference</span>
        <h1>Why buy from Luxury.ae?</h1>
        <p>Everyday essentials become premium experiences through curated international brands built for the modern UAE lifestyle.</p>
      </div>

      <div className="pillar-grid">
        {PILLARS.map((p) => (
          <div key={p.title} className="pillar">
            <span className="pillar-brand">{p.brand}</span>
            <h3>{p.title}</h3>
            <p>{p.body}</p>
          </div>
        ))}
      </div>

      <div className="rich-text prose">
        <h2>Our promise</h2>
        <ul>
          <li>Authentic products through trusted distribution channels.</li>
          <li>Expert customer service and honest product recommendations.</li>
          <li>Fast, reliable UAE-wide shipping — typically 2–5 business days.</li>
          <li>Secure payment processing and a convenient shopping experience.</li>
        </ul>
      </div>

      <div className="content-cta">
        <Link href="/collections" className="btn btn-primary">Start shopping</Link>
      </div>
    </main>
  );
}
