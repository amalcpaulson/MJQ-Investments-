import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Luxury.ae is a curated luxury shopping platform operated by MJQ Investment LLC — the official UAE distributor of Marvis, with Fino and Proraso.",
};

export default function AboutPage() {
  return (
    <main id="main" className="section container content-page">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link> <span>/</span> <span>About</span>
      </nav>

      <div className="page-head">
        <span className="eyebrow">Our story</span>
        <h1>Everyday essentials, made a little more luxurious</h1>
      </div>

      <div className="rich-text prose">
        <p>
          Welcome to <strong>Luxury.ae</strong>, your premier destination for luxury beauty,
          hair and personal-care in the United Arab Emirates. We are operated by
          <strong> MJQ Investment LLC</strong> and are proud to be the official UAE distributor
          of <strong>Marvis</strong>, sourcing every product directly from the manufacturer.
        </p>
        <p>
          With a commitment to excellence and authenticity, we bring together a carefully edited
          portfolio of the world&rsquo;s most coveted houses — the Italian artistry of Marvis,
          the Japanese precision of Shiseido&rsquo;s <strong>Fino Premium Touch</strong>, and the
          century-old barbering heritage of <strong>Proraso</strong>. Each is chosen to turn an
          ordinary daily ritual into something quietly indulgent.
        </p>
        <h2>What we stand for</h2>
        <ul>
          <li><strong>Authenticity</strong> — genuine products through trusted distribution channels.</li>
          <li><strong>Curation</strong> — a tightly edited range, not an endless catalogue.</li>
          <li><strong>Service</strong> — a seamless experience from browsing to your doorstep.</li>
        </ul>
        <p>
          Whether you are refining your morning routine or searching for the perfect gift,
          Luxury.ae is here to make premium feel effortless.
        </p>
      </div>

      <div className="content-cta">
        <Link href="/collections" className="btn btn-primary">Explore the collection</Link>
        <Link href="/contact" className="btn btn-ghost">Get in touch</Link>
      </div>
    </main>
  );
}
