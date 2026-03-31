import { apiFetch } from "@/lib/api/client";

export function unlockChapter(token: string, chapterId: string) {
  return apiFetch<{ message: string }>(`/novels/chapters/${chapterId}/unlock`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
