"use client";

import PlayerAvatar from "@/components/PlayerAvatar";
import { voteMotm, closeVotingAndFinalize } from "@/lib/actions/events";

export type VoteCandidate = {
  userId: string;
  firstName: string;
  lastName: string;
  photoUrl?: string | null;
};

export default function VotingPanel({
  eventId,
  candidates,
  currentVote,
  isAdmin,
  pending,
  run,
}: {
  eventId: string;
  candidates: VoteCandidate[];
  currentVote: string | null;
  isAdmin: boolean;
  pending: boolean;
  run: (fn: () => Promise<unknown>) => void;
}) {
  return (
    <div className="rounded-2xl border border-oml-gold p-4 bg-oml-gold/5">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <h3 className="font-bold text-oml-navy">
          🏅 Votez pour l&apos;homme du match
        </h3>
        {isAdmin && (
          <button
            disabled={pending}
            onClick={() => run(() => closeVotingAndFinalize(eventId))}
            className="rounded-lg bg-oml-navy text-white px-3 py-1.5 text-xs font-semibold hover:bg-oml-navy-light transition disabled:opacity-60"
          >
            Clôturer le vote
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-3">
        {candidates.map((c) => {
          const selected = currentVote === c.userId;
          return (
            <button
              key={c.userId}
              disabled={pending}
              onClick={() => run(() => voteMotm(eventId, c.userId))}
              className={`flex flex-col items-center gap-1 rounded-xl border px-3 py-2 transition ${
                selected
                  ? "border-oml-gold bg-oml-gold/20 ring-2 ring-oml-gold"
                  : "border-oml-navy/10 bg-white hover:border-oml-gold"
              }`}
            >
              <PlayerAvatar
                photoUrl={c.photoUrl}
                firstName={c.firstName}
                lastName={c.lastName}
                size={44}
              />
              <span className="text-xs font-semibold text-oml-navy">
                {c.firstName} {c.lastName[0]}.
              </span>
            </button>
          );
        })}
      </div>
      {currentVote && (
        <p className="text-xs text-oml-navy/60 mt-3">
          Merci pour votre vote ! Vous pouvez le modifier à tout moment tant
          que le vote est ouvert.
        </p>
      )}
    </div>
  );
}
