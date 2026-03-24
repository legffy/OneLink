"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

const buildings = [
  {
    name: "Darrin Communications Center",
    slug: "darrin-communications-center",
  },
  {
    name: "Low Center",
    slug: "low-center",
  },
  {
    name: "Russell Sage Laboratory",
    slug: "russell-sage-laboratory",
  },
  {
    name: "Pittsburgh Building",
    slug: "pittsburgh-building",
  },
  {
    name: "Folsom Library",
    slug: "folsom-library",
  },
];

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="navbar">
      <div className="navLeft">
        <Link href="/" id="homeLink">
          OneLink
        </Link>
      </div>

      <div className="navRight">
        <div className="dropdown" ref={dropdownRef}>
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
                  <Link href={`/buildings/${building.slug}`}>
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
