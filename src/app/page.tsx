import Link from "next/link";
import Hero from "@/components/Hero";
import CategorySection, { type CategoryTile } from "@/components/CategorySection";
import ProductGrid from "@/components/ProductGrid";
import SectionHead from "@/components/SectionHead";
import Newsletter from "@/components/Newsletter";
import { getProducts, getBlogPosts } from "@/lib/catalog";

export const dynamic = "force-dynamic";

const TILES: CategoryTile[] = [
  { href: "/collections/marvis", name: "Oral Care", tagline: "Italian toothpaste & mouthwash", accent: "#1f3d2b" },
  { href: "/collections/fino", name: "Hair Care", tagline: "Japanese premium repair", accent: "#7a5b34" },
  { href: "/collections/proraso", name: "Grooming", tagline: "Classic Italian barbering", accent: "#2b2b2b" },
  { href: "/collections/gift-set-collection", name: "Gift Sets", tagline: "Curated to be gifted", accent: "#8a6d3b" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Store",
  name: "Luxury.ae",
  description:
    "A curated shopping and brand-discovery platform for premium beauty, hair care and grooming in the UAE.",
  address: { "@type": "PostalAddress", addressLocality: "Dubai", addressCountry: "AE" },
  parentOrganization: { "@type": "Organization", name: "MJQ Investment LLC" },
};

export default async function Home() {
  const [{ rows: products, source }, { rows: posts }] = await Promise.all([
    getProducts(),
    getBlogPosts(),
  ]);

  const featured = products.filter((p) => p.featured);
  const showcase = (featured.length >= 4 ? featured : products).slice(0, 8);
  const journal = posts.slice(0, 3);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main id="main">
        <Hero />
        <CategorySection tiles={TILES} />

        <section className="section container" id="collection">
          <div className="section-head">
            <div>
              <span className="eyebrow">The collection</span>
              <h2>Curated for you</h2>
            </div>
            <span className="source-note" title={source === "neon" ? "Live from Neon" : "Preview catalogue"}>
              <span className={`dot ${source === "neon" ? "live" : "preview"}`} />
              {source === "neon" ? "Live from Neon PostgreSQL" : "Preview catalogue"}
            </span>
          </div>
          <ProductGrid products={showcase} />
          <div className="center-cta">
            <Link href="/collections" className="btn btn-primary">Shop all products</Link>
          </div>
        </section>

        {journal.length > 0 && (
          <section className="section container" id="journal">
            <SectionHead
              eyebrow="The Journal"
              title="Stories & rituals"
              description="Notes on the houses we carry and how to get the most from them."
              cta={{ label: "All articles", href: "/blogs" }}
            />
            <div className="journal-grid">
              {journal.map((post) => (
                <Link key={post.handle} href={`/blogs/${post.handle}`} className="journal-card">
                  <span className="journal-date">{post.published}</span>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <span className="journal-more">Read more →</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <Newsletter />
      </main>
    </>
  );
}
