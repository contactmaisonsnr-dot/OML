"use client";

import { useTransition } from "react";
import { deleteContactMessage } from "@/lib/actions/contact";
import type { ContactMessage } from "@/generated/prisma/client";

export default function MessageRow({ message }: { message: ContactMessage }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="rounded-xl border border-oml-navy/10 bg-white px-4 py-3">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <p className="font-semibold text-oml-navy">
            {message.subject}{" "}
            <span className="text-oml-navy/40 text-sm">
              — {message.name} ({message.email})
            </span>
          </p>
          <p className="text-xs text-oml-navy/40">
            {new Date(message.createdAt).toLocaleString("fr-FR")}
          </p>
        </div>
        <button
          disabled={pending}
          onClick={() => startTransition(() => deleteContactMessage(message.id))}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition disabled:opacity-40"
        >
          Supprimer
        </button>
      </div>
      <p className="text-sm text-oml-navy/70 mt-2">{message.message}</p>
    </div>
  );
}
