"use client";

import { useTransition } from "react";
import { useApp } from "@/components/providers/app-provider";

type BookmarkButtonProps = {
  novelId: string;
  className?: string;
};

export function BookmarkButton({ novelId, className }: BookmarkButtonProps) {
  const { isBookmarked, toggleBookmark } = useApp();
  const [isPending, startTransition] = useTransition();

  const bookmarked = isBookmarked(novelId);

  return (
    <button
      type="button"
      onClick={() => {
        startTransition(() => {
          void toggleBookmark(novelId);
        });
      }}
      className={
        className ||
        "rounded-full border border-[var(--color-border)] px-5 py-3 text-sm font-semibold"
      }
    >
      {isPending ? "กำลังบันทึก..." : bookmarked ? "อยู่ในชั้นหนังสือแล้ว" : "เพิ่มเข้าชั้นหนังสือ"}
    </button>
  );
}
