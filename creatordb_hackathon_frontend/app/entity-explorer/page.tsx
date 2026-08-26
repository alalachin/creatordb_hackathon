import Link from "next/link";
import { BRANDS_DATA } from "@/lib/brandsData";
import CategoryGrid from "./CategoryGrid";

export default function EntityExplorerPage() {
  const categories = [
    "Luxury",
    ...Object.keys(BRANDS_DATA)
      .filter((k) => k !== "Luxury")
      .sort(),
  ];

  // Build brand counts per category
  const brandCounts: Record<string, number> = {};
  for (const cat of categories) {
    brandCounts[cat] = Object.keys(BRANDS_DATA[cat] ?? {}).length;
  }

  const totalBrands = Object.values(BRANDS_DATA).reduce(
    (total, brands) => total + Object.keys(brands).length,
    0
  );

  return (
    <div className="mesh-bg min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-6 transition-colors"
        >
          ← Back to Home
        </Link>

        {/* Breadcrumb badge */}
        <div className="mb-6">
          <span className="badge-slate">Home / clearCompetitors</span>
        </div>

        {/* Header */}
        <div className="mb-10 animate-fade-in">
          <h1 className="page-title mb-3">
            <span className="gradient-text">clearCompetitors</span>
          </h1>
          <p className="text-slate-500 text-base leading-relaxed">
            Instant insights for large brands — select a category to analyze your competitors.
          </p>
        </div>

        {/* Category grid */}
        <div className="animate-slide-up delay-100">
          <CategoryGrid categories={categories} brandCounts={brandCounts} />
        </div>

        {/* Footer info */}
        <p className="mt-8 text-xs text-slate-400">
          {categories.length} {categories.length === 1 ? "category" : "categories"} available
          {" · "}
          {totalBrands}+ brands indexed
        </p>
      </div>
    </div>
  );
}
