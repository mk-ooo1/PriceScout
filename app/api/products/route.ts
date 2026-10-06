import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const categorySlug = req.nextUrl.searchParams.get("category");
  const q = req.nextUrl.searchParams.get("q");

  const products = await prisma.product.findMany({
    where: {
      isPublished: true,
      ...(categorySlug ? { category: { slug: categorySlug } } : {}),
      ...(q ? { title: { contains: q, mode: "insensitive" } } : {}),
    },
    include: {
      images: { take: 1, orderBy: { position: "asc" } },
      offers: {
        include: { merchant: true },
        orderBy: { price: "asc" },
      },
      category: true,
    },
    take: 50,
  });

  return NextResponse.json({ products });
}
