import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/admin/auth";

const imageSchema = z.object({
  url: z.string().url(),
  altText: z.string().optional(),
});

export const dynamic = "force-dynamic";

// Create a new image for a product
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = imageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  // Get current max position to append to the end
  const currentImages = await prisma.productImage.findMany({
    where: { productId: params.id },
    orderBy: { position: "desc" },
    take: 1,
  });

  const nextPosition = currentImages.length > 0 ? currentImages[0].position + 1 : 0;

  const image = await prisma.productImage.create({
    data: {
      productId: params.id,
      url: parsed.data.url,
      altText: parsed.data.altText,
      position: nextPosition,
    },
  });

  return NextResponse.json({ image }, { status: 201 });
}
