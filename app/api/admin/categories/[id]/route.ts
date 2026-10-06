import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/admin/auth";

const patchSchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  description: z.string().optional(),
  parentId: z.string().optional().nullable(),
});

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const category = await prisma.category.findUnique({
    where: { id: params.id },
  });
  if (!category) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ category });
}

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

  // Prevent self-referencing parentId
  if (parsed.data.parentId === params.id) {
    return NextResponse.json({ error: "A category cannot be its own parent" }, { status: 400 });
  }

  // If changing slug, verify uniqueness
  if (parsed.data.slug) {
    const existing = await prisma.category.findUnique({
      where: { slug: parsed.data.slug },
    });
    if (existing && existing.id !== params.id) {
      return NextResponse.json(
        { error: "A category with this slug already exists" },
        { status: 400 }
      );
    }
  }

  const category = await prisma.category.update({
    where: { id: params.id },
    data: {
      name: parsed.data.name,
      slug: parsed.data.slug,
      description: parsed.data.description,
      parentId: parsed.data.parentId,
    },
  });

  return NextResponse.json({ category });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Prevent deletion if it has products or subcategories
  const categoryDetails = await prisma.category.findUnique({
    where: { id: params.id },
    include: {
      _count: {
        select: { products: true, children: true },
      },
    },
  });

  if (!categoryDetails) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  if (categoryDetails._count.products > 0 || categoryDetails._count.children > 0) {
    return NextResponse.json(
      { error: "Cannot delete category because it contains products or sub-categories. Reassign them first." },
      { status: 400 }
    );
  }

  await prisma.category.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
