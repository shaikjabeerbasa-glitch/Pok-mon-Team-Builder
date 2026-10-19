export default function Header({ count }) {
  return (
    <header className="header">
      <a className="brand" href="#">
        <span className="pokeball" aria-hidden="true" /> Poké
        <span>Builder</span>
      </a>
      <span className="header-caption">
        A great team starts with a little curiosity.
      </span>
      <a className="team-counter" href="#your-team">
        My team <strong>{count} / 6</strong>
      </a>
    </header>
  );
}
