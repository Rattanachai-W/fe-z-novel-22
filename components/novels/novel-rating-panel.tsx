"use client";

import { useState, useTransition } from "react";
import { useApp } from "@/components/providers/app-provider";
import { rateNovel } from "@/lib/api/novels";

type NovelRatingPanelProps = {
  novelId: string;
  initialRating: number;
  initialCount: number;
};

export function NovelRatingPanel({
  novelId,
  initialRating,
  initialCount,
}: NovelRatingPanelProps) {
  const { token, requireAuth } = useApp();
  const [rating, setRating] = useState(initialRating);
  const [count, setCount] = useState(initialCount);
  const [selectedScore, setSelectedScore] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <section className="rounded-[1.5rem] border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--color-brand-strong)]">Novel Rating</p>
          <h3 className="mt-1 text-lg font-semibold">ให้คะแนนนิยายเรื่องนี้</h3>
        </div>
        <div className="text-right">
          <p className="text-2xl font-semibold text-[var(--color-brand-strong)]">
            {rating.toFixed(1)}
          </p>
          <p className="text-sm text-[var(--color-muted)]">{count} รีวิว</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {[1, 2, 3, 4, 5].map((score) => (
          <button
            key={score}
            type="button"
            onClick={() => {
              if (!token && !requireAuth("login")) {
                return;
              }

              if (!token) {
                return;
              }

              startTransition(async () => {
                try {
                  const response = await rateNovel(token, novelId, score);
                  setSelectedScore(score);
                  setRating(response.rating);
                  setCount(response.rating_count);
                } catch {
                  setSelectedScore(score);
                }
              });
            }}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              selectedScore === score
                ? "bg-[var(--color-brand)] text-white"
                : "border border-[var(--color-border)] bg-[var(--color-surface)]"
            }`}
          >
            {score} ดาว
          </button>
        ))}
      </div>

      <p className="mt-3 text-sm text-[var(--color-muted)]">
        {isPending ? "กำลังบันทึกคะแนน..." : "คะแนนจะถูกส่งไปยัง API และอัปเดตค่าเฉลี่ยทันที"}
      </p>
    </section>
  );
}
