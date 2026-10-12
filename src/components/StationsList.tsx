import {
  MapPin,
  Navigation,
  Fuel,
  ChevronRight,
  Clock,
  Euro,
} from "lucide-react";

import { useFuelStations } from "../hooks/useFuelStations";
import type { FuelStation } from "../hooks/useFuelStations";
import { useFuelStationDetails } from "../hooks/useFuelStationDetails";
import { useFilters } from "../contexts/FiltersContext";

function getDistanceInKm(
  coordinatesA: [number, number],
  coordinatesB: [number, number],
): number {
  const earthRadiusKm = 6371;
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

  const [longitudeA, latitudeA] = coordinatesA;
  const [longitudeB, latitudeB] = coordinatesB;

  const latitudeDifference = toRadians(latitudeB - latitudeA);
  const longitudeDifference = toRadians(longitudeB - longitudeA);

  const a =
    Math.sin(latitudeDifference / 2) ** 2 +
    Math.cos(toRadians(latitudeA)) *
      Math.cos(toRadians(latitudeB)) *
      Math.sin(longitudeDifference / 2) ** 2;

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function openDirections(station: FuelStation) {
  const [longitude, latitude] = station.coordinates;

  window.open(
    `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`,
    "_blank",
    "noopener,noreferrer",
  );
}

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function matchesFuelType(description: string, selectedFuelType: string) {
  const fuel = normalize(description);

  const terms: Record<string, string[]> = {
    gasoleo: ["gasoleo simples", "gasoleo"],
    gasolina95: ["gasolina simples 95", "gasolina 95"],
    gasolina98: ["gasolina 98"],
    gpl: ["gpl auto", "gpl"],
  };

  return (terms[selectedFuelType] ?? []).some((term) =>
    fuel.includes(normalize(term)),
  );
}

interface StationCardProps {
  station: FuelStation;
  distance: number;
}

function StationCard({ station, distance }: StationCardProps) {
  const { fuelType } = useFilters();
  const {
    data: details,
    isLoading,
    isError,
  } = useFuelStationDetails(station.id);

  const selectedPrice = details?.prices.find((price) =>
    matchesFuelType(price.fuelType, fuelType),
  );

  return (
    <article className="group rounded-2xl border border-neutral/15 bg-elements p-4 transition-all duration-200 hover:border-secondary/40 hover:shadow-md sm:p-5">
      <div className="flex items-start gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
          <Fuel size={21} aria-hidden="true" />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-primary">{station.name}</h3>

          <div className="mt-1.5 flex items-center gap-1.5 text-sm text-neutral">
            <MapPin size={15} className="shrink-0" aria-hidden="true" />
            <span>{distance.toFixed(1)} km de distância</span>
          </div>

          {details?.address && (
            <p className="mt-1 text-xs text-neutral">{details.address}</p>
          )}
        </div>

        <button
          type="button"
          aria-label={`Ver localização de ${station.name} no Google Maps`}
          onClick={() => openDirections(station)}
          className="flex size-8 shrink-0 items-center justify-center rounded-lg text-neutral transition-colors hover:bg-secondary/10 hover:text-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
        >
          <ChevronRight size={19} aria-hidden="true" />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-secondary/5 p-3">
          <div className="flex items-center gap-2 text-sm text-neutral">
            <Euro size={16} aria-hidden="true" />
            <span>Preço do combustível</span>
          </div>

          <p className="mt-1 font-semibold text-primary">
            {isLoading
              ? "A carregar preço..."
              : isError
                ? "Indisponível"
                : (selectedPrice?.price ?? "Preço indisponível")}
          </p>

          {selectedPrice?.updatedAt && (
            <p className="mt-1 text-xs text-neutral">
              Atualizado: {selectedPrice.updatedAt}
            </p>
          )}
        </div>

        <div className="rounded-xl bg-secondary/5 p-3">
          <div className="flex items-center gap-2 text-sm text-neutral">
            <Clock size={16} aria-hidden="true" />
            <span>Horário</span>
          </div>

          <p className="mt-1 text-sm font-medium text-primary">
            {isLoading
              ? "A carregar horário..."
              : details?.openingHours || "Horário não disponível"}
          </p>
        </div>
      </div>

      <div className="mt-4 flex justify-end border-t border-neutral/10 pt-3">
        <button
          type="button"
          onClick={() => openDirections(station)}
          className="inline-flex items-center gap-2 rounded-lg bg-secondary/10 px-3 py-2 text-sm font-semibold text-secondary transition-colors hover:bg-secondary hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
        >
          <Navigation size={15} aria-hidden="true" />
          Como chegar
        </button>
      </div>
    </article>
  );
}

export default function StationsList() {
  const { data: stations = [], isLoading, isError } = useFuelStations();

  const { coordinates, radius } = useFilters();

  const nearbyStations = coordinates
    ? stations
        .map((station) => ({
          ...station,
          distance: getDistanceInKm(coordinates, station.coordinates),
        }))
        .filter((station) => station.distance <= radius)
        .sort((a, b) => a.distance - b.distance)
    : [];

  return (
    <section className="flex h-150 min-h-0 flex-col md:h-175">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-primary">
            Postos de combustível
          </h2>

          <p className="mt-1 text-sm text-neutral">
            Encontra postos perto de ti
          </p>
        </div>

        <span className="shrink-0 rounded-full bg-secondary/10 px-3 py-1.5 text-sm font-semibold text-secondary">
          {isLoading ? "A carregar..." : `${nearbyStations.length} postos`}
        </span>
      </div>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-2">
        {isLoading ? (
          <p className="py-8 text-center text-sm text-neutral">
            A carregar postos de combustível...
          </p>
        ) : isError ? (
          <p className="py-8 text-center text-sm text-red-500">
            Não foi possível carregar os postos.
          </p>
        ) : !coordinates ? (
          <p className="py-8 text-center text-sm text-neutral">
            Seleciona uma localização para encontrares postos próximos.
          </p>
        ) : nearbyStations.length === 0 ? (
          <p className="py-8 text-center text-sm text-neutral">
            Não foram encontrados postos num raio de {radius} km.
          </p>
        ) : (
          nearbyStations.map((station) => {
            const distance = getDistanceInKm(coordinates, station.coordinates);

            return (
              <StationCard
                key={station.id}
                station={station}
                distance={distance}
              />
            );
          })
        )}
      </div>
    </section>
  );
}
