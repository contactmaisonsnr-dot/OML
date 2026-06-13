"use client";

import { useTransition } from "react";
import PlayerAvatar from "@/components/PlayerAvatar";
import { toggleMembershipPaid, toggleUserRole, deleteUser } from "@/lib/actions/admin";
import type { User } from "@/generated/prisma/client";

export default function MemberRow({
  member,
  isSelf,
}: {
  member: User;
  isSelf: boolean;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-oml-navy/10 bg-white px-4 py-3 flex-wrap">
      <div className="flex items-center gap-3 min-w-0">
        <PlayerAvatar
          photoUrl={member.photoUrl}
          firstName={member.firstName}
          lastName={member.lastName}
          size={40}
        />
        <div className="min-w-0">
          <p className="font-semibold text-oml-navy truncate">
            {member.firstName} {member.lastName}{" "}
            <span className="text-xs text-oml-navy/40">
              #{String(member.memberNumber).padStart(4, "0")}
            </span>
          </p>
          <p className="text-xs text-oml-navy/50 truncate">
            {member.email} · @{member.username}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <button
          disabled={pending}
          onClick={() =>
            startTransition(() => toggleMembershipPaid(member.id, !member.membershipPaid))
          }
          className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition ${
            member.membershipPaid
              ? "bg-green-100 text-green-700 hover:bg-green-200"
              : "bg-red-100 text-red-700 hover:bg-red-200"
          }`}
        >
          {member.membershipPaid ? "Cotisation réglée" : "Cotisation non réglée"}
        </button>

        <button
          disabled={pending || isSelf}
          onClick={() =>
            startTransition(() =>
              toggleUserRole(member.id, member.role === "ADMIN" ? "MEMBER" : "ADMIN")
            )
          }
          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-oml-navy/10 text-oml-navy hover:bg-oml-navy/20 transition disabled:opacity-40"
        >
          {member.role === "ADMIN" ? "Admin" : "Adhérent"}
        </button>

        <button
          disabled={pending || isSelf}
          onClick={() => {
            if (confirm(`Supprimer le compte de ${member.firstName} ${member.lastName} ?`)) {
              startTransition(() => deleteUser(member.id));
            }
          }}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition disabled:opacity-40"
        >
          Supprimer
        </button>
      </div>
    </div>
  );
}
