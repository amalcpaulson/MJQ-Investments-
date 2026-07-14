import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductBrowser from "@/components/ProductBrowser";
import { getCollectionByHandle, getCollectionProducts } from "@/lib/catalog";
import { collectionTitle } from "@/lib/format";
import { getT } from "@/i18n/server";
import { localizeProducts, displayCollectionTitle } from "@/lib/localize";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ handle: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { handle } = await params;
  const collection = await getCollectionByHandle(handle);
  if (!collection) return { title: "Collection" };
  const title = collectionTitle(handle, collection.title);
  return { title, description: collection.description || `Shop ${title} at Luxury.ae.` };
}

export default async function CollectionPage({ params }: Params) {
  const { handle } = await params;
  const { locale, t } = await getT();
  const collection = await getCollectionByHandle(handle);
  if (!collection) notFound();

  const products = localizeProducts(await getCollectionProducts(handle), locale);
  const title = displayCollectionTitle(handle, locale, collection.title);
  const multiBrand = new Set(products.map((p) => p.vendor)).size > 1;

  return (
    <main id="main" className="section container">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">{t("common.home")}</Link> <span>/</span>
        <Link href="/collections">{t("common.shop")}</Link> <span>/</span> <span>{title}</span>
      </nav>

      <div className="page-head">
        <span className="eyebrow">{t("product.collection")}</span>
        <h1>{title}</h1>
        {locale !== "ar" && collection.description && <p>{collection.description}</p>}
      </div>

      <ProductBrowser products={products} brands={multiBrand} />
    </main>
  );
}
