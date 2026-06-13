"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateEvent, deleteEvent } from "@/lib/actions/events";
import { FORMATION_NAMES } from "@/lib/formations";

function toLocalInput(date: Date) {
  const d = new Date(date);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

export default function AdminEventPanel({
  eventId,
  event,
}: {
  eventId: string;
  event: {
    title: string;
    description: string | null;
    location: string;
    date: Date;
    endTime: Date;
    maxPlayers: number;
    requirePaid: boolean;
    formationA: string;
    formationB: string;
  };
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  return (
    <div className="rounded-2xl border border-oml-navy/10 bg-white">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 font-bold text-oml-navy"
      >
        Administration de l&apos;événement
        <span>{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <form
          action={(formData) => {
            setError(null);
            startTransition(async () => {
              try {
                await updateEvent(eventId, formData);
              } catch (e) {
                setError(e instanceof Error ? e.message : "Erreur");
              }
            });
          }}
          className="px-4 pb-4 space-y-3"
        >
          <div>
            <label className="block text-sm font-semibold text-oml-navy mb-1">
              Titre
            </label>
            <input
              name="title"
              defaultValue={event.title}
              required
              className="w-full rounded-lg border border-oml-navy/20 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-oml-navy mb-1">
              Description
            </label>
            <textarea
              name="description"
              defaultValue={event.description ?? ""}
              rows={2}
              className="w-full rounded-lg border border-oml-navy/20 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-oml-navy mb-1">
              Adresse
            </label>
            <input
              name="location"
              defaultValue={event.location}
              required
              className="w-full rounded-lg border border-oml-navy/20 px-3 py-2 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-oml-navy mb-1">
                Date et heure de début
              </label>
              <input
                type="datetime-local"
                name="date"
                defaultValue={toLocalInput(event.date)}
                required
                className="w-full rounded-lg border border-oml-navy/20 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-oml-navy mb-1">
                Heure de fin
              </label>
              <input
                type="datetime-local"
                name="endTime"
                defaultValue={toLocalInput(event.endTime)}
                required
                className="w-full rounded-lg border border-oml-navy/20 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-oml-navy mb-1">
                Formation équipe A
              </label>
              <select
                name="formationA"
                defaultValue={event.formationA}
                className="w-full rounded-lg border border-oml-navy/20 px-3 py-2 text-sm"
              >
                {FORMATION_NAMES.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-oml-navy mb-1">
                Formation équipe B
              </label>
              <select
                name="formationB"
                defaultValue={event.formationB}
                className="w-full rounded-lg border border-oml-navy/20 px-3 py-2 text-sm"
              >
                {FORMATION_NAMES.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-oml-navy mb-1">
              Nombre maximum de joueurs
            </label>
            <input
              type="number"
              name="maxPlayers"
              min={2}
              max={40}
              defaultValue={event.maxPlayers}
              required
              className="w-full rounded-lg border border-oml-navy/20 px-3 py-2 text-sm"
            />
          </div>

          <label className="flex items-center gap-2 text-sm font-semibold text-oml-navy">
            <input
              type="checkbox"
              name="requirePaid"
              defaultChecked={event.requirePaid}
            />
            Réservé aux adhérents ayant payé leur cotisation
          </label>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={pending}
              className="rounded-lg bg-oml-navy text-white px-4 py-2 text-sm font-semibold hover:bg-oml-navy-light transition disabled:opacity-60"
            >
              Enregistrer
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={() => {
                if (confirm("Supprimer définitivement cet événement ?")) {
                  startTransition(async () => {
                    await deleteEvent(eventId);
                    router.push("/");
                  });
                }
              }}
              className="rounded-lg bg-red-500 text-white px-4 py-2 text-sm font-semibold hover:bg-red-600 transition disabled:opacity-60"
            >
              Supprimer l&apos;événement
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
