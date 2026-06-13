import { requireUser } from "@/lib/auth";
import ContactForm from "./ContactForm";
import RequestMembershipForm from "./RequestMembershipForm";

export default async function ContactPage() {
  const user = await requireUser();

  return (
    <div className="max-w-2xl mx-auto w-full px-4 py-8 space-y-10">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-oml-navy mb-6">
          Contacter l&apos;association
        </h1>
        <ContactForm
          defaultName={`${user.firstName} ${user.lastName}`}
          defaultEmail={user.email}
        />
      </div>

      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-oml-navy mb-2">
          Proposer un nouveau membre
        </h2>
        <p className="text-sm text-oml-navy/60 mb-4">
          Vous connaissez quelqu&apos;un qui souhaite rejoindre le club ?
          Soumettez sa demande, l&apos;administrateur lui enverra un lien
          d&apos;inscription après validation.
        </p>
        <RequestMembershipForm />
      </div>
    </div>
  );
}
