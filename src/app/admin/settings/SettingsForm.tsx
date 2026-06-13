"use client";

import { useState, useTransition } from "react";
import { updateSiteSettings } from "@/lib/actions/admin";

export default function SettingsForm({
  settings,
}: {
  settings: { heroTitle: string; heroSubtitle: string; aboutText: string };
}) {
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  return (
    <form
      action={(formData) => {
        setSaved(false);
        startTransition(async () => {
          await updateSiteSettings(formData);
          setSaved(true);
        });
      }}
      className="space-y-4 bg-white rounded-2xl border border-oml-navy/10 p-6"
    >
      <div>
        <label className="block text-sm font-semibold text-oml-navy mb-1">
          Titre de la page d&apos;accueil
        </label>
        <input
          name="heroTitle"
          defaultValue={settings.heroTitle}
          required
          className="w-full rounded-lg border border-oml-navy/20 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-oml-navy mb-1">
          Sous-titre
        </label>
        <input
          name="heroSubtitle"
          defaultValue={settings.heroSubtitle}
          required
          className="w-full rounded-lg border border-oml-navy/20 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-oml-navy mb-1">
          À propos du club
        </label>
        <textarea
          name="aboutText"
          defaultValue={settings.aboutText}
          rows={4}
          className="w-full rounded-lg border border-oml-navy/20 px-3 py-2 text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-oml-navy text-white px-5 py-2.5 font-semibold hover:bg-oml-navy-light transition disabled:opacity-60"
      >
        Enregistrer
      </button>
      {saved && <span className="ml-3 text-green-600 text-sm">✓ Enregistré</span>}
    </form>
  );
}
