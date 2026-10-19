import PokemonCard from "./PokemonCard";
export default function PokemonGrid({
  pokemon,
  team,
  onDetails,
  onAdd,
  addingId,
}) {
  return (
    <div className="pokemon-grid">
      {pokemon.map((member) => (
        <PokemonCard
          key={member.id}
          pokemon={member}
          onDetails={onDetails}
          onAdd={onAdd}
          inTeam={team.some((item) => item.id === member.id)}
          adding={addingId === member.id}
        />
      ))}
    </div>
  );
}
