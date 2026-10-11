import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import EditMerchantForm from "./EditMerchantForm";

export const dynamic = "force-dynamic";

export default async function EditMerchantPage({
  params,
}: {
  params: { id: string };
}) {
  const merchant = await prisma.merchant.findUnique({
    where: { id: params.id },
  });

  if (!merchant) notFound();

  return (
    <div className="max-w-xl">
      <h1 className="text-xl font-semibold mb-6">Edit merchant</h1>
      <EditMerchantForm
        merchant={{
          id: merchant.id,
          name: merchant.name,
          network: merchant.network,
          affiliateTagId: merchant.affiliateTagId,
          baseUrl: merchant.baseUrl,
          isActive: merchant.isActive,
        }}
      />
    </div>
  );
}
