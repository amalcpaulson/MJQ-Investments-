"use client";

import { useMemo, useState } from "react";
import type { Product, Category } from "../db/schema";
import type { DataSource } from "../lib/products";
import ProductCard from "./ProductCard";
import { SearchIcon } from "./icons";

interface Props {
  products: Product[];
  categories: Category[];
  source: DataSource;
}

/**
 * Client-side merchandising: category filtering + instant search over the
 * server-rendered catalogue, with an accessible empty state.
 */
export default function Storefront({ products, categories, source }: Props) {
  const [active, setActive] = useState<string>("all");
  const [query, setQuery] = useState("");

  const filters = useMemo(
    () => [{ slug: "all", name: "All" }, ...categories.map((c) => ({ slug: c.slug, name: c.name }))],
    [categories]
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const inCat = active === "all" || p.category === active;
      const inQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);
      return inCat && inQuery;
    });
  }, [products, active, query]);

  return (
    <section className="section container" id="collection">
      <div className="section-head">
        <div>
          <span className="eyebrow">The collection</span>
          <h2>Curated for you</h2>
        </div>
        <span className="source-note" title={source === "neon" ? "Live from Neon" : "Preview catalogue"}>
          <span className={`dot ${source === "neon" ? "live" : "preview"}`} />
          {source === "neon" ? "Live from Neon PostgreSQL" : "Preview catalogue"}
        </span>
      </div>

      <div className="controls">
        <div className="filters" role="group" aria-label="Filter by category">
          {filters.map((f) => (
            <button
              key={f.slug}
              type="button"
              className="chip"
              aria-pressed={active === f.slug}
              onClick={() => setActive(f.slug)}
            >
              {f.name}
            </button>
          ))}
        </div>

        <div className="search-field">
          <SearchIcon />
          <label htmlFor="product-search" className="visually-hidden">Search products</label>
          <input
            id="product-search"
            type="search"
            placeholder="Search products…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
          />
        </div>
      </div>

      {visible.length > 0 ? (
        <div className="product-grid">
          {visible.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="product-grid">
          <div className="empty" role="status">
            <h3>Nothing matches yet</h3>
            <p>
              We couldn&rsquo;t find anything for
              {query ? ` “${query}”` : " that selection"}. Try a different category or search term.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
