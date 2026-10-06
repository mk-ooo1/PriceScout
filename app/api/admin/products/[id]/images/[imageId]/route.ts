import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/admin/auth";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

// Delete a product image
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string, imageId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const image = await prisma.productImage.findUnique({
    where: { id: params.imageId },
  });

  if (!image || image.productId !== params.id) {
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }

  // Delete from Uploadthing servers too
  // Extract fileKey from url (usually the last part of the utfs.io URL)
  try {
     const urlObj = new URL(image.url);
     const fileKey = urlObj.pathname.split('/').pop();
     if (fileKey) {
        await utapi.deleteFiles(fileKey);
     }
  } catch (error) {
     console.error("Failed to delete file from Uploadthing:", error);
     // Proceed to delete from our DB anyway
  }

  await prisma.productImage.delete({
    where: { id: params.imageId },
  });

  return NextResponse.json({ ok: true });
}