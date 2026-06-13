import { prisma } from "@/lib/prisma";
import RegisterForm from "./RegisterForm";

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const invite = await prisma.inviteLink.findUnique({ where: { token } });

  const invalid =
    !invite || invite.used || (invite.expiresAt && invite.expiresAt < new Date());

  return (
    <div className="flex flex-1 items-center justify-center bg-oml-navy px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center text-oml-navy font-bold text-2xl border-4 border-oml-gold mb-3">
            OML
          </div>
          <h1 className="text-white text-2xl font-bold text-center">
            Créer mon compte
          </h1>
          <p className="text-white/60 text-sm mt-1">
            Olympique de Maisons-Laffitte
          </p>
        </div>

        {invalid ? (
          <p className="text-red-400 text-sm text-center">
            Ce lien d&apos;inscription est invalide, expiré ou déjà utilisé.
          </p>
        ) : (
          <RegisterForm token={token} defaultEmail={invite?.email ?? ""} />
        )}
      </div>
    </div>
  );
}
