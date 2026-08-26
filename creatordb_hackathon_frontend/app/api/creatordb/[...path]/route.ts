/**
 * Transparent proxy to the CreatorDB API.
 * Forwards GET/POST requests to https://apiv3.creatordb.app/<path>
 * with the server-side API key injected.
 */

import { NextRequest, NextResponse } from "next/server";

const BASE_URL = "https://apiv3.creatordb.app";

function buildHeaders(): HeadersInit {
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    "api-key": process.env.CREATORDB_API_KEY ?? "",
  };
}

async function proxyRequest(
  req: NextRequest,
  { params }: { params: { path: string[] } }
): Promise<NextResponse> {
  const targetPath = params.path.join("/");
  const targetUrl = new URL(`${BASE_URL}/${targetPath}`);

  // Forward query params
  req.nextUrl.searchParams.forEach((value, key) => {
    targetUrl.searchParams.set(key, value);
  });

  const init: RequestInit = {
    method: req.method,
    headers: buildHeaders(),
  };

  if (req.method === "POST" || req.method === "PUT" || req.method === "PATCH") {
    init.body = await req.text();
  }

  const upstream = await fetch(targetUrl.toString(), init);
  const data = await upstream.text();

  return new NextResponse(data, {
    status: upstream.status,
    headers: { "Content-Type": upstream.headers.get("Content-Type") ?? "application/json" },
  });
}

export const GET = proxyRequest;
export const POST = proxyRequest;
