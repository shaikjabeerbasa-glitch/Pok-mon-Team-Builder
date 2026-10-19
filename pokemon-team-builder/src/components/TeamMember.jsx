import PokemonImage from "./PokemonImage";
export default function TeamMember({ pokemon, index, onRemove }) {
  return (
    <div className={`team-slot ${pokemon ? "occupied" : ""}`}>
      <span className="slot-number">{String(index + 1).padStart(2, "0")}</span>
      {pokemon ? (
        <>
          <PokemonImage pokemon={pokemon} />
          <div className="member-info">
            <strong>{pokemon.name}</strong>
            <span>
              {pokemon.types.map((type) => type.type.name).join(" / ")}
            </span>
          </div>
          <button
            className="remove-button"
            onClick={() => onRemove(pokemon.id)}
            aria-label={`Remove ${pokemon.name}`}
          >
            ×
          </button>
        </>
      ) : (
        <>
          <span className="empty-slot-icon" aria-hidden="true">
            +
          </span>
          <span className="empty-slot-label">Waiting for a Pokémon</span>
        </>
      )}
    </div>
  );
}
