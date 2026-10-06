import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import CategoryForm from "../CategoryForm";

export const dynamic = "force-dynamic";

export default async function EditCategoryPage({
  params,
}: {
  params: { id: string };
}) {
  const [category, categories] = await Promise.all([
    prisma.category.findUnique({
      where: { id: params.id },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!category) notFound();

  return (
    <div className="max-w-xl">
      <h1 className="text-xl font-semibold mb-6">Edit Category</h1>
      <CategoryForm
        initialData={{
          id: category.id,
          name: category.name,
          slug: category.slug,
          description: category.description ?? "",
          parentId: category.parentId,
        }}
        categories={categories.map((c) => ({ id: c.id, name: c.name }))}
      />
    </div>
  );
}
