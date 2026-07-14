import Link from "next/link";
import HeroShowcase, { type HeroSlide } from "@/components/HeroShowcase";
import CategorySection, { type CategoryTile } from "@/components/CategorySection";
import BrandHouses, { type House } from "@/components/BrandHouses";
import ProductGrid from "@/components/ProductGrid";
import SectionHead from "@/components/SectionHead";
import Newsletter from "@/components/Newsletter";
import { getProducts, getBlogPosts } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { localizeProducts, localizeProduct } from "@/lib/localize";
import { getT } from "@/i18n/server";
import { TILES_AR, HOUSES_AR } from "@/i18n/content-ar";
import type { Product } from "@/db/schema";

export const dynamic = "force-dynamic";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Store",
  name: "Luxury.ae",
  description: "A curated shopping and brand-discovery platform for premium beauty, hair care and grooming in the UAE.",
  address: { "@type": "PostalAddress", addressLocality: "Dubai", addressCountry: "AE" },
  parentOrganization: { "@type": "Organization", name: "MJQ Investment LLC" },
};

const TILE_BASE = [
  { slug: "oral-care", href: "/collections/marvis", name: "Oral Care", tagline: "Italian toothpaste & mouthwash", accent: "#1f3d2b", img: "marvis-classic-strong-mint-toothpaste-75ml" },
  { slug: "hair-care", href: "/collections/fino", name: "Hair Care", tagline: "Japanese premium repair", accent: "#7a5b34", img: "shiseido-fino-premium-touch-mask-230g" },
  { slug: "grooming", href: "/collections/proraso", name: "Grooming", tagline: "Classic Italian barbering", accent: "#2b2b2b", img: "proraso-shaving-soap-in-a-bowl-150-ml-5-2-oz" },
  { slug: "gift-sets", href: "/collections/gift-set-collection", name: "Gift Sets", tagline: "Curated to be gifted", accent: "#8a6d3b", img: "marvis-gift-set-of-5" },
];

const HOUSE_BASE = [
  { name: "Marvis", origin: "Florence, Italy", blurb: "Cult toothpaste in jewel-bright tubes — a small daily luxury.", href: "/collections/marvis", img: "marvis-amarelli-licorice-mint-toothpaste-75ml" },
  { name: "Fino", origin: "Tokyo, Japan", blurb: "Shiseido's Premium Touch — salon-grade repair for tired hair.", href: "/collections/fino", img: "fino-shiseido-premium-touch-conditioner-550ml" },
  { name: "Proraso", origin: "Florence, Italy", blurb: "Barber-quality shaving and beard care since 1948.", href: "/collections/proraso", img: "beard-oil-30ml-1-0-oz-wood-and-spice" },
];

export default async function Home() {
  const { locale, t } = await getT();
  const [{ rows: products, source }, { rows: posts }] = await Promise.all([getProducts(), getBlogPosts()]);

  const byHandle = new Map(products.map((p) => [p.handle, p]));
  const img = (handle: string) => byHandle.get(handle)?.image ?? null;
  const ar = locale === "ar";

  const tiles: CategoryTile[] = TILE_BASE.map((b) => ({
    href: b.href, accent: b.accent, image: img(b.img),
    name: ar ? TILES_AR[b.slug].name : b.name,
    tagline: ar ? TILES_AR[b.slug].tagline : b.tagline,
  }));

  const houses: House[] = HOUSE_BASE.map((b) => ({
    name: b.name, href: b.href, image: img(b.img),
    origin: ar ? HOUSES_AR[b.name].origin : b.origin,
    blurb: ar ? HOUSES_AR[b.name].blurb : b.blurb,
  }));

  const slide = (handle: string): HeroSlide | null => {
    const p = byHandle.get(handle);
    if (!p) return null;
    const lp = localizeProduct(p, locale);
    return { handle: p.handle, title: lp.title, price: formatPrice(p.priceFils), image: `/products/cutouts/${p.handle}.png`, href: `/products/${p.handle}` };
  };
  const heroSlides: HeroSlide[] = [
    slide("shiseido-fino-premium-touch-mask-230g"),
    slide("marvis-7-flavors-box-7-x-25ml-tubes"),
    slide("proraso-shaving-soap-in-a-bowl-150-ml-5-2-oz"),
    slide("fino-shiseido-premium-touch-hair-oil"),
  ].filter((s): s is HeroSlide => s !== null);

  const featured = products.filter((p) => p.featured);
  const showcase: Product[] = localizeProducts((featured.length >= 4 ? featured : products).slice(0, 8), locale);
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
              <span className="eyebrow">{t("collection.eyebrow")}</span>
              <h2>{t("collection.title")}</h2>
            </div>
            <span className="source-note">
              <span className={`dot ${source === "neon" ? "live" : "preview"}`} />
              {source === "neon" ? t("collection.live") : t("collection.preview")}
            </span>
          </div>
          <ProductGrid products={showcase} />
          <div className="center-cta">
            <Link href="/collections" className="btn btn-primary">{t("collection.shopAll")}</Link>
          </div>
        </section>

        <BrandHouses houses={houses} />

        {journal.length > 0 && (
          <section className="section container" id="journal">
            <SectionHead
              eyebrow={t("journal.eyebrow")}
              title={t("journal.title")}
              description={t("journal.desc")}
              cta={{ label: t("journal.all"), href: "/blogs" }}
            />
            <div className="journal-grid">
              {journal.map((post) => (
                <Link key={post.handle} href={`/blogs/${post.handle}`} className="journal-card">
                  <span className="journal-date">{post.published}</span>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <span className="journal-more">{t("journal.readMore")}</span>
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
