import Link from "next/link";
import { prisma } from "@/lib/db";
import DeleteCategoryButton from "./DeleteCategoryButton";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      parent: { select: { name: true } },
      _count: { select: { products: true, children: true } },
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Categories</h1>
        <Link
          href="/admin/categories/new"
          className="bg-black text-white rounded-md px-4 py-2 text-sm hover:opacity-90"
        >
          + New category
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Slug</th>
              <th className="p-3">Parent Category</th>
              <th className="p-3">Products</th>
              <th className="p-3">Sub-categories</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="p-3 font-medium">{c.name}</td>
                <td className="p-3 text-gray-500">{c.slug}</td>
                <td className="p-3">{c.parent?.name ?? "—"}</td>
                <td className="p-3">{c._count.products}</td>
                <td className="p-3">{c._count.children}</td>
                <td className="p-3 text-right space-x-3">
                  <Link href={`/admin/categories/${c.id}`} className="text-blue-600 hover:underline">
                    Edit
                  </Link>
                  <DeleteCategoryButton
                    id={c.id}
                    disabled={c._count.products > 0 || c._count.children > 0}
                  />
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-400">
                  No categories yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
