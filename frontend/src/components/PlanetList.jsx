import { useEffect, useState } from "react";
import PlanetCard from "./PlanetCard";
import AddPlanetForm from "./AddPlanetForm";
import EditPlanetForm from "./EditPlanetForm";

export default function PlanetList() {
  const [planets, setPlanets] = useState([]);
  const [error, setError] = useState("");
  const [editingPlanet, setEditingPlanet] = useState(null);
  const [formExpanded, setFormExpanded] = useState(false);

  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchId, setSearchId] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState("");

  useEffect(() => {
    fetchPlanets();
  }, []);

  function toggleForm() {
    setFormExpanded((prev) => !prev);
  }

  function fetchPlanets() {
    fetch("http://localhost:8000/planets")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch planets");
        return res.json();
      })
      .then(setPlanets)
      .catch((err) => setError(err.message));
  }

  function handleDelete(id) {
    fetch(`http://localhost:8000/planets/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete planet");
        setPlanets(planets.filter((p) => p.id !== id));

        // Reset and collapse Search section
        setSearchId("");
        setSearchName("");
        setSearchResult(null);
        setSearchError("");
        setSearchExpanded(false);
      })
      .catch((err) => alert(err.message));
  }

  function handleAdd(newPlanet) {
    setPlanets([...planets, newPlanet]);
  }

  function handleEdit(updatedPlanet) {
    setPlanets((prev) =>
      prev.map((planet) => (planet.id === updatedPlanet.id ? updatedPlanet : planet))
    );
    setEditingPlanet(null); // switch to AddPlanetForm
    setFormExpanded(false); // collapse the Edit form section
    setSearchId(""); // Reset search section
    setSearchName("");
    setSearchResult(null);
    setSearchError("");
    setSearchExpanded(false);
  }

  function editPlanet(planet) {
    setEditingPlanet(planet);
    setFormExpanded(true);
    setSearchExpanded(false); // collapse the Search form section
    window.scrollTo({ top: 0, behavior: "smooth" }); // <-- scroll to top
  }

  function handleCancelEdit() {
    setEditingPlanet(null);
    setFormExpanded(false);
    window.scrollTo({ top: 0, behavior: "smooth" }); // <-- scroll to top
  }

  async function searchPlanet() {
    setSearchResult(null);
    setSearchError("");

    // Search by ID if provided
    if (searchId.trim()) {
      try {
        const res = await fetch(`http://localhost:8000/planets/${searchId}`);
        if (!res.ok) {
          throw new Error("Planet not found by ID.");
        }
        const planet = await res.json();
        setSearchResult(planet);
        return;
      } catch (err) {
        setSearchError(err.message);
        return;
      }
    }

    // Search by name if provided
    if (searchName.trim()) {
      try {
        const res = await fetch("http://localhost:8000/planets");
        if (!res.ok) {
          throw new Error("Failed to fetch planets.");
        }
        const data = await res.json();
        const match = data.find(
          (planet) => planet.name.toLowerCase() === searchName.toLowerCase()
        );
        if (match) {
          setSearchResult(match);
        } else {
          setSearchError("No planet found by name.");
        }
      } catch (err) {
        setSearchError(err.message);
      }
      return;
    }

    // No input at all
    setSearchError("Please enter a planet ID or name.");
  }

  if (error) {
    return <div className="text-red-600 text-center mt-10">Error: {error}</div>;
  }

  return (
    <div className="p-6">
      {/* Search Section */}
      <div className="bg-white rounded shadow mb-6">
        <div
          className="cursor-pointer bg-blue-100 px-6 py-4 font-bold text-lg"
          onClick={() => setSearchExpanded((prev) => !prev)}
        >
          Search for a Planet (click to {searchExpanded ? "collapse" : "expand"})
        </div>

        {searchExpanded && (
          <div className="px-6 pb-6 pt-4 space-y-3">
            <input
              type="text"
              placeholder="Planet Id"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="border rounded p-2 w-full"
            />
            <input
              type="text"
              placeholder="Planet Name"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="border rounded p-2 w-full"
            />
            <button
              onClick={searchPlanet}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Search
            </button>
            {searchError && <div className="text-red-500">{searchError}</div>}
            {searchResult && (
              <div className="pt-4">
                <PlanetCard
                  planet={searchResult}
                  onDelete={handleDelete}
                  onEdit={editPlanet}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Form Section */}
      <div className="bg-white rounded shadow mb-6">
        <div
          className="cursor-pointer bg-gray-100 px-6 py-4 font-bold text-lg"
          onClick={toggleForm}
        >
          {editingPlanet
            ? `Edit a Planet (click to ${formExpanded ? "collapse" : "expand"})`
            : `Add a Planet (click to ${formExpanded ? "collapse" : "expand"})`}
        </div>

        {formExpanded && (
          <div className="px-6 pb-6 pt-4">
            {editingPlanet ? (
              <EditPlanetForm
                planet={editingPlanet}
                onEditDone={handleEdit}
                onCancel={handleCancelEdit}
              />
            ) : (
              <AddPlanetForm onAdd={handleAdd} />
            )}
          </div>
        )}
      </div>

      {/* Planet Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {planets.map((planet) => (
          <PlanetCard
            key={planet.id}
            planet={planet}
            onDelete={handleDelete}
            onEdit={editPlanet}
          />
        ))}
      </div>
    </div>
  );
}
