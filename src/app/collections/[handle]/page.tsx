import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductBrowser from "@/components/ProductBrowser";
import { getCollectionByHandle, getCollectionProducts } from "@/lib/catalog";
import { collectionTitle } from "@/lib/format";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ handle: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { handle } = await params;
  const collection = await getCollectionByHandle(handle);
  if (!collection) return { title: "Collection" };
  const title = collectionTitle(handle, collection.title);
  return {
    title,
    description: collection.description || `Shop ${title} at Luxury.ae — authentic and delivered across the UAE.`,
  };
}

export default async function CollectionPage({ params }: Params) {
  const { handle } = await params;
  const collection = await getCollectionByHandle(handle);
  if (!collection) notFound();

  const products = await getCollectionProducts(handle);
  const title = collectionTitle(handle, collection.title);
  const multiBrand = new Set(products.map((p) => p.vendor)).size > 1;

  return (
    <main id="main" className="section container">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link> <span>/</span>
        <Link href="/collections">Shop</Link> <span>/</span> <span>{title}</span>
      </nav>

      <div className="page-head">
        <span className="eyebrow">Collection</span>
        <h1>{title}</h1>
        {collection.description && <p>{collection.description}</p>}
      </div>

      <ProductBrowser products={products} brands={multiBrand} />
    </main>
  );
}
