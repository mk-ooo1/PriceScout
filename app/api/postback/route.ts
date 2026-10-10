import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * Server-to-Server (S2S) Postback Webhook Receiver
 *
 * Affiliate networks (EarnKaro, Cuelinks, Admitad, Flipkart) will hit this URL silently
 * when a user completes a purchase.
 *
 * Example Webhook URL to give to your affiliate network:
 * https://yourdomain.com/api/postback?subid={subid}&order_id={order_id}&status={status}&commission={commission}&sale_amount={sale_amount}&network={network}
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // 1. Extract parameters
    // We check multiple common parameter names since different networks use different keys
    const clickId = searchParams.get("subid") || searchParams.get("click_id") || searchParams.get("affExtParam1");
    const orderId = searchParams.get("order_id") || searchParams.get("transaction_id") || searchParams.get("oid");
    const status = searchParams.get("status") || searchParams.get("state") || "pending";
    const rawCommission = searchParams.get("commission") || searchParams.get("payout");
    const rawSaleAmount = searchParams.get("sale_amount") || searchParams.get("amount");
    const network = searchParams.get("network") || "unknown";

    // 2. Validate
    if (!clickId) {
      return NextResponse.json({ error: "Missing click tracking ID (subid)" }, { status: 400 });
    }

    const commission = rawCommission ? parseFloat(rawCommission) : 0;
    const saleAmount = rawSaleAmount ? parseFloat(rawSaleAmount) : null;

    // 3. Verify the click exists in our database
    const clickEvent = await prisma.clickEvent.findUnique({
      where: { id: clickId },
    });

    if (!clickEvent) {
      return NextResponse.json({ error: "Click ID not found in our system" }, { status: 404 });
    }

    // 4. Record or Update the Conversion!
    // Using upsert so if a network sends "pending" today, and "approved" next week, we just update the same record.
    await prisma.conversion.upsert({
      where: { clickId: clickId },
      update: {
        status: status.toLowerCase(),
        commission,
        saleAmount: saleAmount ?? undefined,
        orderId: orderId ?? undefined,
      },
      create: {
        clickId: clickId,
        orderId: orderId ?? undefined,
        status: status.toLowerCase(),
        commission,
        saleAmount: saleAmount ?? undefined,
        network: network,
      }
    });

    return NextResponse.json({ success: true, message: "Postback recorded successfully" });

  } catch (error) {
    console.error("S2S Postback Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Some networks might send POST requests instead of GET
export async function POST(req: NextRequest) {
  // If the network sends a POST with a JSON body instead of URL params
  try {
    const body = await req.json().catch(() => ({}));

    const clickId = body.subid || body.click_id || body.affExtParam1;
    const orderId = body.order_id || body.transaction_id;
    const status = body.status || body.state || "pending";
    const commission = body.commission || body.payout ? parseFloat(body.commission || body.payout) : 0;
    const saleAmount = body.sale_amount || body.amount ? parseFloat(body.sale_amount || body.amount) : null;
    const network = body.network || "unknown";

    if (!clickId) {
      return NextResponse.json({ error: "Missing click tracking ID" }, { status: 400 });
    }

    const clickEvent = await prisma.clickEvent.findUnique({ where: { id: clickId } });
    if (!clickEvent) return NextResponse.json({ error: "Click not found" }, { status: 404 });

    await prisma.conversion.upsert({
      where: { clickId: clickId },
      update: { status: status.toLowerCase(), commission, saleAmount: saleAmount ?? undefined, orderId: orderId ?? undefined },
      create: { clickId, orderId: orderId ?? undefined, status: status.toLowerCase(), commission, saleAmount: saleAmount ?? undefined, network }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
