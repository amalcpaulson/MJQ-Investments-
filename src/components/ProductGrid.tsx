import type { Product } from "../db/schema";
import ProductCard from "./ProductCard";

export default function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="product-grid">
        <div className="empty" role="status">
          <h3>Nothing here yet</h3>
          <p>There are no products to show in this selection.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="product-grid">
      {products.map((p) => (
        <ProductCard key={p.handle} product={p} />
      ))}
    </div>
  );
}
