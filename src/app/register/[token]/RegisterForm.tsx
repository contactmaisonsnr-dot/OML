"use client";

import { useActionState } from "react";
import { registerAction } from "@/lib/actions/auth";

export default function RegisterForm({
  token,
  defaultEmail,
}: {
  token: string;
  defaultEmail: string;
}) {
  const [state, action, pending] = useActionState(registerAction, undefined);

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="token" value={token} />

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-white/80 mb-1">Prénom</label>
          <input
            name="firstName"
            required
            className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-oml-gold"
          />
        </div>
        <div>
          <label className="block text-sm text-white/80 mb-1">Nom</label>
          <input
            name="lastName"
            required
            className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-oml-gold"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-white/80 mb-1">Email</label>
        <input
          name="email"
          type="email"
          required
          defaultValue={defaultEmail}
          className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-oml-gold"
        />
      </div>

      <div>
        <label className="block text-sm text-white/80 mb-1">
          Identifiant
        </label>
        <input
          name="username"
          required
          minLength={3}
          maxLength={20}
          className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-oml-gold"
          placeholder="jdupont"
        />
      </div>

      <div>
        <label className="block text-sm text-white/80 mb-1">
          Mot de passe
        </label>
        <input
          name="password"
          type="password"
          required
          minLength={6}
          className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-oml-gold"
        />
      </div>

      {state?.error && <p className="text-red-400 text-sm">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-oml-gold text-oml-navy font-semibold py-2.5 transition hover:brightness-110 disabled:opacity-60"
      >
        {pending ? "Création..." : "Créer mon compte"}
      </button>
    </form>
  );
}
