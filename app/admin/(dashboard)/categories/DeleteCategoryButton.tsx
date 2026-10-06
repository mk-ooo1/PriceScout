"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteCategoryButton({ id, disabled }: { id: string, disabled: boolean }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (disabled) {
      alert("Cannot delete category because it contains products or sub-categories.");
      return;
    }

    if (!confirm("Are you sure you want to delete this category?")) return;

    setDeleting(true);
    const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.error ?? "Failed to delete category.");
      setDeleting(false);
      return;
    }

    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      disabled={disabled || deleting}
      className={`text-sm ${
        disabled ? "text-gray-300 cursor-not-allowed" : "text-red-500 hover:underline"
      }`}
      title={disabled ? "Cannot delete category with products or sub-categories" : "Delete category"}
    >
      {deleting ? "..." : "Delete"}
    </button>
  );
}
