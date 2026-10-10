import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and conditions for using PriceScout.",
};

export default function TermsOfServicePage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16 prose prose-blue">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Terms of Service</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString('en-IN')}</p>

      <div className="space-y-6 text-gray-700">
        <p>
          Welcome to PriceScout. By accessing this website, we assume you accept these terms and conditions. Do not continue to use PriceScout if you do not agree to take all of the terms and conditions stated on this page.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Nature of the Service</h2>
        <p>
          PriceScout is a product discovery and price comparison engine. <strong>We are not a retailer, store, or manufacturer.</strong> We do not sell products directly to consumers, and we do not process payments, manage inventory, or handle shipping.
        </p>
        <p>
          All purchases made through links on our website are transactions strictly between you and the third-party merchant (e.g., Amazon, Flipkart). Any issues regarding order fulfillment, product quality, returns, refunds, or customer service must be directed to the merchant from whom the product was purchased.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Accuracy of Information</h2>
        <p>
          While we strive to provide accurate and up-to-date pricing and product information, prices and availability are subject to change rapidly on merchant websites. PriceScout does not warrant or guarantee that the prices, coupons, or stock status displayed on our site will be exactly the same as the final price displayed on the merchant's site at the time of checkout.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. Affiliate Links</h2>
        <p>
          Some of the links on our website are affiliate links. This means that if you click on the link and make a purchase, we may receive a commission at no extra cost to you. This financial relationship does not influence our editorial independence.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. Limitation of Liability</h2>
        <p>
          In no event shall PriceScout, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any products purchased from third-party merchants accessed via the Service.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">5. Governing Law</h2>
        <p>
          These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions.
        </p>
      </div>
    </main>
  );
}
