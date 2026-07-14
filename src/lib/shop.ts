import "server-only";
import { db } from "./db";
import { orders, type OrderLine } from "../db/schema";
import type { Product } from "../db/schema";
import { getProducts } from "./catalog";

/** Keyword search over the catalogue (title / vendor / description). */
export async function searchProducts(query: string, limit = 6): Promise<Product[]> {
  const { rows } = await getProducts();
  const q = query.trim().toLowerCase();
  if (!q) return rows.slice(0, limit);
  const terms = q.split(/\s+/).filter(Boolean);
  const scored = rows
    .map((p) => {
      const hay = `${p.title} ${p.vendor} ${p.productType} ${p.excerpt}`.toLowerCase();
      const score = terms.reduce((n, t) => n + (hay.includes(t) ? 1 : 0), 0);
      return { p, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((x) => x.p);
}

export interface PlacedOrder {
  orderNumber: string;
  totalFils: number;
  lines: OrderLine[];
}

export interface OrderInput {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  items: { handle: string; qty: number }[];
  channel?: "web" | "chatbot";
}

/** Resolve items against the catalogue, persist the order to Neon, return a receipt. */
export async function createOrder(input: OrderInput, orderNumber: string): Promise<PlacedOrder> {
  const { rows } = await getProducts();
  const byHandle = new Map(rows.map((p) => [p.handle, p]));

  const lines: OrderLine[] = [];
  for (const item of input.items) {
    const p = byHandle.get(item.handle);
    if (!p) continue;
    const qty = Math.max(1, Math.min(20, Math.round(item.qty || 1)));
    lines.push({ handle: p.handle, title: p.title, priceFils: p.priceFils, qty });
  }
  if (lines.length === 0) {
    throw new Error("None of the requested items were found in the catalogue.");
  }

  const totalFils = lines.reduce((n, l) => n + l.priceFils * l.qty, 0);

  await db.insert(orders).values({
    orderNumber,
    name: input.name,
    email: input.email.toLowerCase(),
    phone: input.phone ?? "",
    address: input.address ?? "",
    items: lines,
    totalFils,
    channel: input.channel ?? "web",
  });

  return { orderNumber, totalFils, lines };
}

/** Deterministic order number (no Math.random / Date at module scope). */
export function makeOrderNumber(seed: number): string {
  return `LX-${String(100000 + (seed % 900000)).slice(0, 6)}`;
}
