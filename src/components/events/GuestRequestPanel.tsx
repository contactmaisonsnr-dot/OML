"use client";

import { useRef, useState, useTransition } from "react";
import { requestGuest, reviewGuestRequest } from "@/lib/actions/events";

export type GuestRequestItem = {
  id: string;
  guestFirstName: string;
  guestLastName: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  requestedBy: { firstName: string; lastName: string };
};

const STATUS_LABEL: Record<string, string> = {
  PENDING: "En attente",
  ACCEPTED: "Accepté",
  REJECTED: "Refusé",
};

const STATUS_STYLE: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  ACCEPTED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
};

export default function GuestRequestPanel({
  eventId,
  requests,
  isAdmin,
}: {
  eventId: string;
  requests: GuestRequestItem[];
  isAdmin: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div className="rounded-2xl border border-oml-navy/10 p-4 bg-white">
      <h3 className="font-bold text-oml-navy mb-3">Inviter un proche</h3>

      <form
        ref={formRef}
        action={(formData) => {
          setError(null);
          startTransition(async () => {
            try {
              await requestGuest(formData);
              formRef.current?.reset();
            } catch (e) {
              setError(e instanceof Error ? e.message : "Erreur");
            }
          });
        }}
        className="flex flex-wrap gap-2 mb-4"
      >
        <input type="hidden" name="eventId" value={eventId} />
        <input
          name="firstName"
          placeholder="Prénom de l'invité"
          required
          className="flex-1 min-w-[140px] rounded-lg border border-oml-navy/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-oml-gold"
        />
        <input
          name="lastName"
          placeholder="Nom de l'invité"
          required
          className="flex-1 min-w-[140px] rounded-lg border border-oml-navy/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-oml-gold"
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-oml-navy text-white px-4 py-2 text-sm font-semibold hover:bg-oml-navy-light transition disabled:opacity-60"
        >
          Demander
        </button>
      </form>

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      <div className="space-y-2">
        {requests.length === 0 && (
          <p className="text-sm text-oml-navy/40">Aucune demande.</p>
        )}
        {requests.map((r) => (
          <div
            key={r.id}
            className="flex items-center justify-between gap-2 rounded-lg border border-oml-navy/10 px-3 py-2 text-sm"
          >
            <div>
              <span className="font-semibold text-oml-navy">
                {r.guestFirstName} {r.guestLastName}
              </span>
              <span className="text-oml-navy/50">
                {" "}
                — invité par {r.requestedBy.firstName} {r.requestedBy.lastName}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {isAdmin && r.status === "PENDING" ? (
                <>
                  <button
                    onClick={() =>
                      startTransition(() => reviewGuestRequest(r.id, true))
                    }
                    className="rounded bg-green-600 text-white text-xs font-semibold px-2 py-1 hover:bg-green-700"
                  >
                    Accepter
                  </button>
                  <button
                    onClick={() =>
                      startTransition(() => reviewGuestRequest(r.id, false))
                    }
                    className="rounded bg-red-500 text-white text-xs font-semibold px-2 py-1 hover:bg-red-600"
                  >
                    Refuser
                  </button>
                </>
              ) : (
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded ${STATUS_STYLE[r.status]}`}
                >
                  {STATUS_LABEL[r.status]}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
