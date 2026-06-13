"use client";

import { useState, useTransition } from "react";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import PitchFormation, { type SlotPlayer } from "@/components/events/PitchFormation";
import InOutLists, { type ListPlayer } from "@/components/events/InOutLists";
import GuestRequestPanel, { type GuestRequestItem } from "@/components/events/GuestRequestPanel";
import VotingPanel, { type VoteCandidate } from "@/components/events/VotingPanel";
import AdminEventPanel from "@/components/events/AdminEventPanel";
import { toggleSlot, joinEvent, leaveEvent } from "@/lib/actions/events";
import { getFormationSlots } from "@/lib/formations";

type Participation = {
  id: string;
  userId: string | null;
  isGuest: boolean;
  guestFirstName: string | null;
  guestLastName: string | null;
  status: "IN" | "OUT";
  team: string | null;
  slotIndex: number | null;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    photoUrl: string | null;
    favoritePosition: string | null;
  } | null;
};

type Vote = { voterId: string; votedForId: string };

type EventData = {
  id: string;
  title: string;
  description: string | null;
  location: string;
  date: Date;
  endTime: Date;
  maxPlayers: number;
  requirePaid: boolean;
  formationA: string;
  formationB: string;
  votingOpen: boolean;
  motmFinalized: boolean;
  participations: Participation[];
  guestRequests: GuestRequestItem[];
  votes: Vote[];
};

type Member = {
  id: string;
  firstName: string;
  lastName: string;
  photoUrl: string | null;
  favoritePosition: string | null;
};

export default function EventClient({
  event,
  members,
  currentUser,
}: {
  event: EventData;
  members: Member[];
  currentUser: { id: string; role: string; firstName: string; lastName: string };
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const isAdmin = currentUser.role === "ADMIN";

  const run = (fn: () => Promise<unknown>) => {
    setError(null);
    startTransition(async () => {
      try {
        await fn();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erreur");
      }
    });
  };

  // Build pitch slots
  const buildSlots = (team: "A" | "B", formation: string): (SlotPlayer | null)[] => {
    const count = getFormationSlots(formation).length;
    const slots: (SlotPlayer | null)[] = Array(count).fill(null);
    for (const p of event.participations) {
      if (p.status !== "IN" || p.team !== team || p.slotIndex === null) continue;
      if (p.slotIndex >= count) continue;
      slots[p.slotIndex] = p.isGuest
        ? {
            userId: null,
            isGuest: true,
            firstName: p.guestFirstName ?? "Invité",
            lastName: p.guestLastName ?? "",
          }
        : {
            userId: p.user?.id ?? null,
            isGuest: false,
            firstName: p.user?.firstName ?? "",
            lastName: p.user?.lastName ?? "",
            photoUrl: p.user?.photoUrl,
          };
    }
    return slots;
  };

  const slotsA = buildSlots("A", event.formationA);
  const slotsB = buildSlots("B", event.formationB);

  // In / Out lists
  const inParticipations = event.participations.filter((p) => p.status === "IN");
  const inUserIds = new Set(
    inParticipations.filter((p) => p.userId).map((p) => p.userId)
  );

  const inPlayers: ListPlayer[] = inParticipations.map((p) => ({
    key: p.id,
    userId: p.userId,
    isGuest: p.isGuest,
    firstName: p.isGuest ? p.guestFirstName ?? "Invité" : p.user?.firstName ?? "",
    lastName: p.isGuest ? p.guestLastName ?? "" : p.user?.lastName ?? "",
    photoUrl: p.user?.photoUrl,
    team: p.team,
    favoritePosition: p.user?.favoritePosition,
  }));

  const outPlayers: ListPlayer[] = members
    .filter((m) => !inUserIds.has(m.id))
    .map((m) => ({
      key: m.id,
      userId: m.id,
      isGuest: false,
      firstName: m.firstName,
      lastName: m.lastName,
      photoUrl: m.photoUrl,
      favoritePosition: m.favoritePosition,
    }));

  const handleToggle = (team: "A" | "B", slotIndex: number) => {
    run(() => toggleSlot(event.id, team, slotIndex));
  };

  const handleDragEnd = (e: DragEndEvent) => {
    if (!e.over) return;
    if (e.over.id === "in-list") {
      run(() => joinEvent(event.id));
    } else if (e.over.id === "out-list") {
      run(() => leaveEvent(event.id));
    }
  };

  // Voting
  const candidates: VoteCandidate[] = inParticipations
    .filter((p) => !p.isGuest && p.user)
    .map((p) => ({
      userId: p.user!.id,
      firstName: p.user!.firstName,
      lastName: p.user!.lastName,
      photoUrl: p.user!.photoUrl,
    }));
  const myVote = event.votes.find((v) => v.voterId === currentUser.id)?.votedForId ?? null;

  return (
    <div className="max-w-6xl mx-auto w-full px-4 py-8 space-y-8">
      <div className="rounded-2xl bg-oml-navy text-white px-6 py-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold">{event.title}</h1>
        {event.description && (
          <p className="text-white/70 mt-1">{event.description}</p>
        )}
        <div className="flex flex-wrap gap-4 mt-3 text-sm text-white/80">
          <span>📍 {event.location}</span>
          <span>
            🗓{" "}
            {new Date(event.date).toLocaleString("fr-FR", {
              weekday: "long",
              day: "numeric",
              month: "long",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          <span>
            ⏱ Fin à{" "}
            {new Date(event.endTime).toLocaleTimeString("fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          <span>👥 Max {event.maxPlayers} joueurs</span>
          {event.requirePaid && <span>💳 Cotisation requise</span>}
        </div>
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3">
          {error}
        </p>
      )}

      {event.votingOpen && (
        <VotingPanel
          eventId={event.id}
          candidates={candidates}
          currentVote={myVote}
          isAdmin={isAdmin}
          pending={pending}
          run={run}
        />
      )}

      <DndContext id="event-dnd" onDragEnd={handleDragEnd}>
        <div className="grid gap-6 md:grid-cols-2">
          <PitchFormation
            team="A"
            formation={event.formationA}
            jerseyColor="navy"
            slots={slotsA}
            currentUserId={currentUser.id}
            onToggle={handleToggle}
            pending={pending}
          />
          <PitchFormation
            team="B"
            formation={event.formationB}
            jerseyColor="white"
            slots={slotsB}
            currentUserId={currentUser.id}
            onToggle={handleToggle}
            pending={pending}
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            disabled={pending}
            onClick={() => run(() => joinEvent(event.id))}
            className="rounded-lg bg-green-600 text-white px-5 py-2.5 font-semibold hover:bg-green-700 transition disabled:opacity-60"
          >
            Je viens (IN)
          </button>
          <button
            disabled={pending}
            onClick={() => run(() => leaveEvent(event.id))}
            className="rounded-lg bg-oml-navy/10 text-oml-navy px-5 py-2.5 font-semibold hover:bg-oml-navy/20 transition disabled:opacity-60"
          >
            Je ne viens pas (OUT)
          </button>
        </div>

        <InOutLists
          inPlayers={inPlayers}
          outPlayers={outPlayers}
          currentUserId={currentUser.id}
        />
      </DndContext>

      <GuestRequestPanel
        eventId={event.id}
        requests={event.guestRequests}
        isAdmin={isAdmin}
      />

      {isAdmin && (
        <AdminEventPanel
          eventId={event.id}
          event={{
            title: event.title,
            description: event.description,
            location: event.location,
            date: event.date,
            endTime: event.endTime,
            maxPlayers: event.maxPlayers,
            requirePaid: event.requirePaid,
            formationA: event.formationA,
            formationB: event.formationB,
          }}
        />
      )}
    </div>
  );
}
