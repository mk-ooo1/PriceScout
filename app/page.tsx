import Link from "next/link";
import { prisma } from "@/lib/db";
import ProductCard from "@/components/ProductCard";
import { getCategoryIcon } from "@/components/CategoryIcon";
import HeroSearch from "@/components/HeroSearch";
import { Zap, ShieldCheck, TrendingUp, BellRing, ChevronRight } from "lucide-react";

export const revalidate = 1800;

export default async function HomePage() {
  const [categories, products] = await Promise.all([
    prisma.category.findMany({ where: { parentId: null }, orderBy: { name: "asc" } }),
    prisma.product.findMany({
      where: { isPublished: true },
      include: {
        images: { take: 1, orderBy: { position: "asc" } },
        offers: { orderBy: { price: "asc" } },
      },
      orderBy: { updatedAt: "desc" },
      take: 10,
    }),
  ]);

  return (
    <main className="bg-gray-50 min-h-screen">
      {/* Premium Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 text-white pt-20 pb-24 px-4 overflow-hidden">
        {/* Abstract Background shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-400 blur-3xl"></div>
          <div className="absolute top-1/2 right-0 w-80 h-80 rounded-full bg-blue-300 blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-blue-800 border border-blue-600 text-blue-200 text-xs font-bold tracking-widest uppercase mb-6 shadow-sm">
            100% Free Price Tracker
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight">
            Stop Overpaying. <br className="hidden sm:block" />
            <span className="text-orange-400">Start Comparing.</span>
          </h1>
          <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto font-medium">
            We track and compare live prices across Amazon, Flipkart, Myntra, and more so you always get the best deal.
          </p>

          <HeroSearch />
        </div>
      </section>

      {/* Trust / Value Proposition Section */}
      <section className="max-w-7xl mx-auto px-4 -mt-10 relative z-20">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-gray-100">
            <div className="flex flex-col items-center px-4 pt-4 md:pt-0">
              <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-4">
                <Zap className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Real-Time Prices</h3>
              <p className="text-sm text-gray-500">We scan the top Indian stores daily to find the absolute lowest prices and coupons available.</p>
            </div>
            <div className="flex flex-col items-center px-4 pt-8 md:pt-0">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Unbiased Comparison</h3>
              <p className="text-sm text-gray-500">100% transparent tracking. We show you all the offers so you can choose where to buy.</p>
            </div>
            <div className="flex flex-col items-center px-4 pt-8 md:pt-0">
              <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Price History</h3>
              <p className="text-sm text-gray-500">Know exactly when to buy. We track historical prices to ensure you aren't falling for fake sales.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-16 space-y-20">

        {/* Categories Section */}
        {categories.length > 0 && (
          <section>
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Shop by Category</h2>
                <p className="text-gray-500 mt-1">Browse our most popular product categories</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/category/${c.slug}`}
                  className="group bg-white flex flex-col items-center p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 hover:bg-blue-50/50 transition-all duration-300"
                >
                  <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    {getCategoryIcon(c.name, "w-8 h-8")}
                  </div>
                  <span className="text-sm font-bold text-gray-800 text-center group-hover:text-blue-700">{c.name}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Trending Products Section */}
        <section>
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Trending Deals</h2>
              <p className="text-gray-500 mt-1">Recently updated prices and massive price drops</p>
            </div>
            <Link href="/search" className="hidden sm:flex items-center text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors">
              View all products <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {products.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📦</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900">No deals right now</h3>
              <p className="text-gray-500 mt-1">Check back later or add products from the admin panel.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
          <div className="mt-8 text-center sm:hidden">
             <Link href="/search" className="inline-flex items-center justify-center w-full px-6 py-3 border border-gray-200 text-sm font-bold rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                View all products
             </Link>
          </div>
        </section>

        {/* Deal Alerts CTA Banner */}
        <section className="bg-gray-900 rounded-3xl overflow-hidden shadow-2xl relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 transform -translate-x-1/2 translate-y-1/2"></div>

          <div className="relative px-6 py-12 md:py-16 text-center max-w-3xl mx-auto">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-700">
               <BellRing className="w-8 h-8 text-orange-400" />
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight">
              Never Miss a Price Drop
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
              Join thousands of smart shoppers. Get notified instantly when the products you want drop to your target price.
            </p>

            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-5 py-3.5 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
              <button
                type="submit"
                className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-lg"
              >
                Subscribe
              </button>
            </form>
            <p className="text-xs text-gray-500 mt-4">We respect your privacy. No spam, ever.</p>
          </div>
        </section>

      </div>
    </main>
  );
}
