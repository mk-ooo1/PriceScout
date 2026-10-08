"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Offer {
  id: string;
  merchantId: string;
  merchantName: string;
  price: number;
  mrp: number | null;
  couponCode: string;
  inStock: boolean;
  deepLink: string;
}

export default function OffersManager({
  productId,
  merchants,
  initialOffers,
}: {
  productId: string;
  merchants: { id: string; name: string }[];
  initialOffers: Offer[];
}) {
  const router = useRouter();
  const [offers, setOffers] = useState(initialOffers);
  const [error, setError] = useState<string | null>(null);

  // add-offer form state
  const [merchantId, setMerchantId] = useState(merchants[0]?.id ?? "");
  const [price, setPrice] = useState("");
  const [mrp, setMrp] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [deepLink, setDeepLink] = useState("");
  const [adding, setAdding] = useState(false);

  async function updateOffer(id: string, patch: Partial<Offer>) {
    setError(null);
    const res = await fetch(`/api/admin/offers?id=${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (!res.ok) {
      setError("Failed to update offer.");
      return;
    }
    setOffers((prev) => prev.map((o) => (o.id === id ? { ...o, ...patch } : o)));
  }

  async function deleteOffer(id: string) {
    if (!confirm("Remove this offer?")) return;
    const res = await fetch(`/api/admin/offers?id=${id}`, { method: "DELETE" });
    if (res.ok) setOffers((prev) => prev.filter((o) => o.id !== id));
    else setError("Failed to delete offer.");
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setAdding(true);
    setError(null);

    const res = await fetch(`/api/admin/products/${productId}/offers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        merchantId,
        price: Number(price),
        mrp: mrp ? Number(mrp) : undefined,
        couponCode: couponCode || undefined,
        deepLink,
      }),
    });

    setAdding(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ? JSON.stringify(data.error) : "Failed to add offer.");
      return;
    }

    setPrice("");
    setMrp("");
    setCouponCode("");
    setDeepLink("");
    router.refresh(); // simplest way to re-pull the fresh offer list with merchant name
  }

  return (
    <div className="space-y-6">
      {offers.length > 0 && (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="p-3">Merchant</th>
                <th className="p-3">Price</th>
                <th className="p-3">MRP</th>
                <th className="p-3">Coupon</th>
                <th className="p-3">Link/URL</th>
                <th className="p-3">In stock</th>
                <th className="p-3" />
              </tr>
            </thead>
            <tbody>
              {offers.map((o) => (
                <tr key={o.id} className="border-t">
                  <td className="p-3">{o.merchantName}</td>
                  <td className="p-3">
                    <input
                      type="number"
                      defaultValue={o.price}
                      className="w-24 border rounded px-2 py-1"
                      onBlur={(e) => {
                        const v = Number(e.target.value);
                        if (v > 0 && v !== o.price) updateOffer(o.id, { price: v });
                      }}
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="number"
                      defaultValue={o.mrp ?? ""}
                      className="w-24 border rounded px-2 py-1"
                      onBlur={(e) => {
                        const v = e.target.value ? Number(e.target.value) : null;
                        if (v !== o.mrp) updateOffer(o.id, { mrp: v ?? undefined });
                      }}
                    />
                  </td>
                  <td className="p-3">
                    <input
                      defaultValue={o.couponCode}
                      className="w-24 border rounded px-2 py-1"
                      onBlur={(e) => {
                        if (e.target.value !== o.couponCode)
                          updateOffer(o.id, { couponCode: e.target.value });
                      }}
                    />
                  </td>
                  <td className="p-3">
                    <input
                      defaultValue={o.deepLink}
                      placeholder="Affiliate Link"
                      className="w-48 border rounded px-2 py-1 text-xs"
                      onBlur={(e) => {
                        if (e.target.value && e.target.value !== o.deepLink)
                          updateOffer(o.id, { deepLink: e.target.value });
                      }}
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={o.inStock}
                      onChange={(e) => updateOffer(o.id, { inStock: e.target.checked })}
                    />
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => deleteOffer(o.id)}
                      className="text-red-500 text-xs hover:underline"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <form onSubmit={handleAdd} className="border rounded-lg p-4 space-y-3">
        <p className="text-sm font-medium">Add a merchant offer</p>
        <div className="grid grid-cols-2 gap-3">
          <select
            value={merchantId}
            onChange={(e) => setMerchantId(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm"
          >
            {merchants.length === 0 && <option value="">No merchants — add one first</option>}
            {merchants.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
          <input
            required
            type="number"
            placeholder="Price (₹)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm"
          />
          <input
            type="number"
            placeholder="MRP (₹, optional)"
            value={mrp}
            onChange={(e) => setMrp(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm"
          />
          <input
            placeholder="Coupon code (optional)"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm"
          />
          <input
            required
            placeholder="Product URL or Affiliate Link"
            value={deepLink}
            onChange={(e) => setDeepLink(e.target.value)}
            className="col-span-2 border rounded-md px-3 py-2 text-sm"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={adding || !merchantId}
          className="bg-black text-white rounded-md px-4 py-2 text-sm hover:opacity-90 disabled:opacity-50"
        >
          {adding ? "Adding…" : "Add offer"}
        </button>
      </form>
    </div>
  );
}
