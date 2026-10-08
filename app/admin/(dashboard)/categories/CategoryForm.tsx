"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Category {
  id: string;
  name: string;
}

interface CategoryFormProps {
  initialData?: {
    id?: string;
    name: string;
    slug: string;
    description: string;
    parentId: string | null;
  };
  categories: Category[];
}

export default function CategoryForm({ initialData, categories }: CategoryFormProps) {
  const router = useRouter();
  const isEditing = !!initialData?.id;

  const [name, setName] = useState(initialData?.name ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [parentId, setParentId] = useState(initialData?.parentId ?? "");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Auto-generate slug from name if creating
  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEditing) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "")
      );
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      name,
      slug,
      description: description || undefined,
      parentId: parentId || null,
    };

    const url = isEditing
      ? `/api/admin/categories?id=${initialData.id}`
      : "/api/admin/categories";
    const method = isEditing ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ? (typeof data.error === 'string' ? data.error : JSON.stringify(data.error)) : "Failed to save category.");
      return;
    }

    router.push("/admin/categories");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input
          required
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          className="w-full border rounded-md px-3 py-2"
          placeholder="Smartphones"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Slug</label>
        <input
          required
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="w-full border rounded-md px-3 py-2"
          placeholder="smartphones"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Parent Category</label>
        <select
          value={parentId}
          onChange={(e) => setParentId(e.target.value)}
          className="w-full border rounded-md px-3 py-2"
        >
          <option value="">None (Top Level)</option>
          {categories
            .filter((c) => c.id !== initialData?.id) // Prevent selecting self as parent
            .map((c) => (
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
          rows={3}
          className="w-full border rounded-md px-3 py-2"
          placeholder="Compare prices for the best..."
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="bg-black text-white rounded-md px-4 py-2 text-sm hover:opacity-90 disabled:opacity-50"
      >
        {saving ? "Saving…" : isEditing ? "Update category" : "Create category"}
      </button>
    </form>
  );
}
