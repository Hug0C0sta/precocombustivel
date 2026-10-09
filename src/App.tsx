import Filters from "./components/Filters";
import NavBar from "./components/NavBar";

function App() {
  return (
    <>
      <NavBar />
      <main className="max-w-7xl bg-bg">
        <Filters />
      </main>
    </>
  );
}

export default App;
