import "./globals.css";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: {
    default: "PriceScout — Compare Prices Across Stores",
    template: "%s | PriceScout",
  },
  description:
    "Discover products and compare live prices across Amazon, Flipkart and more.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch global settings
  const settingsRecords = await prisma.siteSetting.findMany();
  const settings = settingsRecords.reduce((acc, s) => {
    acc[s.key] = s.value;
    return acc;
  }, {} as Record<string, string>);

  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
        <Header settings={settings} />
        <div className="flex-1">
          {children}
        </div>
        <Footer settings={settings} />
      </body>
    </html>
  );
}
