import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { notFound } from "next/navigation";
import { openVotingIfNeeded } from "@/lib/actions/events";
import EventClient from "./EventClient";

export default async function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) notFound();

  await openVotingIfNeeded(id);

  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      participations: {
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              photoUrl: true,
              favoritePosition: true,
            },
          },
        },
      },
      guestRequests: {
        orderBy: { createdAt: "desc" },
        include: {
          requestedBy: {
            select: { firstName: true, lastName: true },
          },
        },
      },
      votes: true,
    },
  });

  if (!event) notFound();

  const members = await prisma.user.findMany({
    orderBy: [{ firstName: "asc" }, { lastName: "asc" }],
    select: {
      id: true,
      firstName: true,
      lastName: true,
      photoUrl: true,
      favoritePosition: true,
    },
  });

  return (
    <EventClient
      event={event}
      members={members}
      currentUser={{
        id: user.id,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      }}
    />
  );
}
