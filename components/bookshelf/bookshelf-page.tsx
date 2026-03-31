"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useApp } from "@/components/providers/app-provider";

type BookshelfPageProps = {
  novels: Array<{
    id: string;
    title: string;
    authorName: string;
    categoryName: string;
  }>;
};

export function BookshelfPage({ novels }: BookshelfPageProps) {
  const { bookmarks, openAuthModal, refreshBookmarks, token } = useApp();
  const [backendBookmarks, setBackendBookmarks] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setBackendBookmarks(null);
      return;
    }

    let isMounted = true;

    const loadBookmarks = async () => {
      setLoading(true);

      try {
        const ids = await refreshBookmarks();

        if (isMounted) {
          setBackendBookmarks(ids);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadBookmarks();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const activeBookmarks = backendBookmarks ?? bookmarks;
  const bookmarkedNovels = novels.filter((novel) => activeBookmarks.includes(novel.id));

  return (
    <section className="card-surface p-5 sm:p-8">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-brand)]">
        Bookshelf
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">ชั้นหนังสือของฉัน</h1>
      <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
        รวมเรื่องที่คุณกดบันทึกไว้จากหน้า detail
      </p>

      {loading ? (
        <div className="mt-6 rounded-[1.4rem] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-sm text-[var(--color-muted)]">
          กำลังโหลดชั้นหนังสือจาก backend...
        </div>
      ) : null}

      {bookmarkedNovels.length === 0 ? (
        <div className="mt-6 rounded-[1.4rem] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-sm text-[var(--color-muted)]">
          <p>ยังไม่มีเรื่องที่บันทึกไว้ หรือคุณยังไม่ได้ล็อกอิน</p>
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={() => openAuthModal("login")}
              className="rounded-full bg-[var(--color-brand)] px-4 py-2 text-sm font-semibold text-white"
            >
              ล็อกอิน
            </button>
            <Link
              href="/"
              className="rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-semibold"
            >
              กลับไปเลือกนิยาย
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {bookmarkedNovels.map((novel) => (
            <Link
              key={novel.id}
              href={`/novels/${novel.id}`}
              className="rounded-[1.4rem] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition hover:border-[var(--color-brand)]"
            >
              <div className="aspect-[4/5] rounded-[1.2rem] bg-[linear-gradient(135deg,_rgba(66,185,131,0.18),_rgba(15,23,42,0.06))]" />
              <h2 className="mt-4 text-lg font-semibold">{novel.title}</h2>
              <p className="mt-2 text-sm text-[var(--color-muted)]">{novel.authorName}</p>
              <p className="mt-1 text-xs text-[var(--color-muted)]">{novel.categoryName}</p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
