import type { Product } from "../db/schema";
import { getT } from "@/i18n/server";
import ProductCard from "./ProductCard";

export default async function ProductGrid({ products }: { products: Product[] }) {
  const { t } = await getT();
  if (products.length === 0) {
    return (
      <div className="product-grid">
        <div className="empty" role="status">
          <h3>{t("browser.emptyTitle")}</h3>
          <p>{t("browser.emptyDesc")}</p>
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
