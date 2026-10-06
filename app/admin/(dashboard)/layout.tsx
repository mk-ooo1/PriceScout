import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import { Package, Store, Tag, ListTree } from "lucide-react";

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
