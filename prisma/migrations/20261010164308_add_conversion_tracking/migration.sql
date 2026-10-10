-- CreateTable
CREATE TABLE "Conversion" (
    "id" TEXT NOT NULL,
    "clickId" TEXT NOT NULL,
    "orderId" TEXT,
    "status" TEXT NOT NULL,
    "commission" DECIMAL(10,2),
    "saleAmount" DECIMAL(10,2),
    "network" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Conversion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Conversion_clickId_key" ON "Conversion"("clickId");

-- AddForeignKey
ALTER TABLE "Conversion" ADD CONSTRAINT "Conversion_clickId_fkey" FOREIGN KEY ("clickId") REFERENCES "ClickEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
