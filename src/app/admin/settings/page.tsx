import { prisma } from "@/lib/prisma";
import SettingsForm from "./SettingsForm";

export default async function AdminSettingsPage() {
  const settings = await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });

  return (
    <div className="max-w-2xl">
      <SettingsForm settings={settings} />
    </div>
  );
}
