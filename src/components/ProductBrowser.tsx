"use client";

import { useMemo, useState } from "react";
import type { Product } from "../db/schema";
import ProductCard from "./ProductCard";
import { SearchIcon } from "./icons";

interface Props {
  products: Product[];
  /** Show brand (vendor) filter chips. */
  brands?: boolean;
}

type Sort = "featured" | "price-asc" | "price-desc";

/** Client-side browsing: brand filter + search + sort, with empty state. */
export default function ProductBrowser({ products, brands = true }: Props) {
  const [brand, setBrand] = useState("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("featured");

  const brandList = useMemo(() => {
    const set = Array.from(new Set(products.map((p) => p.vendor))).sort();
    return ["all", ...set];
  }, [products]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = products.filter((p) => {
      const inBrand = brand === "all" || p.vendor === brand;
      const inQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.vendor.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q);
      return inBrand && inQuery;
    });
    const sorted = [...filtered];
    if (sort === "price-asc") sorted.sort((a, b) => a.priceFils - b.priceFils);
    else if (sort === "price-desc") sorted.sort((a, b) => b.priceFils - a.priceFils);
    else sorted.sort((a, b) => Number(b.featured) - Number(a.featured));
    return sorted;
  }, [products, brand, query, sort]);

  return (
    <>
      <div className="controls">
        {brands && (
          <div className="filters" role="group" aria-label="Filter by brand">
            {brandList.map((b) => (
              <button
                key={b}
                type="button"
                className="chip"
                aria-pressed={brand === b}
                onClick={() => setBrand(b)}
              >
                {b === "all" ? "All brands" : b}
              </button>
            ))}
          </div>
        )}

        <div className="controls-right">
          <div className="search-field">
            <SearchIcon />
            <label htmlFor="browse-search" className="visually-hidden">Search products</label>
            <input
              id="browse-search"
              type="search"
              placeholder="Search…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoComplete="off"
            />
          </div>
          <label htmlFor="browse-sort" className="visually-hidden">Sort products</label>
          <select
            id="browse-sort"
            className="sort-select"
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      <p className="result-count" aria-live="polite">
        {visible.length} {visible.length === 1 ? "product" : "products"}
      </p>

      {visible.length > 0 ? (
        <div className="product-grid">
          {visible.map((p) => (
            <ProductCard key={p.handle} product={p} />
          ))}
        </div>
      ) : (
        <div className="product-grid">
          <div className="empty" role="status">
            <h3>Nothing matches</h3>
            <p>Try a different brand or search term.</p>
          </div>
        </div>
      )}
    </>
  );
}
