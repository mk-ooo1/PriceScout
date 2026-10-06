"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      className="flex items-center gap-2 text-sm text-red-600 hover:bg-red-50 w-full text-left px-3 py-2 rounded-md transition-colors mt-8"
    >
      <LogOut className="w-4 h-4" />
      Sign out
    </button>
  );
}
