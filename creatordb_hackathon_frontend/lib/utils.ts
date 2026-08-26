import fs from "fs";
import { Creator } from "./types";

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
