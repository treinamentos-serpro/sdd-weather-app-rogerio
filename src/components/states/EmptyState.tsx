interface EmptyStateProps {
  title: string;
  hint: string;
}

export default function EmptyState({ title, hint }: EmptyStateProps) {
  return (
    <div
      className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-md"
      role="status"
    >
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <p className="mt-2 text-white/60">{hint}</p>
    </div>
  );
}
