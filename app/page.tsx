import Link from "next/link";
import { prisma } from "@/lib/db";
import ProductCard from "@/components/ProductCard";
import { ChevronRight } from "lucide-react";

export const revalidate = 1800;

export default async function HomePage() {
  const [categories, products] = await Promise.all([
    prisma.category.findMany({ where: { parentId: null }, orderBy: { name: "asc" } }),
    prisma.product.findMany({
      where: { isPublished: true },
      include: {
        images: { take: 1, orderBy: { position: "asc" } },
        offers: { orderBy: { price: "asc" } }, // Changed from take: 1 to get full count for the card
      },
      orderBy: { updatedAt: "desc" },
      take: 12,
    }),
  ]);

  return (
    <main>
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Find the Best Deals Across India</h1>
          <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto">
            We track and compare prices across Amazon, Flipkart, Myntra, and more so you don&apos;t have to.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Categories Section */}
        {categories.length > 0 && (
          <section className="mb-12 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">Shop by Category</h2>
            </div>
            <div className="flex overflow-x-auto pb-4 hide-scrollbar gap-4">
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/category/${c.slug}`}
                  className="flex-shrink-0 flex flex-col items-center p-4 min-w-[120px] rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-colors group"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-200 transition-colors">
                    <span className="text-blue-600 font-bold">{c.name.charAt(0)}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-700 text-center">{c.name}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Products Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Trending Right Now</h2>
          </div>

          {products.length === 0 ? (
            <div className="bg-white p-8 text-center rounded-xl border border-gray-100">
              <p className="text-gray-500">No published products yet — add some from the admin panel.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
