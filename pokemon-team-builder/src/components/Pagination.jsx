export default function Pagination({ page, totalPages, loading, onChange }) {
  return (
    <nav className="pagination" aria-label="Pokémon pages">
      <button
        className="button secondary"
        disabled={loading || page === 1}
        onClick={() => onChange(page - 1)}
      >
        ← Previous
      </button>
      <span>
        Page <strong>{page}</strong> of {totalPages}
      </span>
      <button
        className="button secondary"
        disabled={loading || page >= totalPages}
        onClick={() => onChange(page + 1)}
      >
        Next →
      </button>
    </nav>
  );
}
