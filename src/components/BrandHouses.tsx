import Link from "next/link";
import Image from "next/image";
import { getT } from "@/i18n/server";

export interface House {
  name: string;
  origin: string;
  blurb: string;
  href: string;
  image?: string | null;
}

/** Editorial brand showcase — the three houses Luxury.ae carries. */
export default async function BrandHouses({ houses }: { houses: House[] }) {
  const { t, locale } = await getT();
  const arrow = locale === "ar" ? "←" : "→";
  return (
    <section className="section container" id="houses">
      <div className="section-head reveal-scroll">
        <div>
          <span className="eyebrow">{t("houses.eyebrow")}</span>
          <h2>{t("houses.title")}</h2>
        </div>
        <p>{t("houses.desc")}</p>
      </div>

      <div className="house-grid">
        {houses.map((h) => (
          <Link key={h.name} href={h.href} className="house-card reveal-scroll" aria-label={t("houses.shop", { brand: h.name })}>
            <div className="house-media">
              {h.image && <Image src={h.image} alt={h.name} fill sizes="(max-width: 860px) 100vw, 380px" className="house-img" />}
              <span className="house-origin">{h.origin}</span>
            </div>
            <div className="house-body">
              <h3>{h.name}</h3>
              <p>{h.blurb}</p>
              <span className="house-more">{t("houses.shop", { brand: h.name })} {arrow}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
