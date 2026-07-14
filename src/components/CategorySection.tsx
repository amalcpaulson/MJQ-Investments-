import Link from "next/link";
import Image from "next/image";
import { ArrowIcon } from "./icons";

export interface CategoryTile {
  href: string;
  name: string;
  tagline: string;
  accent: string;
  image?: string | null;
}

/** Shop-by-category lookbook tiles with real product imagery. */
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
            <div className="cat-media">
              {cat.image && (
                <Image src={cat.image} alt={cat.name} fill sizes="(max-width: 900px) 50vw, 300px" className="cat-img" />
              )}
            </div>
            <div className="cat-caption">
              <div>
                <span className="cat-name">{cat.name}</span>
                <span className="cat-tag">{cat.tagline}</span>
              </div>
              <ArrowIcon className="cat-arrow" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
