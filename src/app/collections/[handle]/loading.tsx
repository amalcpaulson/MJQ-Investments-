import ProductGridSkeleton from "@/components/ProductGridSkeleton";

export default function Loading() {
  return (
    <main id="main" className="section container">
      <div className="page-head">
        <span className="eyebrow">Collection</span>
        <h1 className="skeleton-line shimmer" style={{ width: "min(320px, 60%)", height: "2.4rem", margin: "0.6rem 0" }} />
      </div>
      <ProductGridSkeleton count={8} />
    </main>
  );
}
