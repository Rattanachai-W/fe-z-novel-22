export default function NovelDetailLoading() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="card-surface animate-pulse p-8">
        <div className="h-4 w-28 rounded-full bg-[var(--color-surface-muted)]" />
        <div className="mt-6 h-10 w-2/3 rounded-full bg-[var(--color-surface-muted)]" />
        <div className="mt-4 h-4 w-full rounded-full bg-[var(--color-surface-muted)]" />
        <div className="mt-3 h-4 w-5/6 rounded-full bg-[var(--color-surface-muted)]" />
        <div className="mt-10 grid gap-3 sm:grid-cols-3">
          <div className="h-24 rounded-3xl bg-[var(--color-surface-muted)]" />
          <div className="h-24 rounded-3xl bg-[var(--color-surface-muted)]" />
          <div className="h-24 rounded-3xl bg-[var(--color-surface-muted)]" />
        </div>
      </div>
    </main>
  );
}
