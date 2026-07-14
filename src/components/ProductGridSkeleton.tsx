/** Loading placeholder for product grids (Next.js route loading UI). */
export default function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="product-grid" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-card">
          <div className="skeleton-art shimmer" />
          <div className="skeleton-line shimmer" style={{ width: "40%" }} />
          <div className="skeleton-line shimmer" style={{ width: "75%" }} />
          <div className="skeleton-line shimmer" style={{ width: "30%", marginBottom: "1.1rem" }} />
        </div>
      ))}
    </div>
  );
}
