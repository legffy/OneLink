import BuildingCard from "../components/buildingCard";
import { buildings } from "../data/buildings";

export default function Campus() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fff7f6_0%,#ffffff_45%,#f7f8fb_100%)] px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-950">RPI Campus Buildings</h1>
        <p className="mt-3 max-w-2xl text-zinc-600">
          Browse the full directory and open any building for its dedicated information page.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {buildings.map((building) => (
            <BuildingCard
              key={building.slug}
              name={building.name}
              abbreviation={building.abbreviation}
              description={building.description}
              seats={building.seats}
              slug={building.slug}
              image={building.image}
              tagline={building.tagline}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
