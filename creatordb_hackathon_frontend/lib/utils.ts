import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import { Creator } from "./types";

export function loadBrandsByProductType(): Record<string, string[]> {
  const csvPath = path.join(process.cwd(), "demo-data", "brand_influencers.csv");

  try {
    const content = fs.readFileSync(csvPath, "utf-8");
    const records = parse(content, { columns: true, skip_empty_lines: true }) as Record<
      string,
      string
    >[];
    const brandsByType: Record<string, Set<string>> = {};

    for (const row of records) {
      const productType = row["product type"]?.trim();
      const brandDomain = row.brandDomain?.trim();
      if (!productType || !brandDomain) continue;

      const domainName = brandDomain.split(".")[0];
      const brandName = domainName.charAt(0).toUpperCase() + domainName.slice(1);
      if (!brandsByType[productType]) brandsByType[productType] = new Set();
      brandsByType[productType].add(brandName);
    }

    return Object.fromEntries(
      Object.entries(brandsByType).map(([type, brands]) => [
        type,
        Array.from(brands).sort(),
      ])
    );
  } catch {
    return {};
  }
}

export function loadCreatorCache(filePath: string): Creator[] {
  try {
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8")) as Record<
      string,
      unknown
    >[];
    return data.map((item) => {
      const demographics = (item.demographics as Record<string, unknown>) ?? {};
      const countries = demographics.top_countries;
      return {
        name: String(item.channel_name ?? "Unknown"),
        platform: "YouTube",
        channelId: String(item.channel_id ?? "N/A"),
        videoPrice: String(item.sponsorship_price ?? "N/A"),
        avatarUrl: String(item.avatar ?? ""),
        totalSubscribers: String(item.subscribers ?? "N/A"),
        country: String(item.country ?? "N/A"),
        language: String(item.language ?? "N/A"),
        ageRange: String(demographics["main age range"] ?? "N/A"),
        topCountries: Array.isArray(countries) ? countries.join(", ") : "N/A",
        mainAgeRange: String(demographics["main age range"] ?? "N/A"),
      };
    });
  } catch {
    return [];
  }
}

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
    if (clipped.slice(0, 5).toLowerCase() === "<htlm") {
      clipped = `<html${clipped.slice(5)}`;
    }
    return clipped;
  }

  return input;
}
