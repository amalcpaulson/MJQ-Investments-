import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductGallery from "@/components/ProductGallery";
import ProductCard from "@/components/ProductCard";
import AddToCartButton from "@/components/cart/AddToCartButton";
import { getProductByHandle, getProducts } from "@/lib/catalog";
import { formatPrice, brandAccent } from "@/lib/format";
import { getT } from "@/i18n/server";
import { localizeProduct, localizeProducts } from "@/lib/localize";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ handle: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProductByHandle(handle);
  if (!product) return { title: "Product" };
  return {
    title: product.title,
    description: product.excerpt,
    openGraph: { title: product.title, description: product.excerpt, images: product.image ? [{ url: product.image }] : undefined, type: "website" },
  };
}

export default async function ProductPage({ params }: Params) {
  const { handle } = await params;
  const { locale, t } = await getT();
  const raw = await getProductByHandle(handle);
  if (!raw) notFound();
  const product = localizeProduct(raw, locale);

  const { rows: all } = await getProducts();
  const related = localizeProducts(all.filter((p) => p.handle !== product.handle && p.vendor === product.vendor).slice(0, 4), locale);

  const onSale = product.compareAtFils && product.compareAtFils > product.priceFils;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: raw.title,
    brand: { "@type": "Brand", name: raw.vendor },
    description: raw.excerpt,
    image: raw.images,
    offers: { "@type": "Offer", priceCurrency: "AED", price: (raw.priceFils / 100).toFixed(2), availability: raw.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock" },
  };

  return (
    <main id="main" className="container pdp">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">{t("common.home")}</Link> <span>/</span>
        <Link href="/collections">{t("common.shop")}</Link> <span>/</span> <span>{product.title}</span>
      </nav>

      <div className="pdp-grid">
        <ProductGallery images={product.images} title={product.title} accent={brandAccent(product.vendor)} />

        <div className="pdp-info">
          <span className="product-brand">{product.vendor}</span>
          <h1>{product.title}</h1>

          <div className="pdp-price">
            {formatPrice(product.priceFils)}
            {onSale && <s>{formatPrice(product.compareAtFils!)}</s>}
          </div>

          <p className={`pdp-stock ${product.available ? "in" : "out"}`}>
            <span className="dot" /> {product.available ? t("product.inStock") : t("product.outStock")}
          </p>

          {product.excerpt && <p className="pdp-excerpt">{product.excerpt}</p>}

          <AddToCartButton
            handle={product.handle}
            title={product.title}
            image={product.image}
            priceFils={product.priceFils}
            available={product.available}
            className="btn btn-primary pdp-add"
            label={t("product.addToCart")}
          />

          <ul className="pdp-assurances">
            <li>{t("product.a1")}</li>
            <li>{t("product.a2")}</li>
            <li>{t("product.a3")}</li>
          </ul>
        </div>
      </div>

      {product.bodyHtml && (
        <section className="pdp-description">
          <h2>{t("product.details")}</h2>
          <div className="rich-text" dangerouslySetInnerHTML={{ __html: product.bodyHtml }} />
        </section>
      )}

      {related.length > 0 && (
        <section className="section">
          <div className="section-head"><div><span className="eyebrow">{t("product.moreFrom", { brand: product.vendor })}</span><h2>{t("product.alsoLike")}</h2></div></div>
          <div className="product-grid">
            {related.map((p) => (
              <ProductCard key={p.handle} product={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
