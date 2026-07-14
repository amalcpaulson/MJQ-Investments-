import Link from "next/link";
import Image from "next/image";
import { getT } from "@/i18n/server";
import { ArrowIcon } from "./icons";

export interface CategoryTile {
  href: string;
  name: string;
  tagline: string;
  accent: string;
  image?: string | null;
}

/** Shop-by-category lookbook tiles linking to real collection pages. */
export default async function CategorySection({ tiles }: { tiles: CategoryTile[] }) {
  const { t } = await getT();
  return (
    <section className="section container" id="categories">
      <div className="section-head">
        <div>
          <span className="eyebrow">{t("categories.eyebrow")}</span>
          <h2>{t("categories.title")}</h2>
        </div>
        <p>{t("categories.desc")}</p>
      </div>

      <div className="cat-grid">
        {tiles.map((cat) => (
          <Link
            key={cat.href}
            href={cat.href}
            className="cat-tile"
            style={{ "--tile-accent": cat.accent } as React.CSSProperties}
            aria-label={cat.name}
          >
            <div className="cat-media">
              {cat.image && <Image src={cat.image} alt={cat.name} fill sizes="(max-width: 900px) 50vw, 300px" className="cat-img" />}
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
