import { NextRequest, NextResponse } from "next/server";
import fs from "fs";

const RISK_DATA_FILE =
  "/Users/cdb/Desktop/creatordb_hackathon/output/recommended_creator_list_sportswear_small_5k_25k.json";

type RiskRow = {
  channel_name: string;
  risk_level: string;
  risk_score: number;
  risk_keywords: string[];
  risk_finding: string;
};

function normalizeChannelName(name: string) {
  return name.trim().toLowerCase();
}

export async function POST(req: NextRequest) {
  const { channelNames } = await req.json();

  if (!Array.isArray(channelNames)) {
    return NextResponse.json({ error: "channelNames array is required" }, { status: 400 });
  }

  if (!fs.existsSync(RISK_DATA_FILE)) {
    return NextResponse.json({ error: `Risk file not found: ${RISK_DATA_FILE}` }, { status: 500 });
  }

  try {
    const raw = fs.readFileSync(RISK_DATA_FILE, "utf-8");
    const rows = JSON.parse(raw) as RiskRow[];

    const riskIndex = new Map<string, RiskRow>();
    for (const row of rows) {
      riskIndex.set(normalizeChannelName(row.channel_name), row);
    }

    const risks: Record<string, RiskRow> = {};
    for (const channelName of channelNames) {
      if (typeof channelName !== "string") continue;
      const risk = riskIndex.get(normalizeChannelName(channelName));
      if (risk) {
        risks[channelName] = risk;
      }
    }

    return NextResponse.json({ risks });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
