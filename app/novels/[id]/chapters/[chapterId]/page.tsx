import Link from "next/link";
import { notFound } from "next/navigation";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { ReaderControls } from "@/components/reader/reader-controls";
import { ReaderTapZones } from "@/components/reader/reader-tap-zones";
import { ReaderViewportProvider } from "@/components/reader/reader-viewport";
import { SiteHeader } from "@/components/layout/site-header";
import { ChapterComments } from "@/components/novels/chapter-comments";
import { UnlockChapterButton } from "@/components/novels/unlock-chapter-button";
import { ReaderHistorySync } from "@/components/reader/reader-history-sync";
import { getChapterById, getNovelById } from "@/lib/api/novels";

type ChapterReaderPageProps = {
  params: Promise<{
    id: string;
    chapterId: string;
  }>;
};

export default async function ChapterReaderPage({
  params,
}: ChapterReaderPageProps) {
  const { id, chapterId } = await params;
  const [novel, chapter] = await Promise.all([getNovelById(id), getChapterById(chapterId)]);

  if (!novel || !chapter) {
    notFound();
  }

  const currentIndex =
    novel.chapters?.findIndex((item) => item.id === chapter.id) ?? -1;
  const previousChapter =
    currentIndex > 0 ? novel.chapters?.[currentIndex - 1] : undefined;
  const nextChapter =
    currentIndex >= 0 ? novel.chapters?.[currentIndex + 1] : undefined;

  return (
    <ReaderViewportProvider>
      <main className="mx-auto w-full max-w-4xl px-4 py-8 pb-32 sm:px-6 lg:px-8">
        <SiteHeader primaryHref={`/novels/${novel.id}`} primaryLabel="กลับหน้ารายเรื่อง" />

        <div className="mb-6 flex flex-wrap items-center gap-3 text-sm text-[var(--color-muted)]">
          <Link href="/">หน้าแรก</Link>
          <span>/</span>
          <Link href={`/novels/${novel.id}`}>{novel.title}</Link>
          <span>/</span>
          <span className="text-[var(--color-foreground)]">{chapter.title}</span>
        </div>

        <ReaderControls>
          <article className="overflow-hidden">
            <ReaderHistorySync novelId={novel.id} chapterId={chapter.id} />
            <header className="border-b border-[var(--color-border)] px-5 py-7 sm:px-10 sm:py-8">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-brand)]">
                Reader Experience
              </p>
              <h1 className="mt-4 text-2xl font-semibold tracking-tight sm:text-4xl">
                ตอนที่ {chapter.chapter_number}: {chapter.title}
              </h1>
              <div className="mt-4 flex flex-wrap gap-3 text-sm text-[var(--color-muted)]">
                <span>โดย {novel.author?.username ?? "Unknown"}</span>
                <span>•</span>
                <span>
                  {chapter.is_free
                    ? "เปิดอ่านฟรี"
                    : chapter.locked
                      ? `ล็อกอยู่ ${chapter.coin_price} Gold`
                      : `ปลดล็อกแล้ว ${chapter.coin_price} Gold`}
                </span>
              </div>
            </header>

            <div className="px-5 py-8 sm:px-10 sm:py-10">
              {chapter.locked ? (
                <section className="rounded-[1.75rem] border border-amber-500/25 bg-amber-500/8 p-6">
                  <h2 className="text-2xl font-semibold tracking-tight">
                    ตอนนี้ยังถูกล็อก
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                    UI นี้พร้อมต่อกับ `POST /api/novels/chapters/:id/unlock` เพื่อหัก Gold
                    จาก wallet และรีเฟรชสถานะการอ่านทันที
                  </p>
                  <UnlockChapterButton
                    chapterId={chapter.id}
                    coinPrice={chapter.coin_price}
                  />
                </section>
              ) : (
                <div className="reading-prose text-[var(--color-foreground)]">
                  {splitParagraphs(chapter.content).map((paragraph, index) => (
                    <p key={`${chapter.id}-${index}`}>{paragraph}</p>
                  ))}
                </div>
              )}
            </div>
          </article>
        </ReaderControls>

        <nav className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="card-surface p-5">
            <p className="text-sm text-[var(--color-muted)]">ตอนก่อนหน้า</p>
            {previousChapter ? (
              <Link
                href={`/novels/${novel.id}/chapters/${previousChapter.id}`}
                className="mt-2 block text-lg font-semibold"
              >
                ตอนที่ {previousChapter.chapter_number}: {previousChapter.title}
              </Link>
            ) : (
              <p className="mt-2 text-lg font-semibold">นี่คือตอนแรกของเรื่อง</p>
            )}
          </div>

          <div className="card-surface p-5">
            <p className="text-sm text-[var(--color-muted)]">ตอนถัดไป</p>
            {nextChapter ? (
              <Link
                href={`/novels/${novel.id}/chapters/${nextChapter.id}`}
                className="mt-2 block text-lg font-semibold"
              >
                ตอนที่ {nextChapter.chapter_number}: {nextChapter.title}
              </Link>
            ) : (
              <p className="mt-2 text-lg font-semibold">ถึงตอนล่าสุดแล้ว</p>
            )}
          </div>
        </nav>

        <ChapterComments chapterId={chapter.id} />

        <ReaderTapZones
          previousHref={
            previousChapter
              ? `/novels/${novel.id}/chapters/${previousChapter.id}`
              : undefined
          }
          nextHref={
            nextChapter ? `/novels/${novel.id}/chapters/${nextChapter.id}` : undefined
          }
        />

        <MobileBottomNav
          items={[
            { href: "/", label: "หน้าแรก", icon: "home", match: "exact" },
            { href: `/novels/${novel.id}`, label: "สารบัญ", icon: "list", match: "exact" },
            {
              href: `/novels/${novel.id}/chapters/${chapter.id}`,
              label: "กำลังอ่าน",
              icon: "book-open",
              match: "prefix",
            },
            { href: "/?tag=tag-readlist", label: "ชั้นหนังสือ", icon: "bookmark", match: "prefix" },
          ]}
        />
      </main>
    </ReaderViewportProvider>
  );
}

function splitParagraphs(content?: string | null) {
  if (!content) {
    return [];
  }

  return content
    .split(/\r?\n\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}
