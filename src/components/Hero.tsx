import Link from "next/link";
import Image from "next/image";

interface Props {
  mainImage?: string | null;
  mainLabel?: string;
  mainHref?: string;
  accentImage?: string | null;
  accentHref?: string;
}

/** Editorial hero — headline + copy on the left, layered product photography on the right. */
export default function Hero({ mainImage, mainLabel, mainHref, accentImage, accentHref }: Props) {
  return (
    <section className="hero" id="top">
      <div className="container hero-grid">
        <div className="reveal">
          <span className="eyebrow">Luxury living, delivered in the UAE</span>
          <h1>
            The finest in <em>beauty</em> &amp; personal care, curated.
          </h1>
          <p>
            Luxury.ae brings the world&rsquo;s most coveted grooming, hair and oral-care houses
            to your door — authentic, effortless, and beautifully considered.
          </p>
          <div className="hero-cta">
            <Link href="/collections" className="btn btn-primary">Shop the collection</Link>
            <a href="#categories" className="btn btn-ghost">Explore categories</a>
          </div>
          <div className="hero-stats">
            <div className="hero-stat"><div className="num">3</div><div className="label">House brands</div></div>
            <div className="hero-stat"><div className="num">100%</div><div className="label">Authentic</div></div>
            <div className="hero-stat"><div className="num">2&ndash;5d</div><div className="label">UAE delivery</div></div>
          </div>
        </div>

        <div className="hero-visual reveal">
          <span className="ring" aria-hidden="true" />

          {mainImage ? (
            <Link href={mainHref ?? "/collections"} className="hero-photo" aria-label={mainLabel ?? "Featured product"}>
              <Image src={mainImage} alt={mainLabel ?? "Featured product"} fill sizes="(max-width: 780px) 80vw, 420px" className="hero-photo-img" priority />
              {mainLabel && <span className="hero-photo-chip">{mainLabel}</span>}
            </Link>
          ) : (
            <div className="mono" aria-hidden="true">Curated<br />for the <span>discerning</span></div>
          )}

          {accentImage && (
            <Link href={accentHref ?? "/collections"} className="hero-photo-accent" aria-label="Featured product">
              <Image src={accentImage} alt="" fill sizes="180px" className="hero-photo-img" />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
