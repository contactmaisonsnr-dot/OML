import { prisma } from "@/lib/prisma";
import RequestRow from "./RequestRow";

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

export default async function AdminRequestsPage() {
  const requests = await prisma.membershipRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: { requestedBy: { select: { firstName: true, lastName: true } } },
  });

  return (
    <div className="space-y-2">
      <h2 className="font-bold text-oml-navy mb-2">
        Demandes d&apos;adhésion
      </h2>
      {requests.map((r) => (
        <div
          key={r.id}
          className="flex items-center justify-between gap-3 rounded-xl border border-oml-navy/10 bg-white px-4 py-3 flex-wrap"
        >
          <div>
            <p className="font-semibold text-oml-navy">
              {r.firstName} {r.lastName}{" "}
              <span className="text-oml-navy/40 text-sm">({r.email})</span>
            </p>
            <p className="text-xs text-oml-navy/50">
              Proposé par {r.requestedBy.firstName} {r.requestedBy.lastName}
            </p>
          </div>
          {r.status === "PENDING" ? (
            <RequestRow id={r.id} />
          ) : (
            <span className={`text-xs font-semibold px-2 py-1 rounded ${STATUS_STYLE[r.status]}`}>
              {STATUS_LABEL[r.status]}
            </span>
          )}
        </div>
      ))}
      {requests.length === 0 && (
        <p className="text-sm text-oml-navy/40">Aucune demande.</p>
      )}
    </div>
  );
}
