import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { loadCreatorCache } from "@/lib/utils";
import type { CreatorSearchQuery } from "@/lib/types";

const DEMO_CREATORS_FILE = path.join(process.cwd(), "demo-data", "creators.json");

export async function POST(req: NextRequest) {
  const query: CreatorSearchQuery = await req.json();
  const count = Math.min(Math.max(Number(query.number_of_creators) || 3, 1), 15);
  const maxPrice = Number(query.budget_per_creator) || Number.POSITIVE_INFINITY;
  const requestedLocation = query.filters?.location?.toLowerCase();
  const requestedLanguage = query.filters?.language?.toLowerCase();

  let creators = loadCreatorCache(DEMO_CREATORS_FILE).filter((creator) => {
    const price = Number(creator.videoPrice);
    if (Number.isFinite(price) && price > maxPrice) return false;
    if (requestedLocation && requestedLocation !== "any") {
      const country = creator.country.toLowerCase();
      if (!country.includes(requestedLocation) && !(requestedLocation === "usa" && country === "us")) {
        return false;
      }
    }
    if (requestedLanguage && requestedLanguage !== "any") {
      const language = creator.language.toLowerCase();
      if (!language.includes(requestedLanguage) && !(requestedLanguage === "english" && language === "en")) {
        return false;
      }
    }
    return true;
  });

  if (creators.length < count) {
    creators = loadCreatorCache(DEMO_CREATORS_FILE);
  }

  return NextResponse.json({
    creators: creators.slice(0, count),
    source: "Static clearHub demo dataset (no AI call)",
  });
}
