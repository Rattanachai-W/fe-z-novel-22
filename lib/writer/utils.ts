import type { WriterNovelItem } from "@/lib/writer/dashboard";

export function getNewNovelTemplate(authorName?: string): WriterNovelItem {
  return {
    id: `draft-${Date.now()}`,
    title: "",
    description: "",
    shortDescription: "",
    authorName: authorName ?? "Dino Author",
    coverImageUrl: "",
    tags: [],
    published: false,
    status: "ongoing",
    categoryName: "ไทย",
    chapterCount: 0,
    viewCount: 0,
    reviewCount: 0,
    commentCount: 0,
    bookmarkCount: 0,
    latestChapterTitle: "ยังไม่มีตอน",
    updatedLabel: "รอดำเนินการ",
    coverTone: "from-emerald-500/25 via-teal-500/10 to-cyan-500/20",
    chapters: [],
  };
}

export function formatShortDate(value: string) {
  return new Intl.DateTimeFormat("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function formatKycStatus(status: "draft" | "pending" | "verified") {
  if (status === "verified") return "ยืนยันแล้ว";
  if (status === "pending") return "รอตรวจสอบ";
  return "ยังไม่ส่ง";
}

export function formatWithdrawalStatus(status: "pending" | "approved" | "transferred") {
  if (status === "approved") return "อนุมัติแล้ว";
  if (status === "transferred") return "โอนแล้ว";
  return "รอดำเนินการ";
}
