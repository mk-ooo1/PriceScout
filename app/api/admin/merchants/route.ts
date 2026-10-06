import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/admin/auth";

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

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const merchants = await prisma.merchant.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json({ merchants });
}

export const dynamic = "force-dynamic";

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
