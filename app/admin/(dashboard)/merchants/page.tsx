import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminMerchantsPage() {
  const merchants = await prisma.merchant.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { offers: true } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Merchants</h1>
        <Link
          href="/admin/merchants/new"
          className="bg-black text-white rounded-md px-4 py-2 text-sm hover:opacity-90"
        >
          + New merchant
        </Link>
      </div>

      <table className="w-full text-sm border rounded-lg overflow-hidden">
        <thead className="bg-gray-50 text-left">
          <tr>
            <th className="p-3">Name</th>
            <th className="p-3">Network</th>
            <th className="p-3">Affiliate tag</th>
            <th className="p-3">Offers</th>
            <th className="p-3">Active</th>
          </tr>
        </thead>
        <tbody>
          {merchants.map((m) => (
            <tr key={m.id} className="border-t">
              <td className="p-3">{m.name}</td>
              <td className="p-3">{m.network ?? "—"}</td>
              <td className="p-3">{m.affiliateTagId ?? "—"}</td>
              <td className="p-3">{m._count.offers}</td>
              <td className="p-3">
                {m.isActive ? (
                  <span className="text-green-600">Active</span>
                ) : (
                  <span className="text-gray-400">Disabled</span>
                )}
              </td>
            </tr>
          ))}
          {merchants.length === 0 && (
            <tr>
              <td colSpan={5} className="p-6 text-center text-gray-400">
                No merchants yet — add one before creating offers.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
