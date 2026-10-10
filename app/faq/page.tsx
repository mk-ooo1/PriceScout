import { HelpCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Learn how PriceScout works, how we track prices, and how to track your orders.",
};

export default function FAQPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
          <HelpCircle className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900">Frequently Asked Questions</h1>
      </div>

      <div className="space-y-6">
        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-2">How do I track my order?</h3>
          <p className="text-gray-600 leading-relaxed">
            PriceScout is a discovery and price comparison platform. We do not sell or ship products directly. When you click "Visit Store" or "Buy", you are securely redirected to trusted merchants like Amazon, Flipkart, or Myntra to complete your purchase.
            <strong> To track your shipping, request a return, or cancel an order, please log in to your account on the merchant's website where you placed the order.</strong>
          </p>
        </div>

        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Why is the price on the merchant's site different from PriceScout?</h3>
          <p className="text-gray-600 leading-relaxed">
            We scan prices across thousands of products daily. However, e-commerce stores change their prices and lightning deals dynamically throughout the day. Occasionally, a price may change on the merchant's site before our system has fetched the latest update. The price shown at checkout on the merchant's website is always the final and correct price.
          </p>
        </div>

        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Do I pay extra when buying through PriceScout?</h3>
          <p className="text-gray-600 leading-relaxed">
            Absolutely not. PriceScout is 100% free to use. When you make a purchase through our links, the merchant pays us a small affiliate commission out of their own pocket for referring you to them. This does not affect the price you pay.
          </p>
        </div>

        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-2">How do Deal Alerts work?</h3>
          <p className="text-gray-600 leading-relaxed">
            When you subscribe to Deal Alerts, you join our mailing list. Our system monitors massive price drops on popular products. When a highly sought-after item drops to its lowest historical price, we send an email blast to our subscribers so you can grab the deal before it sells out. You can unsubscribe at any time.
          </p>
        </div>
      </div>
    </main>
  );
}
