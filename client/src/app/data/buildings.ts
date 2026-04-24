export type ApiScheduleState = "available" | "empty" | "out_of_range";

export type ApiScheduleWindow = {
  start_date: string | null;
  end_date: string | null;
};

export type ApiBuildingDailyEvent = {
  id: string;
  room_name: string;
  room_code: string;
  event_name: string;
  group_name?: string | null;
  start_time: string;
  end_time: string;
  is_all_day: boolean;
  status?: string | null;
};

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

export type ApiBuilding = {
  id: string;
  name: string;
  slug: string;
  campus: string;
  address?: string;
  description?: string;
  image_url?: string;
  selected_date?: string;
  schedule_state?: ApiScheduleState;
  schedule_window?: ApiScheduleWindow;
  daily_events?: ApiBuildingDailyEvent[];
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
  {
    name: "Mueller Armory Building",
    slug: "mueller-armory-building",
    seats: 250,
    image: "/rpi-armory.jpg",
    abbreviation: "ARMORY",
    tagline: "Historic campus space with flexible academic and student-facing use.",
    description:
      "A recognizable campus building that supports day-to-day circulation, meetings, and general academic activity.",
    location: "Main campus",
    hours: "Hours not listed yet",
    highlights: ["Historic character", "Flexible interior use", "Connected campus location"],
    facilities: ["Indoor access", "Shared spaces", "Campus wayfinding", "Accessible routes"],
  },
  {
    name: "Playhouse",
    slug: "playhouse",
    seats: 180,
    image: "/playhouse.jpg",
    abbreviation: "PLAYHOUSE",
    tagline: "Performance, rehearsal, and event space with a campus arts focus.",
    description:
      "A campus venue that supports performances, rehearsals, productions, and student event programming.",
    location: "Main campus arts corridor",
    hours: "Hours not listed yet",
    highlights: ["Performance venue", "Arts programming", "Event-ready space"],
    facilities: ["Stage access", "Audience seating", "Back-of-house areas", "Accessible entry"],
  },
  {
    name: "Center for Biotechnology and Interdisciplinary Studies",
    slug: "center-for-biotechnology-and-interdisciplinary-studies",
    seats: 400,
    image: "/cbis.jpg",
    abbreviation: "CBIS",
    tagline: "Research-driven labs and interdisciplinary academic space.",
    description:
      "A modern academic building focused on research, labs, and collaboration across scientific disciplines.",
    location: "Research and science district",
    hours: "Hours not listed yet",
    highlights: ["Research labs", "Interdisciplinary focus", "Modern academic environment"],
    facilities: ["Lab space", "Collaboration areas", "Academic offices", "Accessible entrances"],
  },
  {
    name: "Jonsson Rowland Science Center",
    slug: "j-rowl",
    seats: 350,
    image: "/jrowl.jpg",
    abbreviation: "J-ROWL",
    tagline: "Science classrooms, labs, and high-frequency academic use.",
    description:
      "A science-focused building that supports coursework, lab instruction, and steady daily student traffic.",
    location: "Science and engineering zone",
    hours: "Hours not listed yet",
    highlights: ["Science classrooms", "Lab access", "Central academic use"],
    facilities: ["Teaching labs", "Study space", "Shared hallways", "Accessible entry"],
  },
  {
    name: "Lally School of Management",
    slug: "lally",
    seats: 220,
    image: "/lally.jpg",
    abbreviation: "LALLY",
    tagline: "Management-focused classrooms and student-facing academic space.",
    description:
      "An academic building oriented around management education, meetings, and smaller-scale campus activity.",
    location: "Main campus academic core",
    hours: "Hours not listed yet",
    highlights: ["Management programs", "Smaller classroom spaces", "Academic services"],
    facilities: ["Meeting rooms", "Seating areas", "Classroom access", "Accessible pathways"],
  },
  {
    name: "Troy Building",
    slug: "troy",
    seats: 240,
    image: "/troy.jpg",
    abbreviation: "TROY",
    tagline: "Academic rooms and practical campus use in a compact footprint.",
    description:
      "A straightforward academic building used for classes, transitions between buildings, and everyday campus needs.",
    location: "Academic corridor",
    hours: "Hours not listed yet",
    highlights: ["Compact layout", "Classroom access", "Convenient campus placement"],
    facilities: ["Student seating", "Shared hallways", "Nearby entrances", "Accessible routes"],
  },
  {
    name: "Ned Harkness Field and Track",
    slug: "harkness",
    seats: 300,
    image: "/harkness.jpg",
    abbreviation: "HARKNESS",
    tagline: "Outdoor track and field space for athletics and training.",
    description:
      "An outdoor athletics venue used for track activity, training sessions, and event support throughout the season.",
    location: "Athletics district",
    hours: "Hours not listed yet",
    highlights: ["Track facilities", "Outdoor training", "Athletic events"],
    facilities: ["Track access", "Field space", "Spectator areas", "Team support areas"],
  },
  {
    name: "West Hall",
    slug: "west",
    seats: 260,
    image: "/west.jpg",
    abbreviation: "WEST",
    tagline: "Academic building with everyday classroom and student use.",
    description:
      "A campus academic space that supports classes, movement between buildings, and routine student activity.",
    location: "Main campus",
    hours: "Hours not listed yet",
    highlights: ["Classroom access", "Daily campus use", "Connected location"],
    facilities: ["Indoor seating", "Shared study areas", "Wayfinding support", "Accessible entrances"],
  },
  {
    name: "Commons Dining Hall",
    slug: "commons",
    seats: 500,
    image: "/commons.webp",
    abbreviation: "COMMONS",
    tagline: "Dining, gathering, and high-traffic student activity throughout the day.",
    description:
      "A central student dining destination that also serves as a social and between-class gathering point.",
    location: "Student life corridor",
    hours: "Hours not listed yet",
    highlights: ["Dining hub", "High student traffic", "Central gathering space"],
    facilities: ["Dining seating", "Food service", "Indoor tables", "Accessible entry"],
  },
  {
    name: "Darrin Hass",
    slug: "dcc-hass",
    seats: 280,
    image: "/darrin.png",
    abbreviation: "DCC HASS",
    tagline: "Shared academic space connected to classroom and departmental use.",
    description:
      "A campus academic building that supports classes, offices, and regular student movement through the area.",
    location: "Main academic corridor",
    hours: "Hours not listed yet",
    highlights: ["Academic access", "Shared campus use", "Central location"],
    facilities: ["Indoor seating", "Classroom access", "Shared hallways", "Accessible routes"],
  },
  {
    name: "Sharp Tennis Courts",
    slug: "sharp",
    seats: 150,
    image: "/sharp.jpg",
    abbreviation: "SHARP",
    tagline: "Outdoor tennis facilities for practice, play, and athletics.",
    description:
      "An outdoor athletics space used for tennis practice, competition, and campus recreation.",
    location: "Athletics district",
    hours: "Hours not listed yet",
    highlights: ["Tennis courts", "Outdoor recreation", "Athletic use"],
    facilities: ["Court access", "Spectator space", "Team areas", "Nearby walkways"],
  },
  {
    name: "Mueller Robison Pool",
    slug: "robison",
    seats: 180,
    image: "/robison.webp",
    abbreviation: "ROBISON",
    tagline: "Aquatics space for training, recreation, and team activity.",
    description:
      "A campus pool facility used for aquatics, recreation, and organized athletic programming.",
    location: "Recreation and athletics zone",
    hours: "Hours not listed yet",
    highlights: ["Pool facility", "Recreational use", "Athletic programming"],
    facilities: ["Pool deck", "Locker access", "Seating areas", "Accessible entry"],
  },
  {
    name: "Ricketts Building",
    slug: "ricketts-building",
    seats: 320,
    image: "/ricketts.jpg",
    abbreviation: "RICKETTS",
    tagline: "Academic building with lecture, classroom, and circulation space.",
    description:
      "A well-used academic building that supports classes, transitions, and routine campus activity throughout the day.",
    location: "Academic corridor",
    hours: "Hours not listed yet",
    highlights: ["Classroom use", "Lecture space", "Steady student traffic"],
    facilities: ["Indoor seating", "Classroom access", "Study areas", "Accessible routes"],
  },
  {
    name: "Jonsson Engineering Center",
    slug: "jec",
    image: "/jonsson.jpg",
    seats: 420,
    abbreviation: "JEC",
    tagline: "Engineering classrooms, labs, and collaborative student space.",
    description:
      "A core engineering building that supports labs, lectures, project work, and regular academic use.",
    location: "Engineering district",
    hours: "Hours not listed yet",
    highlights: ["Engineering focus", "Lab and lecture mix", "Project-oriented spaces"],
    facilities: ["Labs", "Classrooms", "Collaboration areas", "Accessible entrances"],
  },
  {
    name: "Rensselaer Union",
    slug: "rensselaer-union",
    seats: 600,
    image: "/union.jpg",
    abbreviation: "UNION",
    tagline: "Student life, meetings, events, and community activity in one hub.",
    description:
      "A major student-centered building that brings together organizations, events, social space, and daily campus activity.",
    location: "Student life core",
    hours: "Hours not listed yet",
    highlights: ["Student organizations", "Event space", "High-traffic campus hub"],
    facilities: ["Meeting rooms", "Lounge seating", "Event areas", "Accessible pathways"],
  },
  {
    name: "Lower Renwyck Turf Field",
    slug: "lower-renwyck-turf-field",
    seats: 220,
    image: "/renwyck.webp",
    abbreviation: "RENWYCK",
    tagline: "Outdoor turf venue for recreation, training, and field activity.",
    description:
      "An outdoor field space used for athletics, training, and campus recreation programming.",
    location: "Athletics district",
    hours: "Hours not listed yet",
    highlights: ["Turf field", "Outdoor athletics", "Training space"],
    facilities: ["Field access", "Sideline space", "Nearby walkways", "Support areas"],
  },
  {
    name: "Amos Eaton Hall",
    slug: "amos-eaton-hall",
    seats: 360,
    image: "/eaton.jpg",
    abbreviation: "EATON",
    tagline: "Academic building with science and classroom use across the day.",
    description:
      "A campus academic building that supports instruction, movement between classes, and shared university use.",
    location: "Academic core",
    hours: "Hours not listed yet",
    highlights: ["Classroom access", "Academic use", "Central location"],
    facilities: ["Indoor seating", "Shared study space", "Classroom areas", "Accessible entry"],
  },
  {
    name: "Sage Building",
    slug: "sage-building",
    seats: 300,
    image: "/sage_lab.jpg",
    abbreviation: "SAGE",
    tagline: "Historic academic space with classrooms and everyday campus use.",
    description:
      "A campus building used for academic activity, classrooms, and regular student circulation through the area.",
    location: "Main campus",
    hours: "Hours not listed yet",
    highlights: ["Academic space", "Historic campus presence", "Daily student use"],
    facilities: ["Classroom access", "Shared hallways", "Indoor seating", "Accessible routes"],
  },
];

const API_BASE_URL = "/api/buildings";

export function getBuildingBySlug(slug: string) {
  return buildings.find((building) => building.slug === slug);
}

export async function getBuildingInfo(): Promise<ApiBuilding[]> {
  try {
    const res = await fetch(API_BASE_URL);
    if (!res.ok) {
      throw new Error(`Failed to fetch buildings: ${res.status}`);
    }
    return (await res.json()) as ApiBuilding[];
  } catch (error) {
    console.error("Error fetching buildings data:", error);
    return [];
  }
}

export async function getBuildingById(id: string, date?: string): Promise<ApiBuilding | null> {
  try {
    const searchParams = new URLSearchParams();
    if (date) {
      searchParams.set("date", date);
    }

    const query = searchParams.toString();
    const res = await fetch(`${API_BASE_URL}/${id}${query ? `?${query}` : ""}`);

    if (!res.ok) {
      throw new Error(`Failed to fetch building: ${res.status}`);
    }

    return (await res.json()) as ApiBuilding;
  } catch (error) {
    console.error("Error fetching building data:", error);
    return null;
  }
}
