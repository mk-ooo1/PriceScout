import { prisma } from "@/lib/db";
import CategoryForm from "../CategoryForm";

export const dynamic = "force-dynamic";

export default async function NewCategoryPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="max-w-xl">
      <h1 className="text-xl font-semibold mb-6">New Category</h1>
      <CategoryForm categories={categories.map((c) => ({ id: c.id, name: c.name }))} />
    </div>
  );
}
