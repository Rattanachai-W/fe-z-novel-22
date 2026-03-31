export default function ChapterLoading() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="card-surface animate-pulse p-8">
        <div className="h-4 w-36 rounded-full bg-[var(--color-surface-muted)]" />
        <div className="mt-5 h-10 w-2/3 rounded-full bg-[var(--color-surface-muted)]" />
        <div className="mt-8 space-y-4">
          <div className="h-4 rounded-full bg-[var(--color-surface-muted)]" />
          <div className="h-4 rounded-full bg-[var(--color-surface-muted)]" />
          <div className="h-4 w-5/6 rounded-full bg-[var(--color-surface-muted)]" />
        </div>
      </div>
    </main>
  );
}
