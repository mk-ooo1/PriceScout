import Link from "next/link";

export default function Footer({ settings }: { settings?: Record<string, string> }) {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 mt-20 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">

        {/* Brand Column */}
        <div className="md:col-span-1">
          <h3 className="text-white text-xl font-bold mb-4 tracking-tight">PriceScout</h3>
          <p className="text-sm text-gray-400 leading-relaxed mb-4">
            Your trusted discovery and comparison platform for the Indian market. Stop overpaying and start comparing today.
          </p>
        </div>

        {/* Help / Support Column */}
        <div>
          <h4 className="text-white font-semibold mb-4 tracking-wide uppercase text-sm">Help & Support</h4>
          <ul className="space-y-3 text-sm">
            <li><Link href="/faq" className="hover:text-white transition-colors">Frequently Asked Questions</Link></li>
            <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
          </ul>
        </div>

        {/* Legal Column */}
        <div>
          <h4 className="text-white font-semibold mb-4 tracking-wide uppercase text-sm">Legal</h4>
          <ul className="space-y-3 text-sm">
            <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link></li>
            <li><Link href="/affiliate-disclosure" className="hover:text-white transition-colors">Affiliate Disclosure</Link></li>
          </ul>
        </div>

        {/* Admin / Links Column */}
        <div>
          <h4 className="text-white font-semibold mb-4 tracking-wide uppercase text-sm">Quick Links</h4>
          <ul className="space-y-3 text-sm">
            <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
            <li><Link href="/search" className="hover:text-white transition-colors">Search Products</Link></li>
            {settings?.whatsappUrl && (
              <li><a href={settings.whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2">WhatsApp Community</a></li>
            )}
            {settings?.telegramUrl && (
              <li><a href={settings.telegramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2">Telegram Channel</a></li>
            )}
          </ul>
        </div>

      </div>

      {/* Mandatory Affiliate Disclaimer (Bottom Bar) */}
      <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-gray-800">
        <p className="text-xs text-gray-500 text-center leading-relaxed max-w-4xl mx-auto mb-4">
          <strong>Disclosure:</strong> Some links on this site are affiliate links. We may earn a commission on purchases made through these links, at no extra cost to you. As an Amazon Associate, we earn from qualifying purchases.
        </p>
        <div className="text-xs text-center text-gray-600">
          &copy; {new Date().getFullYear()} PriceScout. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
