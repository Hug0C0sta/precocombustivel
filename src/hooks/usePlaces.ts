import { useQuery } from "@tanstack/react-query";

export interface Place {
  name: string;
  city?: string;
  county?: string;
  state?: string;
  country?: string;
  countrycode?: string;
  osm_value?: string;
  osm_id?: number;
  osm_type?: string;
  coordinates: [number, number];
}

interface PhotonFeature {
  properties: Omit<Place, "coordinates">;
  geometry: {
    coordinates: [number, number];
  };
}

interface PhotonResponse {
  features: PhotonFeature[];
}

async function fetchPlaces(query: string): Promise<Place[]> {
  const params = new URLSearchParams({
    q: query,
    countrycode: "PT",
    limit: "20",
  });

  const response = await fetch(
    `https://photon.komoot.io/api/?${params.toString()}`,
  );

  if (!response.ok) {
    throw new Error("Não foi possível pesquisar localidades.");
  }

  const data: PhotonResponse = await response.json();

  return data.features
    .filter((feature) => {
      const { countrycode } = feature.properties;

      return countrycode?.toUpperCase() == "PT";
    })
    .slice(0, 8)
    .map((feature) => ({
      ...feature.properties,
      coordinates: feature.geometry.coordinates,
    }));
}

export function usePlaces(query: string) {
  return useQuery({
    queryKey: ["places", query],
    queryFn: () => fetchPlaces(query),
    enabled: query.trim().length >= 3,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}
