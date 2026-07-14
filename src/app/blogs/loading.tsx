export default function Loading() {
  return (
    <main id="main" className="section container" aria-hidden="true">
      <div className="page-head">
        <span className="eyebrow">The Journal</span>
        <h1>Stories &amp; rituals</h1>
      </div>
      <div className="journal-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="journal-card">
            <div className="skeleton-line shimmer" style={{ width: "30%", marginInline: 0 }} />
            <div className="skeleton-line shimmer" style={{ width: "90%", height: "1.4rem", marginInline: 0 }} />
            <div className="skeleton-line shimmer" style={{ width: "100%", marginInline: 0 }} />
            <div className="skeleton-line shimmer" style={{ width: "70%", marginInline: 0 }} />
          </div>
        ))}
      </div>
    </main>
  );
}
