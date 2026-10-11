import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/admin/auth";
import { buildAffiliateUrl } from "@/lib/build-affiliate-url";

export const dynamic = "force-dynamic";

const offerSchema = z.object({
  productId: z.string().min(1),
  merchantId: z.string().min(1),
  price: z.number().positive(),
  mrp: z.number().positive().optional(),
  couponCode: z.string().optional(),
  couponDesc: z.string().optional(),
  inStock: z.boolean().optional(),
  deepLink: z.string().url(),
});

export async function POST(req: NextRequest) {
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
        productId: parsed.data.productId,
        merchantId: parsed.data.merchantId,
      },
    },
    create: {
      productId: parsed.data.productId,
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

  await prisma.priceHistory.create({
    data: { offerId: offer.id, price: parsed.data.price },
  });

  return NextResponse.json({ offer }, { status: 201 });
}

const patchSchema = z.object({
  price: z.number().positive().optional(),
  mrp: z.number().positive().optional(),
  inStock: z.boolean().optional(),
  couponCode: z.string().optional(),
  couponDesc: z.string().optional(),
  deepLink: z.string().url().optional(),
});

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing offer id" }, { status: 400 });

  const body = await req.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const updateData: any = { ...parsed.data, lastCheckedAt: new Date() };

  // If deepLink is being updated, we need to recalculate the affiliateUrl
  if (parsed.data.deepLink) {
    const existingOffer = await prisma.offer.findUnique({
      where: { id },
      include: { merchant: true },
    });
    if (existingOffer) {
      updateData.affiliateUrl = buildAffiliateUrl(existingOffer.merchant, parsed.data.deepLink);
    }
  }

  const offer = await prisma.offer.update({
    where: { id },
    data: updateData,
  });

  if (parsed.data.price !== undefined) {
    await prisma.priceHistory.create({
      data: { offerId: offer.id, price: parsed.data.price },
    });
  }

  return NextResponse.json({ offer });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing offer id" }, { status: 400 });

  await prisma.offer.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
