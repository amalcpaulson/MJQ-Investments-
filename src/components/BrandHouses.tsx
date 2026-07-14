import Link from "next/link";
import Image from "next/image";

export interface House {
  name: string;
  origin: string;
  blurb: string;
  href: string;
  image?: string | null;
}

/** Editorial brand showcase — the three houses Luxury.ae carries. */
export default function BrandHouses({ houses }: { houses: House[] }) {
  return (
    <section className="section container" id="houses">
      <div className="section-head reveal-scroll">
        <div>
          <span className="eyebrow">The houses</span>
          <h2>Three icons, one destination</h2>
        </div>
        <p>Italian craft, Japanese precision and time-honoured barbering — under a single roof.</p>
      </div>

      <div className="house-grid">
        {houses.map((h) => (
          <Link key={h.name} href={h.href} className="house-card reveal-scroll" aria-label={`Shop ${h.name}`}>
            <div className="house-media">
              {h.image && <Image src={h.image} alt={h.name} fill sizes="(max-width: 860px) 100vw, 380px" className="house-img" />}
              <span className="house-origin">{h.origin}</span>
            </div>
            <div className="house-body">
              <h3>{h.name}</h3>
              <p>{h.blurb}</p>
              <span className="house-more">Shop {h.name} →</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
