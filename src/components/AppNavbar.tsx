"use client";

import Link from "next/link";
import { Home, User, Mail, ShieldCheck, LogOut } from "lucide-react";
import { NavBar } from "@/components/ui/tubelight-navbar";
import NotificationsBell from "@/components/NotificationsBell";
import { logoutAction } from "@/lib/actions/auth";

type NotificationItem = {
  id: string;
  message: string;
  link: string | null;
  createdAt: Date;
};

export default function AppNavbar({
  isAdmin,
  notifications,
}: {
  isAdmin: boolean;
  notifications: NotificationItem[];
}) {
  const navItems = [
    { name: "Accueil", url: "/", icon: Home },
    { name: "Profil", url: "/profile", icon: User },
    { name: "Contact", url: "/contact", icon: Mail },
    ...(isAdmin ? [{ name: "Admin", url: "/admin", icon: ShieldCheck }] : []),
  ];

  return (
    <>
      <div className="fixed top-0 left-0 z-50 p-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-oml-navy">
          <span className="h-9 w-9 rounded-full bg-oml-navy text-white flex items-center justify-center text-sm font-extrabold border-2 border-oml-gold">
            OML
          </span>
          <span className="hidden sm:inline drop-shadow-sm">Maisons-Laffitte</span>
        </Link>
      </div>

      <div className="fixed top-4 right-4 z-50 flex items-center gap-1">
        <NotificationsBell notifications={notifications} />
        <form action={logoutAction}>
          <button
            type="submit"
            aria-label="Déconnexion"
            className="flex items-center justify-center h-9 w-9 rounded-full bg-background/5 border border-border backdrop-blur-lg text-foreground/80 hover:text-primary transition"
          >
            <LogOut size={16} strokeWidth={2.5} />
          </button>
        </form>
      </div>

      <NavBar items={navItems} />
    </>
  );
}
