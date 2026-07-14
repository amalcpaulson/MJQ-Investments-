/**
 * Seed script — pushes the scraped Luxury.ae catalogue into Neon.
 * Run with:  npm run db:seed   (after  npm run db:push)
 *
 * Env must load before any module that reads DATABASE_URL at import time
 * (src/lib/db.ts initializes the Neon client on import). ES imports are
 * hoisted, so we load dotenv first, then dynamically import db/schema.
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import productsData from "../data/products.json" with { type: "json" };
import collectionsData from "../data/collections.json" with { type: "json" };
import blogData from "../data/blog.json" with { type: "json" };

async function seed() {
  const { db } = await import("../lib/db");
  const { products, collections, blogPosts, subscribers } = await import("./schema");

  console.log("🌱 Seeding Luxury.ae into Neon…");

  await db.delete(products);
  await db.delete(collections);
  await db.delete(blogPosts);

  await db.insert(products).values(productsData as never);
  console.log(`   ✓ ${productsData.length} products`);

  await db.insert(collections).values(collectionsData as never);
  console.log(`   ✓ ${collectionsData.length} collections`);

  await db.insert(blogPosts).values(blogData as never);
  console.log(`   ✓ ${blogData.length} blog posts`);

  await db.select().from(subscribers).limit(1); // ensure table reachable
  console.log("✅ Seed complete.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
