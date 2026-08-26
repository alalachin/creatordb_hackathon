import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { clampToHtmlDocument, stripHtmlCodeFences } from "@/lib/utils";

const REPORTS_DIR = path.join(process.cwd(), "public", "demo-reports");

function comparisonKey(brandA: string, brandB: string) {
  return [brandA, brandB]
    .map((brand) => brand.trim().toLowerCase())
    .sort()
    .join("::");
}

function availableReports() {
  const reports = new Map<string, string>();

  for (const filename of fs.readdirSync(REPORTS_DIR)) {
    if (!filename.endsWith(".html")) continue;
    const [brandA, brandB] = filename.slice(0, -5).split("_");
    if (brandA && brandB) reports.set(comparisonKey(brandA, brandB), filename);
  }

  return reports;
}

export async function POST(req: NextRequest) {
  const { brandA, brandB } = await req.json();

  if (typeof brandA !== "string" || typeof brandB !== "string") {
    return NextResponse.json({ error: "brandA and brandB are required" }, { status: 400 });
  }

  const reports = availableReports();
  const filename = reports.get(comparisonKey(brandA, brandB));

  if (!filename) {
    const available = Array.from(reports.values()).map((name) =>
      name.slice(0, -5).replace("_", " vs ")
    );
    return NextResponse.json(
      {
        error: `This static demo does not include a ${brandA} vs ${brandB} report. Available comparisons: ${available.join(", ")}.`,
      },
      { status: 404 }
    );
  }

  const content = fs.readFileSync(path.join(REPORTS_DIR, filename), "utf-8");
  const html = clampToHtmlDocument(stripHtmlCodeFences(content));
  return NextResponse.json({ html, cached: true, source: "demo" });
}
