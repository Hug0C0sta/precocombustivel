<img width="1582" height="968" alt="Captura de ecrã 2026-10-12, às 15 52 54" src="https://github.com/user-attachments/assets/5eda40cc-4f28-4bd5-a7fd-5364587c9208" />

# ⛽ PreçoCombustível.pt

Uma aplicação web para consultar e comparar preços de combustíveis em postos de abastecimento em Portugal Continental.

O **PreçoCombustível.pt** é um projeto pessoal desenvolvido para fins de aprendizagem e demonstração de competências de desenvolvimento Frontend, integrando dados de combustíveis, pesquisa de localizações e visualização de postos num mapa interativo.

## ⚠️ Aviso

**Este projeto foi desenvolvido exclusivamente para fins educativos e de demonstração em portefólio. Não tem fins comerciais.**

A aplicação não se destina a utilização comercial ou a substituir as fontes oficiais de informação. Os preços e restantes dados apresentados dependem da disponibilidade, precisão e atualização da API utilizada.

## ✨ Funcionalidades

* 🔎 **Pesquisa de localizações:** pesquisa de cidades, vilas e outras localidades através de sugestões automáticas.
* 📍 **Geolocalização:** possibilidade de utilizar a localização atual do utilizador.
* 🗺️ **Mapa interativo:** visualização dos postos de combustível em Portugal Continental.
* 📏 **Pesquisa por raio:** filtragem de postos de acordo com a distância à localização selecionada.
* ⛽ **Seleção de combustível:** consulta de diferentes tipos de combustível.
* 💶 **Comparação de preços:** consulta dos preços disponibilizados pela fonte de dados.
* 📋 **Lista de postos:** apresentação de informação relevante sobre cada posto.
* 🌙 **Modo claro e escuro:** interface adaptada a diferentes preferências visuais.
* 📱 **Design responsivo:** experiência adaptada a dispositivos móveis e computadores.

## 🛠️ Tecnologias utilizadas

* **React** — construção da interface.
* **TypeScript** — tipagem estática e maior segurança no desenvolvimento.
* **Tailwind CSS v4** — estilização e design responsivo.
* **TanStack Query** — gestão de pedidos à API e dos respetivos estados de carregamento e erro.
* **React Leaflet** — integração do mapa interativo.
* **Leaflet** — visualização cartográfica.
* **Lucide React** — ícones da interface.
* **Photon API** — pesquisa e geocodificação de localidades.
* **API pública da DGEG** — obtenção de informação sobre postos e preços de combustíveis.

## 📡 Fontes de dados

A aplicação utiliza serviços externos para obter informação geográfica e dados sobre combustíveis.

* **DGEG:** [Preços dos Combustíveis Online](https://precoscombustiveis.dgeg.gov.pt/)
* **Photon:** [Photon Geocoding API](https://photon.komoot.io/)

A disponibilidade destes serviços, bem como a qualidade e atualização dos dados, depende dos respetivos fornecedores.

## 🚀 Instalação e execução

### Pré-requisitos

* Node.js
* npm

### 1. Clonar o repositório

```bash
git clone <URL_DO_REPOSITORIO>
cd <NOME_DO_PROJETO>
```

### 2. Instalar as dependências

```bash
npm install
```

### 3. Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

A aplicação ficará disponível no endereço local indicado pelo Vite no terminal.

### 4. Criar uma build de produção

```bash
npm run build
```

## 🎯 Objetivo do projeto

Este projeto tem como objetivo consolidar e demonstrar conhecimentos em desenvolvimento Frontend, nomeadamente:

* Desenvolvimento de aplicações com React e TypeScript.
* Criação de componentes reutilizáveis.
* Gestão de estado e partilha de dados entre componentes.
* Consumo de APIs externas.
* Pesquisa e filtragem de dados.
* Integração de mapas e funcionalidades de geolocalização.
* Implementação de interfaces responsivas e acessíveis.
* Gestão de estados de carregamento, erro e apresentação de dados.

## 📄 Licença e utilização

Este projeto é disponibilizado para fins de demonstração e avaliação de competências técnicas no âmbito de um portefólio pessoal.

**Não tem fins comerciais.** A utilização, redistribuição ou exploração comercial do código e dos dados associados deve respeitar as licenças e os termos aplicáveis.

Os dados obtidos através de serviços externos permanecem sujeitos às condições de utilização dos respetivos fornecedores.

---

Desenvolvido como projeto pessoal de portefólio.
