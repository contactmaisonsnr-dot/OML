import PlayerAvatar from "@/components/PlayerAvatar";
import type { User } from "@/generated/prisma/client";

export default function MembershipCard({ user }: { user: User }) {
  return (
    <div className="rounded-2xl border border-oml-navy/10 p-5 bg-white">
      <h2 className="font-bold text-oml-navy mb-4">Carte de membre</h2>

      <div className="rounded-2xl bg-gradient-to-br from-oml-navy to-oml-navy-light text-white p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-oml-gold/20" />
        <div className="absolute -right-4 bottom-0 h-24 w-24 rounded-full bg-white/5" />

        <div className="flex items-center justify-between relative z-10">
          <div>
            <p className="text-xs uppercase tracking-widest text-white/60">
              Olympique de
            </p>
            <p className="text-lg font-extrabold tracking-wide">
              Maisons-Laffitte
            </p>
          </div>
          <div className="h-10 w-10 rounded-full bg-white text-oml-navy flex items-center justify-center text-xs font-extrabold border-2 border-oml-gold">
            OML
          </div>
        </div>

        <div className="flex items-center gap-4 mt-6 relative z-10">
          <PlayerAvatar
            photoUrl={user.photoUrl}
            firstName={user.firstName}
            lastName={user.lastName}
            size={64}
            ring
          />
          <div>
            <p className="text-xl font-bold">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-white/60 text-sm">
              {user.role === "ADMIN" ? "Administrateur" : "Adhérent"}
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between text-sm relative z-10">
          <div>
            <p className="text-white/50 text-xs uppercase">N° de membre</p>
            <p className="font-mono font-bold text-lg">
              #{String(user.memberNumber).padStart(4, "0")}
            </p>
          </div>
          <div className="text-right">
            <p className="text-white/50 text-xs uppercase">Cotisation</p>
            <p
              className={`font-bold ${
                user.membershipPaid ? "text-green-400" : "text-red-400"
              }`}
            >
              {user.membershipPaid ? "Réglée" : "Non réglée"}
            </p>
          </div>
        </div>

        {user.favoritePosition && (
          <div className="mt-4 text-sm text-white/60 relative z-10">
            Poste favori : <span className="font-semibold text-white">{user.favoritePosition}</span>
          </div>
        )}
      </div>
    </div>
  );
}
