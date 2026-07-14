import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  uniqueIndex,
} from "drizzle-orm/pg-core";

/** Product catalogue (scraped from the real Luxury.ae brand portfolio). */
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  handle: text("handle").notNull().unique(),
  title: text("title").notNull(),
  vendor: text("vendor").notNull(),
  productType: text("product_type").notNull().default(""),
  priceFils: integer("price_fils").notNull(),
  compareAtFils: integer("compare_at_fils"),
  available: boolean("available").notNull().default(true),
  bodyHtml: text("body_html").notNull().default(""),
  excerpt: text("excerpt").notNull().default(""),
  image: text("image"),
  images: jsonb("images").$type<string[]>().notNull().default([]),
  tags: jsonb("tags").$type<string[]>().notNull().default([]),
  collections: jsonb("collections").$type<string[]>().notNull().default([]),
  variants: jsonb("variants").$type<ProductVariant[]>().notNull().default([]),
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export interface ProductVariant {
  title: string;
  priceFils: number;
  available: boolean;
  sku: string;
}

/** Collections / categories. */
export const collections = pgTable("collections", {
  id: serial("id").primaryKey(),
  handle: text("handle").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  productCount: integer("product_count").notNull().default(0),
  productHandles: jsonb("product_handles").$type<string[]>().notNull().default([]),
});

/** Editorial / blog. */
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  handle: text("handle").notNull().unique(),
  title: text("title").notNull(),
  published: text("published").notNull().default(""),
  author: text("author").notNull().default("Luxury.ae"),
  excerpt: text("excerpt").notNull().default(""),
  contentHtml: text("content_html").notNull().default(""),
  image: text("image"),
});

/** Orders placed through the site or the AI concierge. */
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull().default(""),
  address: text("address").notNull().default(""),
  items: jsonb("items").$type<OrderLine[]>().notNull().default([]),
  totalFils: integer("total_fils").notNull().default(0),
  channel: text("channel").notNull().default("web"), // "web" | "chatbot"
  status: text("status").notNull().default("received"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export interface OrderLine {
  handle: string;
  title: string;
  priceFils: number;
  qty: number;
}

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
export type Collection = typeof collections.$inferSelect;
export type BlogPost = typeof blogPosts.$inferSelect;
export type Subscriber = typeof subscribers.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
