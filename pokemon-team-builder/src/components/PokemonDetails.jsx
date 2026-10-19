import { useEffect } from "react";
import PokemonImage from "./PokemonImage";
import Loading from "./Loading";
import ErrorMessage from "./ErrorMessage";
const labels = {
  hp: "HP",
  attack: "Attack",
  defense: "Defense",
  "special-attack": "Sp. Attack",
  "special-defense": "Sp. Defense",
  speed: "Speed",
};
export default function PokemonDetails({
  pokemon,
  loading,
  error,
  onClose,
  onRetry,
  onAdd,
  adding,
  notice,
}) {
  useEffect(() => {
    const previousFocus = document.activeElement;
    const dialog = document.getElementById("pokemon-dialog");
    dialog.showModal();
    return () => {
      dialog.close();
      previousFocus?.focus();
    };
  }, []);
  return (
    <dialog
      id="pokemon-dialog"
      className="details-dialog"
      aria-labelledby="details-title"
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="details-inner">
        <button
          className="close-button"
          onClick={onClose}
          aria-label="Close details"
        >
          ×
        </button>
        <h2 id="details-title">Pokémon details</h2>
        {loading ? (
          <Loading />
        ) : error ? (
          <ErrorMessage message={error} onRetry={onRetry} />
        ) : (
          pokemon && (
            <>
              <div className="detail-hero">
                <PokemonImage key={pokemon.id} pokemon={pokemon} large />
                <span className="dex-number">
                  #{String(pokemon.id).padStart(3, "0")}
                </span>
                <h3>{pokemon.name}</h3>
                <div className="type-breakdown">
                  {pokemon.types.map(({ type }) => (
                    <span
                      className={`type-badge type-${type.name}`}
                      key={type.name}
                    >
                      {type.name}
                    </span>
                  ))}
                </div>
              </div>
              <div className="measurements">
                <div>
                  <span>Height</span>
                  <strong>{pokemon.height / 10} m</strong>
                </div>
                <div>
                  <span>Weight</span>
                  <strong>{pokemon.weight / 10} kg</strong>
                </div>
              </div>
              <h4>Base stats</h4>
              <div className="stats">
                {pokemon.stats.map(({ stat, base_stat }) => (
                  <div className="stat" key={stat.name}>
                    <span>{labels[stat.name] || stat.name}</span>
                    <strong>{base_stat}</strong>
                    <meter
                      min="0"
                      max="255"
                      value={base_stat}
                      aria-label={labels[stat.name] || stat.name}
                    />
                  </div>
                ))}
              </div>
              <button
                className="button primary detail-add"
                onClick={() => onAdd(pokemon)}
                disabled={adding}
              >
                {adding ? "Loading..." : "+ Add to team"}
              </button>
              {notice && (
                <p className="detail-notice" role="status">
                  {notice}
                </p>
              )}
            </>
          )
        )}
      </div>
    </dialog>
  );
}
