"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import crypto from "crypto";

const settingsSchema = z.object({
  heroTitle: z.string().min(1),
  heroSubtitle: z.string().min(1),
  aboutText: z.string().optional(),
});

export async function updateSiteSettings(formData: FormData) {
  await requireAdmin();
  const parsed = settingsSchema.safeParse({
    heroTitle: formData.get("heroTitle"),
    heroSubtitle: formData.get("heroSubtitle"),
    aboutText: formData.get("aboutText") || "",
  });
  if (!parsed.success) throw new Error("Champs invalides");

  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: parsed.data,
    create: { id: "singleton", ...parsed.data },
  });

  revalidatePath("/");
  revalidatePath("/admin/settings");
}

export async function toggleMembershipPaid(userId: string, paid: boolean) {
  await requireAdmin();
  await prisma.user.update({
    where: { id: userId },
    data: { membershipPaid: paid },
  });
  revalidatePath("/admin/members");
}

export async function toggleUserRole(userId: string, role: "ADMIN" | "MEMBER") {
  await requireAdmin();
  await prisma.user.update({
    where: { id: userId },
    data: { role },
  });
  revalidatePath("/admin/members");
}

export async function deleteUser(userId: string) {
  const admin = await requireAdmin();
  if (admin.id === userId) {
    throw new Error("Vous ne pouvez pas supprimer votre propre compte.");
  }
  await prisma.user.delete({ where: { id: userId } });
  revalidatePath("/admin/members");
}

export async function generateInviteLink(formData: FormData) {
  await requireAdmin();
  const email = String(formData.get("email") || "").trim();

  const token = crypto.randomBytes(16).toString("hex");
  await prisma.inviteLink.create({
    data: {
      token,
      email: email || null,
    },
  });

  revalidatePath("/admin/invites");
}

export async function deleteInviteLink(id: string) {
  await requireAdmin();
  await prisma.inviteLink.delete({ where: { id } });
  revalidatePath("/admin/invites");
}
