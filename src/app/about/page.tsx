import type { Metadata } from "next";
import Link from "next/link";
import { getT } from "@/i18n/server";
import { PAGES_AR } from "@/i18n/content-ar";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "About Us" };

const EN = {
  eyebrow: "Our story",
  h1: "Everyday essentials, made a little more luxurious",
  p1: "Welcome to <strong>Luxury.ae</strong>, your premier destination for luxury beauty, hair and personal-care in the United Arab Emirates. We are operated by <strong>MJQ Investment LLC</strong> and are proud to be the official UAE distributor of <strong>Marvis</strong>, sourcing every product directly from the manufacturer.",
  p2: "With a commitment to excellence and authenticity, we bring together a carefully edited portfolio of the world's most coveted houses — the Italian artistry of Marvis, the Japanese precision of Shiseido's <strong>Fino Premium Touch</strong>, and the century-old barbering heritage of <strong>Proraso</strong>. Each is chosen to turn an ordinary daily ritual into something quietly indulgent.",
  h2: "What we stand for",
  list: [
    "<strong>Authenticity</strong> — genuine products through trusted distribution channels.",
    "<strong>Curation</strong> — a tightly edited range, not an endless catalogue.",
    "<strong>Service</strong> — a seamless experience from browsing to your doorstep.",
  ],
  p3: "Whether you are refining your morning routine or searching for the perfect gift, Luxury.ae is here to make premium feel effortless.",
  cta1: "Explore the collection",
  cta2: "Get in touch",
};

export default async function AboutPage() {
  const { locale, t } = await getT();
  const c = locale === "ar" ? PAGES_AR.about : EN;

  return (
    <main id="main" className="section container content-page">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">{t("common.home")}</Link> <span>/</span> <span>{t("footer.about")}</span>
      </nav>

      <div className="page-head">
        <span className="eyebrow">{c.eyebrow}</span>
        <h1>{c.h1}</h1>
      </div>

      <div className="rich-text prose">
        <p dangerouslySetInnerHTML={{ __html: c.p1 }} />
        <p dangerouslySetInnerHTML={{ __html: c.p2 }} />
        <h2>{c.h2}</h2>
        <ul>
          {c.list.map((li, i) => <li key={i} dangerouslySetInnerHTML={{ __html: li }} />)}
        </ul>
        <p dangerouslySetInnerHTML={{ __html: c.p3 }} />
      </div>

      <div className="content-cta">
        <Link href="/collections" className="btn btn-primary">{c.cta1}</Link>
        <Link href="/contact" className="btn btn-ghost">{c.cta2}</Link>
      </div>
    </main>
  );
}
