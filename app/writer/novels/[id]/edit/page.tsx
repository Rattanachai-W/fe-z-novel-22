"use client";

import { useApp } from "@/components/providers/app-provider";
import { WriterNovelEditor } from "@/components/writer/writer-novel-editor";
import { buildWriterNovelItems } from "@/lib/writer/dashboard";
import { getNovelById } from "@/lib/api/novels";
import { updateNovel, createChapter, updateChapter, deleteChapter } from "@/lib/api/writer";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { WriterNovelItem } from "@/lib/writer/dashboard";

export default function WriterNovelEditPage() {
  const { id } = useParams() as { id: string };
  const { token, requireAuth } = useApp();
  const router = useRouter();
  const [novel, setNovel] = useState<WriterNovelItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getNovelById(id);
        if (data) {
          const items = buildWriterNovelItems([data]);
          setNovel(items[0]);
        } else {
          setError("ไม่พบข้อมูลนิยาย");
        }
      } catch (err) {
        setError("โหลดข้อมูลนิยายไม่สำเร็จ");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function handleSave(next: WriterNovelItem) {
    if (!token) {
      requireAuth();
      return;
    }

    try {
      // Basic novel update
      await updateNovel(token, next.id, {
        title: next.title,
        description: next.description,
        cover_image_url: next.coverImageUrl || undefined,
        tags: next.tags,
        status: next.status,
      });

      // Chapter logic: find new, updated, and deleted chapters
      // For simplicity in this demo, we'll focus on the core update.
      // A more robust implementation would diff next.chapters with original.
      
      // Update each chapter (for simplicity, we update all)
      for (const chap of next.chapters) {
        if (chap.id.startsWith("draft-")) {
            await createChapter(token, {
                novel_id: next.id,
                chapter_number: chap.chapterNumber,
                title: chap.title,
                content: chap.content,
                is_free: chap.isFree,
                coin_price: chap.coinPrice,
            });
        } else {
            await updateChapter(token, chap.id, {
                title: chap.title,
                content: chap.content,
                is_free: chap.isFree,
                coin_price: chap.coinPrice,
                chapter_number: chap.chapterNumber,
            });
        }
      }

      router.push("/writer/novels");
      router.refresh();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "บันทึกไม่สำเร็จ");
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-muted italic">กำลังโหลดข้อมูลนิยาย...</p>
      </div>
    );
  }

  if (error || !novel) {
    return (
      <div className="rounded-xl bg-rose-50 p-6 text-center dark:bg-rose-950/20">
        <p className="text-rose-600">{error || "เกิดข้อผิดพลาด"}</p>
        <button onClick={() => router.push("/writer/novels")} className="mt-4 text-sm font-semibold underline">
          กลับไปยังหน้าจัดการ
        </button>
      </div>
    );
  }

  return (
    <div className="py-6">
      <WriterNovelEditor
        novel={novel}
        onSave={handleSave}
        onClose={() => router.push("/writer/novels")}
        isPage
      />
    </div>
  );
}
