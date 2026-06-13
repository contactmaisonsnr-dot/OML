import { requireUser } from "@/lib/auth";
import PhotoUploadForm from "./PhotoUploadForm";
import CredentialsForm from "./CredentialsForm";
import FavoritePositionForm from "./FavoritePositionForm";
import MembershipCard from "./MembershipCard";

export default async function ProfilePage() {
  const user = await requireUser();

  return (
    <div className="max-w-4xl mx-auto w-full px-4 py-8 space-y-8">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-oml-navy">
        Mon profil
      </h1>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <PhotoUploadForm photoUrl={user.photoUrl} firstName={user.firstName} lastName={user.lastName} />
          <FavoritePositionForm favoritePosition={user.favoritePosition} />
          <CredentialsForm email={user.email} username={user.username} />
        </div>

        <div>
          <MembershipCard user={user} />
        </div>
      </div>
    </div>
  );
}
