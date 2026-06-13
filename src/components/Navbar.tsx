import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logoutAction } from "@/lib/actions/auth";
import NotificationsBell from "@/components/NotificationsBell";

export default async function Navbar() {
  const user = await getCurrentUser();
  if (!user) return null;

  const notifications = await prisma.notification.findMany({
    where: { userId: user.id, read: false },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return (
    <header className="sticky top-0 z-50 bg-oml-navy text-white shadow-md">
      <nav className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-3 font-bold text-lg">
          <span className="h-9 w-9 rounded-full bg-white text-oml-navy flex items-center justify-center text-sm font-extrabold border-2 border-oml-gold">
            OML
          </span>
          <span className="hidden sm:inline">Maisons-Laffitte</span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2 text-sm">
          <Link
            href="/"
            className="px-3 py-2 rounded-lg hover:bg-white/10 transition"
          >
            Accueil
          </Link>
          <Link
            href="/profile"
            className="px-3 py-2 rounded-lg hover:bg-white/10 transition"
          >
            Profil
          </Link>
          <Link
            href="/contact"
            className="px-3 py-2 rounded-lg hover:bg-white/10 transition"
          >
            Contact
          </Link>
          {user.role === "ADMIN" && (
            <Link
              href="/admin"
              className="px-3 py-2 rounded-lg hover:bg-white/10 transition text-oml-gold font-semibold"
            >
              Admin
            </Link>
          )}

          <NotificationsBell notifications={notifications} />

          <form action={logoutAction}>
            <button
              type="submit"
              className="px-3 py-2 rounded-lg hover:bg-white/10 transition text-white/70"
            >
              Déconnexion
            </button>
          </form>
        </div>
      </nav>
    </header>
  );
}
