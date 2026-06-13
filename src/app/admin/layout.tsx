import Link from "next/link";
import { requireAdmin } from "@/lib/auth";

const TABS = [
  { href: "/admin/settings", label: "Site" },
  { href: "/admin/events", label: "Événements" },
  { href: "/admin/members", label: "Membres" },
  { href: "/admin/invites", label: "Invitations" },
  { href: "/admin/requests", label: "Demandes" },
  { href: "/admin/messages", label: "Messages" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="max-w-6xl mx-auto w-full px-4 py-8">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-oml-navy mb-6">
        Administration
      </h1>
      <div className="flex flex-wrap gap-2 mb-8 border-b border-oml-navy/10 pb-2">
        {TABS.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className="rounded-lg px-4 py-2 text-sm font-semibold text-oml-navy hover:bg-oml-navy/5 transition"
          >
            {tab.label}
          </Link>
        ))}
      </div>
      {children}
    </div>
  );
}
