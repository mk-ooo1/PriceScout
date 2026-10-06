import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic"; // always fresh for admin

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { updatedAt: "desc" },
    include: { category: true, offers: true },
    take: 100,
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Products</h1>
        <Link
          href="/admin/products/new"
          className="bg-black text-white rounded-md px-4 py-2 text-sm hover:opacity-90"
        >
          + New product
        </Link>
      </div>

      <table className="w-full text-sm border rounded-lg overflow-hidden">
        <thead className="bg-gray-50 text-left">
          <tr>
            <th className="p-3">Title</th>
            <th className="p-3">Category</th>
            <th className="p-3">Offers</th>
            <th className="p-3">Published</th>
            <th className="p-3" />
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="p-3">{p.title}</td>
              <td className="p-3">{p.category?.name ?? "—"}</td>
              <td className="p-3">{p.offers.length}</td>
              <td className="p-3">
                {p.isPublished ? (
                  <span className="text-green-600">Live</span>
                ) : (
                  <span className="text-gray-400">Draft</span>
                )}
              </td>
              <td className="p-3">
                <Link href={`/admin/products/${p.id}`} className="underline">
                  Edit
                </Link>
              </td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr>
              <td colSpan={5} className="p-6 text-center text-gray-400">
                No products yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
