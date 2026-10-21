"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SettingsForm({
  initialSettings,
}: {
  initialSettings: Record<string, string>;
}) {
  const router = useRouter();
  const [settings, setSettings] = useState(initialSettings);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "error" | "success" } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const res = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });

    setSaving(false);

    if (!res.ok) {
      setMessage({ text: "Failed to save settings.", type: "error" });
      return;
    }

    setMessage({ text: "Settings saved successfully.", type: "success" });
    router.refresh();
  }

  function handleChange(key: string, value: string) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white border border-gray-200 rounded-lg p-6">

      <h2 className="font-medium text-lg">Social Media Links</h2>
      <div className="space-y-4 border-l-2 border-gray-100 pl-4">
        <div>
          <label className="block text-sm font-medium mb-1">WhatsApp Group / Contact URL</label>
          <input
            type="url"
            value={settings.whatsappUrl}
            onChange={(e) => handleChange("whatsappUrl", e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm"
            placeholder="https://chat.whatsapp.com/..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Telegram Channel URL</label>
          <input
            type="url"
            value={settings.telegramUrl}
            onChange={(e) => handleChange("telegramUrl", e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm"
            placeholder="https://t.me/..."
          />
        </div>
      </div>

      {message && (
        <p className={`text-sm ${message.type === "error" ? "text-red-600" : "text-green-600"}`}>
          {message.text}
        </p>
      )}

      <button
        type="submit"
        disabled={saving}
        className="bg-black text-white rounded-md px-4 py-2 text-sm hover:opacity-90 disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save Settings"}
      </button>
    </form>
  );
}