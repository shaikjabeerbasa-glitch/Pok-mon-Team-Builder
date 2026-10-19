import TeamMember from "./TeamMember";
export default function Team({ team, onRemove }) {
  const counts = {};
  team.forEach((member) =>
    member.types.forEach(({ type }) => {
      counts[type.name] = (counts[type.name] || 0) + 1;
    }),
  );
  return (
    <aside className="team-panel" id="your-team">
      <div className="team-heading">
        <div>
          <span className="eyebrow">YOUR ADVENTURE PARTY</span>
          <h2>
            Your team <span>{team.length}/6</span>
          </h2>
        </div>
        <span className="team-symbol" aria-hidden="true">
          ⚑
        </span>
      </div>
      <p className="team-intro">Six slots. Endless possibilities.</p>
      <div className="team-slots">
        {Array.from({ length: 6 }, (_, index) => (
          <TeamMember
            key={index}
            index={index}
            pokemon={team[index]}
            onRemove={onRemove}
          />
        ))}
      </div>
      <div className="team-summary">
        <h3>Type coverage</h3>
        {team.length ? (
          <>
            <div className="type-breakdown">
              {Object.entries(counts).map(([type, count]) => (
                <span className={`type-badge type-${type}`} key={type}>
                  {count} {type}
                </span>
              ))}
            </div>
            <p>Dual-type Pokémon count toward both types.</p>
          </>
        ) : (
          <p>Add Pokémon to discover your team's type balance.</p>
        )}
      </div>
      <div className="team-tip">
        <span aria-hidden="true">✦</span>
        <p>
          <strong>Trainer tip</strong>A mix of types makes a versatile team.
          Explore a few different favourites!
        </p>
      </div>
    </aside>
  );
}
