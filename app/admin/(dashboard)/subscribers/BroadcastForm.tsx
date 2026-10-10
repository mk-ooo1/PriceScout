"use client";

import { useState } from "react";
import { Send, Loader2, CheckCircle2 } from "lucide-react";

export default function BroadcastForm({ activeCount }: { activeCount: number }) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirm(`Are you sure you want to email ${activeCount} subscribers?`)) return;

    setStatus("loading");
    setFeedback("");

    try {
      const res = await fetch("/api/admin/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, message }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send broadcast");
      }

      setStatus("success");
      setFeedback(`Successfully sent to ${data.count} subscribers!`);
      setSubject("");
      setMessage("");

      // Reset success state after a few seconds
      setTimeout(() => setStatus("idle"), 5000);

    } catch (err: any) {
      setStatus("error");
      setFeedback(err.message);
    }
  };

  if (activeCount === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">You need at least 1 active subscriber to send a broadcast.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSend} className="space-y-4">
      {status === "success" && (
        <div className="p-4 bg-green-50 text-green-700 border border-green-200 rounded-lg flex items-center gap-2 mb-4">
          <CheckCircle2 className="w-5 h-5" />
          {feedback}
        </div>
      )}

      {status === "error" && (
        <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg mb-4 text-sm">
          <strong>Error: </strong> {feedback}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email Subject</label>
        <input
          required
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="🚨 Massive Price Drop on iPhone 15!"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          disabled={status === "loading"}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Message Body</label>
        <textarea
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={8}
          placeholder="Hey there,&#10;We just spotted a crazy deal...&#10;&#10;Here is the link: https://..."
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-y"
          disabled={status === "loading"}
        />
        <p className="text-xs text-gray-500 mt-2">
          Basic formatting is supported. Line breaks will be preserved in the email.
        </p>
      </div>

      <div className="pt-4 border-t border-gray-100 flex justify-end">
        <button
          type="submit"
          disabled={status === "loading"}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {status === "loading" ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
          Send to {activeCount} {activeCount === 1 ? 'person' : 'people'}
        </button>
      </div>
    </form>
  );
}
