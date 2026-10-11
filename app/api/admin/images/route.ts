import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/admin/auth";
import { UTApi } from "uploadthing/server";

export const dynamic = "force-dynamic";
const utapi = new UTApi();

const imageSchema = z.object({
  productId: z.string().min(1),
  url: z.string().url(),
  altText: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = imageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  // Get current max position to append to the end
  const currentImages = await prisma.productImage.findMany({
    where: { productId: parsed.data.productId },
    orderBy: { position: "desc" },
    take: 1,
  });

  const nextPosition = currentImages.length > 0 ? currentImages[0].position + 1 : 0;

  const image = await prisma.productImage.create({
    data: {
      productId: parsed.data.productId,
      url: parsed.data.url,
      altText: parsed.data.altText,
      position: nextPosition,
    },
  });

  return NextResponse.json({ image }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing image id" }, { status: 400 });

  const image = await prisma.productImage.findUnique({
    where: { id },
  });

  if (!image) {
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }

  // Delete from Uploadthing servers too
  try {
     const urlObj = new URL(image.url);
     const fileKey = urlObj.pathname.split('/').pop();
     if (fileKey) {
        await utapi.deleteFiles(fileKey);
     }
  } catch (error) {
     console.error("Failed to delete file from Uploadthing:", error);
  }

  await prisma.productImage.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
