import Link from "next/link";
import Image from "next/image";
import type { Product } from "../db/schema";
import { formatPrice, brandAccent } from "../lib/format";
import AddToCartButton from "./cart/AddToCartButton";

/** Product card with real imagery, price, and add-to-cart. */
export default function ProductCard({ product }: { product: Product }) {
  const href = `/products/${product.handle}`;
  const onSale = product.compareAtFils && product.compareAtFils > product.priceFils;

  return (
    <article className="product-card">
      <Link href={href} className="product-art-link" aria-label={product.title}>
        <div className="product-art" style={{ "--card-accent": brandAccent(product.vendor) } as React.CSSProperties}>
          {product.featured && <span className="badge">Featured</span>}
          {onSale && <span className="badge badge-sale">Sale</span>}
          {product.image ? (
            <Image
              src={product.image}
              alt={product.title}
              fill
              sizes="(max-width: 720px) 50vw, (max-width: 1024px) 33vw, 300px"
              className="product-img"
            />
          ) : (
            <span className="initial" aria-hidden="true">{product.vendor.charAt(0)}</span>
          )}
        </div>
      </Link>

      <div className="product-body">
        <span className="product-brand">{product.vendor}</span>
        <h3 className="product-name">
          <Link href={href}>{product.title}</Link>
        </h3>
        <div className="product-foot">
          <span className="product-price">
            {formatPrice(product.priceFils)}
            {onSale && <s className="product-compare">{formatPrice(product.compareAtFils!)}</s>}
          </span>
          <AddToCartButton
            handle={product.handle}
            title={product.title}
            image={product.image}
            priceFils={product.priceFils}
            available={product.available}
            compact
          />
        </div>
      </div>
    </article>
  );
}
