"use client";
import { useState } from "react";

export default function Home() {
  const [open, setOpen] = useState(false);

  const buildings = [
    "Darrin Communications Center",
    "Low Center",
    "Russell Sage Laboratory",
    "Pittsburgh Building",
    "Folsom Library"
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

            {open && (
              <ul className="dropdownMenu">
                {buildings.map((building, index) => (
                  <li key={index} className="dropdownItem">
                    {building}
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
          <div id="buildingList"></div>
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