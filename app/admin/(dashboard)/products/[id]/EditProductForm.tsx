"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  title: string;
  brand: string;
  categoryId: string;
  description: string;
  isPublished: boolean;
}

export default function EditProductForm({
  product,
  categories,
}: {
  product: Product;
  categories: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [title, setTitle] = useState(product.title);
  const [brand, setBrand] = useState(product.brand);
  const [categoryId, setCategoryId] = useState(product.categoryId);
  const [description, setDescription] = useState(product.description);
  const [isPublished, setIsPublished] = useState(product.isPublished);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const res = await fetch(`/api/admin/products?id=${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, brand, categoryId, description, isPublished }),
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ? JSON.stringify(data.error) : "Failed to save.");
      return;
    }

    setSavedAt(Date.now());
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm("Delete this product and all its offers? This can't be undone.")) return;
    const res = await fetch(`/api/admin/products?id=${product.id}`, { method: "DELETE" });
    if (res.ok) router.push("/admin/products");
    else setError("Failed to delete — you may need admin (not editor) permissions.");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded-md px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Brand</label>
        <input
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="w-full border rounded-md px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Category</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full border rounded-md px-3 py-2"
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full border rounded-md px-3 py-2"
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={isPublished}
          onChange={(e) => setIsPublished(e.target.checked)}
        />
        Published (visible on the public site)
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
          Delete product
        </button>
      </div>
    </form>
  );
}
