import { prisma } from "@/lib/db";
import SettingsForm from "./SettingsForm";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const settingsRecords = await prisma.siteSetting.findMany();

  // Convert array to key-value object
  const settings = settingsRecords.reduce((acc, s) => {
    acc[s.key] = s.value;
    return acc;
  }, {} as Record<string, string>);

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-semibold mb-6">Site Settings</h1>
      <p className="text-gray-600 mb-8">
        Manage global site settings, including social media links which appear in the footer.
      </p>

      <SettingsForm
        initialSettings={{
          whatsappUrl: settings["whatsappUrl"] ?? "",
          telegramUrl: settings["telegramUrl"] ?? "",
        }}
      />
    </div>
  );
}