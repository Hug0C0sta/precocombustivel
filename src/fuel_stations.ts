export interface FuelStation {
  id: number;
  name: string;
  address: string;
  openingHours: string;
}

const fuelStations: FuelStation[] = [
  {
    id: 1,
    name: "Rede Poupança 24h",
    address: "Rua de São Dinis, 296, 4250-427 Porto",
    openingHours: "Todos os dias: 07:00–23:00",
  },
  {
    id: 2,
    name: "Repsol - Fernão de Magalhães",
    address: "Avenida Fernão de Magalhães, 1626, Porto",
    openingHours: "Todos os dias: 07:00–21:00",
  },
  {
    id: 3,
    name: "Repsol - Antas",
    address: "Rua de Santo António das Antas, 36, Porto",
    openingHours: "Todos os dias: 07:00–20:30",
  },
  {
    id: 4,
    name: "Cepsa - Paiva Couceiro",
    address: "Avenida de Paiva Couceiro, Porto",
    openingHours: "Todos os dias: 07:00–22:00",
  },
  {
    id: 5,
    name: "Galp - Rotunda do Bessa",
    address: "Rotunda do Bessa, Avenida do Bessa, Porto",
    openingHours: "Aberto 24 horas",
  },
  {
    id: 6,
    name: "Moeve - Parque da Cidade",
    address: "Estrada Nacional 12, km 0,710, Porto",
    openingHours: "Todos os dias: 07:00–23:00",
  },
  {
    id: 7,
    name: "Repsol - Monte dos Burgos",
    address: "Rua do Monte dos Burgos, 316, Porto",
    openingHours: "Todos os dias: 07:00–23:00",
  },
  {
    id: 8,
    name: "BP - Circunvalação",
    address: "Estrada da Circunvalação, 12033, Porto",
    openingHours: "Todos os dias: 07:00–23:00",
  },
  {
    id: 9,
    name: "Repsol - Constituição",
    address: "Rua da Constituição, 2570, Porto",
    openingHours: "Aberto 24 horas",
  },
  {
    id: 10,
    name: "Galp - Estrada da Circunvalação",
    address: "Estrada da Circunvalação, 82130, Porto",
    openingHours: "Aberto 24 horas",
  },
  {
    id: 11,
    name: "BP - São Roque da Lameira",
    address: "Rua de São Roque da Lameira, Porto",
    openingHours: "Todos os dias: 06:00–23:59",
  },
  {
    id: 12,
    name: "PRIO - Circunvalação",
    address: "Estrada da Circunvalação, 10853, Porto",
    openingHours: "Aberto 24 horas",
  },
  {
    id: 13,
    name: "Cepsa - Chaves de Oliveira",
    address: "Rua de Chaves de Oliveira, Porto",
    openingHours: "Todos os dias: 07:00–22:00",
  },
  {
    id: 14,
    name: "Rede Energia - Serpa Pinto",
    address: "Rua de Serpa Pinto, 616, Porto",
    openingHours: "A confirmar",
  },
  {
    id: 15,
    name: "Auchan - Mercado Abastecedor",
    address: "Alameda de Cartes, 429–485, Porto",
    openingHours: "A confirmar",
  },
  {
    id: 16,
    name: "Cepsa - Mercado Abastecedor",
    address: "Mercado Abastecedor, Porto",
    openingHours: "A confirmar",
  },
  {
    id: 17,
    name: "Cepsa - Marginal",
    address: "Avenida de Paiva Couceiro, Porto",
    openingHours: "A confirmar",
  },
  {
    id: 18,
    name: "PRIO - Fábrica do Cobre",
    address: "Zona da Fábrica do Cobre, Porto",
    openingHours: "A confirmar",
  },
  {
    id: 19,
    name: "Repsol - Lordelo do Ouro",
    address: "Lordelo do Ouro, Porto",
    openingHours: "A confirmar",
  },
  {
    id: 20,
    name: "BP - Combatentes",
    address: "Avenida dos Combatentes da Grande Guerra, Porto",
    openingHours: "A confirmar",
  },
];

export default fuelStations;
