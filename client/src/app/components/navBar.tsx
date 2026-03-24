"use client";

import { useState } from "react";
import Link from "next/link";
import { buildings } from "../data/buildings";

export default function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="navLeft">
        <Link href="/" id="homeLink">
          OneLink
        </Link>
      </div>

      <div className="navRight">
        <div className="dropdown">
          <button
            id="buildingLink"
            onClick={() => setOpen(!open)}
            className="dropdownButton"
          >
            Buildings &#9662;
          </button>
          {open && (
            <ul className="dropdownMenu">
              {buildings.map((building) => (
                <li key={building.slug} className="dropdownItem">
                  <Link href={`/buildings/${building.slug}`} onClick={() => setOpen(false)}>
                    {building.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <a
          href="https://www.arch.rpi.edu/wp-content/uploads/RPI_Campus_Map.pdf"
          id="mapLink"
        >
          Map
        </a>
        <a href="#" id="announcementsLink">
          Announcements
        </a>
      </div>
    </header>
  );
}
