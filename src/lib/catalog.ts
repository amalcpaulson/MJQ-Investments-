import { db } from "./db";
import {
  products as productsTable,
  collections as collectionsTable,
  blogPosts as blogTable,
} from "../db/schema";
import type { Product, Collection, BlogPost } from "../db/schema";
import { eq } from "drizzle-orm";

import productsData from "../data/products.json";
import collectionsData from "../data/collections.json";
import blogData from "../data/blog.json";

export type DataSource = "neon" | "fallback";

function isConfigured(): boolean {
  const url = process.env.DATABASE_URL;
  return !!url && !url.includes("placeholder") && !url.includes("user:password");
}

/* ------------------------------------------------------------------ */
/* Bundled fallback (shaped to match DB rows)                          */
/* ------------------------------------------------------------------ */

const fallbackProducts: Product[] = (productsData as unknown as Partial<Product>[]).map(
  (p, i) => ({
    id: i + 1,
    createdAt: new Date(0),
    compareAtFils: null,
    image: null,
    ...p,
  })
) as Product[];

const fallbackCollections: Collection[] = (collectionsData as unknown as Partial<Collection>[]).map(
  (c, i) => ({ id: i + 1, description: "", productCount: 0, productHandles: [], ...c })
) as Collection[];

const fallbackBlog: BlogPost[] = (blogData as unknown as Partial<BlogPost>[]).map(
  (b, i) => ({ id: i + 1, author: "Luxury.ae", image: null, ...b })
) as BlogPost[];

/* ------------------------------------------------------------------ */
/* Queries with fallback                                               */
/* ------------------------------------------------------------------ */

async function tryDb<T>(query: () => Promise<T[]>, fallback: T[]): Promise<{ rows: T[]; source: DataSource }> {
  if (!isConfigured()) return { rows: fallback, source: "fallback" };
  try {
    const rows = await query();
    if (rows.length === 0) return { rows: fallback, source: "fallback" };
    return { rows, source: "neon" };
  } catch (err) {
    console.error("DB query failed, using fallback:", err);
    return { rows: fallback, source: "fallback" };
  }
}

export async function getProducts() {
  return tryDb(() => db.select().from(productsTable), fallbackProducts);
}

export async function getProductByHandle(handle: string): Promise<Product | null> {
  const { rows } = await tryDb(
    () => db.select().from(productsTable).where(eq(productsTable.handle, handle)),
    fallbackProducts.filter((p) => p.handle === handle)
  );
  return rows[0] ?? null;
}

export async function getCollections() {
  return tryDb(() => db.select().from(collectionsTable), fallbackCollections);
}

export async function getCollectionByHandle(handle: string): Promise<Collection | null> {
  const { rows } = await tryDb(
    () => db.select().from(collectionsTable).where(eq(collectionsTable.handle, handle)),
    fallbackCollections.filter((c) => c.handle === handle)
  );
  return rows[0] ?? null;
}

/** All products belonging to a collection (order preserved from the collection). */
export async function getCollectionProducts(handle: string): Promise<Product[]> {
  const collection = await getCollectionByHandle(handle);
  if (!collection) return [];
  const { rows } = await getProducts();
  const byHandle = new Map(rows.map((p) => [p.handle, p]));
  return collection.productHandles.map((h) => byHandle.get(h)).filter((p): p is Product => !!p);
}

export async function getBlogPosts() {
  const { rows, source } = await tryDb(() => db.select().from(blogTable), fallbackBlog);
  const sorted = [...rows].sort((a, b) => (a.published < b.published ? 1 : -1));
  return { rows: sorted, source };
}

export async function getBlogPost(handle: string): Promise<BlogPost | null> {
  const { rows } = await tryDb(
    () => db.select().from(blogTable).where(eq(blogTable.handle, handle)),
    fallbackBlog.filter((b) => b.handle === handle)
  );
  return rows[0] ?? null;
}
