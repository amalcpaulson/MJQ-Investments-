import type { Metadata } from "next";
import Link from "next/link";
import ProductBrowser from "@/components/ProductBrowser";
import { getProducts, getCollections } from "@/lib/catalog";
import { collectionTitle } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop all",
  description: "Browse the full Luxury.ae collection of premium beauty, hair care and grooming.",
};

export default async function CollectionsPage() {
  const [{ rows: products }, { rows: collections }] = await Promise.all([
    getProducts(),
    getCollections(),
  ]);

  return (
    <main id="main" className="section container">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link> <span>/</span> <span>Shop all</span>
      </nav>

      <div className="page-head">
        <span className="eyebrow">The collection</span>
        <h1>Shop all</h1>
        <p>{products.length} authentic products across our houses — Marvis, Fino and Proraso.</p>
      </div>

      <div className="collection-chips">
        {collections.map((c) => (
          <Link key={c.handle} href={`/collections/${c.handle}`} className="chip">
            {collectionTitle(c.handle, c.title)}
          </Link>
        ))}
      </div>

      <ProductBrowser products={products} />
    </main>
  );
}
