import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ChevronRight, Home, CheckCircle2, XCircle, ShoppingBag, ExternalLink } from "lucide-react";

export const revalidate = 3600;

async function getProduct(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { position: "asc" } },
      offers: { include: { merchant: true }, orderBy: { price: "asc" } },
      category: true,
    },
  });
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = await getProduct(params.slug);
  if (!product) return {};
  return {
    title: product.metaTitle ?? `${product.title} — Compare Prices`,
    description:
      product.metaDescription ??
      `Compare live prices for ${product.title} across ${product.offers.length} merchants.`,
  };
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProduct(params.slug);
  if (!product || !product.isPublished) notFound();

  const lowest = product.offers[0];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    brand: product.brand ?? undefined,
    image: product.images.map((i) => i.url),
    description: product.description ?? undefined,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "INR",
      lowPrice: lowest ? Number(lowest.price) : undefined,
      offerCount: product.offers.length,
      offers: product.offers.map((o) => ({
        "@type": "Offer",
        price: Number(o.price),
        priceCurrency: "INR",
        availability: o.inStock
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
        seller: { "@type": "Organization", name: o.merchant.name },
        url: `/go/${o.id}`,
      })),
    },
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      {/* JSON-LD structured data */}
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
        <Link href={`/category/${product.category.slug}`} className="hover:text-blue-600">
          {product.category.name}
        </Link>
        <ChevronRight className="w-4 h-4 text-gray-400" />
        <span className="text-gray-900 font-medium truncate max-w-[200px] sm:max-w-md">{product.title}</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Image Section */}
          <div className="p-8 flex items-center justify-center bg-white border-b md:border-b-0 md:border-r border-gray-100 min-h-[400px] relative">
            {product.images[0] ? (
              <div className="relative w-full aspect-square max-w-md">
                <Image
                  src={product.images[0].url}
                  alt={product.images[0].altText ?? product.title}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            ) : (
              <div className="w-full h-full min-h-[300px] bg-gray-50 flex items-center justify-center rounded-xl">
                <span className="text-gray-400">No Image Available</span>
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="p-6 md:p-10 flex flex-col">
            {product.brand && (
              <span className="text-blue-600 font-semibold tracking-wide uppercase text-sm mb-2">
                {product.brand}
              </span>
            )}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-4">
              {product.title}
            </h1>

            {product.description && (
              <p className="text-gray-600 mb-6 leading-relaxed">
                {product.description}
              </p>
            )}

            <div className="mt-auto pt-6 border-t border-gray-100">
              {lowest ? (
                <div>
                  <p className="text-sm text-gray-500 font-medium mb-1">Best Price Available</p>
                  <div className="flex items-end gap-3 mb-6">
                    <span className="text-4xl font-extrabold text-gray-900">
                      ₹{Number(lowest.price).toLocaleString("en-IN")}
                    </span>
                    {lowest.mrp && Number(lowest.mrp) > Number(lowest.price) && (
                      <span className="text-lg text-gray-400 line-through mb-1">
                        ₹{Number(lowest.mrp).toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>
                  <a
                    href={`/go/${lowest.id}`}
                    target="_blank"
                    rel="sponsored nofollow noopener"
                    className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white text-lg font-bold rounded-xl transition-all shadow-md hover:shadow-lg"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    Buy from {lowest.merchant.name}
                  </a>
                </div>
              ) : (
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <p className="text-gray-600 font-medium">Currently Out of Stock</p>
                  <p className="text-sm text-gray-500">Check back later for updated prices.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Section */}
      <section className="mt-12">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
          Compare Prices ({product.offers.length} stores)
        </h2>

        {product.offers.length > 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-sm uppercase tracking-wider text-gray-500 font-semibold">
                    <th className="px-6 py-4">Store</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {product.offers.map((offer, index) => (
                    <tr
                      key={offer.id}
                      className={`hover:bg-gray-50 transition-colors ${index === 0 ? 'bg-orange-50/30' : ''}`}
                    >
                      <td className="px-6 py-5 font-medium text-gray-900 flex items-center gap-2">
                        {index === 0 && <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider hidden sm:inline-block">Best</span>}
                        {offer.merchant.name}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="font-bold text-lg text-gray-900">
                            ₹{Number(offer.price).toLocaleString("en-IN")}
                          </span>
                          {offer.couponCode && (
                            <span className="text-xs text-green-600 font-medium mt-1">
                              Code: {offer.couponCode}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        {offer.inStock ? (
                          <div className="flex items-center text-green-600 text-sm font-medium">
                            <CheckCircle2 className="w-4 h-4 mr-1.5" />
                            In Stock
                          </div>
                        ) : (
                          <div className="flex items-center text-red-500 text-sm font-medium">
                            <XCircle className="w-4 h-4 mr-1.5" />
                            Out of Stock
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <a
                          href={`/go/${offer.id}`}
                          rel="sponsored nofollow noopener"
                          target="_blank"
                          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 text-white px-5 py-2.5 text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm"
                        >
                          Visit Store
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
              <p className="text-xs text-gray-500 flex items-center gap-1">
                Prices last checked: {product.offers[0]?.lastCheckedAt.toLocaleString("en-IN")}.
                We may earn a commission when you buy through these links.
              </p>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 bg-white p-6 rounded-xl border border-gray-100">No offers available for this product.</p>
        )}
      </section>
    </main>
  );
}
