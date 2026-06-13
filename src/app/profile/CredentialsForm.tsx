"use client";

import { useActionState } from "react";
import { updateCredentials } from "@/lib/actions/profile";

export default function CredentialsForm({
  email,
  username,
}: {
  email: string;
  username: string;
}) {
  const [state, action, pending] = useActionState(updateCredentials, undefined);

  return (
    <div className="rounded-2xl border border-oml-navy/10 p-5 bg-white">
      <h2 className="font-bold text-oml-navy mb-4">Identifiants</h2>
      <form action={action} className="space-y-3">
        <div>
          <label className="block text-sm font-semibold text-oml-navy mb-1">
            Email
          </label>
          <input
            name="email"
            type="email"
            defaultValue={email}
            required
            className="w-full rounded-lg border border-oml-navy/20 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-oml-navy mb-1">
            Identifiant
          </label>
          <input
            name="username"
            defaultValue={username}
            required
            minLength={3}
            maxLength={20}
            className="w-full rounded-lg border border-oml-navy/20 px-3 py-2 text-sm"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold text-oml-navy mb-1">
              Mot de passe actuel
            </label>
            <input
              name="currentPassword"
              type="password"
              className="w-full rounded-lg border border-oml-navy/20 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-oml-navy mb-1">
              Nouveau mot de passe
            </label>
            <input
              name="newPassword"
              type="password"
              minLength={6}
              className="w-full rounded-lg border border-oml-navy/20 px-3 py-2 text-sm"
            />
          </div>
        </div>

        {state?.error && <p className="text-red-500 text-sm">{state.error}</p>}
        {state?.success && (
          <p className="text-green-600 text-sm">{state.success}</p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-oml-navy text-white px-4 py-2 text-sm font-semibold hover:bg-oml-navy-light transition disabled:opacity-60"
        >
          {pending ? "Enregistrement..." : "Enregistrer"}
        </button>
      </form>
    </div>
  );
}
