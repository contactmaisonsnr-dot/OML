"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser, requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import crypto from "crypto";

const membershipRequestSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
});

export async function requestMembership(
  _prevState: { error?: string; success?: string } | undefined,
  formData: FormData
): Promise<{ error?: string; success?: string }> {
  const user = await requireUser();

  const parsed = membershipRequestSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
  });
  if (!parsed.success) {
    return { error: "Veuillez remplir tous les champs correctement." };
  }

  await prisma.membershipRequest.create({
    data: { ...parsed.data, requestedById: user.id },
  });

  return { success: "Demande envoyée à l'administrateur." };
}

export async function reviewMembershipRequest(id: string, accept: boolean) {
  await requireAdmin();
  const request = await prisma.membershipRequest.findUnique({ where: { id } });
  if (!request) throw new Error("Demande introuvable");

  await prisma.membershipRequest.update({
    where: { id },
    data: { status: accept ? "ACCEPTED" : "REJECTED" },
  });

  if (accept) {
    const token = crypto.randomBytes(16).toString("hex");
    await prisma.inviteLink.create({
      data: { token, email: request.email },
    });
  }

  revalidatePath("/admin/requests");
}
