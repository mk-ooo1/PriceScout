import Link from "next/link";
import { prisma } from "@/lib/db";
import { CheckCircle2, XCircle, ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminOffersPage() {
  const offers = await prisma.offer.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      product: { select: { title: true, slug: true, id: true } },
      merchant: { select: { name: true } },
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold">Global Offers</h1>
          <p className="text-sm text-gray-500 mt-1">
            View all active offers across all products and merchants.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-3">Product</th>
              <th className="p-3">Merchant</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Last Checked</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {offers.map((o) => (
              <tr key={o.id} className="border-t">
                <td className="p-3 font-medium max-w-[250px] truncate" title={o.product.title}>
                  <Link href={`/admin/products/${o.product.id}`} className="hover:text-blue-600 hover:underline">
                    {o.product.title}
                  </Link>
                </td>
                <td className="p-3">{o.merchant.name}</td>
                <td className="p-3 font-bold">
                  ₹{Number(o.price).toLocaleString("en-IN")}
                </td>
                <td className="p-3">
                  {o.inStock ? (
                    <span className="text-green-600 flex items-center gap-1 text-xs font-medium">
                      <CheckCircle2 className="w-3 h-3" /> In Stock
                    </span>
                  ) : (
                    <span className="text-red-500 flex items-center gap-1 text-xs font-medium">
                      <XCircle className="w-3 h-3" /> Out of Stock
                    </span>
                  )}
                </td>
                <td className="p-3 text-gray-500 text-xs">
                  {o.lastCheckedAt.toLocaleDateString("en-IN")}
                </td>
                <td className="p-3 text-right space-x-3">
                  <a
                    href={o.affiliateUrl || o.deepLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-blue-600 inline-flex items-center gap-1"
                    title="Test Link"
                  >
                    Test <ExternalLink className="w-3 h-3" />
                  </a>
                  <Link
                    href={`/admin/products/${o.product.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {offers.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-400">
                  No offers exist yet. Add them by editing a Product.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
