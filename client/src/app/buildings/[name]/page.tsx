import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buildings, getBuildingBySlug } from "../../data/buildings";

type PageProps = {
  params: Promise<{ name: string }>;
};

export async function generateStaticParams() {
  return buildings.map((building) => ({ name: building.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { name } = await params;
  const building = getBuildingBySlug(name);

  if (!building) {
    return {
      title: "Building Not Found",
    };
  }

  return {
    title: `${building.name} | OneLink`,
    description: building.description,
  };
}

export default async function BuildingPage({ params }: PageProps) {
  const { name } = await params;
  const building = getBuildingBySlug(name);

  if (!building) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(200,16,46,0.16),transparent_30%),linear-gradient(180deg,#14080a_0%,#1f1115_18%,#f7f3ef_18%,#ffffff_100%)] px-6 py-8 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/20 px-4 py-2 text-sm font-medium text-white backdrop-blur transition hover:bg-black/30"
        >
          ← Back to buildings
        </Link>

        <section className="mt-6 overflow-hidden rounded-[36px] border border-white/10 bg-zinc-950 text-white shadow-[0_40px_100px_-45px_rgba(0,0,0,0.75)]">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
            <div className="relative min-h-[360px]">
              <Image
                src={building.image}
                alt={building.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/45 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-red-300">
                  {building.abbreviation}
                </p>
                <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
                  {building.name}
                </h1>
                <p className="mt-4 max-w-xl text-base leading-7 text-white/80">
                  {building.tagline}
                </p>
              </div>
            </div>

            <div className="flex flex-col justify-between gap-6 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-6 sm:p-8">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-white/45">Overview</p>
                <p className="mt-4 text-base leading-7 text-white/80">{building.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/45">Capacity</p>
                  <p className="mt-2 text-2xl font-semibold">{building.seats}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/45">Hours</p>
                  <p className="mt-2 text-sm font-semibold leading-6">{building.hours}</p>
                </div>
                <div className="col-span-2 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/45">Location</p>
                  <p className="mt-2 text-sm font-semibold leading-6">{building.location}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-[0_30px_80px_-50px_rgba(15,23,42,0.45)]">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-red-700">
              Building highlights
            </p>
            <div className="mt-5 space-y-3">
              {building.highlights.map((highlight) => (
                <div
                  key={highlight}
                  className="rounded-2xl border border-red-100 bg-red-50/70 px-4 py-3 text-sm font-medium text-zinc-800"
                >
                  {highlight}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-zinc-200 bg-[linear-gradient(180deg,#ffffff_0%,#f6f8fb_100%)] p-6 shadow-[0_30px_80px_-50px_rgba(15,23,42,0.45)]">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-zinc-500">
              What you&apos;ll find here
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {building.facilities.map((facility) => (
                <div
                  key={facility}
                  className="rounded-2xl border border-zinc-200 bg-white px-4 py-4 text-sm font-medium text-zinc-700"
                >
                  {facility}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
