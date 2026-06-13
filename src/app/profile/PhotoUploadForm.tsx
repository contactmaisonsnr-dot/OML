"use client";

import { useRef, useState, useTransition } from "react";
import PlayerAvatar from "@/components/PlayerAvatar";
import { updateProfilePhoto } from "@/lib/actions/profile";

export default function PhotoUploadForm({
  photoUrl,
  firstName,
  lastName,
}: {
  photoUrl: string | null;
  firstName: string;
  lastName: string;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div className="rounded-2xl border border-oml-navy/10 p-5 bg-white">
      <h2 className="font-bold text-oml-navy mb-4">Photo de profil</h2>
      <div className="flex items-center gap-5">
        <PlayerAvatar
          photoUrl={photoUrl}
          firstName={firstName}
          lastName={lastName}
          size={80}
          ring
        />
        <form
          ref={formRef}
          action={(formData) => {
            setError(null);
            startTransition(async () => {
              try {
                await updateProfilePhoto(formData);
              } catch (e) {
                setError(e instanceof Error ? e.message : "Erreur");
              }
            });
          }}
          className="space-y-2"
        >
          <input
            type="file"
            name="photo"
            accept="image/*"
            required
            className="block text-sm text-oml-navy"
          />
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-oml-navy text-white px-4 py-2 text-sm font-semibold hover:bg-oml-navy-light transition disabled:opacity-60"
          >
            {pending ? "Envoi..." : "Mettre à jour"}
          </button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </form>
      </div>
    </div>
  );
}
