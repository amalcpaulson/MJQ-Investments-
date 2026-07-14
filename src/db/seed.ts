/**
 * Seed script — pushes the curated catalogue into Neon.
 * Run with:  npm run db:seed   (after  npm run db:push)
 *
 * Note: env must load *before* any module that reads DATABASE_URL at import
 * time (src/lib/db.ts initializes the Neon client on import). ES module imports
 * are hoisted, so we load dotenv first and then dynamically import db/schema.
 */
import { config } from "dotenv";
config({ path: ".env.local" });

async function seed() {
  const { db } = await import("../lib/db");
  const { products, categories, subscribers } = await import("./schema");
  const { CATEGORIES, PRODUCTS } = await import("./catalog");

  console.log("🌱 Seeding Luxury.ae catalogue into Neon…");

  // Idempotent: clear then insert.
  await db.delete(products);
  await db.delete(categories);

  await db.insert(categories).values([...CATEGORIES]);
  console.log(`   ✓ ${CATEGORIES.length} categories`);

  await db.insert(products).values(PRODUCTS);
  console.log(`   ✓ ${PRODUCTS.length} products`);

  // Ensure the subscribers table exists / is reachable.
  await db.select().from(subscribers).limit(1);

  console.log("✅ Seed complete.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
