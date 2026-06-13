"use client";

import { useActionState } from "react";
import { loginAction } from "@/lib/actions/auth";

export default function LoginPage() {
  const [state, action, pending] = useActionState(loginAction, undefined);

  return (
    <div className="flex flex-1 items-center justify-center bg-oml-navy px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center text-oml-navy font-bold text-2xl border-4 border-oml-gold mb-3">
            OML
          </div>
          <h1 className="text-white text-2xl font-bold text-center">
            Olympique de Maisons-Laffitte
          </h1>
          <p className="text-white/60 text-sm mt-1">Espace adhérents</p>
        </div>

        <form action={action} className="space-y-4">
          <div>
            <label className="block text-sm text-white/80 mb-1">
              Identifiant ou email
            </label>
            <input
              name="identifier"
              type="text"
              required
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
              className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-oml-gold"
              placeholder="••••••••"
            />
          </div>

          {state?.error && (
            <p className="text-red-400 text-sm">{state.error}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-oml-gold text-oml-navy font-semibold py-2.5 transition hover:brightness-110 disabled:opacity-60"
          >
            {pending ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <p className="text-white/40 text-xs text-center mt-6">
          Vous n&apos;avez pas de compte ? Demandez un lien d&apos;inscription
          à un administrateur.
        </p>
      </div>
    </div>
  );
}
