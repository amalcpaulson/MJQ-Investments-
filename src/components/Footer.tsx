import Link from "next/link";
import { getT } from "@/i18n/server";

const COLUMNS = [
  {
    heading: "footer.shop",
    links: [
      { key: "nav.toothpaste", href: "/collections/marvis" },
      { key: "nav.mouthwash", href: "/collections/mouthwash" },
      { key: "nav.hairCare", href: "/collections/fino" },
      { key: "nav.grooming", href: "/collections/proraso" },
      { key: "nav.giftSets", href: "/collections/gift-set-collection" },
    ],
  },
  {
    heading: "footer.maison",
    links: [
      { key: "footer.about", href: "/about" },
      { key: "footer.why", href: "/why-us" },
      { key: "footer.journal", href: "/blogs" },
      { key: "footer.contact", href: "/contact" },
    ],
  },
  {
    heading: "footer.care",
    links: [
      { key: "footer.shipping", href: "/policies/shipping-returns" },
      { key: "footer.faq", href: "/faq" },
      { key: "footer.privacy", href: "/policies/privacy" },
      { key: "footer.terms", href: "/policies/terms" },
    ],
  },
];

export default async function Footer() {
  const { t } = await getT();
  const year = 2026;

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand footer-col">
          <span className="brand">
            LUXURY<span className="dot-ae" style={{ color: "var(--gold)" }}>.ae</span>
          </span>
          <p>{t("footer.tagline")}</p>
          <p className="footer-contact">
            <a href="tel:+97148804005">04 880 4005</a> &nbsp;·&nbsp;
            <a href="mailto:mk@mjqinvestment.com">mk@mjqinvestment.com</a>
          </p>
        </div>

        {COLUMNS.map((col) => (
          <nav key={col.heading} className="footer-col" aria-label={t(col.heading)}>
            <h4>{t(col.heading)}</h4>
            {col.links.map((link) => (
              <Link key={link.key} href={link.href}>{t(link.key)}</Link>
            ))}
          </nav>
        ))}
      </div>

      <div className="container footer-bottom">
        <span>{t("footer.rights", { year })}</span>
        <span>{t("footer.city")}</span>
      </div>
    </footer>
  );
}
