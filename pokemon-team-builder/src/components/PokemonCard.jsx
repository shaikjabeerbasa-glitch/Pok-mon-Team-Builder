import PokemonImage from "./PokemonImage";
export default function PokemonCard({
  pokemon,
  onDetails,
  onAdd,
  inTeam,
  adding,
}) {
  return (
    <article className="pokemon-card">
      <div className="card-top">
        <span className="dex-number">
          #{String(pokemon.id).padStart(3, "0")}
        </span>
        <span className="card-mark" aria-hidden="true">
          ✧
        </span>
      </div>
      <button
        className="pokemon-view"
        onClick={() => onDetails(pokemon)}
        aria-label={`View ${pokemon.name} details`}
      >
        <div className="sprite-stage">
          <PokemonImage pokemon={pokemon} />
        </div>
        <h3>{pokemon.name}</h3>
        <span className="view-label">
          View details <span aria-hidden="true">↗</span>
        </span>
      </button>
      <button
        className={`add-button ${inTeam ? "added" : ""}`}
        disabled={adding}
        onClick={() => onAdd(pokemon)}
      >
        {adding ? "Loading..." : inTeam ? "✓ On your team" : "+ Add to team"}
      </button>
    </article>
  );
}
