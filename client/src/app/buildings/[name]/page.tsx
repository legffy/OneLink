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

const scheduleSkeleton = [
  { startTime: "8:00 AM", endTime: "9:15 AM" },
  { startTime: "10:00 AM", endTime: "11:20 AM" },
  { startTime: "12:30 PM", endTime: "1:45 PM" },
  { startTime: "3:00 PM", endTime: "4:30 PM" },
];

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
          {"< Back to buildings"}
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

        <section className="mt-8 rounded-[28px] border border-zinc-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8f4ef_100%)] p-6 shadow-[0_30px_80px_-50px_rgba(15,23,42,0.45)]">
          <div className="flex flex-col gap-3 border-b border-zinc-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-red-700">
                Daily events
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950">
                Building schedule timeline
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
                This section is ready for event data. Each row can show what is happening in
                the building, when it starts, and when it ends.
              </p>
            </div>
            <div className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-red-700">
              Placeholder structure
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {building.eventSchedule && building.eventSchedule.length > 0
              ? building.eventSchedule.map((event) => (
                  <div
                    key={`${event.title}-${event.startTime}-${event.endTime}`}
                    className="grid gap-4 rounded-[24px] border border-zinc-200 bg-white p-5 shadow-sm md:grid-cols-[180px_1fr]"
                  >
                    <div className="rounded-2xl bg-zinc-950 px-4 py-4 text-white">
                      <p className="text-xs uppercase tracking-[0.2em] text-white/45">Time</p>
                      <p className="mt-3 text-lg font-semibold">{event.startTime}</p>
                      <p className="text-sm text-white/65">to {event.endTime}</p>
                    </div>

                    <div className="flex flex-col justify-center">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold text-zinc-950">{event.title}</h3>
                        {event.type ? (
                          <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-600">
                            {event.type}
                          </span>
                        ) : null}
                        {event.status ? (
                          <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-red-700">
                            {event.status}
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-3 text-sm leading-6 text-zinc-600">
                        {event.location ?? "Event location can be added here later."}
                      </p>
                    </div>
                  </div>
                ))
              : scheduleSkeleton.map((slot) => (
                  <div
                    key={`${slot.startTime}-${slot.endTime}`}
                    className="grid gap-4 rounded-[24px] border border-dashed border-zinc-300 bg-white/80 p-5 md:grid-cols-[180px_1fr]"
                  >
                    <div className="rounded-2xl bg-zinc-950 px-4 py-4 text-white">
                      <p className="text-xs uppercase tracking-[0.2em] text-white/45">Time</p>
                      <p className="mt-3 text-lg font-semibold">{slot.startTime}</p>
                      <p className="text-sm text-white/65">to {slot.endTime}</p>
                    </div>

                    <div className="flex flex-col justify-center">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="h-5 w-40 rounded-full bg-zinc-200" />
                        <div className="h-6 w-24 rounded-full bg-red-100" />
                      </div>
                      <div className="mt-3 space-y-2">
                        <div className="h-4 w-full max-w-xl rounded-full bg-zinc-100" />
                        <div className="h-4 w-full max-w-md rounded-full bg-zinc-100" />
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </section>
      </div>
    </main>
  );
}
