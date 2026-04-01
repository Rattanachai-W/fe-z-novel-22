import Link from "next/link";
import { FaChevronDown } from "react-icons/fa";

type Chapter = {
  id: string;
  chapter_number: number;
  title: string;
  is_free: boolean;
  coin_price: number;
  created_at: string;
};

type ChapterListProps = {
  novelId: string;
  chapters: Chapter[];
};

export function ChapterList({ novelId, chapters }: ChapterListProps) {
  // Mock data — pad up to 150 chapters for accordion demo
  let displayChapters = [...chapters];
  if (displayChapters.length < 150) {
    const start =
      displayChapters.length > 0
        ? displayChapters[displayChapters.length - 1].chapter_number + 1
        : 1;
    for (let i = start; i <= 150; i++) {
      displayChapters.push({
        id: `mock-uuid-${i}`,
        chapter_number: i,
        title: `บทที่ ${i}: การเดินทางที่ไม่สิ้นสุด`,
        is_free: i <= 10,
        coin_price: 5,
        created_at: new Date(Date.now() - (150 - i) * 86400000).toISOString(),
      });
    }
  }

  // Sort newest (highest chapter_number) first
  displayChapters = displayChapters.sort((a, b) => b.chapter_number - a.chapter_number);

  // Group by 50 (after sorting, so group 1 = chapters 150–101, group 2 = 100–51, …)
  const groups: { range: string; chapters: Chapter[] }[] = [];
  const GROUP_SIZE = 50;

  for (let i = 0; i < displayChapters.length; i += GROUP_SIZE) {
    const chunk = displayChapters.slice(i, i + GROUP_SIZE);
    // chunk is sorted descending, so first item is the highest chapter number
    const highNum = chunk[0].chapter_number;
    const lowNum = chunk[chunk.length - 1].chapter_number;
    groups.push({
      range: `ตอนที่ ${lowNum}–${highNum}`,
      chapters: chunk,
    });
  }

  return (
    <div className="mt-6 flex flex-col gap-4">
      {groups.map((group, index) => (
        <details
          key={group.range}
          className="group overflow-hidden rounded-[1.4rem] border border-[var(--color-border)] bg-[var(--color-surface-muted)] transition-all open:bg-[var(--color-background)] open:shadow-sm"
          open={index === 0} // open the first one by default
        >
          <summary className="flex cursor-pointer list-none items-center justify-between p-4 font-semibold outline-none transition hover:text-[var(--color-brand)] [&::-webkit-details-marker]:hidden">
            <span className="text-lg">{group.range}</span>
            <FaChevronDown className="text-[var(--color-muted)] transition-transform duration-300 group-open:rotate-180" />
          </summary>
          <div className="flex flex-col gap-3 p-4 pt-0">
            {group.chapters.map((chapter) => (
              <Link
                key={chapter.id}
                href={`/novels/${novelId}/chapters/${chapter.id}`}
                className="flex items-center justify-between gap-4 rounded-[1.2rem] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition-all hover:border-[var(--color-brand)] hover:shadow-sm"
              >
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-muted)]">
                    ตอนที่ {chapter.chapter_number}
                  </p>
                  <h3 className="mt-1 text-[15px] font-semibold sm:text-lg">{chapter.title}</h3>
                </div>
                <div className="shrink-0 text-right">
                  <p className="whitespace-nowrap text-sm font-medium text-[var(--color-muted)]">
                    {chapter.is_free ? (
                      <span className="text-[var(--color-brand-strong)]">อ่านฟรี</span>
                    ) : (
                      <span className="text-[#eab308]">{chapter.coin_price} Gold</span>
                    )}
                  </p>
                  <p className="mt-1 text-xs text-[var(--color-muted)]">
                    {new Date(chapter.created_at).toLocaleDateString("th-TH")}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </details>
      ))}
    </div>
  );
}
