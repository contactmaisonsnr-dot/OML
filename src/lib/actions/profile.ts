"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser, hashPassword, verifyPassword } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

export async function updateFavoritePosition(formData: FormData) {
  const user = await requireUser();
  const favoritePosition = String(formData.get("favoritePosition") || "");

  await prisma.user.update({
    where: { id: user.id },
    data: { favoritePosition: favoritePosition || null },
  });

  revalidatePath("/profile");
}

const credentialsSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(20),
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
});

export async function updateCredentials(
  _prevState: { error?: string; success?: string } | undefined,
  formData: FormData
): Promise<{ error?: string; success?: string }> {
  const user = await requireUser();

  const parsed = credentialsSchema.safeParse({
    email: formData.get("email"),
    username: formData.get("username"),
    currentPassword: formData.get("currentPassword") || undefined,
    newPassword: formData.get("newPassword") || undefined,
  });
  if (!parsed.success) {
    return { error: "Champs invalides." };
  }

  const { email, username, currentPassword, newPassword } = parsed.data;

  const existing = await prisma.user.findFirst({
    where: {
      AND: [
        { id: { not: user.id } },
        { OR: [{ email }, { username }] },
      ],
    },
  });
  if (existing) {
    return { error: "Cet email ou cet identifiant est déjà utilisé." };
  }

  const data: { email: string; username: string; passwordHash?: string } = {
    email,
    username,
  };

  if (newPassword) {
    if (!currentPassword) {
      return { error: "Veuillez saisir votre mot de passe actuel." };
    }
    const valid = await verifyPassword(currentPassword, user.passwordHash);
    if (!valid) {
      return { error: "Mot de passe actuel incorrect." };
    }
    if (newPassword.length < 6) {
      return { error: "Le nouveau mot de passe doit contenir au moins 6 caractères." };
    }
    data.passwordHash = await hashPassword(newPassword);
  }

  await prisma.user.update({ where: { id: user.id }, data });

  revalidatePath("/profile");
  return { success: "Informations mises à jour." };
}

export async function updateProfilePhoto(formData: FormData) {
  const user = await requireUser();
  const file = formData.get("photo");

  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Aucun fichier sélectionné.");
  }
  if (!file.type.startsWith("image/")) {
    throw new Error("Le fichier doit être une image.");
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("L'image ne doit pas dépasser 5 Mo.");
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });

  const ext = path.extname(file.name).toLowerCase().replace(/[^a-z0-9.]/g, "") || ".jpg";
  const filename = `${user.id}-${Date.now()}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadDir, filename), buffer);

  await prisma.user.update({
    where: { id: user.id },
    data: { photoUrl: `/uploads/${filename}` },
  });

  revalidatePath("/profile");
  revalidatePath("/");
}
