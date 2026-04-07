"use client";

import BuildingCard from "./components/buildingCard";
import { getBuildingInfo } from "./data/buildings";
import { useState, useEffect } from "react";
import type { ApiBuilding } from "./data/buildings";

export default function Home() {
    const [buildings, setBuildings] = useState<ApiBuilding[]>([]);

    useEffect(() => {
      getBuildingInfo().then((data) => {
      setBuildings(data);
      });
    }, []);
  
  return (
    <main id="app" className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(200,16,46,0.12),transparent_36%),linear-gradient(180deg,#fff8f5_0%,#ffffff_48%,#f5f7fb_100%)] px-6 py-10">
      <section id="buildingView" className="view mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="mb-3 inline-flex rounded-full border border-red-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-red-700">
            Building directory
          </p>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
            Choose a building to open a dedicated information page.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600">
            Each card opens a page with location details, hours, capacity, and what the building is best used for.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {buildings.map((building) => (
            <BuildingCard
              key={building.id}
              name={building.name}
              slug={building.slug}
              campus={building.campus}
              id={building.id}
              imageUrl={building.image_url}
            />
          ))}
        </div>
      </section>

      <section id="mapView" className="view hidden">
        <h2>Campus Map</h2>
        <p>Map will go here later.</p>
      </section>

      <section id="announcementView" className="view hidden">
        <h2>Announcements</h2>
        <p>Emails will go here later.</p>
      </section>
    </main>
  );
}
