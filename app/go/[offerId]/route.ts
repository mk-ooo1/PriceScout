import { NextRequest, NextResponse } from "next/server";
import { logClickAndGetRedirect } from "@/lib/affiliate";

export const dynamic = "force-dynamic";

// Basic in-memory token bucket per IP hash for click-fraud mitigation.
// Swap for Redis (Upstash) once deployed on more than one instance.
const RATE_LIMIT_WINDOW_MS = 10_000;
const RATE_LIMIT_MAX = 5;
const hits = new Map<string, number[]>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const arr = (hits.get(key) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  arr.push(now);
  hits.set(key, arr);
  return arr.length > RATE_LIMIT_MAX;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { offerId: string } }
) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "0.0.0.0";

  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const redirectUrl = await logClickAndGetRedirect({
    offerId: params.offerId,
    ip,
    userAgent: req.headers.get("user-agent"),
    referrer: req.headers.get("referer"),
    sessionId: req.cookies.get("sid")?.value,
  });

  if (!redirectUrl) {
    return NextResponse.redirect(new URL("/offer-unavailable", req.url));
  }

  return NextResponse.redirect(redirectUrl, { status: 302 });
}
