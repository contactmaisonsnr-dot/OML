"use client";

import { useState } from "react";
import Link from "next/link";
import { markAllNotificationsRead } from "@/lib/actions/notifications";

type NotificationItem = {
  id: string;
  message: string;
  link: string | null;
  createdAt: Date;
};

export default function NotificationsBell({
  notifications,
}: {
  notifications: NotificationItem[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative flex items-center justify-center h-9 w-9 rounded-full bg-background/5 border border-border backdrop-blur-lg text-foreground/80 hover:text-primary transition"
        aria-label="Notifications"
      >
        🔔
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-oml-gold text-oml-navy text-[10px] font-bold flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 rounded-xl bg-white text-oml-navy shadow-2xl border border-black/5 overflow-hidden z-50">
          <div className="flex items-center justify-between px-4 py-2 border-b border-black/5">
            <span className="font-semibold text-sm">Notifications</span>
            {notifications.length > 0 && (
              <form action={markAllNotificationsRead}>
                <button
                  type="submit"
                  className="text-xs text-oml-blue hover:underline"
                >
                  Tout marquer lu
                </button>
              </form>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto scrollbar-thin">
            {notifications.length === 0 ? (
              <p className="px-4 py-6 text-sm text-center text-black/40">
                Aucune notification
              </p>
            ) : (
              notifications.map((n) => (
                <Link
                  key={n.id}
                  href={n.link ?? "#"}
                  onClick={() => setOpen(false)}
                  className="block px-4 py-3 text-sm border-b border-black/5 hover:bg-black/5 transition"
                >
                  {n.message}
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
