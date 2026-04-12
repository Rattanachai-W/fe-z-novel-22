import { apiFetch, safeArray } from "@/lib/api/client";
import { mockBanners } from "@/lib/data/mock";
import type { Banner } from "@/lib/types/api";

// @TODO: [PENDING API] ฟังก์ชันนี้ยังไม่มี API รองรับใน API-SPACE.md ปัจจุบันใช้งาน mock
export async function getHomeBanners() {
  const banners = await apiFetch<Banner[]>("/marketing/banners", {
    fallbackData: mockBanners,
  });

  return safeArray<Banner>(banners).filter((banner) => {
    const isActive = banner.is_active !== false;
    const isHomeZone = !banner.zone || banner.zone.toLowerCase() === "home";

    return isActive && isHomeZone;
  });
}
