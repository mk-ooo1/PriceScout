import crypto from "crypto";
import { prisma } from "./db";
import { buildAffiliateUrl } from "./build-affiliate-url";

const IP_SALT = process.env.CLICK_IP_SALT || "change-me-in-env";

/** Hash the IP so we can dedupe/rate-limit without storing raw PII. */
export function hashIp(ip: string): string {
  return crypto.createHash("sha256").update(IP_SALT + ip).digest("hex");
}

interface LogClickInput {
  offerId: string;
  ip: string;
  userAgent?: string | null;
  referrer?: string | null;
  sessionId?: string | null;
}

export async function logClickAndGetRedirect(input: LogClickInput) {
  const offer = await prisma.offer.findUnique({
    where: { id: input.offerId },
    include: { merchant: true, product: true },
  });

  if (!offer || !offer.merchant.isActive) return null;

  // 1. Log the click and get the unique click ID
  const clickEvent = await prisma.clickEvent.create({
    data: {
      offerId: offer.id,
      ipHash: hashIp(input.ip),
      userAgent: input.userAgent ?? undefined,
      referrer: input.referrer ?? undefined,
      sessionId: input.sessionId ?? undefined,
    },
  });

  // 2. We dynamically build the final redirect URL at click-time instead of ingestion-time.
  // This allows us to inject the specific `clickEvent.id` into the URL as the Sub-ID.
  // This Sub-ID will be tracked by the merchant and sent back to our /api/postback webhook when a sale occurs!
  const dynamicTrackingUrl = buildAffiliateUrl(offer.merchant, offer.deepLink, clickEvent.id);

  return dynamicTrackingUrl;
}
