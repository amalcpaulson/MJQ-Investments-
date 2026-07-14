import type { Metadata } from "next";
import Link from "next/link";
import ProductBrowser from "@/components/ProductBrowser";
import { getProducts, getCollections } from "@/lib/catalog";
import { getT } from "@/i18n/server";
import { localizeProducts, displayCollectionTitle } from "@/lib/localize";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop all",
  description: "Browse the full Luxury.ae collection of premium beauty, hair care and grooming.",
};

export default async function CollectionsPage() {
  const { locale, t } = await getT();
  const [{ rows: products }, { rows: collections }] = await Promise.all([getProducts(), getCollections()]);
  const localized = localizeProducts(products, locale);

  return (
    <main id="main" className="section container">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">{t("common.home")}</Link> <span>/</span> <span>{t("shopAllPage.title")}</span>
      </nav>

      <div className="page-head">
        <span className="eyebrow">{t("shopAllPage.eyebrow")}</span>
        <h1>{t("shopAllPage.title")}</h1>
        <p>{t("shopAllPage.desc", { n: products.length })}</p>
      </div>

      <div className="collection-chips">
        {collections.map((c) => (
          <Link key={c.handle} href={`/collections/${c.handle}`} className="chip">
            {displayCollectionTitle(c.handle, locale, c.title)}
          </Link>
        ))}
      </div>

      <ProductBrowser products={localized} />
    </main>
  );
}
