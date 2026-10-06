import Link from "next/link";
import Image from "next/image";
import { Tag } from "lucide-react";
import type { Product, Offer, ProductImage } from "@prisma/client";

interface ProductCardProps {
  product: Product & {
    images: ProductImage[];
    offers: Offer[];
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const lowestOffer = product.offers[0];
  const imageUrl = product.images[0]?.url;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group bg-white border border-gray-100 rounded-lg p-4 hover:shadow-lg transition-all duration-300 flex flex-col"
    >
      <div className="relative aspect-square w-full mb-4 bg-white rounded-md overflow-hidden flex items-center justify-center p-2 group-hover:scale-105 transition-transform duration-300">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.title}
            fill
            className="object-contain"
          />
        ) : (
          <div className="w-full h-full bg-gray-50 flex items-center justify-center rounded-md">
            <span className="text-gray-300 text-xs">No image</span>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1">
        <h3 className="text-sm font-medium text-gray-800 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
          {product.title}
        </h3>

        {product.brand && (
          <p className="text-xs text-gray-500 mt-1">{product.brand}</p>
        )}

        <div className="mt-auto pt-3">
          {lowestOffer ? (
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-gray-900">
                  ₹{Number(lowestOffer.price).toLocaleString("en-IN")}
                </span>
                {lowestOffer.mrp && Number(lowestOffer.mrp) > Number(lowestOffer.price) && (
                  <span className="text-xs text-gray-400 line-through">
                    ₹{Number(lowestOffer.mrp).toLocaleString("en-IN")}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 mt-1 text-xs text-green-600 bg-green-50 w-fit px-2 py-0.5 rounded-full font-medium">
                <Tag className="w-3 h-3" />
                <span>Compare {product.offers.length} store{product.offers.length > 1 ? 's' : ''}</span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">No active offers</p>
          )}
        </div>
      </div>
    </Link>
  );
}
