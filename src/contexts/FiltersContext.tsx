import { createContext, useContext, useState, type ReactNode } from "react";

export const fuelOptions = [
  { id: "gasoleo", label: "Gasóleo" },
  { id: "gasolina95", label: "Gasolina 95" },
  { id: "gasolina98", label: "Gasolina 98" },
  { id: "gpl", label: "GPL" },
] as const;

export type FuelType = (typeof fuelOptions)[number]["id"];

export const radiusOptions = [5, 10, 15, 25, 50] as const;

export type Coordinates = [number, number];

type FiltersContextType = {
  location: string;
  coordinates: Coordinates | null;
  radius: number;
  fuelType: FuelType;
  setLocation: (location: string) => void;
  setCoordinates: (coordinates: Coordinates | null) => void;
  setRadius: (radius: number) => void;
  setFuelType: (fuelType: FuelType) => void;
  resetFilters: () => void;
};

const FiltersContext = createContext<FiltersContextType | undefined>(undefined);

export function FiltersProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState("");
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [radius, setRadius] = useState(10);
  const [fuelType, setFuelType] = useState<FuelType>("gasoleo");

  function resetFilters() {
    setLocation("");
    setCoordinates(null);
    setRadius(10);
    setFuelType("gasoleo");
  }

  return (
    <FiltersContext.Provider
      value={{
        location,
        coordinates,
        radius,
        fuelType,
        setLocation,
        setCoordinates,
        setRadius,
        setFuelType,
        resetFilters,
      }}
    >
      {children}
    </FiltersContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FiltersContext);

  if (!context) {
    throw new Error("useFilters must be used within a FiltersProvider");
  }

  return context;
}
