import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 mt-20">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-white text-lg font-bold mb-4">PriceScout</h3>
          <p className="text-sm text-gray-400">
            Your trusted discovery and comparison platform for the Indian market. We track prices across multiple stores to help you find the best deals.
          </p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
            <li><Link href="/search" className="hover:text-white transition-colors">Search Products</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Disclaimer</h4>
          <p className="text-sm text-gray-400 leading-relaxed border-l-4 border-gray-700 pl-3">
            Some links on this site are affiliate links. We may earn a commission on purchases made through these links, at no extra cost to you. This helps support our platform.
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-8 pt-6 border-t border-gray-800 text-xs text-center text-gray-500">
        &copy; {new Date().getFullYear()} PriceScout. All rights reserved.
      </div>
    </footer>
  );
}
