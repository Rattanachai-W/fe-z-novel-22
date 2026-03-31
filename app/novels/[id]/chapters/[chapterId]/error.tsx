"use client";

import Link from "next/link";

export default function ChapterError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="card-surface p-8">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-rose-500">
          Reader Error
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          เปิดตอนนิยายไม่สำเร็จ
        </h1>
        <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">{error.message}</p>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-full bg-[var(--color-brand)] px-5 py-3 text-sm font-semibold text-white"
          >
            ลองใหม่
          </button>
          <Link
            href="/"
            className="rounded-full border border-[var(--color-border)] px-5 py-3 text-sm font-semibold"
          >
            กลับหน้าแรก
          </Link>
        </div>
      </div>
    </main>
  );
}
