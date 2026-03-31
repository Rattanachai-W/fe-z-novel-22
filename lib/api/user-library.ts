import { apiFetch } from "@/lib/api/client";
import type { Novel } from "@/lib/types/api";

export async function getBookmarks(token: string) {
  const novels = await apiFetch<Novel[]>("/novels/my/bookmarks", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    fallbackData: [],
  });

  return novels.map((novel) => novel.id);
}

export async function toggleBookmark(token: string, novelId: string) {
  return apiFetch<{ bookmarked: boolean; message: string }>(
    `/novels/${novelId}/bookmark`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      fallbackData: {
        bookmarked: true,
        message: "บันทึกสำเร็จ",
      },
    },
  );
}
