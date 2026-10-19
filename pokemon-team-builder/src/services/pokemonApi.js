const API_URL = "https://pokeapi.co/api/v2";
export const PAGE_SIZE = 20;
const cache = new Map();

// Only successful JSON responses are cached. Aborted or failed requests can be retried.
async function request(path, signal) {
  if (cache.has(path)) return cache.get(path);
  try {
    const response = await fetch(`${API_URL}/${path}`, { signal });
    if (!response.ok) {
      if (response.status === 404) throw new Error("Pokémon not found.");
      throw new Error("Something went wrong. Please try again.");
    }
    const data = await response.json();
    cache.set(path, data);
    return data;
  } catch (error) {
    if (error.name === "AbortError") throw error;
    if (error instanceof TypeError)
      throw new Error(
        "Unable to connect. Check your internet connection and try again.",
      );
    throw error;
  }
}

export function pokemonFromList(item) {
  const id = Number(item.url.split("/").filter(Boolean).pop());
  return { id, name: item.name };
}

export async function getPokemonPage(page, signal) {
  const data = await request(
    `pokemon?limit=${PAGE_SIZE}&offset=${(page - 1) * PAGE_SIZE}`,
    signal,
  );
  return { pokemon: data.results.map(pokemonFromList), count: data.count };
}

export function getPokemon(nameOrId, signal) {
  return request(
    `pokemon/${encodeURIComponent(String(nameOrId).trim().toLowerCase())}`,
    signal,
  );
}

export async function getPokemonByType(type, page, signal) {
  const data = await request(`type/${encodeURIComponent(type)}`, signal);
  const members = data.pokemon.map((item) => pokemonFromList(item.pokemon));
  return {
    pokemon: members.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    count: members.length,
  };
}
