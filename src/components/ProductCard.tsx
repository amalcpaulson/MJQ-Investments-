import type { Product } from "../db/schema";
import { formatPrice } from "../lib/products";

/**
 * Presentational product card. The "image" is a self-contained typographic
 * composition (brand initial on a branded gradient) — premium, and immune to
 * broken-image errors on deploy.
 */
export default function ProductCard({ product }: { product: Product }) {
  return (
    <article className="product-card">
      <div
        className="product-art"
        style={{ "--card-accent": product.accent } as React.CSSProperties}
        role="img"
        aria-label={`${product.brand} ${product.name}`}
      >
        {product.badge && <span className="badge">{product.badge}</span>}
        <span className="initial" aria-hidden="true">{product.brand.charAt(0)}</span>
        <span className="brandmark" aria-hidden="true">{product.brand}</span>
        <span className="sheen" aria-hidden="true" />
      </div>

      <div className="product-body">
        <span className="product-brand">{product.brand}</span>
        <h3 className="product-name">{product.name}</h3>
        {product.size && <span className="product-size">{product.size}</span>}
        <div className="product-foot">
          <span className="product-price">{formatPrice(product.price)}</span>
          <button
            type="button"
            className="add-btn"
            aria-label={`Add ${product.name} to cart`}
          >
            Add
          </button>
        </div>
      </div>
    </article>
  );
}
