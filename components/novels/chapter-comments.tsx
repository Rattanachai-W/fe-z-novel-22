"use client";

import { useEffect, useState, useTransition } from "react";
import { useApp } from "@/components/providers/app-provider";
import { createChapterComment, getChapterComments } from "@/lib/api/novels";
import type { ChapterComment } from "@/lib/types/api";

type ChapterCommentsProps = {
  chapterId: string;
};

export function ChapterComments({ chapterId }: ChapterCommentsProps) {
  const { token, requireAuth } = useApp();
  const [comments, setComments] = useState<ChapterComment[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    void getChapterComments(chapterId)
      .then((response) => {
        if (!cancelled) {
          setComments(response);
          setLoading(false);
        }
      })
      .catch((requestError) => {
        if (!cancelled) {
          setError(requestError instanceof Error ? requestError.message : "โหลดคอมเมนต์ไม่สำเร็จ");
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [chapterId]);

  return (
    <section className="card-surface mt-8 p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[var(--color-brand-strong)]">Comments</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight">คอมเมนต์ผู้อ่าน</h2>
        </div>
        <span className="text-sm text-[var(--color-muted)]">{comments.length} รายการ</span>
      </div>

      <div className="mt-5 space-y-3">
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          rows={4}
          className="w-full rounded-[1.2rem] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm outline-none transition focus:border-[var(--color-brand)]"
          placeholder="เขียนความเห็นถึงตอนนี้..."
        />
        <button
          type="button"
          onClick={() => {
            if (!token && !requireAuth("login")) {
              return;
            }

            if (!token || !content.trim()) {
              return;
            }

            startTransition(async () => {
              try {
                const response = await createChapterComment(token, chapterId, {
                  content: content.trim(),
                  parent_id: null,
                });
                setComments((current) => [
                  ...(response.comment ? [response.comment] : []),
                  ...current,
                ]);
                setContent("");
              } catch (requestError) {
                setError(
                  requestError instanceof Error
                    ? requestError.message
                    : "ส่งคอมเมนต์ไม่สำเร็จ",
                );
              }
            });
          }}
          className="rounded-full bg-[var(--color-brand)] px-5 py-3 text-sm font-semibold text-white"
        >
          {isPending ? "กำลังส่ง..." : "ส่งคอมเมนต์"}
        </button>
      </div>

      {loading ? <p className="mt-5 text-sm text-[var(--color-muted)]">กำลังโหลดคอมเมนต์...</p> : null}
      {error ? <p className="mt-5 text-sm text-rose-600 dark:text-rose-300">{error}</p> : null}

      <div className="mt-6 space-y-4">
        {comments.map((comment) => (
          <article
            key={comment.id}
            className="rounded-[1.2rem] border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-4 py-4"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold">{comment.User.username}</p>
              <time className="text-xs text-[var(--color-muted)]">
                {new Date(comment.created_at).toLocaleString("th-TH")}
              </time>
            </div>
            <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
              {comment.content}
            </p>
          </article>
        ))}

        {!loading && comments.length === 0 ? (
          <div className="rounded-[1.2rem] border border-dashed border-[var(--color-border)] px-4 py-6 text-sm text-[var(--color-muted)]">
            ตอนนี้ยังไม่มีคอมเมนต์ เป็นคนแรกที่เริ่มคุยได้เลย
          </div>
        ) : null}
      </div>
    </section>
  );
}
