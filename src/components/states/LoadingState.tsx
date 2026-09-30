export default function LoadingState() {
  return (
    <div
      aria-live="polite"
      className="flex min-h-40 items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-md"
      role="status"
    >
      <p className="text-white/70">Carregando previsão...</p>
    </div>
  );
}
