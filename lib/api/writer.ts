import { apiFetch } from "@/lib/api/client";
import type { Chapter, Novel } from "@/lib/types/api";

type CreateNovelPayload = {
  title: string;
  description: string;
  cover_image_url?: string;
  category_id?: string;
  tags?: string[];
};

type UpdateNovelPayload = {
  title: string;
  description: string;
  cover_image_url?: string;
  category_id?: string;
  tags?: string[];
  status?: "ongoing" | "completed" | "on_hold";
};

type CreateChapterPayload = {
  novel_id: string;
  chapter_number?: number;
  title: string;
  content: string;
  is_free: boolean;
  coin_price?: number;
};

type UpdateChapterPayload = {
  title?: string;
  content?: string;
  is_free?: boolean;
  coin_price?: number;
  chapter_number?: number;
};

type UploadNovelCoverResponse = {
  message: string;
  url: string;
  fileName: string;
};

export function createNovel(token: string, payload: CreateNovelPayload) {
  return apiFetch<{ message: string; novel: Novel }>("/novels", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export function createChapter(token: string, payload: CreateChapterPayload) {
  return apiFetch<{ message: string; chapter?: Chapter }>("/novels/chapters", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export function updateNovel(token: string, novelId: string, payload: UpdateNovelPayload) {
  return apiFetch<{ message: string; novel?: Novel }>(`/novels/${novelId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    fallbackData: {
      message: "บันทึกการแก้ไขนิยายแล้ว",
    },
  });
}

export function updateChapter(token: string, chapterId: string, payload: UpdateChapterPayload) {
  return apiFetch<{ message: string; chapter?: Chapter }>(`/novels/chapters/${chapterId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    fallbackData: {
      message: "อัปเดตตอนนิยายแล้ว",
    },
  });
}

export function deleteChapter(token: string, chapterId: string) {
  return apiFetch<{ message: string }>(`/novels/chapters/${chapterId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    fallbackData: {
      message: "ลบตอนนิยายแล้ว",
    },
  });
}

export function deleteNovel(token: string, novelId: string) {
  return apiFetch<{ message: string }>(`/novels/${novelId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    fallbackData: {
      message: "ลบเรื่องนี้แล้ว",
    },
  });
}

export async function uploadNovelCover(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/uploads/novel-covers", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(payload?.message || "อัปโหลดรูปปกไม่สำเร็จ");
  }

  return (await response.json()) as UploadNovelCoverResponse;
}
