import { Suspense } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CategorySection from "@/components/CategorySection";
import Storefront from "@/components/Storefront";
import ProductGridSkeleton from "@/components/ProductGridSkeleton";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import { getCatalog } from "@/lib/products";

// Read from the database at request time (not statically pre-rendered).
export const dynamic = "force-dynamic";

/** Async data boundary — the Suspense fallback shows the loading skeleton. */
async function Collection() {
  const { products, categories, source } = await getCatalog();
  return (
    <>
      <CategorySection categories={categories} />
      <Storefront products={products} categories={categories} source={source} />
    </>
  );
}

function CollectionFallback() {
  return (
    <section className="section container">
      <div className="section-head">
        <div>
          <span className="eyebrow">The collection</span>
          <h2>Curated for you</h2>
        </div>
      </div>
      <ProductGridSkeleton />
    </section>
  );
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Store",
  name: "Luxury.ae",
  description:
    "A curated shopping and brand-discovery platform for premium beauty, hair care and grooming in the UAE.",
  address: { "@type": "PostalAddress", addressLocality: "Dubai", addressCountry: "AE" },
  parentOrganization: { "@type": "Organization", name: "MJQ Investment LLC" },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main id="main">
        <Hero />
        <Suspense fallback={<CollectionFallback />}>
          <Collection />
        </Suspense>
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
