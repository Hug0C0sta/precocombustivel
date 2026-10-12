import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from "react-leaflet";
import L from "leaflet";

import "leaflet/dist/leaflet.css";

import { useFilters } from "../contexts/FiltersContext";
import { useFuelStations } from "../hooks/useFuelStations";

import type { FuelStation } from "../hooks/useFuelStations";

import GalpLogo from "../assets/galp.png";
import RepsolLogo from "../assets/repsol.webp";
import BPLogo from "../assets/bp.png";

const portugalBounds: [[number, number], [number, number]] = [
  [36.8, -9.6],
  [42.3, -6.0],
];

const selectedLocationIcon = L.divIcon({
  className: "",
  html: `
    <div style="
      width: 18px;
      height: 18px;
      background: #0284c7;
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 0 0 5px rgba(2, 132, 199, 0.25);
    "></div>
  `,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

const brandIcons: Record<string, L.Icon> = {
  galp: L.icon({
    iconUrl: GalpLogo,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  }),
  repsol: L.icon({
    iconUrl: RepsolLogo,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  }),
  bp: L.icon({
    iconUrl: BPLogo,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  }),
};

function getStationIcon(name: string): L.Icon | undefined {
  const brand = name.trim().toLowerCase();

  if (brand.includes("galp")) return brandIcons.galp;
  if (brand.includes("repsol")) return brandIcons.repsol;
  if (brand === "bp" || brand.includes("bp ")) return brandIcons.bp;

  return undefined;
}

// Calcula a distância entre duas coordenadas, em quilómetros.
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

  const centralAngle = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusKm * centralAngle;
}

function MapCenterUpdater() {
  const map = useMap();
  const { coordinates } = useFilters();

  useEffect(() => {
    if (!coordinates) return;

    const [longitude, latitude] = coordinates;

    map.flyTo([latitude, longitude], 13, {
      animate: true,
      duration: 1.5,
    });
  }, [coordinates, map]);

  return null;
}

function SelectedLocationLayer() {
  const { coordinates, radius, location } = useFilters();

  if (!coordinates) return null;

  const [longitude, latitude] = coordinates;
  const center: [number, number] = [latitude, longitude];

  return (
    <>
      <Circle
        center={center}
        radius={radius * 1000}
        pathOptions={{
          color: "#0284c7",
          fillColor: "#0284c7",
          fillOpacity: 0.12,
          weight: 2,
        }}
      />

      <Marker position={center} icon={selectedLocationIcon}>
        <Popup>
          <strong>{location || "Localização selecionada"}</strong>
          <br />
          Raio de pesquisa: {radius} km
        </Popup>
      </Marker>
    </>
  );
}

interface FuelStationsLayerProps {
  stations: FuelStation[];
}

function FuelStationsLayer({ stations }: FuelStationsLayerProps) {
  const { coordinates, radius } = useFilters();

  if (!coordinates) return null;

  const nearbyStations = stations.filter((station) => {
    const distance = getDistanceInKm(coordinates, station.coordinates);

    return distance <= radius;
  });

  return (
    <>
      {nearbyStations.map((station) => {
        const [longitude, latitude] = station.coordinates;
        const icon = getStationIcon(station.name);

        return (
          <Marker
            key={station.id}
            position={[latitude, longitude]}
            {...(icon ? { icon } : {})}
          >
            <Popup>
              <strong>{station.name}</strong>
              <br />
              Posto de abastecimento
              <br />
              Distância:{" "}
              {getDistanceInKm(coordinates, station.coordinates).toFixed(1)} km
            </Popup>
          </Marker>
        );
      })}
    </>
  );
}

export default function Map() {
  const { data: stations = [], isLoading, isError } = useFuelStations();
  const { coordinates, radius } = useFilters();

  const nearbyStations = coordinates
    ? stations.filter(
        (station) =>
          getDistanceInKm(coordinates, station.coordinates) <= radius,
      )
    : [];

  return (
    <div className="relative h-150 w-full overflow-hidden rounded-2xl md:h-175">
      <MapContainer
        center={[39.5, -8.0]}
        zoom={7}
        minZoom={7}
        maxZoom={18}
        maxBounds={portugalBounds}
        maxBoundsViscosity={1.0}
        scrollWheelZoom
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url={`https://{s}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}{r}.png?key=${import.meta.env.VITE_CARTO_API_KEY}`}
          subdomains="abcd"
          maxZoom={20}
        />

        <MapCenterUpdater />

        <SelectedLocationLayer />

        {!isLoading && !isError && <FuelStationsLayer stations={stations} />}
      </MapContainer>

      <div className="absolute left-3 top-3 z-1000 rounded-lg border border-neutral/15 bg-elements/95 px-3 py-2 text-xs shadow-sm">
        {isLoading ? (
          <span>A carregar postos...</span>
        ) : isError ? (
          <span className="text-red-500">Erro ao carregar postos</span>
        ) : (
          <span>
            <strong>{nearbyStations.length}</strong> postos num raio de {radius}{" "}
            km
          </span>
        )}
      </div>
    </div>
  );
}
