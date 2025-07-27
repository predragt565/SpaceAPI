import PlanetList from "./components/PlanetList";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-indigo-700 text-white p-6 text-center text-2xl font-bold">
        🌌 SpaceAPI Planet Explorer by Pred
      </header>
      <main className="max-w-7xl mx-auto">
        <PlanetList />
      </main>
    </div>
  );
}

export default App;
