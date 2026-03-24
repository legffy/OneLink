"use client";
import { useState } from "react";
import Link from "next/link";
import BuildingCard from "./components/buildingCard";

export default function Home() {
  const [open, setOpen] = useState(false);

  const buildings = [
  { name: "Darrin Communications Center", slug: "darrin-communications-center" , seats: 550, image: "bot.png", abbreviation: "DCC"},
  { name: "Low Center", slug: "low-center", seats: 550, image: "bot.png", abbreviation: "LOW"},
  { name: "Russell Sage Laboratory", slug: "russell-sage-laboratory", seats: 550, image: "bot.png", abbreviation: "SAGE LABORATORY" },
  { name: "Pittsburgh Building", slug: "pittsburgh-building", seats: 550, image: "bot.png", abbreviation: "PITTSBURGH"},
  { name: "Folsom Library", slug: "folsom-library", seats: 900, image: "bot.png", abbreviation: "FOLSOM"}
  ];



  return (
    <div>
      <header className="navbar">
        <div className="navLeft">
          <h1 id="homeLink">OneLink</h1>
        </div>

        <div className="navRight">
          <div className="dropdown">
            <button
              id="buildingLink"
              onClick={() => setOpen(!open)}
              className="dropdownButton"
            >
              Buildings ▼
            </button>
            {/* Drop down menu */}
            {open && (
             <ul className="dropdownMenu">
                {buildings.map((building) => (
                  <li key={building.slug} className="dropdownItem">
                    <Link href={`/buildings/${building.slug}`}>
                      {building.name}
                    </Link>
                  </li>
                  ))}
              </ul>
            )}
          </div>

          <a href="https://www.arch.rpi.edu/wp-content/uploads/RPI_Campus_Map.pdf" id="mapLink">Map</a>
          <a href="#" id="announcementsLink">Announcements</a>
        </div>
      </header>

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
    </div>
  );
}
