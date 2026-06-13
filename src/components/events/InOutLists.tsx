"use client";

import { useDraggable, useDroppable } from "@dnd-kit/core";
import PlayerAvatar from "@/components/PlayerAvatar";

export type ListPlayer = {
  key: string;
  userId: string | null;
  isGuest: boolean;
  firstName: string;
  lastName: string;
  photoUrl?: string | null;
  team?: string | null;
  favoritePosition?: string | null;
};

function PlayerCard({
  player,
  draggable,
}: {
  player: ListPlayer;
  draggable: boolean;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: "me",
    disabled: !draggable,
  });

  return (
    <div
      ref={draggable ? setNodeRef : undefined}
      {...(draggable ? { ...attributes, ...listeners } : {})}
      className={`flex items-center gap-3 rounded-xl border px-3 py-2 bg-white transition ${
        draggable
          ? "cursor-grab active:cursor-grabbing border-oml-gold shadow-md"
          : "border-oml-navy/10"
      } ${isDragging ? "opacity-30" : ""}`}
    >
      <PlayerAvatar
        photoUrl={player.photoUrl}
        firstName={player.firstName}
        lastName={player.lastName}
        size={36}
      />
      <div className="min-w-0">
        <p className="text-sm font-semibold text-oml-navy truncate">
          {player.firstName} {player.lastName}
          {player.isGuest && (
            <span className="ml-1 text-[10px] uppercase text-oml-gold font-bold">
              invité
            </span>
          )}
        </p>
        <p className="text-xs text-oml-navy/50">
          {player.team ? `Équipe ${player.team}` : player.favoritePosition || ""}
        </p>
      </div>
    </div>
  );
}

export default function InOutLists({
  inPlayers,
  outPlayers,
  currentUserId,
}: {
  inPlayers: ListPlayer[];
  outPlayers: ListPlayer[];
  currentUserId: string;
}) {
  const { setNodeRef: setInRef, isOver: isOverIn } = useDroppable({ id: "in-list" });
  const { setNodeRef: setOutRef, isOver: isOverOut } = useDroppable({ id: "out-list" });

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div
        ref={setInRef}
        className={`rounded-2xl border p-4 min-h-[160px] transition ${
          isOverIn
            ? "border-oml-gold bg-oml-gold/10"
            : "border-oml-navy/10 bg-oml-navy/[0.02]"
        }`}
      >
        <h3 className="font-bold text-oml-navy mb-3">
          Joueurs présents ({inPlayers.length})
        </h3>
        <div className="space-y-2">
          {inPlayers.length === 0 && (
            <p className="text-sm text-oml-navy/40">Personne pour le moment.</p>
          )}
          {inPlayers.map((p) => (
            <PlayerCard
              key={p.key}
              player={p}
              draggable={p.userId === currentUserId}
            />
          ))}
        </div>
      </div>

      <div
        ref={setOutRef}
        className={`rounded-2xl border p-4 min-h-[160px] transition ${
          isOverOut
            ? "border-oml-gold bg-oml-gold/10"
            : "border-oml-navy/10 bg-oml-navy/[0.02]"
        }`}
      >
        <h3 className="font-bold text-oml-navy mb-3">
          Joueurs absents ({outPlayers.length})
        </h3>
        <div className="space-y-2">
          {outPlayers.length === 0 && (
            <p className="text-sm text-oml-navy/40">Personne pour le moment.</p>
          )}
          {outPlayers.map((p) => (
            <PlayerCard
              key={p.key}
              player={p}
              draggable={p.userId === currentUserId}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
