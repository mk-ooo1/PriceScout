import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Affiliate Disclosure",
  description: "How PriceScout is funded through affiliate partnerships.",
};

export default function AffiliateDisclosurePage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16 prose prose-blue">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Affiliate Disclosure</h1>

      <div className="space-y-6 text-gray-700">
        <p className="font-medium text-lg border-l-4 border-blue-500 pl-4 bg-blue-50 py-3 pr-3 rounded-r-lg">
          In compliance with FTC guidelines and the Advertising Standards Council of India (ASCI), please assume that any links on PriceScout leading to products or services are affiliate links.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">What is an affiliate link?</h2>
        <p>
          When you click on a product link on PriceScout and proceed to make a purchase on a merchant's website (such as Amazon, Flipkart, Myntra, etc.), we may earn a small referral commission from the retailer.
        </p>
        <p>
          <strong>This commission comes at absolutely no additional cost to you.</strong> The price you pay for the product is exactly the same whether you use our affiliate link or go directly to the vendor's website.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Why do we use affiliate links?</h2>
        <p>
          PriceScout is 100% free for users. Running a high-speed data aggregation and price comparison platform requires significant server resources and maintenance. The affiliate commissions we earn help us keep the servers running, maintain the platform, and continue building tools to help you save money.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Our Commitment to Transparency</h2>
        <p>
          Our primary goal is to help you find the best deal. We do not accept money from merchants to falsely inflate reviews or hide lower prices from competitors. Our price comparison tables are built to be objective and transparent, showing you the data we fetch directly from the merchants.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Amazon Associates Program</h2>
        <p>
          PriceScout is a participant in the Amazon Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.in and affiliated sites. As an Amazon Associate, we earn from qualifying purchases.
        </p>
      </div>
    </main>
  );
}
