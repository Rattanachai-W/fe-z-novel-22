"use client";

import { useApp } from "@/components/providers/app-provider";
import { WriterNovelEditor } from "@/components/writer/writer-novel-editor";
import { getNewNovelTemplate } from "@/lib/writer/utils";
import { createNovel, createChapter } from "@/lib/api/writer";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function WriterNovelCreatePage() {
  const { token, user, requireAuth } = useApp();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const initialNovel = getNewNovelTemplate(user?.username);

  async function handleSave(next: typeof initialNovel) {
    if (!token) {
       requireAuth();
       return;
    }

    try {
      const response = await createNovel(token, {
        title: next.title,
        description: next.description,
        cover_image_url: next.coverImageUrl || undefined,
        category_id: undefined,
        tags: next.tags,
      });

      const newId = response.novel.id;

      for (const chap of next.chapters) {
        await createChapter(token, {
          novel_id: newId,
          chapter_number: chap.chapterNumber,
          title: chap.title,
          content: chap.content,
          is_free: chap.isFree,
          coin_price: chap.coinPrice,
        });
      }

      router.push("/writer/novels");
      router.refresh();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "สร้างนิยายไม่สำเร็จ");
    }
  }

  return (
    <div className="py-6">
      {error && (
        <div className="mb-4 rounded-xl bg-rose-50 p-4 text-sm text-rose-600 dark:bg-rose-950/20 dark:text-rose-400">
          {error}
        </div>
      )}
      <WriterNovelEditor
        novel={initialNovel}
        onSave={handleSave}
        onClose={() => router.push("/writer/novels")}
        isPage
      />
    </div>
  );
}
