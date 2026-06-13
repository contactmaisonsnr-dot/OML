import { prisma } from "@/lib/prisma";
import StadiumIntro from "@/components/home/StadiumIntro";
import Link from "next/link";
import Image from "next/image";

export default async function Home() {
  const settings = await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });

  const nextEvent = await prisma.event.findFirst({
    where: { date: { gte: new Date() } },
    orderBy: { date: "asc" },
  });

  const motmUser = settings.motmUserId
    ? await prisma.user.findUnique({ where: { id: settings.motmUserId } })
    : null;

  const motmEvent = settings.motmEventId
    ? await prisma.event.findUnique({ where: { id: settings.motmEventId } })
    : null;

  return (
    <div className="flex flex-col">
      <StadiumIntro
        heroTitle={settings.heroTitle}
        heroSubtitle={settings.heroSubtitle}
      />

      <section className="max-w-6xl mx-auto w-full px-4 py-16 grid gap-8 md:grid-cols-2">
        {/* Next event */}
        <div className="rounded-2xl border border-oml-navy/10 shadow-xl overflow-hidden bg-white">
          <div className="bg-oml-navy text-white px-6 py-4">
            <h2 className="text-lg font-bold uppercase tracking-wide">
              Prochain événement
            </h2>
          </div>
          {nextEvent ? (
            <div className="p-6 space-y-3">
              <h3 className="text-2xl font-extrabold text-oml-navy">
                {nextEvent.title}
              </h3>
              <p className="text-oml-navy/70">{nextEvent.location}</p>
              <p className="text-oml-navy/70">
                {new Date(nextEvent.date).toLocaleString("fr-FR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                {" — fin "}
                {new Date(nextEvent.endTime).toLocaleTimeString("fr-FR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              {nextEvent.description && (
                <p className="text-sm text-oml-navy/60">
                  {nextEvent.description}
                </p>
              )}
              <Link
                href={`/events/${nextEvent.id}`}
                className="inline-flex items-center gap-2 mt-2 rounded-lg bg-oml-navy text-white px-5 py-2.5 font-semibold hover:bg-oml-navy-light transition"
              >
                Voir les compositions →
              </Link>
            </div>
          ) : (
            <div className="p-6 text-oml-navy/60">
              Aucun événement à venir pour le moment.
            </div>
          )}
        </div>

        {/* MOTM */}
        <div className="rounded-2xl border border-oml-navy/10 shadow-xl overflow-hidden bg-white">
          <div className="bg-oml-gold text-oml-navy px-6 py-4">
            <h2 className="text-lg font-bold uppercase tracking-wide">
              Homme du match
            </h2>
          </div>
          {motmUser ? (
            <div className="p-6 flex items-center gap-5">
              <div className="h-20 w-20 rounded-full overflow-hidden border-4 border-oml-gold bg-oml-navy/5 flex-shrink-0 relative">
                {motmUser.photoUrl ? (
                  <Image
                    src={motmUser.photoUrl}
                    alt={motmUser.firstName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-2xl font-bold text-oml-navy/40">
                    {motmUser.firstName[0]}
                    {motmUser.lastName[0]}
                  </div>
                )}
              </div>
              <div>
                <p className="text-2xl font-extrabold text-oml-navy">
                  {motmUser.firstName} {motmUser.lastName}
                </p>
                {motmEvent && (
                  <p className="text-oml-navy/60 text-sm mt-1">
                    Élu lors de {motmEvent.title} —{" "}
                    {new Date(motmEvent.date).toLocaleDateString("fr-FR")}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="p-6 text-oml-navy/60">
              Aucun homme du match désigné pour le moment.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
