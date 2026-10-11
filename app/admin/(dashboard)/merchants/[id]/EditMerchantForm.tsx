"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Merchant {
  id: string;
  name: string;
  network: string | null;
  affiliateTagId: string | null;
  baseUrl: string | null;
  isActive: boolean;
}

export default function EditMerchantForm({ merchant }: { merchant: Merchant }) {
  const router = useRouter();
  const [name, setName] = useState(merchant.name);
  const [network, setNetwork] = useState(merchant.network || "");
  const [affiliateTagId, setAffiliateTagId] = useState(merchant.affiliateTagId || "");
  const [baseUrl, setBaseUrl] = useState(merchant.baseUrl || "");
  const [isActive, setIsActive] = useState(merchant.isActive);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const res = await fetch(`/api/admin/merchants?id=${merchant.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        network: network || undefined,
        affiliateTagId: affiliateTagId || undefined,
        baseUrl: baseUrl || undefined,
        isActive,
      }),
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ? JSON.stringify(data.error) : "Failed to update.");
      return;
    }

    setSavedAt(Date.now());
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm("Delete this merchant and all its offers? This can't be undone.")) return;
    const res = await fetch(`/api/admin/merchants?id=${merchant.id}`, { method: "DELETE" });
    if (res.ok) router.push("/admin/merchants");
    else setError("Failed to delete — you may need admin permissions or there may be active offers tied to this merchant.");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded-md px-3 py-2"
          placeholder="Flipkart"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Network{" "}
          <span className="text-gray-400 font-normal">
            (amazon / flipkart / earnkaro / cuelinks / direct…)
          </span>
        </label>
        <input
          value={network}
          onChange={(e) => setNetwork(e.target.value)}
          className="w-full border rounded-md px-3 py-2"
          placeholder="flipkart"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Affiliate tag / publisher ID
        </label>
        <input
          value={affiliateTagId}
          onChange={(e) => setAffiliateTagId(e.target.value)}
          className="w-full border rounded-md px-3 py-2"
          placeholder="your-tag-21"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Base URL <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <input
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
          className="w-full border rounded-md px-3 py-2"
          placeholder="https://www.flipkart.com"
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
        />
        Active (visible on the public site and valid for tracking)
      </label>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="bg-black text-white rounded-md px-4 py-2 text-sm hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
        {savedAt && <span className="text-xs text-gray-400">Saved</span>}
        <button
          type="button"
          onClick={handleDelete}
          className="ml-auto text-red-500 text-sm hover:underline"
        >
          Delete merchant
        </button>
      </div>
    </form>
  );
}
