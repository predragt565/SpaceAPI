export default function PlanetCard({ planet, onDelete, onEdit }) {
  return (
    <div className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition relative flex flex-col">
      <img
        src={planet.img_url}
        alt={planet.name}
        className="w-full aspect-square object-cover"
        loading="lazy"
        decoding="async"
      />
      <div className="p-4 flex flex-col flex-grow">
        <h2 className="text-xl font-bold mb-1">{planet.name}</h2>
        <ul className="text-sm text-gray-700 space-y-1">
          <li><strong>Mass:</strong> {planet.mass_earths ?? "Unknown"} Earths</li>
          <li><strong>Diameter:</strong> {planet.diameter_km?.toLocaleString() ?? "Unknown"} km</li>
          <li><strong>Distance:</strong> {planet.distance_from_sun_km?.toLocaleString() ?? "Unknown"} km</li>
          <li><strong>Orbital period (days):</strong> {planet.orbital_period_days?.toLocaleString() ?? "n/a"}</li>
          <li><strong>Orbital period (years):</strong> {planet.orbital_period_years?.toLocaleString() ?? "n/a"}</li>
          <li><strong>Moons:</strong> {planet.moons ?? "Unknown"}</li>
          <li><strong>Facts:</strong> {planet.facts[0]?.toLocaleString() ?? "Unknown"}</li>
        </ul>

        <div className="flex gap-2 mt-auto pt-2">
          <button
            onClick={() => {
              const confirmed = window.confirm(`Are you sure you want to delete "${planet.name}"?`);
              if (confirmed) {
                onDelete(planet.id);
              }
            }}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Delete
          </button>

          <button
            onClick={() => onEdit(planet)}
            className="bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-500"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}
