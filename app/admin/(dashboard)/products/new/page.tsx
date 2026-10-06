import { prisma } from "@/lib/db";
import NewProductForm from "./NewProductForm";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  return (
    <div className="max-w-xl">
      <h1 className="text-xl font-semibold mb-6">New product</h1>
      <NewProductForm categories={categories.map((c) => ({ id: c.id, name: c.name }))} />
    </div>
  );
}
