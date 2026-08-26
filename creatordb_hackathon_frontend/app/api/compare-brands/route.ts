import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs";
import path from "path";
import { getBrandDemographics, getOutputDir, stripHtmlCodeFences, clampToHtmlDocument } from "@/lib/utils";
import { BRAND_COMPARISON_PROMPT } from "@/lib/brandsData";

const execAsync = promisify(exec);

export async function POST(req: NextRequest) {
  const { brandA, brandB } = await req.json();

  if (!brandA || !brandB) {
    return NextResponse.json({ error: "brandA and brandB are required" }, { status: 400 });
  }

  // ── Cache check ──────────────────────────────────────────────────────────────
  const outputDir = getOutputDir();
  const reportPath = path.join(outputDir, `${brandA}_${brandB}.html`);

  if (fs.existsSync(reportPath)) {
    const existing = fs.readFileSync(reportPath, "utf-8");
    if (existing.trim()) {
      const preprocessed = clampToHtmlDocument(stripHtmlCodeFences(existing));
      if (preprocessed !== existing) {
        fs.writeFileSync(reportPath, preprocessed, "utf-8");
      }
      return NextResponse.json({ html: preprocessed, cached: true });
    }
    // File exists but is empty (failed previous run) — delete and regenerate
    fs.rmSync(reportPath, { force: true });
  }

  const prompt = BRAND_COMPARISON_PROMPT
    .replace(/{brand_a}/g, brandA)
    .replace(/{brand_b}/g, brandB)
    .concat("\n\nHTML Output: ");

  // ── Invoke Claude — same pattern as find-creators ────────────────────────────
  // Pass prompt via JSON.stringify (handles quoting), capture stdout in Node.js,
  // write HTML to file ourselves. Avoids shell redirect / $(cat) expansion bugs.
  let stdout: string;
  try {
    const result = await execAsync(
      `claude --dangerously-skip-permissions ${JSON.stringify(prompt)}`,
      { timeout: 600_000, maxBuffer: 10 * 1024 * 1024 /* 10 MB */ }
    );
    stdout = result.stdout;
    if (!stdout.trim() && result.stderr) {
      return NextResponse.json({ error: result.stderr }, { status: 500 });
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }

  const html = clampToHtmlDocument(stripHtmlCodeFences(stdout));
  if (!html.trim()) {
    return NextResponse.json({ error: "Claude returned empty output" }, { status: 500 });
  }

  // Cache to disk for future requests
  fs.writeFileSync(reportPath, html, "utf-8");

  return NextResponse.json({ html, cached: false });
}
