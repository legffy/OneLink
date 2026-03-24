"use client";

import BuildingCard from "./components/buildingCard";

export default function Home() {
  const buildings = [
    {
      name: "Darrin Communications Center",
      slug: "darrin-communications-center",
      seats: 550,
      image: "darrin.png",
      abbreviation: "DCC",
    },
    {
      name: "Low Center",
      slug: "low-center",
      seats: 550,
      image: "low.jpg",
      abbreviation: "LOW",
    },
    {
      name: "Russell Sage Laboratory",
      slug: "russell-sage-laboratory",
      seats: 550,
      image: "sage_lab.jpg",
      abbreviation: "SAGE LABORATORY",
    },
    {
      name: "Pittsburgh Building",
      slug: "pittsburgh-building",
      seats: 550,
      image: "pittsburgh.jpg",
      abbreviation: "PITTSBURGH",
    },
    {
      name: "Folsom Library",
      slug: "folsom-library",
      seats: 900,
      image: "folsom_library.jpg",
      abbreviation: "FOLSOM",
    },
  ];

  return (
    <main id="app">
      <section id="buildingView" className="view">
        <h2>Campus Buildings</h2>
        <div className="flex flex-wrap justify-center">
          {buildings.map((building) => (
            <BuildingCard
              key={building.slug}
              name={building.name}
              slug={building.slug}
              description="Quick access to building information."
              image={building.image}
              seats={building.seats}
              abbreviation={building.abbreviation}
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
