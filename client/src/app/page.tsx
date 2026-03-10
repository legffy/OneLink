"use client";

import { useState } from "react";

export default function Home() {
  const [view, setView] = useState("buildings");

  return (
      <>
        <header className="navbar">
          <div className="navLeft">
            <h1 id="homeLink" onClick={() => setView("buildings")}>
              OneLink
            </h1>
          </div>

          <div className="navRight">
            <a onClick={() => setView("buildings")}>Buildings</a>
            <a onClick={() => setView("map")}>Map</a>
            <a onClick={() => setView("announcements")}>Announcements</a>
          </div>
        </header>

        <main id="app">
          {view === "buildings" && (
              <section className="view">
                <h2>Campus Buildings</h2>
                <div id="buildingList"></div>
              </section>
          )}

          {view === "map" && (
              <section className="view">
                <h2>Campus Map</h2>
                <p>Map will go here later.</p>
              </section>
          )}

          {view === "announcements" && (
              <section className="view">
                <h2>Announcements</h2>
                <p>Emails will go here later.</p>
              </section>
          )}
        </main>
      </>
  );
}