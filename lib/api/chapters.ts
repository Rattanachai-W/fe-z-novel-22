import { apiFetch } from "@/lib/api/client";

export function unlockChapter(token: string, chapterId: string) {
  return apiFetch<{ message: string }>(`/novels/chapters/${chapterId}/unlock`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// API ใหม่ตาม `API-SPACE.md`: POST /novels/chapters/:id/like
export function likeChapter(token: string, chapterId: string) {
  return apiFetch<{ liked: boolean; like_count: number; message: string }>(
    `/novels/chapters/${chapterId}/like`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      fallbackData: { liked: true, like_count: 1, message: "Liked" },
    }
  );
}

// API ใหม่ตาม `API-SPACE.md`: GET /novels/chapters/:id/like
export function getChapterLikeStatus(token: string, chapterId: string) {
  return apiFetch<{ liked: boolean }>(`/novels/chapters/${chapterId}/like`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    fallbackData: { liked: false },
  });
}
