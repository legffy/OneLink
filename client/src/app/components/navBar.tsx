"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { buildings } from "../data/buildings";

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuId = "building-menu";

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
            type="button"
            id="buildingLink"
            onClick={() => setOpen(!open)}
            className="dropdownButton"
            aria-expanded={open}
            aria-controls={menuId}
            aria-haspopup="menu"
          >
            Buildings &#9662;
          </button>
          {open && (
            <ul id={menuId} className="dropdownMenu" role="menu" aria-labelledby="buildingLink">
              {buildings.map((building) => (
                <li key={building.slug} className="dropdownItem" role="none">
                  <Link href={`/buildings/${building.slug}`} onClick={() => setOpen(false)} role="menuitem">
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
