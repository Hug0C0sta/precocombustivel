import { useState } from "react";
import {
  LocateFixed,
  MapPin,
  Radar,
  ChevronDown,
  SlidersHorizontal,
  Fuel,
} from "lucide-react";

import AutoCompleteCity from "./AutoCompleteCity";
import {
  useFilters,
  radiusOptions,
  fuelOptions,
} from "../contexts/FiltersContext";

export default function Filters() {
  const {
    radius,
    location,
    setRadius,
    fuelType,
    setFuelType,
    setLocation,
    setCoordinates,
  } = useFilters();

  const [isExpanded, setIsExpanded] = useState(false);

  function handleCurrentLocation() {
    if (!navigator.geolocation) {
      console.error("A geolocalização não é suportada neste browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        setLocation("Localização atual");
        setCoordinates([longitude, latitude]);
      },
      (error) => {
        console.error("Não foi possível obter a localização:", error.message);
      },
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl">
      {/* Cabeçalho mobile */}
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        aria-expanded={isExpanded}
        aria-controls="filters-content"
        className="flex w-full items-center justify-between rounded-xl border border-neutral/15 bg-elements p-4 transition-colors hover:bg-neutral/5 md:hidden"
      >
        <span className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
            <SlidersHorizontal size={19} />
          </span>

          <span className="text-left">
            <span className="block text-sm font-semibold text-primary">
              Filtros de pesquisa
            </span>

            <span className="mt-0.5 block text-xs text-neutral">
              <span className="block truncate">
                {location || "Seleciona uma localização"}
              </span>

              <span className="mt-0.5 block">
                Raio de {radius} km ·{" "}
                {fuelOptions.find((fuel) => fuel.id === fuelType)?.label ??
                  fuelType}
              </span>
            </span>
          </span>
        </span>

        <ChevronDown
          size={20}
          className={`shrink-0 text-neutral transition-transform duration-300 ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Conteúdo dos filtros */}
      <div
        id="filters-content"
        className={`${
          isExpanded ? "grid" : "hidden"
        } grid-cols-1 gap-5 pt-4 md:grid md:grid-cols-[minmax(0,1fr)_minmax(280px,auto)] md:items-end md:gap-4 md:pt-0 lg:grid-cols-[minmax(0,1fr)_320px_auto]`}
      >
        {/* Localização */}
        <div className="min-w-0">
          <label
            htmlFor="autocomplete_city"
            className="mb-2 flex items-center gap-2 text-sm font-medium text-primary"
          >
            <MapPin size={16} className="text-secondary" />
            Localização
          </label>

          <AutoCompleteCity />
        </div>

        {/* Raio de pesquisa */}
        <fieldset className="min-w-0">
          <legend className="mb-2 flex items-center gap-2 text-sm font-medium text-primary">
            <Radar size={16} className="text-secondary" />
            Raio de pesquisa
          </legend>

          <div className="flex h-12 w-full rounded-xl border border-neutral/15 bg-elements p-1">
            {radiusOptions.map((option) => {
              const isActive = radius === option;

              return (
                <label
                  key={option}
                  className={`flex flex-1 cursor-pointer items-center justify-center rounded-lg px-1 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-secondary text-white shadow-sm"
                      : "text-neutral hover:bg-neutral/10 hover:text-primary"
                  }`}
                >
                  <input
                    type="radio"
                    name="radius"
                    value={option}
                    checked={isActive}
                    onChange={() => setRadius(option)}
                    className="sr-only"
                  />

                  {option}
                  <span className="ml-0.5 text-xs">km</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        {/* Localização atual */}
        <div className="flex flex-col md:justify-end">
          <button
            type="button"
            onClick={handleCurrentLocation}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-secondary px-4 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:opacity-90 active:scale-[0.98] md:w-auto md:whitespace-nowrap"
          >
            <LocateFixed size={17} />
            Usar localização atual
          </button>
        </div>

        {/* Tipo de combustível */}
        <fieldset className="min-w-0 lg:col-span-1">
          <legend className="mb-2 flex items-center gap-2 text-sm font-medium text-primary">
            <Fuel size={16} className="text-secondary" />
            Tipo de combustível
          </legend>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-2 xl:grid-cols-4">
            {fuelOptions.map((fuel) => {
              const isActive = fuelType === fuel.id;

              return (
                <label
                  key={fuel.id}
                  className={`flex h-12 cursor-pointer items-center justify-center rounded-xl border px-2 text-center text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "border-secondary bg-secondary text-white shadow-sm"
                      : "border-neutral/15 bg-elements text-neutral hover:border-secondary/40 hover:text-primary"
                  }`}
                >
                  <input
                    type="radio"
                    name="fuelType"
                    value={fuel.id}
                    checked={isActive}
                    onChange={() => setFuelType(fuel.id)}
                    className="sr-only"
                  />

                  {fuel.label}
                </label>
              );
            })}
          </div>
        </fieldset>
      </div>
    </div>
  );
}
