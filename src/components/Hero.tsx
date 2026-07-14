/** Editorial hero — headline, description, primary CTA, quiet proof stats. */
export default function Hero() {
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
            <a href="#collection" className="btn btn-primary">Shop the collection</a>
            <a href="#categories" className="btn btn-ghost">Explore categories</a>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="num">3</div>
              <div className="label">House brands</div>
            </div>
            <div className="hero-stat">
              <div className="num">100%</div>
              <div className="label">Authentic</div>
            </div>
            <div className="hero-stat">
              <div className="num">2&ndash;5d</div>
              <div className="label">UAE delivery</div>
            </div>
          </div>
        </div>

        <div className="hero-visual reveal" aria-hidden="true">
          <span className="ring" />
          <div className="mono">
            Curated<br />
            for the <span>discerning</span>
          </div>
        </div>
      </div>
    </section>
  );
}
