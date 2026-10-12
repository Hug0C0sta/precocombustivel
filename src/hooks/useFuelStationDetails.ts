import { useQuery } from "@tanstack/react-query";

const API_URL = "https://precoscombustiveis.dgeg.gov.pt/api/PrecoComb";

export interface FuelPrice {
  fuelType: string;
  price: string;
  updatedAt: string | null;
}

export interface FuelStationDetails {
  address: string;
  openingHours: string;
  services: string[];
  prices: FuelPrice[];
}

interface DGEGResponse<T> {
  status: boolean;
  mensagem?: string;
  resultado: T;
}

interface DGEGAddress {
  Distrito?: string;
  Municipio?: string;
  Morada?: string;
  Localidade?: string;
  CodPostal?: string;
  Latitude?: number | string;
  Longitude?: number | string;
  Sentido?: string;
}

interface DGEGFuel {
  TipoCombustivel?: string;
  Preco?: string | number;
  DataAtualizacao?: string;
}

interface DGEGStationDetails {
  Morada?: string | DGEGAddress | null;
  HorarioPosto?: string | null;
  Servicos?: string[] | string | null;
  Combustiveis?: DGEGFuel[] | null;
}

function formatAddress(value: DGEGStationDetails["Morada"]): string {
  if (typeof value === "string") {
    return value;
  }

  if (!value || typeof value !== "object") {
    return "Morada indisponível";
  }

  return (
    [
      value.Morada,
      value.Localidade,
      value.CodPostal,
      value.Municipio,
      value.Distrito,
    ]
      .filter(
        (part): part is string =>
          typeof part === "string" && part.trim().length > 0,
      )
      .filter((part, index, parts) => parts.indexOf(part) === index)
      .join(", ") || "Morada indisponível"
  );
}

function formatOpeningHours(value: DGEGStationDetails["HorarioPosto"]): string {
  if (typeof value === "string" && value.trim()) {
    return value;
  }

  return "Horário não disponível";
}

function formatServices(value: DGEGStationDetails["Servicos"]): string[] {
  if (Array.isArray(value)) {
    return value.filter(
      (service): service is string => typeof service === "string",
    );
  }

  if (typeof value === "string" && value.trim()) {
    return [value];
  }

  return [];
}

function fetchJSON<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error("Não foi possível obter os detalhes do posto.");
  }

  return response.json() as Promise<T>;
}

async function fetchStationDetails(id: number): Promise<FuelStationDetails> {
  const params = new URLSearchParams({
    id: String(id),
  });

  const response = await fetch(`${API_URL}/GetDadosPosto?${params.toString()}`);

  const data = await fetchJSON<DGEGResponse<DGEGStationDetails>>(response);

  if (data.status === false || !data.resultado) {
    throw new Error(
      data.mensagem || "A API da DGEG não devolveu os detalhes do posto.",
    );
  }

  const station = data.resultado;

  return {
    address: formatAddress(station.Morada),
    openingHours: formatOpeningHours(station.HorarioPosto),
    services: formatServices(station.Servicos),
    prices: (station.Combustiveis ?? []).map((fuel) => ({
      fuelType:
        typeof fuel.TipoCombustivel === "string"
          ? fuel.TipoCombustivel
          : "Combustível",
      price:
        fuel.Preco !== undefined && fuel.Preco !== null
          ? String(fuel.Preco)
          : "Preço indisponível",
      updatedAt:
        typeof fuel.DataAtualizacao === "string" ? fuel.DataAtualizacao : null,
    })),
  };
}

export function useFuelStationDetails(id: number | null) {
  return useQuery({
    queryKey: ["fuelStationDetails", id],
    queryFn: () => fetchStationDetails(id!),
    enabled: id !== null,
    staleTime: 1000 * 60 * 30,
    retry: 1,
  });
}
