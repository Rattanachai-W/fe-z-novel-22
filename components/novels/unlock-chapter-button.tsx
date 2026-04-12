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
      <div className="flex items-center justify-center gap-2">
        {isPending ? (
          "กำลังปลดล็อก..."
        ) : (
          <>
            <img src="/coin_logo.png" alt="Coin" className="w-5 h-5 object-contain brightness-0 invert" />
            <span>ปลดล็อก {coinPrice} Gold</span>
          </>
        )}
      </div>
    </button>
  );
}
