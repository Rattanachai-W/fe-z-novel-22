import Link from "next/link";
import { HeroCarousel } from "@/components/home/hero-carousel";
import { getHomeBanners } from "@/lib/api/marketing";
import { getFeaturedNovel, getNovelCatalog, getTrendingTags } from "@/lib/api/novels";
import type { Banner, Novel } from "@/lib/types/api";

type HomepageSectionsProps = {
  category?: string;
  tag?: string;
};

export async function HomepageSections({
  category,
  tag,
}: HomepageSectionsProps) {
  const [novels, featuredNovel, tags, banners] = await Promise.all([
    getNovelCatalog({
      category,
      tag,
    }),
    getFeaturedNovel(),
    getTrendingTags(),
    getHomeBanners(),
  ]);

  const heroBanners = [featuredNovel, ...novels.filter((novel) => novel.id !== featuredNovel.id)].slice(
    0,
    3,
  );
  const updatedNovels = novels.slice(0, 4);
  const recommendedNovels = novels.slice(0, 6);
  const rankedNovels = [...novels].sort((a, b) => b.view_count - a.view_count).slice(0, 5);
  const carouselBanners = (banners.length > 0 ? banners : heroBanners)
    .slice(0, 3)
    .map((entry) => mapEntryToHeroBanner(entry));

  return (
    <section className="space-y-8 sm:space-y-10">
      <section className="space-y-5">
        <HeroCarousel banners={carouselBanners} />
      </section>

      <section id="discover" className="card-surface p-4 sm:p-6 lg:p-8">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-brand)]">
              Updated Novel
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">
              อัปเดตล่าสุด
            </h2>
          </div>
          <Link
            href="/?tag=tag-community"
            className="text-sm font-medium text-[var(--color-muted)] transition hover:text-[var(--color-brand)]"
          >
            See more
          </Link>
        </div>

        <div className="-mx-1 overflow-x-auto px-1 pb-1 sm:mx-0 sm:overflow-visible sm:px-0">
          <div className="flex gap-3 sm:grid sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
            {updatedNovels.map((novel, index) => (
              <Link
                key={novel.id}
                href={`/novels/${novel.id}`}
                className="group min-w-[10.5rem] flex-1 rounded-[1.35rem] border border-[var(--color-border)] bg-[var(--color-surface)] p-3 transition hover:-translate-y-1 hover:border-[var(--color-brand)] sm:min-w-0 sm:rounded-[1.6rem] sm:p-4"
              >
                <div className="flex aspect-[4/5] items-center justify-center rounded-[1.25rem] bg-[linear-gradient(135deg,_rgba(66,185,131,0.2),_rgba(15,23,42,0.06))] text-center">
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--color-brand)]">
                      Image
                    </p>
                    <p className="mt-3 text-sm text-[var(--color-muted)]">
                      Updated {index + 1}
                    </p>
                  </div>
                </div>
                <h3 className="mt-4 line-clamp-2 text-sm font-semibold tracking-tight group-hover:text-[var(--color-brand)] sm:text-base">
                  {novel.title}
                </h3>
                <p className="mt-2 text-xs text-[var(--color-muted)] sm:text-sm">
                  {novel.author?.username ?? "Unknown"}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:gap-6 xl:grid-cols-[1.3fr_0.9fr]">
        <section className="card-surface p-4 sm:p-6 lg:p-8">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-brand)]">
                Recommended Novel
              </p>
              <h2 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">
                แนะนำสำหรับคุณ
              </h2>
            </div>
          </div>

          <div className="-mx-1 overflow-x-auto px-1 pb-1 sm:mx-0 sm:overflow-visible sm:px-0">
            <div className="flex gap-3 sm:grid sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
              {recommendedNovels.map((novel) => (
                <Link
                  key={novel.id}
                  href={`/novels/${novel.id}`}
                  className="group min-w-[10.5rem] flex-1 rounded-[1.35rem] border border-[var(--color-border)] bg-[var(--color-surface)] p-3 transition hover:-translate-y-1 hover:border-[var(--color-brand)] sm:min-w-0 sm:rounded-[1.6rem] sm:p-4"
                >
                  <div className="flex aspect-[4/5] items-center justify-center rounded-[1.25rem] bg-[linear-gradient(135deg,_rgba(66,185,131,0.18),_rgba(15,23,42,0.04))] text-center">
                    <div>
                      <p className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--color-brand)]">
                        Image
                      </p>
                      <p className="mt-3 text-sm text-[var(--color-muted)]">
                        {novel.Category?.name ?? "Novel"}
                      </p>
                    </div>
                  </div>
                  <h3 className="mt-4 line-clamp-2 text-sm font-semibold tracking-tight group-hover:text-[var(--color-brand)] sm:text-base">
                    {novel.title}
                  </h3>
                  <p className="mt-2 text-xs text-[var(--color-muted)] sm:text-sm">
                    {novel.author?.username ?? "Unknown"}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <aside id="ranking" className="card-surface p-4 sm:p-6 lg:p-8">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-brand)]">
              Ranking
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">
              นิยายติดอันดับ
            </h2>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2">
            {["วัน", "สัปดาห์", "เดือน"].map((label, index) => (
              <button
                key={label}
                type="button"
                className={`rounded-xl px-3 py-2 text-sm font-medium ${
                  index === 1
                    ? "bg-[var(--color-foreground)] text-[var(--color-background)]"
                    : "border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="mt-5 space-y-2.5 sm:space-y-3">
            {rankedNovels.map((novel, index) => (
              <Link
                key={novel.id}
                href={`/novels/${novel.id}`}
                className="flex items-center gap-3 rounded-[1.1rem] border border-[var(--color-border)] bg-[var(--color-surface)] p-2.5 transition hover:border-[var(--color-brand)] sm:rounded-[1.35rem] sm:p-3"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[linear-gradient(135deg,_rgba(66,185,131,0.2),_rgba(15,23,42,0.06))] text-xs font-semibold text-[var(--color-brand)] sm:h-14 sm:w-14">
                  #{index + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{novel.title}</p>
                  <p className="mt-1 text-xs text-[var(--color-muted)]">
                    {novel.author?.username ?? "Unknown"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[var(--color-muted)]">Total view</p>
                  <p className="text-sm font-semibold">
                    {novel.view_count.toLocaleString("th-TH")}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link
                key={tag.id}
                href={`/?tag=${encodeURIComponent(tag.id)}`}
                className="rounded-full border border-[var(--color-border)] px-3 py-2 text-xs text-[var(--color-muted)] transition hover:border-[var(--color-brand)] hover:text-[var(--color-brand)]"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        </aside>
      </section>
    </section>
  );
}

function mapEntryToHeroBanner(entry: Banner | Novel) {
  const isMarketingBanner = "link_url" in entry || "novel_id" in entry || "Novel" in entry;
  const relatedNovel = isMarketingBanner ? entry.Novel : entry;
  const id = isMarketingBanner ? entry.novel_id || entry.id : entry.id;
  const title =
    isMarketingBanner && entry.title ? entry.title : relatedNovel?.title ?? "Dino Banner";
  const description =
    isMarketingBanner && entry.description
      ? entry.description
      : relatedNovel?.description ?? "พบเรื่องเด่นและอัปเดตใหม่ล่าสุดใน DinoNovel";
  const accentKey =
    id === "demo-001" || entry.id === "banner-001"
      ? "pink"
      : id === "demo-002" || entry.id === "banner-002"
        ? "blue"
        : "orange";

  return {
    id,
    href:
      (isMarketingBanner ? entry.link_url : undefined) ||
      (id ? `/novels/${id}` : "/"),
    title,
    description,
    imageUrl: isMarketingBanner ? entry.image_url : undefined,
    mobileImageUrl: isMarketingBanner ? entry.mobile_image_url : undefined,
    imageAlt:
      (isMarketingBanner ? entry.image_alt : undefined) ||
      title,
    viewCount: relatedNovel?.view_count ?? 0,
    authorName: relatedNovel?.author?.username ?? "ทีม Dino",
    categoryName:
      (isMarketingBanner ? entry.zone : undefined) ||
      relatedNovel?.Category?.name ||
      "Dino Pick",
    accent: accentKey === "pink" ? "#f79ec7" : accentKey === "blue" ? "#7dd3fc" : "#fb923c",
    glow:
      accentKey === "pink"
        ? "rgba(247, 158, 199, 0.38)"
        : accentKey === "blue"
          ? "rgba(125, 211, 252, 0.34)"
          : "rgba(251, 146, 60, 0.32)",
    panel:
      accentKey === "pink"
        ? "linear-gradient(135deg, #f8bfd5 0%, #fce7f3 52%, #fff7fb 100%)"
        : accentKey === "blue"
          ? "linear-gradient(135deg, #0f172a 0%, #224f78 45%, #5b9bd5 100%)"
          : "linear-gradient(135deg, #111827 0%, #1f2937 40%, #4b1d1d 100%)",
  };
}
