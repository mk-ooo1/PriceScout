import crypto from "crypto";
import { prisma } from "./db";

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

  await prisma.clickEvent.create({
    data: {
      offerId: offer.id,
      ipHash: hashIp(input.ip),
      userAgent: input.userAgent ?? undefined,
      referrer: input.referrer ?? undefined,
      sessionId: input.sessionId ?? undefined,
    },
  });

  // affiliateUrl is the pre-built, tagged URL (built at ingestion time with
  // this merchant's affiliate id) — never expose the raw deepLink or your
  // affiliate tag directly in client-rendered HTML/JS.
  return offer.affiliateUrl;
}
