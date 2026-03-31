import type { Novel } from "@/lib/types/api";

export type WriterNovelItem = {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  authorName: string;
  coverImageUrl: string;
  tags: string[];
  published: boolean;
  status: "ongoing" | "completed" | "on_hold";
  categoryName: string;
  chapterCount: number;
  viewCount: number;
  reviewCount: number;
  commentCount: number;
  bookmarkCount: number;
  latestChapterTitle: string;
  updatedLabel: string;
  coverTone: string;
  chapters: Array<{
    id: string;
    chapterNumber: number;
    title: string;
    content: string;
    readerNote: string;
    isFree: boolean;
    coinPrice: number;
    createdAt: string;
  }>;
};

export function buildWriterNovelItems(novels: Novel[]): WriterNovelItem[] {
  return novels.map((novel, index) => {
    const latestChapter = [...(novel.chapters ?? [])].sort((left, right) =>
      right.created_at.localeCompare(left.created_at),
    )[0];

    return {
      id: novel.id,
      title: novel.title,
      description: novel.description,
      shortDescription: novel.description.slice(0, 200),
      authorName: novel.author?.username ?? "Unknown",
      coverImageUrl: novel.cover_image_url,
      tags: (novel.Tags ?? []).map((tag) => tag.name),
      published: novel.status !== "on_hold",
      status: novel.status,
      categoryName: novel.Category?.name ?? "Novel",
      chapterCount: novel.chapters?.length ?? 0,
      viewCount: novel.view_count,
      reviewCount: novel.rating_count,
      commentCount: Math.max(0, Math.round(novel.rating_count / 8)),
      bookmarkCount: Math.max(1, Math.round(novel.view_count / 3200)),
      latestChapterTitle: latestChapter?.title ?? "ยังไม่มีตอน",
      updatedLabel: formatWriterDate(latestChapter?.created_at),
      coverTone: coverTones[index % coverTones.length],
      chapters:
        novel.chapters?.map((chapter) => ({
          id: chapter.id,
          chapterNumber: chapter.chapter_number,
          title: chapter.title,
          content: "",
          readerNote: "",
          isFree: chapter.is_free,
          coinPrice: chapter.coin_price,
          createdAt: chapter.created_at,
        })) ?? [],
    };
  });
}

export function formatWriterDate(value?: string) {
  if (!value) {
    return "ยังไม่มีการอัปเดต";
  }

  return new Intl.DateTimeFormat("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

const coverTones = [
  "from-emerald-500/25 via-teal-500/10 to-cyan-500/20",
  "from-sky-500/25 via-indigo-500/10 to-emerald-500/20",
  "from-amber-500/20 via-orange-500/10 to-emerald-500/20",
  "from-fuchsia-500/15 via-violet-500/10 to-emerald-500/15",
];
