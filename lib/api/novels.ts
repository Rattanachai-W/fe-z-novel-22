import { apiFetch, safeArray } from "@/lib/api/client";
import { mockHomeMetrics, mockNovels, mockTags } from "@/lib/data/mock";
import type {
  AuthorProfile,
  Chapter,
  ChapterComment,
  HomeMetric,
  Novel,
  NovelMetadata,
  ReadingHistoryItem,
  Tag,
} from "@/lib/types/api";

type CatalogFilters = {
  category?: string;
  tag?: string;
};

export async function getNovelCatalog(filters: CatalogFilters = {}) {
  const novels = await apiFetch<Novel[]>("/novels", {
    fallbackData: mockNovels,
  });

  return safeArray<Novel>(novels).filter((novel) => {
    const categoryMatches = filters.category
      ? novel.category_id === filters.category || novel.Category?.id === filters.category
      : true;

    const tagMatches = filters.tag
      ? (novel.Tags ?? []).some((tag) => tag.id === filters.tag)
      : true;

    return categoryMatches && tagMatches;
  });
}

export async function getNovelById(id: string) {
  const fallbackNovel = mockNovels.find((novel) => novel.id === id) ?? null;

  return apiFetch<Novel | null>(`/novels/${id}`, {
    fallbackData: fallbackNovel,
  });
}

export async function getChapterById(id: string) {
  const fallbackChapter =
    mockNovels.flatMap((novel) => novel.chapters ?? []).find((chapter) => chapter.id === id) ??
    null;

  return apiFetch<Chapter | null>(`/novels/chapters/${id}`, {
    fallbackData: fallbackChapter,
  });
}

// @TODO: [PENDING API] ฟังก์ชันนี้ยังไม่มี API รองรับใน API-SPACE.md ปัจจุบันใช้งาน mock
export async function getFeaturedNovel() {
  const novels = await getNovelCatalog();
  return novels[0] ?? mockNovels[0];
}

// @TODO: [PENDING API] ฟังก์ชันนี้ยังไม่มี API รองรับใน API-SPACE.md ปัจจุบันใช้งาน mock
export async function getTrendingTags(): Promise<Tag[]> {
  return mockTags;
}

// @TODO: [PENDING API] ฟังก์ชันนี้ยังไม่มี API รองรับใน API-SPACE.md ปัจจุบันใช้งาน mock
export async function getHomePageMetrics(): Promise<HomeMetric[]> {
  return mockHomeMetrics;
}

// @TODO: [PENDING API] ฟังก์ชันนี้ยังไม่มี API รองรับใน API-SPACE.md ปัจจุบันใช้งาน mock
export function getNovelMetadata() {
  return apiFetch<NovelMetadata>("/novels/metadata", {
    fallbackData: {
      categories: [],
      tags: mockTags,
    },
  });
}

// @TODO: [PENDING API] ฟังก์ชันนี้ยังไม่มี API รองรับใน API-SPACE.md
export function rateNovel(token: string, novelId: string, score: number) {
  return apiFetch<{ message: string; rating: number; rating_count: number }>(
    `/novels/${novelId}/rate`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ score }),
    },
  );
}

// @TODO: [PENDING API] ฟังก์ชันนี้ยังไม่มี API รองรับใน API-SPACE.md
export function getBookmarkStatus(token: string, novelId: string) {
  return apiFetch<{ bookmarked: boolean }>(`/novels/${novelId}/bookmark`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    fallbackData: { bookmarked: false },
  });
}

export function saveReadingHistory(token: string, novelId: string, chapterId: string) {
  return apiFetch<void>(`/novels/${novelId}/history`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ chapter_id: chapterId }),
    fallbackData: undefined,
  });
}

export function getReadingHistory(token: string) {
  return apiFetch<ReadingHistoryItem[]>("/novels/my/history", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    fallbackData: [],
  });
}

// @TODO: [PENDING API] ฟังก์ชันนี้ยังไม่มี API รองรับใน API-SPACE.md (มีแต่ GET /novels/writers/:writerId/novels)
export function getAuthorProfile(authorId: string) {
  return apiFetch<AuthorProfile | null>(`/novels/authors/${authorId}`, {
    fallbackData: null,
  });
}

// API ใหม่ตาม `API-SPACE.md`: GET /novels/writers/:writerId/novels
export function getWriterNovels(writerId: string, page = 1, limit = 10) {
  return apiFetch<{ data: Novel[]; pagination: any }>(
    `/novels/writers/${writerId}/novels?page=${page}&limit=${limit}`,
    {
      fallbackData: { data: [], pagination: { current_page: 1, total_pages: 1 } },
    }
  );
}

// @TODO: [PENDING API] ฟังก์ชันนี้ยังไม่มี API รองรับใน API-SPACE.md
export function toggleAuthorFollow(token: string, authorId: string) {
  return apiFetch<{ followed: boolean; message: string }>(
    `/novels/authors/${authorId}/follow`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
}

// @TODO: [PENDING API] ฟังก์ชันนี้ยังไม่มี API รองรับใน API-SPACE.md
export function getAuthorFollowStatus(token: string, authorId: string) {
  return apiFetch<{ followed: boolean }>(`/novels/authors/${authorId}/follow`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    fallbackData: { followed: false },
  });
}

// @TODO: [PENDING API] ฟังก์ชันนี้ยังไม่มี API รองรับใน API-SPACE.md
export function getFollowingAuthors(token: string) {
  return apiFetch<Array<{ id: string; username: string }>>("/novels/my/following", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    fallbackData: [],
  });
}

export function getChapterComments(chapterId: string) {
  return apiFetch<ChapterComment[]>(`/novels/chapters/${chapterId}/comments`, {
    fallbackData: [],
  });
}

export function createChapterComment(
  token: string,
  chapterId: string,
  payload: { content: string; parent_id?: string | null },
) {
  return apiFetch<{ message?: string; comment?: ChapterComment }>(
    `/novels/chapters/${chapterId}/comments`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );
}
