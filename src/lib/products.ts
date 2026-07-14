import { db } from "./db";
import { products as productsTable, categories as categoriesTable } from "../db/schema";
import type { Product, Category } from "../db/schema";
import { PRODUCTS, CATEGORIES } from "../db/catalog";

/**
 * Data-access layer with a graceful fallback.
 *
 * When Neon is configured we read live from the database. If the connection
 * string is missing (e.g. before setup) or a query fails, we fall back to the
 * bundled catalogue so the storefront always renders. `source` lets the UI
 * show an honest "live / preview" status.
 */

export type DataSource = "neon" | "fallback";

export interface CatalogResult {
  products: Product[];
  categories: Category[];
  source: DataSource;
  error: string | null;
}

function isConfigured(): boolean {
  const url = process.env.DATABASE_URL;
  return !!url && !url.includes("placeholder") && !url.includes("user:password");
}

/** Local catalogue shaped like DB rows (stable ids for keys). */
function fallbackData(): { products: Product[]; categories: Category[] } {
  const products = PRODUCTS.map((p, i) => ({
    id: i + 1,
    createdAt: new Date(0),
    size: p.size ?? null,
    badge: p.badge ?? null,
    accent: p.accent ?? "#1f3d2b",
    featured: p.featured ?? false,
    ...p,
  })) as Product[];

  const categories = CATEGORIES.map((c, i) => ({ id: i + 1, ...c })) as Category[];
  return { products, categories };
}

export async function getCatalog(): Promise<CatalogResult> {
  if (!isConfigured()) {
    const { products, categories } = fallbackData();
    return { products, categories, source: "fallback", error: null };
  }

  try {
    const [products, categories] = await Promise.all([
      db.select().from(productsTable),
      db.select().from(categoriesTable),
    ]);

    // Empty DB (not seeded yet) → use fallback so the page still looks complete.
    if (products.length === 0) {
      const fb = fallbackData();
      return { ...fb, source: "fallback", error: "Database reachable but not seeded yet." };
    }

    return { products, categories, source: "neon", error: null };
  } catch (err) {
    console.error("Catalog query failed, using fallback:", err);
    const { products, categories } = fallbackData();
    const message = err instanceof Error ? err.message : "Unknown database error";
    return { products, categories, source: "fallback", error: message };
  }
}

export function formatPrice(aed: number): string {
  return `AED ${aed.toLocaleString("en-AE")}`;
}
