"use client";

import { useTransition } from "react";
import { reviewMembershipRequest } from "@/lib/actions/membership";

export default function RequestRow({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-2">
      <button
        disabled={pending}
        onClick={() => startTransition(() => reviewMembershipRequest(id, true))}
        className="rounded bg-green-600 text-white text-xs font-semibold px-2 py-1 hover:bg-green-700 disabled:opacity-40"
      >
        Accepter et générer un lien
      </button>
      <button
        disabled={pending}
        onClick={() => startTransition(() => reviewMembershipRequest(id, false))}
        className="rounded bg-red-500 text-white text-xs font-semibold px-2 py-1 hover:bg-red-600 disabled:opacity-40"
      >
        Refuser
      </button>
    </div>
  );
}
