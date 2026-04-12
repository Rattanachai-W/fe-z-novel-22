"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/providers/app-provider";
import { getChapterLikeStatus, likeChapter } from "@/lib/api/chapters";
import { AppIcon } from "@/components/ui/app-icon";

type ChapterLikeButtonProps = {
  chapterId: string;
};

export function ChapterLikeButton({ chapterId }: ChapterLikeButtonProps) {
  const router = useRouter();
  const { token, requireAuth } = useApp();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!token) return;
    let mounted = true;

    async function fetchStatus() {
      try {
        const { liked } = await getChapterLikeStatus(token!, chapterId);
        if (mounted) {
          setIsLiked(liked);
        }
      } catch (error) {
        console.error("Failed to fetch like status");
      }
    }

    void fetchStatus();

    return () => {
      mounted = false;
    };
  }, [token, chapterId]);

  function handleLike() {
    if (!requireAuth()) return;

    startTransition(async () => {
      try {
        const res = await likeChapter(token!, chapterId);
        setIsLiked(res.liked);
        if (res.like_count !== undefined) {
          setLikeCount(res.like_count);
        } else {
          setLikeCount((prev) => (res.liked ? prev + 1 : Math.max(0, prev - 1)));
        }
        router.refresh();
      } catch (error) {
        console.error("Failed to like chapter", error);
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleLike}
      disabled={isPending}
      className={`group flex items-center justify-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold transition-all w-full sm:w-auto mt-8 disabled:opacity-50 ${
        isLiked
          ? "border-rose-500 bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400"
          : "border-[var(--color-border)] bg-[var(--color-surface)] hover:border-rose-300 hover:text-rose-500"
      }`}
    >
      <AppIcon name="heart" className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
      <span>{isLiked ? "ให้กำลังใจแล้ว" : "ส่งกำลังใจให้นักเขียน"}</span>
      {likeCount > 0 && <span className="ml-1 opacity-80">({likeCount})</span>}
    </button>
  );
}
