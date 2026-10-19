import { useState } from "react";
export default function PokemonImage({ pokemon, large = false }) {
  const [failed, setFailed] = useState(false);
  return failed ? (
    <span
      className="image-fallback"
      role="img"
      aria-label={`${pokemon.name} image unavailable`}
    >
      ?
    </span>
  ) : (
    <img
      className={large ? "pokemon-image large" : "pokemon-image"}
      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
      alt={pokemon.name}
      onError={() => setFailed(true)}
    />
  );
}
