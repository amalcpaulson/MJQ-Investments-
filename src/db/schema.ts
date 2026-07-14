import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

/**
 * Product catalogue for the Luxury.ae storefront.
 * Prices are whole AED (dirhams) to keep the demo simple.
 */
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  brand: text("brand").notNull(),
  category: text("category").notNull(), // matches categories.slug
  price: integer("price").notNull(), // AED
  size: text("size"),
  description: text("description").notNull(),
  badge: text("badge"), // e.g. "Bestseller", "New"
  accent: text("accent").notNull().default("#1f3d2b"), // card art colour
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/** Shop-by-category tiles. */
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  tagline: text("tagline").notNull(),
  accent: text("accent").notNull().default("#1f3d2b"),
});

/** Newsletter / membership sign-ups. */
export const subscribers = pgTable(
  "subscribers",
  {
    id: serial("id").primaryKey(),
    email: text("email").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [uniqueIndex("subscribers_email_idx").on(table.email)]
);

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Category = typeof categories.$inferSelect;
export type Subscriber = typeof subscribers.$inferSelect;
