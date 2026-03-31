import { apiFetch } from "@/lib/api/client";
import { mockBanners } from "@/lib/data/mock";
import type { Banner } from "@/lib/types/api";

export async function getHomeBanners() {
  const banners = await apiFetch<Banner[]>("/marketing/banners", {
    fallbackData: mockBanners,
  });

  return banners.filter((banner) => {
    const isActive = banner.is_active !== false;
    const isHomeZone = !banner.zone || banner.zone.toLowerCase() === "home";

    return isActive && isHomeZone;
  });
}
