"use client";

import { useState, useTransition } from "react";
import { updateFavoritePosition } from "@/lib/actions/profile";
import { POSITION_OPTIONS } from "@/lib/formations";

export default function FavoritePositionForm({
  favoritePosition,
}: {
  favoritePosition: string | null;
}) {
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  return (
    <div className="rounded-2xl border border-oml-navy/10 p-5 bg-white">
      <h2 className="font-bold text-oml-navy mb-4">Poste favori</h2>
      <form
        action={(formData) => {
          setSaved(false);
          startTransition(async () => {
            await updateFavoritePosition(formData);
            setSaved(true);
          });
        }}
        className="flex flex-wrap items-center gap-3"
      >
        <select
          name="favoritePosition"
          defaultValue={favoritePosition ?? ""}
          className="rounded-lg border border-oml-navy/20 px-3 py-2 text-sm"
        >
          <option value="">Non renseigné</option>
          {POSITION_OPTIONS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-oml-navy text-white px-4 py-2 text-sm font-semibold hover:bg-oml-navy-light transition disabled:opacity-60"
        >
          Enregistrer
        </button>
        {saved && <span className="text-green-600 text-sm">✓ Enregistré</span>}
      </form>
    </div>
  );
}
