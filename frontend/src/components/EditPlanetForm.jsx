import { useState, useEffect } from "react";

export default function EditPlanetForm({ planet, onEditDone, onCancel }) {
  const [formData, setFormData] = useState({ ...planet, fact: planet.facts?.[0] || "" });

  useEffect(() => {
    setFormData({ ...planet, fact: planet.facts?.[0] || "" });
  }, [planet]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    const updatedPlanet = {
      ...formData,
      facts: formData.fact ? [formData.fact] : [],
      diameter_km: formData.diameter_km ? Number(formData.diameter_km) : undefined,
      distance_from_sun_km: formData.distance_from_sun_km ? Number(formData.distance_from_sun_km) : undefined,
      mass_earths: formData.mass_earths ? Number(formData.mass_earths) : undefined,
      orbital_period_days: formData.orbital_period_days ? Number(formData.orbital_period_days) : undefined,
      orbital_period_years: formData.orbital_period_years ? Number(formData.orbital_period_years) : undefined,
      moons: formData.moons ? Number(formData.moons) : undefined,
    };

    fetch(`http://localhost:8000/planets/${planet.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedPlanet),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to edit planet");
        return res.json();
      })
      .then((editedPlanet) => {
        onEditDone(editedPlanet);
      })
      .catch((err) => alert(err.message));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-yellow-100 p-6 rounded shadow mb-6">
      <h2 className="text-xl font-bold">Edit a Planet</h2>

      {[
        ["name", "Planet Name *"],
        ["img_url", "Image URL *"],
        ["fact", "Fact *"],
        ["diameter_km", "Diameter (km)"],
        ["distance_from_sun_km", "Distance from Sun (km)"],
        ["mass_earths", "Mass (Earth = 1)"],
        ["orbital_period_days", "Orbital Period (days)"],
        ["orbital_period_years", "Orbital Period (years)"],
        ["moons", "Number of Moons"],
      ].map(([field, placeholder]) => (
        <input
          key={field}
          name={field}
          value={formData[field] ?? ""}
          onChange={handleChange}
          placeholder={placeholder}
          className="border p-2 w-full"
          required={["name", "img_url", "fact"].includes(field)}
        />
      ))}

      <div className="flex gap-4">
        <button
          type="submit"
          className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
        >
          Save Changes
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          Cancel Edit
        </button>
      </div>
    </form>
  );
}
