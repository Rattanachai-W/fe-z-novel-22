"use client";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="card-surface w-full p-8">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-rose-500">
          Loading Error
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          โหลดข้อมูลหน้าแรกไม่สำเร็จ
        </h1>
        <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
          {error.message || "มีบางอย่างผิดพลาดระหว่างเชื่อมต่อ API"}
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 rounded-full bg-[var(--color-brand)] px-5 py-3 text-sm font-semibold text-white"
        >
          ลองใหม่
        </button>
      </div>
    </main>
  );
}
