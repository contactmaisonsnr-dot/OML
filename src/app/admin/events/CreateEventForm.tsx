"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createEvent } from "@/lib/actions/events";
import { FORMATION_NAMES } from "@/lib/formations";

export default function CreateEventForm() {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  return (
    <form
      action={(formData) => {
        setError(null);
        startTransition(async () => {
          try {
            const id = await createEvent(formData);
            router.push(`/events/${id}`);
          } catch (e) {
            setError(e instanceof Error ? e.message : "Erreur");
          }
        });
      }}
      className="space-y-3 bg-white rounded-2xl border border-oml-navy/10 p-6"
    >
      <div>
        <label className="block text-sm font-semibold text-oml-navy mb-1">
          Titre
        </label>
        <input
          name="title"
          required
          placeholder="Match amical vs FC Voisins"
          className="w-full rounded-lg border border-oml-navy/20 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-oml-navy mb-1">
          Description
        </label>
        <textarea
          name="description"
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
          required
          placeholder="Stade Robert Vimeux, Maisons-Laffitte"
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
            defaultValue="4-4-2"
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
            defaultValue="4-4-2"
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
          defaultValue={22}
          required
          className="w-full rounded-lg border border-oml-navy/20 px-3 py-2 text-sm"
        />
      </div>
      <label className="flex items-center gap-2 text-sm font-semibold text-oml-navy">
        <input type="checkbox" name="requirePaid" />
        Réservé aux adhérents ayant payé leur cotisation
      </label>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-oml-navy text-white px-5 py-2.5 font-semibold hover:bg-oml-navy-light transition disabled:opacity-60"
      >
        {pending ? "Création..." : "Créer l'événement"}
      </button>
    </form>
  );
}
