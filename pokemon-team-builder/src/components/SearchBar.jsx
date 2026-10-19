const TYPES = [
  "normal",
  "fire",
  "water",
  "electric",
  "grass",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
];
export default function SearchBar({
  value,
  onChange,
  type,
  onTypeChange,
  onSubmit,
  onClear,
}) {
  return (
    <div className="search-controls">
      <form onSubmit={onSubmit} className="search">
        <label className="sr-only" htmlFor="search">
          Search Pokémon by name or ID
        </label>
        <span aria-hidden="true">⌕</span>
        <input
          id="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Search by name or Pokédex number..."
          autoComplete="off"
        />
        {value && (
          <button type="button" aria-label="Clear search" onClick={onClear}>
            ×
          </button>
        )}
        <button className="search-submit" type="submit">
          Search
        </button>
      </form>
      <label className="type-select">
        <span className="sr-only">Filter by type</span>
        <select
          value={type}
          onChange={(event) => onTypeChange(event.target.value)}
          disabled={Boolean(value.trim())}
        >
          <option value="">All types</option>
          {TYPES.map((name) => (
            <option key={name} value={name}>
              {name[0].toUpperCase() + name.slice(1)}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
