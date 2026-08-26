import { notFound } from "next/navigation";
import ComparisonClient from "./ComparisonClient";

interface Props {
  searchParams: { brandA?: string; brandB?: string };
}

export default function BrandsComparisonPage({ searchParams }: Props) {
  const brandA = searchParams.brandA?.trim() ?? "";
  const brandB = searchParams.brandB?.trim() ?? "";

  if (!brandA || !brandB) notFound();

  return (
    <div className="mesh-bg min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <ComparisonClient brandA={brandA} brandB={brandB} />
      </div>
    </div>
  );
}
