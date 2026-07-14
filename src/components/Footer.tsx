import Link from "next/link";

const COLUMNS = [
  {
    heading: "Shop",
    links: [
      { label: "Toothpaste", href: "/collections/marvis" },
      { label: "Mouthwash", href: "/collections/mouthwash" },
      { label: "Hair Care", href: "/collections/fino" },
      { label: "Grooming", href: "/collections/proraso" },
      { label: "Gift Sets", href: "/collections/gift-set-collection" },
    ],
  },
  {
    heading: "Maison",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Why Us", href: "/why-us" },
      { label: "The Journal", href: "/blogs" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Care",
    links: [
      { label: "Shipping & Returns", href: "/policies/shipping-returns" },
      { label: "FAQ", href: "/faq" },
      { label: "Privacy Policy", href: "/policies/privacy" },
      { label: "Terms of Service", href: "/policies/terms" },
    ],
  },
];

export default function Footer() {
  const year = 2026; // build-time constant; avoids hydration drift

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand footer-col">
          <span className="brand">
            LUXURY<span className="dot-ae" style={{ color: "var(--gold)" }}>.ae</span>
          </span>
          <p>
            A luxury shopping &amp; brand-discovery platform for the modern UAE lifestyle.
            Authentic beauty, hair and grooming, beautifully delivered.
          </p>
          <p className="footer-contact">
            <a href="tel:+97148804005">04 880 4005</a> &nbsp;·&nbsp;
            <a href="mailto:mk@mjqinvestment.com">mk@mjqinvestment.com</a>
          </p>
        </div>

        {COLUMNS.map((col) => (
          <nav key={col.heading} className="footer-col" aria-label={col.heading}>
            <h4>{col.heading}</h4>
            {col.links.map((link) => (
              <Link key={link.label} href={link.href}>{link.label}</Link>
            ))}
          </nav>
        ))}
      </div>

      <div className="container footer-bottom">
        <span>&copy; {year} Luxury.ae — a MJQ Investment LLC company. All rights reserved.</span>
        <span>Dubai, United Arab Emirates</span>
      </div>
    </footer>
  );
}
