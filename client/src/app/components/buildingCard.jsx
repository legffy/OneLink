import Link from "next/link";

export default function BuildingCard({ name, description, image, slug, seats, abbreviation }) {
  return (
    <div className="w-80 bg-white rounded-xl shadow-md p-4 m-4 hover:-translate-y-1 transition-transform duration-200">
      
      <h3 className="text-lg font-semibold mb-2">{name}</h3>

      <img
        src={image}
        alt={name}
        className="w-full h-40 object-cover rounded-md border-b-4 border-red-600"
      />

      <Link href={`/buildings/${slug}`}>
        <button className="w-full mt-3 py-2 border border-gray-400 rounded-md bg-gray-100 font-semibold hover:bg-gray-200">
          OPEN BUILDING PAGE
        </button>
      </Link>

      <p className="mt-2 text-sm text-gray-500">
        {description}
      </p>
    </div>
  );
}