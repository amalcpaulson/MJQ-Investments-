import type { Category } from "../db/schema";
import { ArrowIcon } from "./icons";

/** Shop-by-category tiles. Anchor links jump to the filtered collection. */
export default function CategorySection({ categories }: { categories: Category[] }) {
  return (
    <section className="section container" id="categories">
      <div className="section-head">
        <div>
          <span className="eyebrow">Browse</span>
          <h2>Shop by category</h2>
        </div>
        <p>Four disciplines of everyday luxury, each sourced from a house that defined it.</p>
      </div>

      <div className="cat-grid">
        {categories.map((cat) => (
          <a
            key={cat.slug}
            href={`#collection`}
            className="cat-tile"
            style={{ "--tile-accent": cat.accent } as React.CSSProperties}
            aria-label={`Shop ${cat.name}`}
          >
            <ArrowIcon className="cat-arrow" />
            <span className="cat-name">{cat.name}</span>
            <span className="cat-tag">{cat.tagline}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
