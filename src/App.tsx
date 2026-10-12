import Filters from "./components/Filters";
import Footer from "./components/Footer";
import Map from "./components/Map";
import NavBar from "./components/NavBar";
import StationsList from "./components/StationsList";
import { FiltersProvider } from "./contexts/FiltersContext";

function App() {
  return (
    <>
      <NavBar />
      <FiltersProvider>
        <div className=" flex w-full justify-center p-4 bg-white dark:bg-bg md:py-4 border-b border-neutral/15">
          <Filters />
        </div>
        <main className="w-full bg-bg p-4">
          <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-stretch gap-4 md:grid-cols-5">
            <div className="min-w-0 md:col-span-2">
              <StationsList />
            </div>
            <div className="min-w-0 md:col-span-3">
              <Map />
            </div>
          </div>
        </main>
      </FiltersProvider>
      <Footer />
    </>
  );
}

export default App;
