export default function RootLoading() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="glass-panel rounded-[2rem] p-6">
        <div className="h-12 animate-pulse rounded-full bg-[var(--color-surface-muted)]" />
      </div>
      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <div className="card-surface h-56 animate-pulse bg-[var(--color-surface-muted)]" />
        <div className="card-surface h-56 animate-pulse bg-[var(--color-surface-muted)]" />
        <div className="card-surface h-56 animate-pulse bg-[var(--color-surface-muted)]" />
      </div>
    </main>
  );
}
