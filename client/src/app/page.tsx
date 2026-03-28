"use client";

import BuildingCard from "./components/buildingCard";
import { buildings } from "./data/buildings";

export default function Home() {
  const [open, setOpen] = useState(false);

  const buildings = [
  { name: "Darrin Communications Center", slug: "darrin-communications-center" , seats: 550, image: "bot.png", abbreviation: "DCC"},
  { name: "Low Center", slug: "low-center", seats: 550, image: "bot.png", abbreviation: "LOW"},
  { name: "Russell Sage Laboratory", slug: "russell-sage-laboratory", seats: 550, image: "bot.png", abbreviation: "SAGE LABORATORY" },
  { name: "Pittsburgh Building", slug: "pittsburgh-building", seats: 550, image: "bot.png", abbreviation: "PITTSBURGH"},
  { name: "Folsom Library", slug: "folsom-library", seats: 900, image: "bot.png", abbreviation: "FOLSOM"}
  ];
  const [apibuildings, setApiBuildings] = useState({});
  const getBuildingInfo = async () => {
    try{
      const res = await fetch("http://127.0.0.1:8000/api/buildings/");
      const data = await res.json();
      setApiBuildings(data);
      console.log("Feteched building data:",data);
    } catch (error){
      console.error("Error fetching tree data:", error);
    }
  }
  const [treeData, setTreeData] = useState<Node[]>([]);
  const fetchTreeData = async () => {
    try {
      const res = await fetch("http://localhost:8000/all_instruments_by_scale");
      const data = await res.json();
      let newTreeData: Node[] | undefined = createTree(data);
      setTreeData(newTreeData || [{ name: "No data", children: undefined }]);
      console.log("Fetched tree data:", data);
    } catch (error) {
      console.error("Error fetching tree data:", error);
    }
  };
  useEffect(() => {
    fetchTreeData();
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
            Each card opens a fuller page with location details, hours, capacity, and what the building is best used for.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {buildings.map((building) => (
            <BuildingCard
              key={building.slug}
              name={building.name}
              slug={building.slug}
              description={building.description}
              image={building.image}
              seats={building.seats}
              abbreviation={building.abbreviation}
              tagline={building.tagline}
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
