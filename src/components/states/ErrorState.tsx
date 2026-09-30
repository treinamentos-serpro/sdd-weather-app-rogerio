interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div
      aria-live="assertive"
      className="rounded-2xl border border-red-300/20 bg-red-950/30 p-6 text-center backdrop-blur-md"
      role="alert"
    >
      <p className="text-red-100">{message}</p>
      <button
        className="mt-4 rounded-lg bg-accent-500 px-4 py-2 font-semibold text-night-900 transition hover:bg-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:ring-offset-2 focus:ring-offset-night-900"
        onClick={onRetry}
        type="button"
      >
        Tentar novamente
      </button>
    </div>
  );
}
