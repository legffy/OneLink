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
  {
    name: "Mueller Recreation Center",
    slug: "mueller-recreation",
    seats: 350,
    image: "/mueller.jpg",
    abbreviation: "MUELLER",
    tagline: "Fitness, intramural activity, and student recreation in one active hub.",
    description:
      "A campus recreation center designed for workouts, pickup games, group activities, and everyday student wellness.",
    location: "1643 15th St, Troy, NY 12180",
    hours: "Open daily, 8:00 AM to 11:00 PM",
    highlights: ["Indoor recreation space", "Popular fitness destination", "Supports sports and group activity"],
    facilities: ["Swimming pool", "Basketball courts", "Student lounge", "Weight rooms"],
  },
  {
    name: "'87 Gym",
    slug: "87-gym",
    seats: 200,
    image: "/87.jpg",
    abbreviation: "'87 GYM",
    tagline: "Courts, fitness space, and active student use throughout the day.",
    description:
      "A student recreation and athletics space used for open gym activity, workouts, and campus fitness programming.",
    location: "1145 Sage Ave, Troy, NY 12180",
    hours: "Open daily, 8:00 AM to 11:00 PM",
    highlights: ["Flexible recreation space", "Popular for active student use", "Supports pickup games and training"],
    facilities: ["Gym courts", "Fitness areas", "Open recreation space", "Student gathering areas"],
  },
  {
    name: "ECAV Stadium",
    slug: "ecav-stadium",
    seats: 200,
    image: "/ecav.jpg",
    abbreviation: "ECAV",
    tagline: "Outdoor competition, athletic events, and large-campus game day energy.",
    description:
      "A major outdoor athletics venue used for varsity competition, team practices, and larger campus sporting events.",
    location: "East Campus Athletic Village",
    hours: "Open daily, 8:00 AM to 11:00 PM",
    highlights: ["Outdoor stadium venue", "Hosts athletic events", "Designed for team competition and spectators"],
    facilities: ["Stadium seating", "Athletic field", "Event access areas", "Team support spaces"],
  },
];

export function getBuildingBySlug(slug: string) {
  return buildings.find((building) => building.slug === slug);
}

export async function getBuildingInfo() {
  try{ const res = await fetch("http://127.0.0.1:8000/api/buildings/"); 
      const data = await res.json();
      return data;
  }catch (error){ 
        console.error("Error fetching tree data:", error); 
      }     
    return {}
  }
