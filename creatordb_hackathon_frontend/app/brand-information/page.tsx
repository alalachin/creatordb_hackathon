import Link from "next/link";
import { BRANDS_DATA } from "@/lib/brandsData";
import BrandInfoClient from "./BrandInfoClient";

interface Props {
  searchParams: { category?: string };
}

export default function BrandInformationPage({ searchParams }: Props) {
  const category = searchParams.category ?? Object.keys(BRANDS_DATA)[0];
  const brands = BRANDS_DATA[category] ?? {};

  return (
    <div className="min-h-screen px-4 py-12 max-w-5xl mx-auto">
      {/* Back */}
      <Link
        href="/entity-explorer"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-8 transition-colors"
      >
        ← Back to Categories
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
          {category}
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
          Select 2 brands to compare
        </h1>
        <p className="text-slate-500 text-sm">
          Choose two brands from the {category} category to generate a side-by-side demographics report.
        </p>
      </div>

      <BrandInfoClient category={category} brands={brands} />
    </div>
  );
}
