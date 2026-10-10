import type { Merchant } from "@prisma/client";

/**
 * Appends this merchant's affiliate tag/publisher id to a raw product URL.
 * The exact query param differs per network — extend the switch as you
 * onboard real merchants/aggregators (Amazon uses `tag`, Flipkart affiliate
 * links use `affid`/`affExtParam1` depending on the program, aggregator
 * networks like EarnKaro/Cuelinks usually wrap the whole URL instead).
 */
export function buildAffiliateUrl(merchant: Merchant, deepLink: string, clickId?: string): string {
  // If no tag is configured and no clickId is requested, return the raw link
  if (!merchant.affiliateTagId && !clickId) return deepLink;

  try {
    const url = new URL(deepLink);

    // Determine the network type to inject the correct parameters
    const network = merchant.network?.toLowerCase() || "";

    switch (network) {
      case "amazon":
        if (merchant.affiliateTagId) url.searchParams.set("tag", merchant.affiliateTagId);
        // Note: Amazon Associates standard accounts don't officially support dynamic sub-id tracking via S2S postbacks.
        // Some users inject it into the tag itself if they have multiple tracking IDs, but standard sub-id is not supported.
        break;
      case "flipkart":
        if (merchant.affiliateTagId) url.searchParams.set("affid", merchant.affiliateTagId);
        if (clickId) url.searchParams.set("affExtParam1", clickId);
        break;
      case "earnkaro":
      case "cuelinks":
      case "admitad":
        // Most aggregator networks use `subid` or `sub_id`
        if (merchant.affiliateTagId) url.searchParams.set("ref", merchant.affiliateTagId);
        if (clickId) url.searchParams.set("subid", clickId);
        break;
      default:
        // Generic fallback for unknown networks
        if (merchant.affiliateTagId) url.searchParams.set("ref", merchant.affiliateTagId);
        if (clickId) url.searchParams.set("subid", clickId);
    }

    return url.toString();
  } catch {
    // deepLink wasn't a valid absolute URL
    return deepLink;
  }
}
