import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import EditProductForm from "./EditProductForm";
import OffersManager from "./OffersManager";
import ImagesManager from "./ImagesManager";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const [product, categories, merchants] = await Promise.all([
    prisma.product.findUnique({
      where: { id: params.id },
      include: {
        offers: { include: { merchant: true }, orderBy: { price: "asc" } },
        images: { orderBy: { position: "asc" } }
      },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.merchant.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
  ]);

  if (!product) notFound();

  return (
    <div className="max-w-3xl space-y-10">
      <div>
        <h1 className="text-xl font-semibold mb-6">Edit product</h1>
        <EditProductForm
          product={{
            id: product.id,
            title: product.title,
            brand: product.brand ?? "",
            categoryId: product.categoryId,
            description: product.description ?? "",
            isPublished: product.isPublished,
          }}
          categories={categories.map((c) => ({ id: c.id, name: c.name }))}
        />
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Images</h2>
        <ImagesManager
          productId={product.id}
          initialImages={product.images}
        />
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Offers</h2>
        <OffersManager
          productId={product.id}
          merchants={merchants.map((m) => ({ id: m.id, name: m.name }))}
          initialOffers={product.offers.map((o) => ({
            id: o.id,
            merchantId: o.merchantId,
            merchantName: o.merchant.name,
            price: Number(o.price),
            mrp: o.mrp ? Number(o.mrp) : null,
            couponCode: o.couponCode ?? "",
            inStock: o.inStock,
            deepLink: o.deepLink,
          }))}
        />
      </div>
    </div>
  );
}
