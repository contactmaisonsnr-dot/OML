"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser, requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { getFormationSlots } from "@/lib/formations";

async function getEventOrThrow(eventId: string) {
  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) throw new Error("Événement introuvable");
  return event;
}

async function countIn(eventId: string, excludeParticipationId?: string) {
  return prisma.participation.count({
    where: {
      eventId,
      status: "IN",
      ...(excludeParticipationId ? { id: { not: excludeParticipationId } } : {}),
    },
  });
}

function firstFreeSlot(
  formation: string,
  taken: number[]
): number | null {
  const slots = getFormationSlots(formation);
  for (let i = 0; i < slots.length; i++) {
    if (!taken.includes(i)) return i;
  }
  return null;
}

async function assertEligible(eventId: string, userId: string) {
  const event = await getEventOrThrow(eventId);
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("Utilisateur introuvable");
  if (event.requirePaid && !user.membershipPaid) {
    throw new Error(
      "Vous devez avoir réglé votre cotisation pour participer à cet événement."
    );
  }
  return { event, user };
}

/** Toggle a formation slot for the current user (click on a position). */
export async function toggleSlot(
  eventId: string,
  team: "A" | "B",
  slotIndex: number
) {
  const user = await requireUser();
  const { event } = await assertEligible(eventId, user.id);

  const existing = await prisma.participation.findUnique({
    where: { eventId_userId: { eventId, userId: user.id } },
  });

  // If user already occupies this exact slot -> unassign (set OUT)
  if (
    existing &&
    existing.status === "IN" &&
    existing.team === team &&
    existing.slotIndex === slotIndex
  ) {
    await prisma.participation.update({
      where: { id: existing.id },
      data: { status: "OUT", team: null, slotIndex: null },
    });
    revalidatePath(`/events/${eventId}`);
    return;
  }

  // Check the slot isn't already taken by someone else
  const occupied = await prisma.participation.findFirst({
    where: { eventId, team, slotIndex, status: "IN" },
  });
  if (occupied) {
    throw new Error("Ce poste est déjà occupé.");
  }

  // Check max players
  const currentlyIn = await countIn(eventId, existing?.id);
  if (existing?.status !== "IN" && currentlyIn >= event.maxPlayers) {
    throw new Error("Le nombre maximum de joueurs est atteint.");
  }

  await prisma.participation.upsert({
    where: { eventId_userId: { eventId, userId: user.id } },
    update: { status: "IN", team, slotIndex },
    create: { eventId, userId: user.id, status: "IN", team, slotIndex },
  });

  revalidatePath(`/events/${eventId}`);
}

/** "In" button: auto-assign to the team with fewest players. */
export async function joinEvent(eventId: string) {
  const user = await requireUser();
  const { event } = await assertEligible(eventId, user.id);

  const existing = await prisma.participation.findUnique({
    where: { eventId_userId: { eventId, userId: user.id } },
  });

  if (existing?.status === "IN") return;

  const currentlyIn = await countIn(eventId, existing?.id);
  if (currentlyIn >= event.maxPlayers) {
    throw new Error("Le nombre maximum de joueurs est atteint.");
  }

  const teamAParticipations = await prisma.participation.findMany({
    where: { eventId, team: "A", status: "IN" },
    select: { slotIndex: true },
  });
  const teamBParticipations = await prisma.participation.findMany({
    where: { eventId, team: "B", status: "IN" },
    select: { slotIndex: true },
  });

  const teamASlots = getFormationSlots(event.formationA).length;
  const teamBSlots = getFormationSlots(event.formationB).length;

  let team: "A" | "B";
  if (teamAParticipations.length < teamASlots && (teamAParticipations.length <= teamBParticipations.length || teamBParticipations.length >= teamBSlots)) {
    team = "A";
  } else if (teamBParticipations.length < teamBSlots) {
    team = "B";
  } else {
    throw new Error("Les deux équipes sont déjà complètes.");
  }

  const taken = (team === "A" ? teamAParticipations : teamBParticipations)
    .map((p) => p.slotIndex)
    .filter((s): s is number => s !== null);

  const formation = team === "A" ? event.formationA : event.formationB;
  const slot = firstFreeSlot(formation, taken);
  if (slot === null) {
    throw new Error("Aucun poste disponible dans cette équipe.");
  }

  await prisma.participation.upsert({
    where: { eventId_userId: { eventId, userId: user.id } },
    update: { status: "IN", team, slotIndex: slot },
    create: { eventId, userId: user.id, status: "IN", team, slotIndex: slot },
  });

  revalidatePath(`/events/${eventId}`);
}

/** "Out" button or drag to "out" list. */
export async function leaveEvent(eventId: string) {
  const user = await requireUser();
  await getEventOrThrow(eventId);

  await prisma.participation.upsert({
    where: { eventId_userId: { eventId, userId: user.id } },
    update: { status: "OUT", team: null, slotIndex: null },
    create: { eventId, userId: user.id, status: "OUT" },
  });

  revalidatePath(`/events/${eventId}`);
}

const guestRequestSchema = z.object({
  eventId: z.string().min(1),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

export async function requestGuest(formData: FormData) {
  const user = await requireUser();
  const parsed = guestRequestSchema.safeParse({
    eventId: formData.get("eventId"),
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
  });
  if (!parsed.success) throw new Error("Champs invalides");

  await prisma.guestRequest.create({
    data: {
      eventId: parsed.data.eventId,
      requestedById: user.id,
      guestFirstName: parsed.data.firstName,
      guestLastName: parsed.data.lastName,
    },
  });

  revalidatePath(`/events/${parsed.data.eventId}`);
}

export async function reviewGuestRequest(
  guestRequestId: string,
  accept: boolean
) {
  await requireAdmin();
  const request = await prisma.guestRequest.findUnique({
    where: { id: guestRequestId },
  });
  if (!request) throw new Error("Demande introuvable");

  await prisma.guestRequest.update({
    where: { id: guestRequestId },
    data: { status: accept ? "ACCEPTED" : "REJECTED" },
  });

  if (accept) {
    await prisma.participation.create({
      data: {
        eventId: request.eventId,
        isGuest: true,
        guestFirstName: request.guestFirstName,
        guestLastName: request.guestLastName,
        status: "IN",
      },
    });
  }

  revalidatePath(`/events/${request.eventId}`);
}

const eventSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  location: z.string().min(1),
  date: z.string().min(1),
  endTime: z.string().min(1),
  maxPlayers: z.coerce.number().int().min(2).max(40),
  requirePaid: z.coerce.boolean(),
  formationA: z.string().min(1),
  formationB: z.string().min(1),
});

export async function createEvent(formData: FormData) {
  await requireAdmin();
  const parsed = eventSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    location: formData.get("location"),
    date: formData.get("date"),
    endTime: formData.get("endTime"),
    maxPlayers: formData.get("maxPlayers"),
    requirePaid: formData.get("requirePaid") === "on",
    formationA: formData.get("formationA"),
    formationB: formData.get("formationB"),
  });
  if (!parsed.success) throw new Error("Champs invalides");

  const event = await prisma.event.create({
    data: {
      ...parsed.data,
      date: new Date(parsed.data.date),
      endTime: new Date(parsed.data.endTime),
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  return event.id;
}

export async function updateEvent(eventId: string, formData: FormData) {
  await requireAdmin();
  const parsed = eventSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    location: formData.get("location"),
    date: formData.get("date"),
    endTime: formData.get("endTime"),
    maxPlayers: formData.get("maxPlayers"),
    requirePaid: formData.get("requirePaid") === "on",
    formationA: formData.get("formationA"),
    formationB: formData.get("formationB"),
  });
  if (!parsed.success) throw new Error("Champs invalides");

  await prisma.event.update({
    where: { id: eventId },
    data: {
      ...parsed.data,
      date: new Date(parsed.data.date),
      endTime: new Date(parsed.data.endTime),
    },
  });

  revalidatePath("/");
  revalidatePath(`/events/${eventId}`);
  revalidatePath("/admin");
}

export async function deleteEvent(eventId: string) {
  await requireAdmin();
  await prisma.event.delete({ where: { id: eventId } });
  revalidatePath("/");
  revalidatePath("/admin");
}

/** Opens MOTM voting and notifies all "in" participants. Called lazily once the event has ended. */
export async function openVotingIfNeeded(eventId: string) {
  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) return;
  if (event.votingOpen || event.motmFinalized) return;
  if (event.endTime > new Date()) return;

  const participants = await prisma.participation.findMany({
    where: { eventId, status: "IN", isGuest: false, userId: { not: null } },
  });

  if (participants.length === 0) return;

  await prisma.event.update({
    where: { id: eventId },
    data: { votingOpen: true },
  });

  await prisma.notification.createMany({
    data: participants
      .filter((p) => p.userId)
      .map((p) => ({
        userId: p.userId as string,
        message: `Votez pour l'homme du match de "${event.title}" !`,
        link: `/events/${eventId}`,
      })),
  });
}

export async function voteMotm(eventId: string, votedForId: string) {
  const user = await requireUser();
  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event || !event.votingOpen) throw new Error("Le vote n'est pas ouvert.");

  await prisma.vote.upsert({
    where: { eventId_voterId: { eventId, voterId: user.id } },
    update: { votedForId },
    create: { eventId, voterId: user.id, votedForId },
  });

  revalidatePath(`/events/${eventId}`);
}

export async function closeVotingAndFinalize(eventId: string) {
  await requireAdmin();
  const votes = await prisma.vote.groupBy({
    by: ["votedForId"],
    where: { eventId },
    _count: { votedForId: true },
    orderBy: { _count: { votedForId: "desc" } },
  });

  if (votes.length === 0) {
    throw new Error("Aucun vote enregistré.");
  }

  const winnerId = votes[0].votedForId;

  await prisma.event.update({
    where: { id: eventId },
    data: { votingOpen: false, motmFinalized: true },
  });

  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: { motmUserId: winnerId, motmEventId: eventId },
    create: { id: "singleton", motmUserId: winnerId, motmEventId: eventId },
  });

  revalidatePath("/");
  revalidatePath(`/events/${eventId}`);
}
