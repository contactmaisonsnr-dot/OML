import { prisma } from "@/lib/prisma";
import MessageRow from "./MessageRow";

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-2">
      <h2 className="font-bold text-oml-navy mb-2">
        Messages de contact ({messages.length})
      </h2>
      {messages.map((m) => (
        <MessageRow key={m.id} message={m} />
      ))}
      {messages.length === 0 && (
        <p className="text-sm text-oml-navy/40">Aucun message.</p>
      )}
    </div>
  );
}
