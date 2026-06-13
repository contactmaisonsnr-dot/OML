"use client";

import { useState, useTransition } from "react";
import { deleteInviteLink } from "@/lib/actions/admin";
import type { InviteLink } from "@/generated/prisma/client";

export default function InviteRow({ invite }: { invite: InviteLink }) {
  const [pending, startTransition] = useTransition();
  const [copied, setCopied] = useState(false);

  const url = `/register/${invite.token}`;

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-oml-navy/10 bg-white px-4 py-3 flex-wrap">
      <div className="min-w-0">
        <p className="font-mono text-sm text-oml-navy truncate">{url}</p>
        <p className="text-xs text-oml-navy/50">
          {invite.email && <>Pour {invite.email} · </>}
          {invite.used ? "Utilisé" : "Disponible"}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            const fullUrl = `${window.location.origin}${url}`;
            navigator.clipboard.writeText(fullUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-oml-navy/10 text-oml-navy hover:bg-oml-navy/20 transition"
        >
          {copied ? "Copié !" : "Copier le lien"}
        </button>
        <button
          disabled={pending}
          onClick={() => startTransition(() => deleteInviteLink(invite.id))}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition disabled:opacity-40"
        >
          Supprimer
        </button>
      </div>
    </div>
  );
}
