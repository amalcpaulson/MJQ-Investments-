import Link from "next/link";
import { ArrowIcon } from "./icons";

export interface CategoryTile {
  href: string;
  name: string;
  tagline: string;
  accent: string;
}

/** Shop-by-category tiles linking to real collection pages. */
export default function CategorySection({ tiles }: { tiles: CategoryTile[] }) {
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
        {tiles.map((cat) => (
          <Link
            key={cat.href}
            href={cat.href}
            className="cat-tile"
            style={{ "--tile-accent": cat.accent } as React.CSSProperties}
            aria-label={`Shop ${cat.name}`}
          >
            <ArrowIcon className="cat-arrow" />
            <span className="cat-name">{cat.name}</span>
            <span className="cat-tag">{cat.tagline}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
