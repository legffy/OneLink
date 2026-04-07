import Image from "next/image";
import Link from "next/link";

export default function BuildingCard({ name, slug, campus, id, imageUrl }) {
  const imageSrc = imageUrl || "/mueller.jpg";
  const isRemoteImage = imageSrc.startsWith("http");

  return (
    <Link
      href={`/buildings/${id}`}
      className="group block overflow-hidden rounded-[28px] border border-white/70 bg-white/90 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_-30px_rgba(15,23,42,0.45)]"
    >
      <div className="relative h-52 overflow-hidden">
        <Image
          src={imageSrc}
          alt={name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
          unoptimized={isRemoteImage}
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute left-4 top-4 rounded-full border border-white/30 bg-black/35 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-sm">
          {slug}
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
          <h3 className="text-2xl font-semibold leading-tight">{name}</h3>
          <p className="mt-2 text-sm text-white/85">{campus}</p>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div className="flex items-center justify-between text-sm text-zinc-500">
          <span>Campus</span>
          <span className="font-semibold text-zinc-900">{campus}</span>
        </div>
        <p className="text-sm leading-6 text-zinc-600">
          Open the building page for location details, hours, and schedule placeholders.
        </p>
        <div className="flex items-center justify-between border-t border-zinc-200 pt-4 text-sm font-semibold text-zinc-900">
          <span>Open building page</span>
          <span className="transition-transform duration-300 group-hover:translate-x-1">View</span>
        </div>
      </div>
    </Link>
  );
}
