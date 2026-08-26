/**
 * Utility functions — TypeScript port of src/utils.py
 */

import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import { BrandDemographics, Creator } from "./types";

const PROJECT_ROOT =
  process.env.PROJECT_ROOT ?? path.resolve(__dirname, "../../..");

// ─── CSV helpers ─────────────────────────────────────────────────────────────

function getCsvPath(): string {
  return path.join(PROJECT_ROOT, "resource/external/brand_influencers.csv");
}

export function loadBrandsByProductType(): Record<string, string[]> {
  const csvPath = getCsvPath();
  try {
    const content = fs.readFileSync(csvPath, "utf-8");
    const records = parse(content, { columns: true, skip_empty_lines: true }) as Record<
      string,
      string
    >[];

    const map: Record<string, Set<string>> = {};
    for (const row of records) {
      const productType = row["product type"]?.trim();
      const brandDomain = row["brandDomain"]?.trim();
      if (productType && brandDomain) {
        const brandName =
          brandDomain.split(".")[0].charAt(0).toUpperCase() +
          brandDomain.split(".")[0].slice(1);
        if (!map[productType]) map[productType] = new Set();
        map[productType].add(brandName);
      }
    }

    return Object.fromEntries(
      Object.entries(map).map(([k, v]) => [k, Array.from(v).sort()])
    );
  } catch {
    return {};
  }
}

export function getBrandDemographics(brandName: string): BrandDemographics {
  const csvPath = getCsvPath();
  const brandDomain = `${brandName.toLowerCase()}.com`;

  const influencers: Record<string, string>[] = [];
  const ages: number[] = [];
  const maleList: number[] = [];
  const femaleList: number[] = [];
  const countries: Record<string, number> = {};
  let totalFollowers = 0;

  try {
    const content = fs.readFileSync(csvPath, "utf-8");
    const records = parse(content, { columns: true, skip_empty_lines: true }) as Record<
      string,
      string
    >[];

    for (const row of records) {
      if (row["brandDomain"]?.trim() !== brandDomain) continue;
      influencers.push(row);

      const age = parseFloat(row["avgAge"] ?? "0") || 0;
      if (age > 0) ages.push(age);

      const male = parseFloat(row["genderManPercent"] ?? "0") || 0;
      const female = parseFloat(row["genderWomanPercent"] ?? "0") || 0;
      if (male > 0 || female > 0) {
        maleList.push(male);
        femaleList.push(female);
      }

      const country = row["maxCountry"]?.trim() ?? "";
      const countryPct = parseFloat(row["maxCountryPercent"] ?? "0") || 0;
      if (country && countryPct > 0) {
        countries[country] = (countries[country] ?? 0) + countryPct;
      }

      totalFollowers += parseFloat(row["followers"] ?? "0") || 0;
    }
  } catch {
    // return zeroed demographics on error
  }

  const avg = (arr: number[]) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0);

  const topCountries = Object.entries(countries)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([country, percent]) => ({ country, percent: Math.round(percent * 10) / 10 }));

  return {
    brand_name: brandName,
    influencer_count: influencers.length,
    total_followers: Math.round(totalFollowers),
    avg_age: Math.round(avg(ages) * 10) / 10,
    gender_male_percent: Math.round(avg(maleList) * 10) / 10,
    gender_female_percent: Math.round(avg(femaleList) * 10) / 10,
    top_countries: topCountries,
    influencers: influencers.slice(0, 10).map((row) => ({
      handle: row["instagramHandle"] ?? "",
      followers: Math.round(parseFloat(row["followers"] ?? "0") || 0),
      age: parseFloat(row["avgAge"] ?? "0") || 0,
      gender_male: parseFloat(row["genderManPercent"] ?? "0") || 0,
      gender_female: parseFloat(row["genderWomanPercent"] ?? "0") || 0,
      country: row["maxCountry"] ?? "",
    })),
  };
}

// ─── Output directory ─────────────────────────────────────────────────────────

export function getOutputDir(): string {
  const dir = path.join(PROJECT_ROOT, "output");
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

export function getCacheFilePath(productType: string, budgetLabel: string): string {
  const toSlug = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_|_$/g, "");
  return path.join(
    getOutputDir(),
    `recommended_creator_list_${toSlug(productType)}_${toSlug(budgetLabel)}.json`
  );
}

// ─── Creator parsing ──────────────────────────────────────────────────────────

export function sanitizeClaudeOutput(text: string): string {
  const cleaned = text.trim();
  if (!cleaned.startsWith("```")) return cleaned;
  const lines = cleaned.split("\n");
  if (lines.length >= 2 && lines[lines.length - 1].trim() === "```") {
    return lines.slice(1, -1).join("\n").trim();
  }
  return cleaned;
}

export function parseCreatorRows(text: string): Creator[] {
  const rows: Creator[] = [];
  for (const raw of text.split("\n")) {
    const line = raw.trim().replace(/^-\s*/, "");
    if (!line || !line.includes("|")) continue;
    const parts = line.split("|").map((p) => p.trim());
    if (parts.length < 4) continue;

    if (parts.length >= 11) {
      rows.push({
        name: parts[0],
        platform: parts[1],
        channelId: parts[2],
        videoPrice: parts[3],
        avatarUrl: parts[4],
        totalSubscribers: parts[5],
        country: parts[6],
        language: parts[7],
        ageRange: parts[8],
        topCountries: parts[9],
        mainAgeRange: parts[10],
      });
    } else {
      rows.push({
        name: parts[0],
        platform: parts[1],
        channelId: parts[2],
        videoPrice: "N/A",
        avatarUrl: "",
        totalSubscribers: "N/A",
        country: "N/A",
        language: "N/A",
        ageRange: "N/A",
        topCountries: "N/A",
        mainAgeRange: "N/A",
      });
    }
  }
  return rows;
}

export function loadCreatorCache(filePath: string): Creator[] {
  try {
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8")) as Record<
      string,
      unknown
    >[];
    return data.map((item) => {
      const demo = (item["demographics"] as Record<string, string>) ?? {};
      return {
        name: String(item["channel_name"] ?? "Unknown"),
        platform: "YouTube",
        channelId: String(item["channelId"] ?? "N/A"),
        videoPrice: String(item["sponsorship_price"] ?? "N/A"),
        avatarUrl: String(item["avatar"] ?? ""),
        totalSubscribers: String(item["subscribers"] ?? "N/A"),
        country: String(item["country"] ?? "N/A"),
        language: String(item["language"] ?? "N/A"),
        ageRange: String(demo["main age range"] ?? "N/A"),
        topCountries: String(demo["top_countries"] ?? "N/A"),
        mainAgeRange: String(demo["main age range"] ?? "N/A"),
      };
    });
  } catch {
    return [];
  }
}

// ─── HTML helpers ─────────────────────────────────────────────────────────────

export function stripHtmlCodeFences(content: string): string {
  const stripped = content.trim();
  if (!stripped.startsWith("```html")) return content;
  const lines = stripped.split("\n");
  if (lines.length >= 2 && lines[lines.length - 1].trim() === "```") {
    return lines.slice(1, -1).join("\n").trim();
  }
  return content;
}

export function clampToHtmlDocument(content: string): string {
  const input = content.trim();
  if (!input) return input;

  const lower = input.toLowerCase();
  const htmlStart = lower.indexOf("<html");
  const commonTypoStart = lower.indexOf("<htlm");
  const startIndex = htmlStart >= 0 ? htmlStart : commonTypoStart;
  const endIndex = lower.lastIndexOf("</html>");

  if (startIndex >= 0 && endIndex > startIndex) {
    let clipped = input.slice(startIndex, endIndex + "</html>".length).trim();
    // Correct common typo if model outputs "<htlm".
    if (clipped.slice(0, 5).toLowerCase() === "<htlm") {
      clipped = `<html${clipped.slice(5)}`;
    }
    return clipped;
  }

  return input;
}
