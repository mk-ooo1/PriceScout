import { prisma } from "@/lib/db";
import { TrendingUp, DollarSign, Activity, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ConversionsPage() {
  const conversions = await prisma.conversion.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      click: {
        include: {
          offer: {
            include: { product: true, merchant: true }
          }
        }
      }
    },
    take: 100,
  });

  const totalCommissions = conversions
    .filter(c => c.status === "approved" || c.status === "successful")
    .reduce((sum, current) => sum + Number(current.commission || 0), 0);

  const pendingCommissions = conversions
    .filter(c => c.status === "pending")
    .reduce((sum, current) => sum + Number(current.commission || 0), 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          Sales & Conversions
        </h1>
        <p className="text-gray-500 text-sm">
          Track affiliate sales reported via Postback webhooks.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Approved Earnings</p>
            <p className="text-2xl font-extrabold text-gray-900">₹{totalCommissions.toLocaleString("en-IN")}</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Pending Earnings</p>
            <p className="text-2xl font-extrabold text-gray-900">₹{pendingCommissions.toLocaleString("en-IN")}</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Total Sales</p>
            <p className="text-2xl font-extrabold text-gray-900">{conversions.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500">
              <tr>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Product / Merchant</th>
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Commission</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {conversions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No sales recorded yet. Once your affiliate network sends a postback webhook, it will appear here.
                  </td>
                </tr>
              ) : (
                conversions.map((conv) => (
                  <tr key={conv.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-500">
                      {conv.createdAt.toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {conv.click.offer ? (
                        <>
                           <Link href={`/admin/products/${conv.click.offer.product.id}`} className="hover:text-blue-600 hover:underline">
                             {conv.click.offer.product.title}
                           </Link>
                           <span className="text-xs text-gray-400 block mt-0.5 border-t border-gray-100 pt-0.5">
                             via {conv.click.offer.merchant.name}
                           </span>
                        </>
                      ) : (
                        <span className="text-gray-400">Offer deleted</span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">
                      {conv.orderId || "—"}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize
                        ${conv.status === "approved" || conv.status === "successful" ? "bg-green-100 text-green-700" : ""}
                        ${conv.status === "pending" ? "bg-orange-100 text-orange-700" : ""}
                        ${conv.status === "rejected" || conv.status === "cancelled" ? "bg-red-100 text-red-700" : ""}
                      `}>
                        {conv.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-gray-900">
                      {conv.commission ? `₹${Number(conv.commission).toLocaleString("en-IN")}` : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
