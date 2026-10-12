import { useState } from "react";
import { LoaderCircle, MapPin, Search, X } from "lucide-react";

import MapMarkerLight from "../assets/map-marker-light.svg";
import MapMarkerDark from "../assets/map-maker-dark.svg";

import { useTheme } from "../contexts/ThemeContext";
import { useFilters } from "../contexts/FiltersContext";

import useDebounce from "../hooks/useDebounce";
import { usePlaces, type Place } from "../hooks/usePlaces";

export default function AutoCompleteCity() {
  const { theme } = useTheme();

  const {
    location: selectedLocation,
    setLocation,
    setCoordinates,
  } = useFilters();

  const [search, setSearch] = useState(selectedLocation);
  const [isSearching, setIsSearching] = useState(false);

  const debouncedSearch = useDebounce(search.trim(), 350);

  const {
    data: locations = [],
    isLoading,
    isFetching,
    isError,
  } = usePlaces(debouncedSearch);

  const hasMinimumCharacters = search.trim().length >= 3;
  const isWaitingForDebounce = search.trim() !== debouncedSearch;

  const showLoading =
    hasMinimumCharacters && (isWaitingForDebounce || isLoading || isFetching);

  const showDropdown = search.trim() !== "" && isSearching;

  function handleSelect(place: Place) {
    setSearch(place.name);
    setLocation(place.name);
    setCoordinates(place.coordinates);
    setIsSearching(false);
  }

  function handleClear() {
    setSearch("");
    setLocation("");
    setCoordinates(null);
    setIsSearching(true);
  }

  function handleSearchChange(value: string) {
    setSearch(value);
    setLocation("");
    setCoordinates(null);
    setIsSearching(true);
  }

  return (
    <div className="relative w-full">
      {/* Campo de pesquisa */}
      <div
        className={`flex h-12 items-center rounded-xl border bg-elements transition-all duration-200 ${
          isSearching
            ? "border-secondary ring-4 ring-secondary/10"
            : "border-transparent hover:border-neutral/30"
        }`}
      >
        <img
          className="ml-3 size-5 shrink-0"
          src={theme === "dark" ? MapMarkerDark : MapMarkerLight}
          alt=""
        />

        <input
          value={search}
          onChange={(event) => handleSearchChange(event.target.value)}
          onFocus={() => setIsSearching(true)}
          onBlur={() => {
            setTimeout(() => setIsSearching(false), 150);
          }}
          id="autocomplete_city"
          name="search"
          type="text"
          autoComplete="off"
          placeholder="Pesquisar cidade, concelho ou vila..."
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={showDropdown}
          aria-controls="locations-dropdown"
          aria-busy={showLoading}
          className="h-full w-full min-w-0 flex-1 bg-transparent px-3 text-sm text-primary outline-none placeholder:text-neutral"
        />

        {showLoading ? (
          <LoaderCircle
            size={17}
            className="mr-3 shrink-0 animate-spin text-secondary"
            aria-label="A pesquisar localidades"
          />
        ) : search ? (
          <button
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={handleClear}
            aria-label="Limpar pesquisa"
            className="mr-2 flex size-8 shrink-0 items-center justify-center rounded-lg text-neutral transition-colors hover:bg-neutral/10 hover:text-primary"
          >
            <X size={16} />
          </button>
        ) : null}
      </div>

      {/* Lista de resultados */}
      {showDropdown && (
        <div
          id="locations-dropdown"
          role="listbox"
          className="absolute z-[2000] mt-2 w-full overflow-hidden rounded-xl border border-neutral/15 bg-bg shadow-xl shadow-black/10 animate-[dropdownEnter_180ms_ease-out]"
        >
          <div className="flex items-center justify-between border-b border-neutral/10 px-4 py-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral">
              Localizações
            </span>

            {showLoading ? (
              <span className="flex items-center gap-2 text-xs text-secondary">
                <LoaderCircle size={14} className="animate-spin" />A pesquisar
              </span>
            ) : (
              <span className="rounded-full bg-secondary/10 px-2 py-1 text-xs font-medium text-secondary">
                {locations.length} resultados
              </span>
            )}
          </div>

          <div className="max-h-60 overflow-y-auto p-1.5">
            {!hasMinimumCharacters ? (
              <div className="px-4 py-6 text-center text-sm text-neutral">
                Escreve pelo menos 3 caracteres para pesquisar.
              </div>
            ) : showLoading ? (
              <div className="flex flex-col items-center px-4 py-8 text-center">
                <LoaderCircle
                  size={28}
                  className="animate-spin text-secondary"
                />

                <p className="mt-3 text-sm font-medium text-primary">
                  A procurar localidades...
                </p>

                <p className="mt-1 text-xs text-neutral">
                  Estamos a encontrar resultados para ti.
                </p>

                <div className="mt-5 flex w-full max-w-48 flex-col gap-2">
                  <div className="h-3 w-full animate-pulse rounded-full bg-neutral/10" />
                  <div className="h-3 w-3/4 animate-pulse rounded-full bg-neutral/10" />
                  <div className="h-3 w-5/6 animate-pulse rounded-full bg-neutral/10" />
                </div>
              </div>
            ) : isError ? (
              <div className="flex flex-col items-center px-4 py-8 text-center">
                <MapPin size={24} className="text-neutral" />

                <p className="mt-3 text-sm font-medium text-primary">
                  Não foi possível pesquisar
                </p>

                <p className="mt-1 text-xs text-neutral">
                  Verifica a tua ligação e tenta novamente.
                </p>
              </div>
            ) : locations.length > 0 ? (
              locations.map((place) => {
                const details = [
                  place.city,
                  place.county,
                  place.state,
                  place.country,
                ].filter(
                  (value, index, values) =>
                    value &&
                    value !== place.name &&
                    values.indexOf(value) === index,
                );

                const placeKey = `${place.osm_type ?? "place"}-${
                  place.osm_id ?? place.coordinates.join(",")
                }`;

                return (
                  <button
                    key={placeKey}
                    type="button"
                    role="option"
                    aria-selected={selectedLocation === place.name}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => handleSelect(place)}
                    className="group flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors duration-150 hover:bg-secondary/10 focus-visible:bg-secondary/10 focus-visible:outline-none"
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-neutral/10 text-neutral transition-colors group-hover:bg-secondary/15 group-hover:text-secondary">
                      <MapPin size={17} strokeWidth={1.8} />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-primary">
                        {place.name}
                      </span>

                      <span className="mt-0.5 block truncate text-xs text-neutral">
                        {details.length > 0
                          ? details.join(", ")
                          : (place.country ?? "Portugal")}
                      </span>
                    </span>

                    <span className="text-neutral opacity-0 transition-opacity group-hover:opacity-100">
                      <Search size={15} />
                    </span>
                  </button>
                );
              })
            ) : (
              <div className="flex flex-col items-center px-4 py-8 text-center">
                <span className="mb-3 flex size-11 items-center justify-center rounded-full bg-neutral/10 text-neutral">
                  <MapPin size={20} />
                </span>

                <p className="text-sm font-medium text-primary">
                  Nenhuma localização encontrada
                </p>

                <p className="mt-1 text-xs text-neutral">
                  Experimenta pesquisar por outro nome.
                </p>
              </div>
            )}
          </div>

          {locations.length > 0 && !showLoading && (
            <div className="border-t border-neutral/10 bg-neutral/3 px-4 py-2">
              <p className="text-xs text-neutral">
                Seleciona uma localização para continuar
              </p>
            </div>
          )}
        </div>
      )}

      {/* Localização selecionada */}
      {selectedLocation && (
        <p className="mt-2 text-xs text-secondary">
          Localização selecionada: {selectedLocation}
        </p>
      )}
    </div>
  );
}
