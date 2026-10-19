export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="state-box" role="alert">
      <strong>{message}</strong>
      {onRetry && (
        <button className="button secondary" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
