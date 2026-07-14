export default function Loading() {
  return (
    <main id="main" className="container pdp" aria-hidden="true">
      <div className="pdp-grid">
        <div className="pdp-gallery">
          <div className="pdp-main skeleton-art shimmer" />
        </div>
        <div className="pdp-info">
          <div className="skeleton-line shimmer" style={{ width: "30%", marginInline: 0 }} />
          <div className="skeleton-line shimmer" style={{ width: "80%", height: "2.2rem", marginInline: 0 }} />
          <div className="skeleton-line shimmer" style={{ width: "35%", height: "1.4rem", marginInline: 0 }} />
          <div className="skeleton-line shimmer" style={{ width: "100%", marginInline: 0, marginTop: "1.5rem" }} />
          <div className="skeleton-line shimmer" style={{ width: "90%", marginInline: 0 }} />
          <div className="skeleton-line shimmer" style={{ width: "100%", height: "3rem", marginInline: 0, marginTop: "1.5rem" }} />
        </div>
      </div>
    </main>
  );
}
