import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 60; // Enable ISR (Incremental Static Regeneration) cache for 60 seconds

import type { Metadata } from "next";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { AuthorFollowButton } from "@/components/novels/author-follow-button";
import { SiteHeader } from "@/components/layout/site-header";
import { BookmarkButton } from "@/components/novels/bookmark-button";
import { NovelReviewSection } from "@/components/novels/novel-review-section";
import { ChapterList } from "@/components/novels/chapter-list";
import { getNovelById } from "@/lib/api/novels";
import {
  FaEye,
  FaStar,
  FaBookOpen,
  FaBell,
  FaCalendarAlt,
  FaPlay,
} from "react-icons/fa";

type NovelDetailPageProps = {
  params: Promise<{ id: string }>;
};

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  ongoing:   { label: "กำลังดำเนินเรื่อง", color: "#22c55e", bg: "color-mix(in srgb,#22c55e 14%,transparent)" },
  completed: { label: "จบแล้ว",             color: "#6366f1", bg: "color-mix(in srgb,#6366f1 14%,transparent)" },
  on_hold:   { label: "หยุดพัก",            color: "#f97316", bg: "color-mix(in srgb,#f97316 14%,transparent)" },
};

export async function generateMetadata({ params }: NovelDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const novel = await getNovelById(id);

  if (!novel) {
    return { title: "ไม่พบนิยาย" };
  }

  const title = novel.title;
  const description = novel.description || `อ่าน ${novel.title} โดย ${novel.author?.username ?? "ผู้แต่ง"} บทแพลตฟอร์ม DinoNovel`;
  const imageUrl = novel.cover_image_url || "/default-cover.png";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      images: [{ url: imageUrl }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function NovelDetailPage({ params }: NovelDetailPageProps) {
  const { id } = await params;
  const novel = await getNovelById(id);

  if (!novel) notFound();

  const firstChapter = novel.chapters?.[0];
  const latestChapter = novel.chapters?.[novel.chapters.length - 1];
  const statusInfo = STATUS_MAP[novel.status] ?? STATUS_MAP.ongoing;

  // Mock follower count (replace with real API field when available)
  const followerCount = 2410;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 pb-28 sm:px-6 lg:px-8">
      {/* ── JSON-LD Schema for SEO ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Book",
            name: novel.title,
            author: {
              "@type": "Person",
              name: novel.author?.username ?? "ผู้แต่ง DinoNovel",
            },
            image: novel.cover_image_url || "https://dinonovel.com/default-cover.png",
            description: novel.description || `นิยายเรื่อง ${novel.title}`,
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: novel.rating > 0 ? novel.rating.toFixed(1) : "5.0",
              ratingCount: novel.rating_count > 0 ? novel.rating_count : 1,
            },
            genre: novel.Category?.name || "Fiction",
          }),
        }}
      />
      <SiteHeader
        primaryHref={firstChapter ? `/novels/${novel.id}/chapters/${firstChapter.id}` : "/"}
        primaryLabel="เปิดหน้าอ่าน"
      />

      {/* Breadcrumb */}
      <div className="mb-6 flex flex-wrap items-center gap-3 text-sm text-[var(--color-muted)]">
        <Link href="/">หน้าแรก</Link>
        <span>/</span>
        <span>{novel.Category?.name ?? "นิยาย"}</span>
        <span>/</span>
        <span className="text-[var(--color-foreground)]">{novel.title}</span>
      </div>

      {/* ═══════════════════════════════════════════════════════
          Novel Detail Card  (ดีไซน์ใหม่ inspired by platforms)
          ═══════════════════════════════════════════════════════ */}
      <section className="card-surface overflow-hidden">
        <div className="flex flex-col gap-0 sm:flex-row">

          {/* ── Cover Image ── */}
          <div className="relative shrink-0 sm:w-44 lg:w-52 xl:w-60 p-4 sm:p-5 lg:p-6">
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[1.25rem] shadow-xl shadow-[color-mix(in_srgb,var(--color-brand)_15%,transparent)] ring-1 ring-white/10 transition-transform hover:scale-[1.02]">
              {novel.cover_image_url ? (
                <img
                  src={novel.cover_image_url}
                  alt={novel.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[var(--color-surface-muted)] text-sm text-[var(--color-muted)]">
                  ไม่มีรูปปก
                </div>
              )}
              {/* Status badge overlayed on the image container */}
              <span
                className="absolute top-2 left-2 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow-sm"
                style={{ background: statusInfo.bg, color: statusInfo.color, backdropFilter: "blur(4px)" }}
              >
                {statusInfo.label}
              </span>
            </div>
          </div>

          {/* ── Main Info ── */}
          <div className="flex min-w-0 flex-1 flex-col justify-between gap-5 p-5 sm:p-6 lg:p-8">
            {/* Top block */}
            <div>
              {/* Category badge */}
              {novel.Category ? (
                <span className="rounded-full bg-[color-mix(in_srgb,var(--color-brand)_12%,transparent)] px-2.5 py-1 text-xs font-semibold text-[var(--color-brand-strong)]">
                  {novel.Category.name}
                </span>
              ) : null}

              {/* Title */}
              <h1 className="mt-3 text-2xl font-bold tracking-tight leading-snug sm:text-3xl lg:text-4xl">
                {novel.title}
              </h1>

              {/* Author row */}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Link
                  href={`/authors/${novel.author?.id}`}
                  className="flex items-center gap-2 text-sm font-semibold text-[var(--color-foreground)] hover:text-[var(--color-brand)]"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand)] text-xs font-bold text-white">
                    {novel.author?.username?.[0]?.toUpperCase() ?? "A"}
                  </span>
                  {novel.author?.username ?? "ผู้แต่ง"}
                </Link>
                {novel.author?.id ? (
                  <AuthorFollowButton authorId={novel.author.id} />
                ) : null}
              </div>

              {/* Description */}
              <p className="mt-4 text-sm leading-7 text-[var(--color-muted)] line-clamp-3 sm:line-clamp-none">
                {novel.description}
              </p>

              {/* Latest chapter info */}
              {latestChapter ? (
                <p className="mt-3 text-xs text-[var(--color-muted)]">
                  <span className="font-semibold text-[var(--color-brand)]">ล่าสุด:</span>{" "}
                  <Link
                    href={`/novels/${novel.id}/chapters/${latestChapter.id}`}
                    className="hover:underline"
                  >
                    ตอนที่ {latestChapter.chapter_number} — {latestChapter.title}
                  </Link>
                </p>
              ) : null}

              {/* Tags section moved here */}
              <div className="mt-6 flex flex-wrap gap-2">
                {novel.Tags?.slice(0, 8).map((tag) => (
                  <span
                    key={tag.id}
                    className="rounded-full border border-[var(--color-border)] px-2.5 py-1 text-xs text-[var(--color-muted)] transition hover:border-[var(--color-brand)] hover:text-[var(--color-brand)]"
                  >
                    #{tag.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom block: Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              {firstChapter ? (
                <Link
                  href={`/novels/${novel.id}/chapters/${firstChapter.id}`}
                  className="flex items-center gap-2 rounded-full bg-[var(--color-brand)] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[var(--color-brand-strong)] active:scale-95"
                >
                  <FaPlay className="text-[10px]" />
                  เริ่มอ่านตอนแรก
                </Link>
              ) : null}
              <BookmarkButton novelId={novel.id} />
              {novel.author?.id ? null /* already shown above */ : null}
            </div>
          </div>

          {/* ── Right Stats Panel ── */}
          <aside className="shrink-0 border-t border-[var(--color-border)] sm:w-40 sm:border-t-0 sm:border-l lg:w-48">
            {/* Stats list */}
            <div className="divide-y divide-[var(--color-border)]">
              {[
                { icon: <FaEye />,       value: novel.view_count.toLocaleString("th-TH"), label: "ยอดอ่าน",      color: "#0ea5e9" },
                { icon: <FaStar />,      value: novel.rating.toFixed(1),                  label: "คะแนน",        color: "#eab308" },
                { icon: <FaBell />,      value: followerCount.toLocaleString("th-TH"),    label: "ผู้ติดตาม",    color: "#a855f7" },
                { icon: <FaBookOpen />,  value: `${novel.chapters?.length ?? 0} ตอน`,    label: "ทั้งหมด",      color: "#f97316" },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-3 px-4 py-3.5 sm:flex-col sm:items-start sm:gap-1 sm:px-5 sm:py-4">
                  <span style={{ color: stat.color }} className="text-base sm:text-lg">{stat.icon}</span>
                  <div>
                    <p className="text-base font-bold leading-none sm:text-xl">{stat.value}</p>
                    <p className="mt-0.5 text-[10px] uppercase tracking-widest text-[var(--color-muted)]">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Meta info at bottom */}
            <div className="border-t border-[var(--color-border)] px-5 py-4 space-y-2 text-xs text-[var(--color-muted)]">
              <div className="flex items-center gap-2">
                <FaCalendarAlt className="shrink-0 text-[var(--color-brand)]" />
                <span>อัปเดต {latestChapter?.created_at
                  ? new Date(latestChapter.created_at).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" })
                  : "—"
                }</span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* ─── Review & Rating Section ─── */}
      <div className="mt-8">
        <NovelReviewSection
          novelId={novel.id}
          initialRating={novel.rating}
          initialCount={novel.rating_count}
        />
      </div>

      {/* ─── Tagline Card (คำโปรย) ─── */}
      <div className="card-surface mt-8 overflow-hidden">
        <div className="px-7 py-8 sm:px-10 sm:py-10">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-brand)]">
            คำโปรย
          </p>
          <div className="relative mt-1">
            <span
              aria-hidden
              className="pointer-events-none absolute -top-3 -left-3 select-none text-[7rem] leading-none text-[var(--color-brand)] opacity-10 sm:-top-4 sm:-left-4 sm:text-[9rem]"
            >
              "
            </span>
            <blockquote className="relative z-10 mt-4 text-lg font-medium leading-[2] tracking-wide text-[var(--color-foreground)] sm:text-xl sm:leading-[2.1]">
              {novel.description}
            </blockquote>
          </div>
          <footer className="mt-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-[var(--color-border)]" />
            <p className="text-sm font-semibold text-[var(--color-muted)]">
              — {novel.author?.username ?? "ผู้แต่ง"}
            </p>
          </footer>
        </div>
      </div>

      {/* ─── Chapter List ─── */}
      <section className="card-surface mt-8 p-6 sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-brand)]">
              Chapter List
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">สารบัญนิยาย</h2>
          </div>
          <div className="rounded-full bg-[var(--color-surface-muted)] px-3 py-2 text-sm text-[var(--color-muted)]">
            {novel.chapters?.length ?? 0} ตอน
          </div>
        </div>
        <ChapterList novelId={novel.id} chapters={novel.chapters ?? []} />
      </section>

      <MobileBottomNav
        items={[
          { href: "/", label: "หน้าแรก", icon: "home", match: "exact" },
          { href: `/novels/${novel.id}`, label: "ข้อมูล", icon: "info", match: "exact" },
          {
            href: firstChapter
              ? `/novels/${novel.id}/chapters/${firstChapter.id}`
              : `/novels/${novel.id}`,
            label: "อ่าน",
            icon: "book-open",
            match: "prefix",
          },
          { href: "/writer", label: "เขียน", icon: "pen", match: "prefix" },
        ]}
      />
    </main>
  );
}
