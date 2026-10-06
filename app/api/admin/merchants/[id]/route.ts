import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/admin/auth";

const patchSchema = z.object({
  name: z.string().min(2).optional(),
  network: z.string().optional(),
  affiliateTagId: z.string().optional(),
  baseUrl: z.string().url().optional(),
  logoUrl: z.string().url().optional(),
  isActive: z.boolean().optional(),
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

  const merchant = await prisma.merchant.update({
    where: { id: params.id },
    data: parsed.data,
  });
  return NextResponse.json({ merchant });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string })?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Deleting a merchant cascades to its offers via schema relations only if
  // you add onDelete: Cascade on Offer.merchant — left as a manual guard
  // here since silently wiping offers on merchant delete is risky.
  const offerCount = await prisma.offer.count({ where: { merchantId: params.id } });
  if (offerCount > 0) {
    return NextResponse.json(
      { error: `Cannot delete: ${offerCount} offer(s) still reference this merchant.` },
      { status: 409 }
    );
  }

  await prisma.merchant.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
