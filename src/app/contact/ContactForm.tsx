"use client";

import { useActionState } from "react";
import { sendContactMessage } from "@/lib/actions/contact";

export default function ContactForm({
  defaultName,
  defaultEmail,
}: {
  defaultName: string;
  defaultEmail: string;
}) {
  const [state, action, pending] = useActionState(sendContactMessage, undefined);

  return (
    <form action={action} className="space-y-4 bg-white rounded-2xl border border-oml-navy/10 p-6">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-semibold text-oml-navy mb-1">
            Nom
          </label>
          <input
            name="name"
            defaultValue={defaultName}
            required
            className="w-full rounded-lg border border-oml-navy/20 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-oml-navy mb-1">
            Email
          </label>
          <input
            name="email"
            type="email"
            defaultValue={defaultEmail}
            required
            className="w-full rounded-lg border border-oml-navy/20 px-3 py-2 text-sm"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold text-oml-navy mb-1">
          Sujet
        </label>
        <input
          name="subject"
          required
          className="w-full rounded-lg border border-oml-navy/20 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-oml-navy mb-1">
          Message
        </label>
        <textarea
          name="message"
          required
          rows={5}
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
        {pending ? "Envoi..." : "Envoyer"}
      </button>
    </form>
  );
}
