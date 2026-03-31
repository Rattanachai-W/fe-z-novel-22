import Link from "next/link";
import { notFound } from "next/navigation";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { AuthorFollowButton } from "@/components/novels/author-follow-button";
import { SiteHeader } from "@/components/layout/site-header";
import { BookmarkButton } from "@/components/novels/bookmark-button";
import { NovelRatingPanel } from "@/components/novels/novel-rating-panel";
import { getNovelById } from "@/lib/api/novels";

type NovelDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function NovelDetailPage({ params }: NovelDetailPageProps) {
  const { id } = await params;
  const novel = await getNovelById(id);

  if (!novel) {
    notFound();
  }

  const firstChapter = novel.chapters?.[0];

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 pb-28 sm:px-6 lg:px-8">
      <SiteHeader primaryHref={firstChapter ? `/novels/${novel.id}/chapters/${firstChapter.id}` : "/"} primaryLabel="เปิดหน้าอ่าน" />

      <div className="mb-6 flex flex-wrap items-center gap-3 text-sm text-[var(--color-muted)]">
        <Link href="/">หน้าแรก</Link>
        <span>/</span>
        <span>{novel.Category?.name ?? "นิยาย"}</span>
        <span>/</span>
        <span className="text-[var(--color-foreground)]">{novel.title}</span>
      </div>

      <section className="card-surface overflow-hidden">
        <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-brand)]">
              Novel Detail
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-balance">
              {novel.title}
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-8 text-[var(--color-muted)] sm:text-base">
              {novel.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {novel.Tags?.map((tag) => (
                <span
                  key={tag.id}
                  className="rounded-full bg-[var(--color-surface-muted)] px-3 py-2 text-sm text-[var(--color-muted)]"
                >
                  #{tag.name}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {firstChapter ? (
                <Link
                  href={`/novels/${novel.id}/chapters/${firstChapter.id}`}
                  className="rounded-full bg-[var(--color-brand)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-brand-strong)]"
                >
                  เริ่มอ่านตอนแรก
                </Link>
              ) : null}
              <BookmarkButton novelId={novel.id} />
              {novel.author?.id ? (
                <AuthorFollowButton
                  authorId={novel.author.id}
                  authorName={novel.author.username}
                />
              ) : null}
            </div>
          </div>

          <aside className="rounded-[1.75rem] border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-6">
            <h2 className="text-lg font-semibold">ข้อมูลเรื่อง</h2>
            <dl className="mt-5 space-y-4 text-sm">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-[var(--color-muted)]">ผู้แต่ง</dt>
                <dd className="font-semibold">
                  {novel.author?.id ? (
                    <Link href={`/authors/${novel.author.id}`}>
                      {novel.author.username}
                    </Link>
                  ) : (
                    "Unknown"
                  )}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-[var(--color-muted)]">หมวดหมู่</dt>
                <dd className="font-semibold">{novel.Category?.name ?? "ทั่วไป"}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-[var(--color-muted)]">สถานะ</dt>
                <dd className="font-semibold capitalize">{novel.status}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-[var(--color-muted)]">ยอดอ่าน</dt>
                <dd className="font-semibold">
                  {novel.view_count.toLocaleString("th-TH")}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-[var(--color-muted)]">เรตติ้ง</dt>
                <dd className="font-semibold">{novel.rating.toFixed(1)}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-[var(--color-muted)]">จำนวนตอน</dt>
                <dd className="font-semibold">{novel.chapters?.length ?? 0}</dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>

      <section className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="card-surface p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-brand)]">
                Chapter List
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                สารบัญนิยาย
              </h2>
            </div>
            <div className="rounded-full bg-[var(--color-surface-muted)] px-3 py-2 text-sm text-[var(--color-muted)]">
              พร้อมต่อ API unlock
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {novel.chapters?.map((chapter) => (
              <Link
                key={chapter.id}
                href={`/novels/${novel.id}/chapters/${chapter.id}`}
                className="flex items-center justify-between gap-4 rounded-[1.4rem] border border-[var(--color-border)] p-4 transition hover:border-[var(--color-brand)] hover:bg-[var(--color-surface-muted)]"
              >
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-muted)]">
                    ตอนที่ {chapter.chapter_number}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold">{chapter.title}</h3>
                </div>
                <div className="text-right">
                  <p className="text-sm text-[var(--color-muted)]">
                    {chapter.is_free ? "อ่านฟรี" : `${chapter.coin_price} Gold`}
                  </p>
                  <p className="mt-1 text-xs text-[var(--color-muted)]">
                    {new Date(chapter.created_at).toLocaleDateString("th-TH")}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <aside className="card-surface p-6 sm:p-8">
          <NovelRatingPanel
            novelId={novel.id}
            initialRating={novel.rating}
            initialCount={novel.rating_count}
          />
        </aside>
      </section>

      <MobileBottomNav
        items={[
          { href: "/", label: "หน้าแรก", icon: "home", match: "exact" },
          { href: `/novels/${novel.id}`, label: "ข้อมูล", icon: "info", match: "exact" },
          {
            href: firstChapter ? `/novels/${novel.id}/chapters/${firstChapter.id}` : `/novels/${novel.id}`,
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
