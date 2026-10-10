import { Mail, MessageSquare } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the PriceScout team.",
};

export default function ContactPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center">
          <MessageSquare className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900">Contact Us</h1>
      </div>

      <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">We'd love to hear from you</h2>
        <p className="text-gray-600 mb-8 max-w-lg mx-auto">
          Whether you have a question about our platform, want to report a bug, or are interested in a business partnership, our inbox is always open.
        </p>

        <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-gray-50 p-6 rounded-2xl border border-gray-100">
          <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center">
            <Mail className="w-6 h-6" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Email us directly at</p>
            <a href="mailto:support@pricescout.in" className="text-xl font-bold text-blue-600 hover:text-blue-800 transition-colors">
              support@pricescout.in
            </a>
          </div>
        </div>

        <p className="text-sm text-gray-500 mt-8">
          Please note: For questions regarding shipping, returns, or product warranties, please contact the merchant (Amazon, Flipkart, etc.) where you placed your order directly.
        </p>
      </div>
    </main>
  );
}
