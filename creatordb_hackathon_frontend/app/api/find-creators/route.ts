import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs";
import path from "path";
import {
  getCacheFilePath,
  sanitizeClaudeOutput,
  parseCreatorRows,
  loadCreatorCache,
} from "@/lib/utils";
import type { CreatorSearchQuery } from "@/lib/types";

const execAsync = promisify(exec);

const PROJECT_ROOT =
  process.env.PROJECT_ROOT ?? path.resolve(process.cwd(), "../..");

export async function POST(req: NextRequest) {
  const query: CreatorSearchQuery = await req.json();
  const { product_type, budget, budget_per_creator, filters, number_of_creators } = query;

  const cacheFile = getCacheFilePath(product_type, budget.label);

  // Return from cache
  if (fs.existsSync(cacheFile)) {
    let creators = loadCreatorCache(cacheFile);
    if (!creators.length) {
      const text = fs.readFileSync(cacheFile, "utf-8");
      creators = parseCreatorRows(text);
    }
    return NextResponse.json({
      creators,
      source: `cache: ${path.basename(cacheFile)}`,
    });
  }

  // Build filter text
  const active = Object.entries(filters)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}=${v}`)
    .join(", ");
  const filterText = active || "none";

  const prompt = `
You are helping with creator discovery.
Find ${number_of_creators} YouTube creators for product type "${product_type}".
Use approximately $${budget_per_creator.toLocaleString(undefined, { maximumFractionDigits: 0 })} budget per creator.
Audience filters: ${filterText}.

Return ONLY rows in this exact format, one creator per line:
name | platform | channelId | videoPrice | avatarUrl | totalSubscribers | country | language | ageRange | top_countries | mainAgeRange
`.trim();

  try {
    const { stdout, stderr } = await execAsync(
      `claude --dangerously-skip-permissions ${JSON.stringify(prompt)}`,
      { cwd: PROJECT_ROOT, timeout: 120_000 }
    );

    if (stderr && !stdout.trim()) {
      return NextResponse.json({ error: stderr }, { status: 500 });
    }

    const clean = sanitizeClaudeOutput(stdout);
    // Cache the raw output
    fs.writeFileSync(cacheFile, clean, "utf-8");

    const creators = parseCreatorRows(clean);
    return NextResponse.json({
      creators,
      source: `new search cached: ${path.basename(cacheFile)}`,
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
