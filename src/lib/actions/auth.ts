"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  hashPassword,
  verifyPassword,
  createSession,
  destroySession,
} from "@/lib/auth";
import { redirect } from "next/navigation";

const loginSchema = z.object({
  identifier: z.string().min(1),
  password: z.string().min(1),
});

export async function loginAction(
  _prevState: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string }> {
  const parsed = loginSchema.safeParse({
    identifier: formData.get("identifier"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: "Veuillez remplir tous les champs." };
  }

  const { identifier, password } = parsed.data;

  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: identifier }, { username: identifier }],
    },
  });

  if (!user) {
    return { error: "Identifiant ou mot de passe incorrect." };
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return { error: "Identifiant ou mot de passe incorrect." };
  }

  await createSession(user.id);
  redirect("/");
}

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}

const registerSchema = z.object({
  token: z.string().min(1),
  email: z.string().email(),
  username: z.string().min(3).max(20),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  password: z.string().min(6),
});

export async function registerAction(
  _prevState: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string }> {
  const parsed = registerSchema.safeParse({
    token: formData.get("token"),
    email: formData.get("email"),
    username: formData.get("username"),
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: "Veuillez remplir correctement tous les champs." };
  }

  const { token, email, username, firstName, lastName, password } =
    parsed.data;

  const invite = await prisma.inviteLink.findUnique({ where: { token } });
  if (!invite || invite.used) {
    return { error: "Ce lien d'inscription est invalide ou déjà utilisé." };
  }
  if (invite.expiresAt && invite.expiresAt < new Date()) {
    return { error: "Ce lien d'inscription a expiré." };
  }

  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
  });
  if (existing) {
    return { error: "Cet email ou cet identifiant est déjà utilisé." };
  }

  const count = await prisma.user.count();

  const user = await prisma.user.create({
    data: {
      email,
      username,
      firstName,
      lastName,
      passwordHash: await hashPassword(password),
      memberNumber: count + 1,
    },
  });

  await prisma.inviteLink.update({
    where: { id: invite.id },
    data: { used: true },
  });

  await createSession(user.id);
  redirect("/");
}
