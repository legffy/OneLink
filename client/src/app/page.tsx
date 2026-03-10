import Image from "next/image";

export default function Home() {
  return (

<body>
<header className="navbar">
    <div className="navLeft">
        <h1 id="homeLink">OneLink</h1>
    </div>
    <div className="navRight">
        <a href="#" id="buildingLink">Buildings</a>
        <a href="#" id="mapLink">Map</a>
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
</body>


  );
}
