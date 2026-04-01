import type { MetadataRoute } from "next";
import { getNovelCatalog } from "@/lib/api/novels";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://dinonovel.com";
  
  // Fetch all novels to generate the dynamic sitemap array
  const novels = await getNovelCatalog();

  const novelRoutes = novels.map((novel) => ({
    url: `${BASE_URL}/novels/${novel.id}`,
    lastModified: novel.updated_at || new Date().toISOString(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  // Add static routes like Home, Top-up, Tags
  const staticRoutes = [
    {
      url: `${BASE_URL}`,
      lastModified: new Date().toISOString(),
      changeFrequency: "hourly" as const,
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/top-up`,
      lastModified: new Date().toISOString(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
  ];

  return [...staticRoutes, ...novelRoutes];
}
