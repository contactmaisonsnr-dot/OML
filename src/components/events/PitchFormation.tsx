"use client";

import { getFormationSlots } from "@/lib/formations";
import PlayerAvatar from "@/components/PlayerAvatar";

export type SlotPlayer = {
  userId: string | null;
  isGuest: boolean;
  firstName: string;
  lastName: string;
  photoUrl?: string | null;
};

export default function PitchFormation({
  team,
  formation,
  jerseyColor,
  slots,
  currentUserId,
  onToggle,
  pending,
}: {
  team: "A" | "B";
  formation: string;
  jerseyColor: "navy" | "white";
  slots: (SlotPlayer | null)[];
  currentUserId: string;
  onToggle: (team: "A" | "B", slotIndex: number) => void;
  pending: boolean;
}) {
  const positions = getFormationSlots(formation);

  return (
    <div className="rounded-2xl overflow-hidden border border-oml-navy/10 shadow-lg">
      <div
        className={`px-4 py-2 font-bold text-sm uppercase tracking-wide ${
          jerseyColor === "navy"
            ? "bg-oml-navy text-white"
            : "bg-white text-oml-navy border-b border-oml-navy/10"
        }`}
      >
        Équipe {team} <span className="opacity-60">— {formation}</span>
      </div>
      <div className="relative bg-pitch aspect-[3/4] w-full">
        <div className="absolute inset-x-0 top-0 h-1 bg-white/70" />
        <div className="absolute top-4 left-1/2 -translate-x-1/2 h-20 w-20 rounded-full border-2 border-white/50" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-14 border-2 border-t-0 border-white/50" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-14 border-2 border-b-0 border-white/50" />
        <div className="absolute inset-x-0 bottom-1/2 h-px bg-white/40" />

        {positions.map((pos, i) => {
          const player = slots[i];
          const isMe = player?.userId === currentUserId;
          return (
            <button
              key={i}
              type="button"
              disabled={pending || (!!player && !isMe)}
              onClick={() => onToggle(team, i)}
              className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 group ${
                !player || isMe ? "cursor-pointer" : "cursor-default"
              }`}
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              title={
                player
                  ? `${player.firstName} ${player.lastName}`
                  : `Poste libre (${pos.label})`
              }
            >
              <div
                className={`rounded-full transition ${
                  isMe ? "ring-4 ring-oml-gold" : ""
                } ${!player ? "group-hover:ring-2 group-hover:ring-white/80" : ""}`}
              >
                {player ? (
                  <PlayerAvatar
                    photoUrl={player.photoUrl}
                    firstName={player.firstName}
                    lastName={player.lastName}
                    size={48}
                  />
                ) : (
                  <div
                    className={`h-12 w-12 rounded-full border-2 border-dashed border-white/70 flex items-center justify-center text-white/80 text-[10px] font-bold bg-black/10 ${
                      jerseyColor === "navy" ? "" : ""
                    }`}
                  >
                    {pos.label}
                  </div>
                )}
              </div>
              {player && (
                <span className="text-[10px] font-semibold text-white drop-shadow bg-black/30 rounded px-1 max-w-[64px] truncate">
                  {player.firstName} {player.lastName[0]}.
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
