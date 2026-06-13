import Image from "next/image";

export default function PlayerAvatar({
  photoUrl,
  firstName,
  lastName,
  size = 40,
  ring = false,
}: {
  photoUrl?: string | null;
  firstName: string;
  lastName: string;
  size?: number;
  ring?: boolean;
}) {
  return (
    <div
      className={`relative rounded-full overflow-hidden flex-shrink-0 bg-oml-navy/10 flex items-center justify-center text-oml-navy font-bold ${
        ring ? "ring-2 ring-oml-gold" : ""
      }`}
      style={{ width: size, height: size, fontSize: size * 0.35 }}
    >
      {photoUrl ? (
        <Image src={photoUrl} alt={`${firstName} ${lastName}`} fill className="object-cover" />
      ) : (
        <span>
          {firstName[0]}
          {lastName[0]}
        </span>
      )}
    </div>
  );
}
