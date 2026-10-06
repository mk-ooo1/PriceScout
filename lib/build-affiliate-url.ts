import type { Merchant } from "@prisma/client";

/**
 * Appends this merchant's affiliate tag/publisher id to a raw product URL.
 * The exact query param differs per network — extend the switch as you
 * onboard real merchants/aggregators (Amazon uses `tag`, Flipkart affiliate
 * links use `affid`/`affExtParam1` depending on the program, aggregator
 * networks like EarnKaro/Cuelinks usually wrap the whole URL instead).
 */
export function buildAffiliateUrl(merchant: Merchant, deepLink: string): string {
  if (!merchant.affiliateTagId) return deepLink;

  try {
    const url = new URL(deepLink);
    switch (merchant.network) {
      case "amazon":
        url.searchParams.set("tag", merchant.affiliateTagId);
        break;
      case "flipkart":
        url.searchParams.set("affid", merchant.affiliateTagId);
        break;
      default:
        // Generic fallback param; replace once you know the real network's format.
        url.searchParams.set("ref", merchant.affiliateTagId);
    }
    return url.toString();
  } catch {
    // deepLink wasn't a valid absolute URL — store as-is, fix at ingestion.
    return deepLink;
  }
}
