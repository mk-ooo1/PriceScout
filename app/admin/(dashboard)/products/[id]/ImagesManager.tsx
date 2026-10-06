"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { UploadDropzone } from "@/utils/uploadthing";
import { Trash2, Loader2 } from "lucide-react";
import type { ProductImage } from "@prisma/client";

export default function ImagesManager({
  productId,
  initialImages,
}: {
  productId: string;
  initialImages: ProductImage[];
}) {
  const router = useRouter();
  const [images, setImages] = useState<ProductImage[]>(initialImages);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleUploadComplete = async (res: any[]) => {
    // res is an array of objects containing the file info
    for (const file of res) {
      // Save each uploaded image URL to our database
      const dbRes = await fetch(`/api/admin/products/${productId}/images`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: file.url, altText: file.name }),
      });

      if (dbRes.ok) {
        const { image } = await dbRes.json();
        setImages((prev) => [...prev, image]);
      }
    }
    router.refresh();
  };

  const handleDelete = async (imageId: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    setDeletingId(imageId);
    const res = await fetch(`/api/admin/products/${productId}/images/${imageId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setImages((prev) => prev.filter((img) => img.id !== imageId));
      router.refresh();
    } else {
      alert("Failed to delete image.");
    }
    setDeletingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Upload Dropzone */}
      <div className="border border-dashed border-gray-300 rounded-xl bg-gray-50 p-6 flex justify-center">
        <UploadDropzone
          endpoint="imageUploader"
          onClientUploadComplete={handleUploadComplete}
          onUploadError={(error: Error) => {
            alert(`ERROR! ${error.message}`);
          }}
          appearance={{
            button: "bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md",
            label: "text-blue-600 hover:text-blue-700 font-medium",
            allowedContent: "text-gray-400 text-xs",
          }}
        />
      </div>

      {/* Image Grid */}
      {images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((image) => (
            <div key={image.id} className="relative group rounded-lg overflow-hidden border border-gray-200 aspect-square bg-white">
              <Image
                src={image.url}
                alt={image.altText ?? "Product Image"}
                fill
                className="object-contain p-2"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={() => handleDelete(image.id)}
                  disabled={deletingId === image.id}
                  className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors disabled:opacity-50"
                  title="Delete Image"
                >
                  {deletingId === image.id ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Trash2 className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm text-center py-8">
          No images uploaded yet.
        </p>
      )}
    </div>
  );
}
