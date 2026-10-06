import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/admin/auth";
import { buildAffiliateUrl } from "@/lib/build-affiliate-url";

const offerSchema = z.object({
  merchantId: z.string().min(1),
  price: z.number().positive(),
  mrp: z.number().positive().optional(),
  couponCode: z.string().optional(),
  couponDesc: z.string().optional(),
  inStock: z.boolean().optional(),
  deepLink: z.string().url(),
});

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = offerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const merchant = await prisma.merchant.findUnique({
    where: { id: parsed.data.merchantId },
  });
  if (!merchant) {
    return NextResponse.json({ error: "Unknown merchant" }, { status: 400 });
  }

  const affiliateUrl = buildAffiliateUrl(merchant, parsed.data.deepLink);

  const offer = await prisma.offer.upsert({
    where: {
      productId_merchantId: {
        productId: params.id,
        merchantId: parsed.data.merchantId,
      },
    },
    create: {
      productId: params.id,
      merchantId: parsed.data.merchantId,
      price: parsed.data.price,
      mrp: parsed.data.mrp,
      couponCode: parsed.data.couponCode,
      couponDesc: parsed.data.couponDesc,
      inStock: parsed.data.inStock ?? true,
      deepLink: parsed.data.deepLink,
      affiliateUrl,
    },
    update: {
      price: parsed.data.price,
      mrp: parsed.data.mrp,
      couponCode: parsed.data.couponCode,
      couponDesc: parsed.data.couponDesc,
      inStock: parsed.data.inStock ?? true,
      deepLink: parsed.data.deepLink,
      affiliateUrl,
      lastCheckedAt: new Date(),
    },
  });

  // Keep a price-history point every time price changes via admin edit too,
  // not just from automated feed syncs.
  await prisma.priceHistory.create({
    data: { offerId: offer.id, price: parsed.data.price },
  });

  return NextResponse.json({ offer }, { status: 201 });
}
