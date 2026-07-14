import Link from "next/link";
import HeroShowcase, { type HeroSlide } from "@/components/HeroShowcase";
import CategorySection, { type CategoryTile } from "@/components/CategorySection";
import BrandHouses, { type House } from "@/components/BrandHouses";
import ProductGrid from "@/components/ProductGrid";
import SectionHead from "@/components/SectionHead";
import Newsletter from "@/components/Newsletter";
import { getProducts, getBlogPosts } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/db/schema";

export const dynamic = "force-dynamic";

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

  const byHandle = new Map(products.map((p) => [p.handle, p]));
  const img = (handle: string) => byHandle.get(handle)?.image ?? null;

  const tiles: CategoryTile[] = [
    { href: "/collections/marvis", name: "Oral Care", tagline: "Italian toothpaste & mouthwash", accent: "#1f3d2b", image: img("marvis-classic-strong-mint-toothpaste-75ml") },
    { href: "/collections/fino", name: "Hair Care", tagline: "Japanese premium repair", accent: "#7a5b34", image: img("shiseido-fino-premium-touch-mask-230g") },
    { href: "/collections/proraso", name: "Grooming", tagline: "Classic Italian barbering", accent: "#2b2b2b", image: img("proraso-shaving-soap-in-a-bowl-150-ml-5-2-oz") },
    { href: "/collections/gift-set-collection", name: "Gift Sets", tagline: "Curated to be gifted", accent: "#8a6d3b", image: img("marvis-gift-set-of-5") },
  ];

  const houses: House[] = [
    { name: "Marvis", origin: "Florence, Italy", blurb: "Cult toothpaste in jewel-bright tubes — a small daily luxury.", href: "/collections/marvis", image: img("marvis-amarelli-licorice-mint-toothpaste-75ml") },
    { name: "Fino", origin: "Tokyo, Japan", blurb: "Shiseido's Premium Touch — salon-grade repair for tired hair.", href: "/collections/fino", image: img("fino-shiseido-premium-touch-conditioner-550ml") },
    { name: "Proraso", origin: "Florence, Italy", blurb: "Barber-quality shaving and beard care since 1948.", href: "/collections/proraso", image: img("beard-oil-30ml-1-0-oz-wood-and-spice") },
  ];

  const slide = (handle: string): HeroSlide | null => {
    const p = byHandle.get(handle);
    return p ? { handle: p.handle, title: p.title, price: formatPrice(p.priceFils), image: p.image, href: `/products/${p.handle}` } : null;
  };
  const heroSlides: HeroSlide[] = [
    slide("shiseido-fino-premium-touch-mask-230g"),
    slide("marvis-7-flavors-box-7-x-25ml-tubes"),
    slide("proraso-shaving-soap-in-a-bowl-150-ml-5-2-oz"),
    slide("fino-shiseido-premium-touch-hair-oil"),
  ].filter((s): s is HeroSlide => s !== null);

  const featured = products.filter((p) => p.featured);
  const showcase: Product[] = (featured.length >= 4 ? featured : products).slice(0, 8);
  const journal = posts.slice(0, 3);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main id="main">
        <HeroShowcase slides={heroSlides} />

        <CategorySection tiles={tiles} />

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

        <BrandHouses houses={houses} />

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
