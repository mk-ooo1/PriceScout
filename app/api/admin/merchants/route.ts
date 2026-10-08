import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

const merchantSchema = z.object({
  name: z.string().min(2),
  network: z.string().optional(),
  affiliateTagId: z.string().optional(),
  baseUrl: z.string().url().optional(),
  logoUrl: z.string().url().optional(),
  isActive: z.boolean().optional(),
});

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = merchantSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const merchant = await prisma.merchant.create({
    data: { ...parsed.data, slug: slugify(parsed.data.name) },
  });

  return NextResponse.json({ merchant }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing merchant id" }, { status: 400 });

  const body = await req.json();
  const parsed = merchantSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data: any = { ...parsed.data };
  if (parsed.data.name) {
    data.slug = slugify(parsed.data.name);
  }

  const merchant = await prisma.merchant.update({
    where: { id },
    data,
  });

  return NextResponse.json({ merchant });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing merchant id" }, { status: 400 });

  await prisma.merchant.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
