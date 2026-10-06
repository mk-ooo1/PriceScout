"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewMerchantPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [network, setNetwork] = useState("");
  const [affiliateTagId, setAffiliateTagId] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const res = await fetch("/api/admin/merchants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        network: network || undefined,
        affiliateTagId: affiliateTagId || undefined,
        baseUrl: baseUrl || undefined,
      }),
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ? JSON.stringify(data.error) : "Failed to save.");
      return;
    }

    router.push("/admin/merchants");
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-xl font-semibold mb-6">New merchant</h1>
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

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="bg-black text-white rounded-md px-4 py-2 text-sm hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Create merchant"}
        </button>
      </form>
    </div>
  );
}
