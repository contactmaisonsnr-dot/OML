import { prisma } from "@/lib/prisma";
import Link from "next/link";
import CreateEventForm from "./CreateEventForm";

export default async function AdminEventsPage() {
  const events = await prisma.event.findMany({
    orderBy: { date: "desc" },
  });

  return (
    <div className="space-y-8">
      <div className="max-w-2xl">
        <h2 className="font-bold text-oml-navy mb-3">
          Créer un nouvel événement
        </h2>
        <CreateEventForm />
      </div>

      <div>
        <h2 className="font-bold text-oml-navy mb-3">
          Tous les événements
        </h2>
        <div className="space-y-2">
          {events.map((e) => (
            <Link
              key={e.id}
              href={`/events/${e.id}`}
              className="flex items-center justify-between rounded-xl border border-oml-navy/10 bg-white px-4 py-3 hover:border-oml-gold transition"
            >
              <div>
                <p className="font-semibold text-oml-navy">{e.title}</p>
                <p className="text-sm text-oml-navy/50">
                  {e.location} —{" "}
                  {new Date(e.date).toLocaleString("fr-FR", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </div>
              <span className="text-oml-navy/40 text-sm">Gérer →</span>
            </Link>
          ))}
          {events.length === 0 && (
            <p className="text-sm text-oml-navy/40">Aucun événement.</p>
          )}
        </div>
      </div>
    </div>
  );
}
