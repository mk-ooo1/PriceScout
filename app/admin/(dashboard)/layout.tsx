import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import { Package, Store, Tag, ListTree, Users, TrendingUp } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-gray-200 bg-gray-50 flex flex-col">
        <div className="p-6">
          <p className="font-bold text-gray-900 text-lg tracking-tight mb-6">Admin Panel</p>
          <nav className="space-y-1">
            <Link href="/admin/products" className="flex items-center gap-3 text-sm font-medium text-gray-700 px-3 py-2 rounded-md hover:bg-gray-200 transition-colors">
              <Package className="w-4 h-4 text-gray-500" />
              Products
            </Link>
            <Link href="/admin/categories" className="flex items-center gap-3 text-sm font-medium text-gray-700 px-3 py-2 rounded-md hover:bg-gray-200 transition-colors">
              <ListTree className="w-4 h-4 text-gray-500" />
              Categories
            </Link>
            <Link href="/admin/merchants" className="flex items-center gap-3 text-sm font-medium text-gray-700 px-3 py-2 rounded-md hover:bg-gray-200 transition-colors">
              <Store className="w-4 h-4 text-gray-500" />
              Merchants
            </Link>
            <Link href="/admin/offers" className="flex items-center gap-3 text-sm font-medium text-gray-700 px-3 py-2 rounded-md hover:bg-gray-200 transition-colors">
              <Tag className="w-4 h-4 text-gray-500" />
              Global Offers
            </Link>
            <Link href="/admin/conversions" className="flex items-center gap-3 text-sm font-medium text-gray-700 px-3 py-2 rounded-md hover:bg-gray-200 transition-colors mt-4">
              <TrendingUp className="w-4 h-4 text-gray-500" />
              Sales & Conversions
            </Link>
            <Link href="/admin/subscribers" className="flex items-center gap-3 text-sm font-medium text-gray-700 px-3 py-2 rounded-md hover:bg-gray-200 transition-colors">
              <Users className="w-4 h-4 text-gray-500" />
              Subscribers
            </Link>
            <Link href="/admin/settings" className="flex items-center gap-3 text-sm font-medium text-gray-700 px-3 py-2 rounded-md hover:bg-gray-200 transition-colors mt-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-500"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              Site Settings
            </Link>
          </nav>
        </div>
        <div className="mt-auto p-6 border-t border-gray-200">
          <LogoutButton />
        </div>
      </aside>
      <main className="flex-1 p-6 md:p-10 bg-white overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
