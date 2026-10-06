import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import ProductCard from "@/components/ProductCard";
import { ChevronRight, Home } from "lucide-react";

export const revalidate = 3600;

async function getCategory(slug: string) {
  return prisma.category.findUnique({
    where: { slug },
    include: {
      products: {
        where: { isPublished: true },
        include: {
          images: { take: 1, orderBy: { position: "asc" } },
          offers: { orderBy: { price: "asc" } },
        },
        orderBy: { updatedAt: "desc" },
      },
    },
  });
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const category = await getCategory(params.slug);
  if (!category) return {};
  return {
    title: `${category.name} — Compare Prices`,
    description:
      category.description ??
      `Compare ${category.name} prices across top Indian stores.`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const category = await getCategory(params.slug);
  if (!category) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "/" },
      { "@type": "ListItem", position: 2, name: category.name },
    ],
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-gray-500 mb-6 space-x-2">
        <Link href="/" className="hover:text-blue-600 flex items-center">
          <Home className="w-4 h-4 mr-1" />
          Home
        </Link>
        <ChevronRight className="w-4 h-4 text-gray-400" />
        <span className="text-gray-900 font-medium">{category.name}</span>
      </nav>

      {/* Category Header */}
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100 mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{category.name}</h1>
        {category.description ? (
          <p className="text-gray-600 mt-2 max-w-3xl">{category.description}</p>
        ) : (
          <p className="text-gray-600 mt-2">Compare prices and find the best deals for {category.name}.</p>
        )}
        <div className="mt-4 inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
          {category.products.length} Products available
        </div>
      </div>

      {/* Products Grid */}
      {category.products.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-xl border border-gray-100 shadow-sm">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📦</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900">No products found</h3>
          <p className="text-gray-500 mt-1">Check back later for new additions to this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {category.products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </main>
  );
}
