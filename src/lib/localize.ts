import type { Product } from "../db/schema";
import type { Locale } from "../i18n/config";
import { PRODUCTS_AR, COLLECTIONS_AR } from "../i18n/content-ar";
import { collectionTitle } from "./format";

/** Swap a product's title / description to Arabic when locale is "ar". */
export function localizeProduct(p: Product, locale: Locale): Product {
  if (locale !== "ar") return p;
  const ar = PRODUCTS_AR[p.handle];
  if (!ar) return p;
  return { ...p, title: ar.title, excerpt: ar.description, bodyHtml: `<p>${ar.description}</p>` };
}

export function localizeProducts(rows: Product[], locale: Locale): Product[] {
  return locale === "ar" ? rows.map((p) => localizeProduct(p, locale)) : rows;
}

/** Human-friendly collection title in the active locale. */
export function displayCollectionTitle(handle: string, locale: Locale, fallback = ""): string {
  if (locale === "ar" && COLLECTIONS_AR[handle]) return COLLECTIONS_AR[handle];
  return collectionTitle(handle, fallback);
}
