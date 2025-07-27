import { useState } from "react";

export default function AddPlanetForm({ onAdd }) {
  const [formData, setFormData] = useState({
    name: "",
    img_url: "",
    fact: "", // <- Einzelner Fakt
    diameter_km: "",
    distance_from_sun_km: "",
    mass_earths: "",
    orbital_period_days: "",
    orbital_period_years: "",
    moons: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

function handleSubmit(e) {
  e.preventDefault();

  const data = {
    name: formData.name,
    img_url: formData.img_url,
    facts: formData.fact ? [formData.fact] : [],
    ...(formData.diameter_km !== "" && { diameter_km: Number(formData.diameter_km) }),
    ...(formData.distance_from_sun_km !== "" && { distance_from_sun_km: Number(formData.distance_from_sun_km) }),
    ...(formData.mass_earths !== "" && { mass_earths: Number(formData.mass_earths) }),
    ...(formData.orbital_period_days !== "" && { orbital_period_days: Number(formData.orbital_period_days) }),
    ...(formData.orbital_period_years !== "" && { orbital_period_years: Number(formData.orbital_period_years) }),
    ...(formData.moons !== "" && { moons: Number(formData.moons) }),
  };

  fetch("http://localhost:8000/planets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Failed to add planet");
      return res.json();
    })
    .then((newPlanet) => {
      onAdd(newPlanet);
      setFormData({
        name: "",
        img_url: "",
        fact: "",
        diameter_km: "",
        distance_from_sun_km: "",
        mass_earths: "",
        orbital_period_days: "",
        orbital_period_years: "",
        moons: "",
      });
    })
    .catch((err) => alert(err.message));
}

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow mb-6">
      <h2 className="text-xl font-bold">Add a Planet</h2>

      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Planet Name *"
        className="border p-2 w-full"
        required
      />

      <input
        name="img_url"
        value={formData.img_url}
        onChange={handleChange}
        placeholder="Image URL *"
        className="border p-2 w-full"
        required
      />

      <input
        name="fact"
        value={formData.fact}
        onChange={handleChange}
        placeholder="Fact *"
        className="border p-2 w-full"
        required
      />

      <input
        name="diameter_km"
        value={formData.diameter_km}
        onChange={handleChange}
        placeholder="Diameter (km)"
        className="border p-2 w-full"
      />

      <input
        name="distance_from_sun_km"
        value={formData.distance_from_sun_km}
        onChange={handleChange}
        placeholder="Distance from Sun (km)"
        className="border p-2 w-full"
      />

      <input
        name="mass_earths"
        value={formData.mass_earths}
        onChange={handleChange}
        placeholder="Mass (Earth = 1)"
        className="border p-2 w-full"
      />

      <input
        name="orbital_period_days"
        value={formData.orbital_period_days}
        onChange={handleChange}
        placeholder="Orbital Period (days)"
        className="border p-2 w-full"
      />

      <input
        name="orbital_period_years"
        value={formData.orbital_period_years}
        onChange={handleChange}
        placeholder="Orbital Period (years)"
        className="border p-2 w-full"
      />

      <input
        name="moons"
        value={formData.moons}
        onChange={handleChange}
        placeholder="Number of Moons"
        className="border p-2 w-full"
      />

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Add Planet
      </button>
    </form>
  );
}
