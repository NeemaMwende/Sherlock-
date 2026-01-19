import { NextRequest, NextResponse } from "next/server";
import LRU from "lru-cache";

const rateLimitCache = new LRU({
  max: 500,
  ttl: 60 * 1000, // time to live: 1 minute
});

export function rateLimit(req: NextRequest) {
  const ip = req.ip ?? "unknown";
  const count = rateLimitCache.get(ip) ?? 0;

  if (count >= 5)
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  rateLimitCache.set(ip, count + 1);
  return null;
}
