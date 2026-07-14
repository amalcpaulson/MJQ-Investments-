import ProductGridSkeleton from "@/components/ProductGridSkeleton";

export default function Loading() {
  return (
    <main id="main" className="section container">
      <div className="page-head">
        <span className="eyebrow">The collection</span>
        <h1>Shop all</h1>
      </div>
      <ProductGridSkeleton count={12} />
    </main>
  );
}
