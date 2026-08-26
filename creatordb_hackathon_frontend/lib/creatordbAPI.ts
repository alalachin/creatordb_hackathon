/**
 * CreatorDB API client — TypeScript port of src/cretordbAPI.py
 */

import { CreatorDBSearchPayload, CreatorDBCreator } from "./types";

const BASE_URL = "https://apiv3.creatordb.app";

function getHeaders(): HeadersInit {
  return {
    Accept: "application/json",
    "api-key": process.env.CREATORDB_API_KEY ?? "",
  };
}

// ─── Account info ────────────────────────────────────────────────────────────

export async function getAccountInfo(
  endpoint: string,
  accountId: string
): Promise<unknown> {
  const clean = endpoint.replace(/^\//, "");
  const url = new URL(`${BASE_URL}/${clean}`);

  if (clean.startsWith("youtube")) {
    url.searchParams.set("channelId", accountId);
  } else {
    url.searchParams.set("uniqueId", accountId);
  }

  const res = await fetch(url.toString(), { headers: getHeaders() });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API Error ${res.status}: ${text}`);
  }
  return res.json();
}

// ─── Popular accounts ────────────────────────────────────────────────────────

export async function getPopularAccounts(
  platform: string,
  limit: number
): Promise<CreatorDBCreator[]> {
  const url = `${BASE_URL}/${platform}/search`;
  const PAGE_SIZE = 100;
  let offset = 0;
  const all: CreatorDBCreator[] = [];

  while (all.length < limit) {
    const payload: CreatorDBSearchPayload = {
      filters: [{ filterName: "totalSubscribers", op: ">", value: 1_000_000 }],
      desc: true,
      sortBy: "totalSubscribers",
      pageSize: Math.min(PAGE_SIZE, limit - all.length),
      offset,
    };

    const res = await fetch(url, {
      method: "POST",
      headers: { ...getHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error(`API Error ${res.status}: ${await res.text()}`);

    const data = await res.json();
    const batch: CreatorDBCreator[] = data?.data?.creatorList ?? [];
    if (!batch.length) break;

    all.push(...batch);
    offset += batch.length;
    if (batch.length < PAGE_SIZE) break;

    await new Promise((r) => setTimeout(r, 100));
  }

  return all;
}

// ─── Video price ─────────────────────────────────────────────────────────────

export async function getVideoPrice(channelId: string): Promise<number> {
  const url = new URL(`${BASE_URL}/youtube/profile`);
  url.searchParams.set("channelId", channelId);

  const res = await fetch(url.toString(), { headers: getHeaders() });
  if (!res.ok) throw new Error(`API Error ${res.status}: ${await res.text()}`);

  const json = await res.json();
  const price = json?.data?.videoPrice?.priceRaw;
  if (price === undefined) throw new Error("priceRaw not found in response");
  return price;
}

// ─── Natural Language Search ──────────────────────────────────────────────────

function parseSseResponse(text: string): unknown {
  const lines = text.split("\n");
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith("event: result") && lines[i + 1]?.startsWith("data:")) {
      return JSON.parse(lines[i + 1].replace("data: ", ""));
    }
  }
  throw new Error("No result event found in SSE response");
}

export async function searchCreatorsNL(
  query: string
): Promise<Array<[string, string]>> {
  const url = `${BASE_URL}/nls`;
  const res = await fetch(url, {
    method: "POST",
    headers: { ...getHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ description: query }),
  });

  if (!res.ok) throw new Error(`API Error ${res.status}: ${await res.text()}`);

  const data = parseSseResponse(await res.text()) as {
    data: { creatorList: CreatorDBCreator[] };
  };

  return data.data.creatorList
    .filter((c) => c.channelId.startsWith("UC"))
    .map((c) => [c.channelId, c.displayName]);
}

// ─── Filter builder ───────────────────────────────────────────────────────────

export function makeFilter(opts: {
  displayName?: string;
  minSubscribers?: number;
  minAvgViews?: number;
  category?: string;
}): CreatorDBSearchPayload {
  const filters: CreatorDBSearchPayload["filters"] = [];

  if (opts.displayName) {
    filters.push({
      filterName: "displayName",
      op: "=",
      value: opts.displayName,
      isFuzzySearch: true,
    });
  }
  if (opts.minSubscribers) {
    filters.push({ filterName: "totalSubscribers", op: ">", value: opts.minSubscribers });
  }
  if (opts.minAvgViews) {
    filters.push({ filterName: "avgVideosViewsAll", op: ">", value: opts.minAvgViews });
  }
  if (opts.category) {
    filters.push({ filterName: "mainCategory", op: "=", value: opts.category });
  }

  return { filters, pageSize: 10, offset: 0, desc: true, sortBy: "totalSubscribers" };
}
