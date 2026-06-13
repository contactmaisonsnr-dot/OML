import { prisma } from "@/lib/prisma";
import { generateInviteLink } from "@/lib/actions/admin";
import InviteRow from "./InviteRow";

export default async function AdminInvitesPage() {
  const invites = await prisma.inviteLink.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <form action={generateInviteLink} className="flex flex-wrap gap-2 items-end max-w-xl">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-semibold text-oml-navy mb-1">
            Email (optionnel)
          </label>
          <input
            name="email"
            type="email"
            placeholder="prenom.nom@email.fr"
            className="w-full rounded-lg border border-oml-navy/20 px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          className="rounded-lg bg-oml-navy text-white px-5 py-2.5 font-semibold hover:bg-oml-navy-light transition"
        >
          Générer un lien
        </button>
      </form>

      <div className="space-y-2">
        {invites.map((invite) => (
          <InviteRow key={invite.id} invite={invite} />
        ))}
        {invites.length === 0 && (
          <p className="text-sm text-oml-navy/40">Aucune invitation.</p>
        )}
      </div>
    </div>
  );
}
