"use client";

import { useActionState } from "react";
import { requestMembership } from "@/lib/actions/membership";

export default function RequestMembershipForm() {
  const [state, action, pending] = useActionState(requestMembership, undefined);

  return (
    <form action={action} className="space-y-4 bg-white rounded-2xl border border-oml-navy/10 p-6">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-semibold text-oml-navy mb-1">
            Prénom
          </label>
          <input
            name="firstName"
            required
            className="w-full rounded-lg border border-oml-navy/20 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-oml-navy mb-1">
            Nom
          </label>
          <input
            name="lastName"
            required
            className="w-full rounded-lg border border-oml-navy/20 px-3 py-2 text-sm"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold text-oml-navy mb-1">
          Email de la personne
        </label>
        <input
          name="email"
          type="email"
          required
          className="w-full rounded-lg border border-oml-navy/20 px-3 py-2 text-sm"
        />
      </div>

      {state?.error && <p className="text-red-500 text-sm">{state.error}</p>}
      {state?.success && <p className="text-green-600 text-sm">{state.success}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-oml-navy text-white px-5 py-2.5 font-semibold hover:bg-oml-navy-light transition disabled:opacity-60"
      >
        {pending ? "Envoi..." : "Envoyer la demande"}
      </button>
    </form>
  );
}
