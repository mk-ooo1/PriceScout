import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/admin/auth";
import { buildAffiliateUrl } from "@/lib/build-affiliate-url";

const patchSchema = z.object({
  price: z.number().positive().optional(),
  mrp: z.number().positive().optional(),
  inStock: z.boolean().optional(),
  couponCode: z.string().optional(),
  couponDesc: z.string().optional(),
  deepLink: z.string().url().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const updateData: any = { ...parsed.data, lastCheckedAt: new Date() };

  // If deepLink is being updated, we need to recalculate the affiliateUrl
  if (parsed.data.deepLink) {
    const existingOffer = await prisma.offer.findUnique({
      where: { id: params.id },
      include: { merchant: true },
    });
    if (existingOffer) {
      updateData.affiliateUrl = buildAffiliateUrl(
        existingOffer.merchant,
        parsed.data.deepLink
      );
    }
  }

  const offer = await prisma.offer.update({
    where: { id: params.id },
    data: updateData,
  });

  if (parsed.data.price !== undefined) {
    await prisma.priceHistory.create({
      data: { offerId: offer.id, price: parsed.data.price },
    });
  }

  return NextResponse.json({ offer });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.offer.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
