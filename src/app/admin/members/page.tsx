import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import MemberRow from "./MemberRow";

export default async function AdminMembersPage() {
  const members = await prisma.user.findMany({
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
  });
  const current = await getCurrentUser();

  return (
    <div className="space-y-3">
      <h2 className="font-bold text-oml-navy mb-2">
        Membres ({members.length})
      </h2>
      <div className="space-y-2">
        {members.map((m) => (
          <MemberRow key={m.id} member={m} isSelf={m.id === current?.id} />
        ))}
      </div>
    </div>
  );
}
