import { prisma } from "@/lib/db";
import BroadcastForm from "./BroadcastForm";
import { Users, Mail } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SubscribersPage() {
  const subscribers = await prisma.subscriber.findMany({
    orderBy: { createdAt: "desc" },
  });

  const activeCount = subscribers.filter(s => s.isActive).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Users className="w-6 h-6 text-blue-600" />
          Subscribers Dashboard
        </h1>
        <p className="text-gray-500 text-sm">
          Manage your audience and send manual Deal Alert broadcasts.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left Column: Stats & Subscribers List */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Active Subscribers</h3>
            <p className="text-4xl font-extrabold text-blue-600">{activeCount}</p>
            <p className="text-xs text-gray-400 mt-2">Total signups: {subscribers.length}</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col max-h-[500px]">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 font-medium text-sm text-gray-700">
              Recent Signups
            </div>
            <div className="overflow-y-auto p-0 m-0 flex-1">
              {subscribers.length === 0 ? (
                <p className="text-sm text-gray-500 p-4 text-center">No subscribers yet.</p>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {subscribers.map((sub) => (
                    <li key={sub.id} className="p-4 flex items-center justify-between text-sm hover:bg-gray-50">
                      <span className={`truncate ${!sub.isActive && 'text-gray-400 line-through'}`}>
                        {sub.email}
                      </span>
                      <span className="text-xs text-gray-400 shrink-0 ml-2">
                        {sub.createdAt.toLocaleDateString()}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Broadcast Form */}
        <div className="md:col-span-2">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
              <Mail className="w-5 h-5 text-gray-500" />
              <h2 className="font-semibold text-gray-800">Send Deal Alert Blast</h2>
            </div>
            <div className="p-6">
              <BroadcastForm activeCount={activeCount} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
