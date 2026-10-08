import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/admin/auth";
import { redirect } from "next/navigation";
import LoginForm from "./LoginForm";
import { Shield } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/admin/products");
  }

  return (
    <main className="mx-auto max-w-sm px-4 py-24 flex flex-col items-center">
      <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
        <Shield className="w-6 h-6" />
      </div>
      <h1 className="text-2xl font-bold mb-8 text-gray-900">Admin Login</h1>
      <div className="w-full bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
        <LoginForm />
      </div>
    </main>
  );
}
