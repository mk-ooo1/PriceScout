"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

export default function DealAlertForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to subscribe");
      }

      setStatus("success");
      setEmail("");
    } catch (error: any) {
      setStatus("error");
      setErrorMessage(error.message);
    }
  };

  if (status === "success") {
    return (
      <div className="max-w-md mx-auto bg-gray-800/50 backdrop-blur-sm border border-green-500/30 rounded-2xl p-6 text-center animate-in fade-in zoom-in duration-300">
        <div className="w-12 h-12 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-3">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">You're on the list!</h3>
        <p className="text-gray-400 text-sm">
          Keep an eye on your inbox. We'll let you know when the best deals drop.
        </p>
      </div>
    );
  }

  return (
    <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto w-full relative" onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Enter your email address"
        className="flex-1 px-5 py-3.5 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={status === "loading"}
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
      >
        {status === "loading" ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          "Subscribe"
        )}
      </button>

      {status === "error" && (
        <p className="absolute -bottom-8 left-0 w-full text-red-400 text-sm text-center">
          {errorMessage}
        </p>
      )}
    </form>
  );
}
