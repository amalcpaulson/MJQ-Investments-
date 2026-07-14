const COLUMNS = [
  {
    heading: "Shop",
    links: ["Oral Care", "Hair Care", "Grooming", "Gift Sets"],
  },
  {
    heading: "Maison",
    links: ["About Luxury.ae", "Why Us", "The Edit", "Wholesale"],
  },
  {
    heading: "Care",
    links: ["Shipping & Returns", "FAQ", "Contact", "Track Order"],
  },
];

export default function Footer() {
  const year = 2026; // build-time constant; avoids hydration drift

  return (
    <footer className="site-footer" id="journal">
      <div className="container footer-grid">
        <div className="footer-brand footer-col">
          <span className="brand">
            LUXURY<span className="dot-ae" style={{ color: "var(--gold)" }}>.ae</span>
          </span>
          <p>
            A luxury shopping &amp; brand-discovery platform for the modern UAE lifestyle.
            Authentic beauty, hair and grooming, beautifully delivered.
          </p>
        </div>

        {COLUMNS.map((col) => (
          <nav key={col.heading} className="footer-col" aria-label={col.heading}>
            <h4>{col.heading}</h4>
            {col.links.map((link) => (
              <a key={link} href="#top">{link}</a>
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
