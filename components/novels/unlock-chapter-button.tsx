"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useApp } from "@/components/providers/app-provider";

type UnlockChapterButtonProps = {
  chapterId: string;
  coinPrice: number;
};

export function UnlockChapterButton({
  chapterId,
  coinPrice,
}: UnlockChapterButtonProps) {
  const router = useRouter();
  const { unlockChapter } = useApp();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      onClick={() => {
        startTransition(async () => {
          const success = await unlockChapter(chapterId);

          if (success) {
            router.refresh();
          }
        });
      }}
      className="mt-5 rounded-full bg-[var(--color-brand)] px-5 py-3 text-sm font-semibold text-white"
    >
      {isPending ? "กำลังปลดล็อก..." : `ปลดล็อก ${coinPrice} Gold`}
    </button>
  );
}
