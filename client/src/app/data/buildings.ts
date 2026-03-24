export type Building = {
  name: string;
  slug: string;
  seats: number;
  image: string;
  abbreviation: string;
  tagline: string;
  description: string;
  location: string;
  hours: string;
  highlights: string[];
  facilities: string[];
};

export const buildings: Building[] = [
  {
    name: "Darrin Communications Center",
    slug: "darrin-communications-center",
    seats: 550,
    image: "/darrin.png",
    abbreviation: "DCC",
    tagline: "Lecture halls, event flow, and high-traffic classroom space.",
    description:
      "A busy academic building built for movement between classes, presentations, and larger campus gatherings.",
    location: "15th Street academic corridor",
    hours: "Open daily, 7:00 AM to 11:00 PM",
    highlights: ["Large lecture rooms", "Central location", "Fast between-class access"],
    facilities: ["Study corners", "Indoor seating", "Nearby food options", "Accessible entrances"],
  },
  {
    name: "Low Center",
    slug: "low-center",
    seats: 550,
    image: "/low.jpg",
    abbreviation: "LOW",
    tagline: "Student-facing services and administrative support in one place.",
    description:
      "A central stop for campus operations with frequent foot traffic and quick access to nearby academic buildings.",
    location: "Main campus core",
    hours: "Open weekdays, 8:00 AM to 6:00 PM",
    highlights: ["Central services", "Easy to find", "Useful starting point for visitors"],
    facilities: ["Lobby seating", "Service counters", "Meeting areas", "Accessible pathways"],
  },
  {
    name: "Russell Sage Laboratory",
    slug: "russell-sage-laboratory",
    seats: 550,
    image: "/sage_lab.jpg",
    abbreviation: "SAGE LAB",
    tagline: "Labs, classrooms, and technical spaces with an academic focus.",
    description:
      "A practical building oriented around coursework, lab access, and day-to-day academic use.",
    location: "Science and engineering zone",
    hours: "Open daily, 7:30 AM to 10:00 PM",
    highlights: ["Lab-oriented spaces", "Classroom access", "Strong academic usage"],
    facilities: ["Project rooms", "Technical labs", "Quiet hallways", "Accessible entrances"],
  },
  {
    name: "Pittsburgh Building",
    slug: "pittsburgh-building",
    seats: 550,
    image: "/pittsburgh.jpg",
    abbreviation: "PITTSBURGH",
    tagline: "A compact academic stop with classrooms and everyday campus utility.",
    description:
      "A straightforward building that supports regular course traffic and quick transitions across campus.",
    location: "Connected academic corridor",
    hours: "Open daily, 8:00 AM to 9:00 PM",
    highlights: ["Convenient layout", "Classroom access", "Short walk to adjacent buildings"],
    facilities: ["Student seating", "Hallway study spots", "Nearby entrances", "Accessible routes"],
  },
  {
    name: "Folsom Library",
    slug: "folsom-library",
    seats: 900,
    image: "/folsom_library.jpg",
    abbreviation: "FOLSOM",
    tagline: "Research, quiet study, and collaborative work under one roof.",
    description:
      "A flagship study destination with room for focused work, group collaboration, and longer academic sessions.",
    location: "Library plaza",
    hours: "Open daily, 8:00 AM to midnight",
    highlights: ["Largest seating capacity", "Quiet and group study", "Popular study destination"],
    facilities: ["Study tables", "Research support", "Collaborative seating", "Accessible entry"],
  },
];

export function getBuildingBySlug(slug: string) {
  return buildings.find((building) => building.slug === slug);
}
