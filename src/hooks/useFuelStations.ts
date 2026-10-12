import { useQuery } from "@tanstack/react-query";
import { useFilters } from "../contexts/FiltersContext";

export interface FuelStation {
  id: number;
  name: string;
  coordinates: [number, number];
  address: string;
  price: string | null;
  fuelType: string;
  updatedAt: string | null;
}

interface DGEGResponse<T> {
  status: boolean;
  mensagem?: string;
  resultado: T;
}

interface DGEGFuelType {
  Id: number;
  Descritivo: string;
}

interface DGEGStation {
  Id?: number;
  IdPosto?: number;
  Nome?: string;
  Marca?: string;
  Preco?: string;
  TipoCombustivel?: string;
  DataAtualizacao?: string;
  Morada?:
    | string
    | {
        Distrito?: string;
        Municipio?: string;
        Morada?: string;
        Localidade?: string;
        CodPostal?: string;
        Latitude?: number | string;
        Longitude?: number | string;
      };
  Localidade?: string;
  CodPostal?: string;
  Latitude?: number | string;
  Longitude?: number | string;
}

const API_URL = "https://precoscombustiveis.dgeg.gov.pt/api/PrecoComb";

const fuelTypeNames: Record<string, string[]> = {
  gasoleo: ["gasoleo simples", "gasoleo"],
  gasolina95: ["gasolina simples 95", "gasolina 95"],
  gasolina98: ["gasolina 98", "gasolina especial 98"],
  gpl: ["gpl auto", "gpl"],
};

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

async function fetchJSON<T>(
  endpoint: string,
  params: Record<string, string> = {},
): Promise<T> {
  const searchParams = new URLSearchParams(params);
  const response = await fetch(
    `${API_URL}/${endpoint}?${searchParams.toString()}`,
  );

  if (!response.ok) {
    throw new Error("Não foi possível contactar a API da DGEG.");
  }

  const data: DGEGResponse<T> = await response.json();

  if (data.status === false) {
    throw new Error(data.mensagem || "A API da DGEG devolveu um erro.");
  }

  return data.resultado;
}

function getAddress(station: DGEGStation): string {
  const address = station.Morada;

  if (typeof address === "string") {
    return [address, station.Localidade, station.CodPostal]
      .filter(Boolean)
      .join(", ");
  }

  return [
    address?.Morada,
    address?.Localidade,
    address?.CodPostal,
    address?.Municipio,
    address?.Distrito,
  ]
    .filter(Boolean)
    .filter((value, index, values) => values.indexOf(value) === index)
    .join(", ");
}

async function fetchFuelStations(
  selectedFuelType: string,
): Promise<FuelStation[]> {
  const fuelTypes = await fetchJSON<DGEGFuelType[]>("GetTiposCombustiveis");

  const acceptedNames = fuelTypeNames[selectedFuelType] ?? [];

  const fuelType = fuelTypes.find((item) =>
    acceptedNames.includes(normalize(item.Descritivo)),
  );

  if (!fuelType) {
    throw new Error(
      `Não foi possível identificar o combustível "${selectedFuelType}" na DGEG.`,
    );
  }

  const pageSize = 1000;
  const allStations: DGEGStation[] = [];
  let page = 1;

  while (true) {
    const results = await fetchJSON<DGEGStation[]>("PesquisarPostos", {
      idsTiposComb: String(fuelType.Id),
      idMarca: "",
      idTipoPosto: "",
      idDistrito: "",
      idsMunicipios: "",
      qtdPorPagina: String(pageSize),
      pagina: String(page),
      orderDesc: "0",
    });

    allStations.push(...results);

    if (results.length < pageSize) {
      break;
    }

    page += 1;
  }

  const uniqueStations = new Map<number, FuelStation>();

  allStations.forEach((station, index) => {
    const address =
      station.Morada && typeof station.Morada === "object"
        ? station.Morada
        : undefined;

    const latitude = Number(station.Latitude ?? address?.Latitude);

    const longitude = Number(station.Longitude ?? address?.Longitude);

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude) ||
      latitude < 36 ||
      latitude > 43 ||
      longitude < -10 ||
      longitude > -6
    ) {
      return;
    }

    const id = Number(station.Id ?? station.IdPosto ?? index);

    uniqueStations.set(id, {
      id,
      name: station.Nome || station.Marca || "Posto de combustível",
      coordinates: [longitude, latitude],
      address: getAddress(station),
      price: station.Preco ?? null,
      fuelType: station.TipoCombustivel || fuelType.Descritivo,
      updatedAt: station.DataAtualizacao ?? null,
    });
  });

  return Array.from(uniqueStations.values());
}

export function useFuelStations() {
  const { fuelType } = useFilters();

  return useQuery({
    queryKey: ["fuelStations", fuelType],
    queryFn: () => fetchFuelStations(fuelType),
    staleTime: 1000 * 60 * 30,
    retry: 2,
  });
}
