"use client";

import { useState, useTransition } from "react";
import { useApp } from "@/components/providers/app-provider";
import { rateNovel } from "@/lib/api/novels";
import {
  FaStar,
  FaRegStar,
  FaPen,
  FaTimes,
  FaArrowRight,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";

// ─── Types ────────────────────────────────────────────────────────────────────
type MockReview = {
  id: string;
  username: string;
  avatar: string;
  score: number;
  content: string;
  chapter_read?: string;
  tag?: string;
  likes: number;
  liked: boolean;
  created_at: string;
};

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_REVIEWS: MockReview[] = [
  {
    id: "1",
    username: "DinoFan99",
    avatar: "D",
    score: 5,
    content: "นิยายเรื่องนี้ดีมากเลยครับ เนื้อเรื่องสนุกมาก อ่านทีเดียวรวดเดียวเลย อยากให้อัปเดตบ่อยๆ นะครับ ❤️",
    chapter_read: "อ่านถึง #87",
    likes: 12,
    liked: false,
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: "2",
    username: "RexReader",
    avatar: "R",
    score: 4,
    content: "เนื้อเรื่องน่าสนใจดีค่ะ ชอบตัวละครหลักมาก แต่บางตอนดำเนินเรื่องช้าไปนิดหน่อย โดยรวมถือว่าดีมากค่ะ",
    chapter_read: "อ่านถึง #71",
    tag: "ตื่นเต้น ลุ้นระทึกตลอดเรื่อง",
    likes: 4,
    liked: false,
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: "3",
    username: "ThaiNovelLover",
    avatar: "T",
    score: 5,
    content: "เขียนได้ดีมากครับ สไตล์การเขียนเป็นเอกลักษณ์มาก อ่านแล้วติดใจเลยครับ รอตอนต่อไปอยู่เลย",
    chapter_read: "อ่านถึง #22",
    likes: 7,
    liked: false,
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    id: "4",
    username: "MangaKhun",
    avatar: "M",
    score: 4,
    content: "เรื่องราวสะท้อนชีวิตจริงได้ดีมาก ตัวละครมีความลึกดีครับ ชอบมากๆ",
    chapter_read: "อ่านถึง #55",
    likes: 2,
    liked: false,
    created_at: new Date(Date.now() - 14 * 86400000).toISOString(),
  },
  {
    id: "5",
    username: "NightOwlReader",
    avatar: "N",
    score: 5,
    content: "อ่านตอนดึกแล้วขนลุกมากเลยครับ เนื้อเรื่องดีมาก ตัวเอกน่ารัก เป็นกำลังใจให้นักเขียนนะครับ!",
    chapter_read: "อ่านถึง #10",
    likes: 19,
    liked: false,
    created_at: new Date(Date.now() - 22 * 86400000).toISOString(),
  },
];
const REVIEW_TAGS = [
  "ทั้งหมด",
  "ตัวละครมีเสน่ห์ น่าสนใจ",
  "ดำเนินเรื่องกระชับ ชวนติดตาม",
  "เนื้อเรื่องมีชั้นเชิง เดาทางไม่ถูก",
  "อ่านแล้วรู้สึกอุ่นใจ",
  "บีบคั้นอารมณ์สุดๆ",
  "ตื่นเต้น ลุ้นระทึกตลอดเรื่อง",
  "สะกดคำถูกต้อง อ่านง่าย ไม่สะดุด",
  "อัปเดตสม่ำเสมอ ตามอ่านได้ต่อเนื่อง",
];

// ─── Sub-components ───────────────────────────────────────────────────────────
function StarRow({ score, size = 16 }: { score: number; size?: number }) {
  return (
    <span className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) =>
        i <= score ? (
          <FaStar key={i} style={{ fontSize: size }} className="text-[#eab308]" />
        ) : (
          <FaRegStar key={i} style={{ fontSize: size }} className="text-[var(--color-border)]" />
        ),
      )}
    </span>
  );
}

function StarPicker({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (s: number) => void;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const display = hovered ?? value;
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onMouseEnter={() => setHovered(s)}
          onMouseLeave={() => setHovered(null)}
          onClick={() => onChange(s)}
          className="text-2xl transition-transform hover:scale-110 active:scale-95"
        >
          {s <= (display ?? 0) ? (
            <FaStar className="text-[#eab308]" />
          ) : (
            <FaRegStar className="text-[var(--color-border)]" />
          )}
        </button>
      ))}
    </div>
  );
}

// ─── Compact Review Card (horizontal strip) ───────────────────────────────────
function ReviewCard({
  review,
  onToggleLike,
}: {
  review: MockReview;
  onToggleLike: (id: string) => void;
}) {
  return (
    <div className="flex w-[280px] shrink-0 flex-col justify-between rounded-[1.5rem] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-sm sm:w-80 sm:p-5">
      <div>
        <div className="flex items-center justify-between">
          <StarRow score={review.score} size={13} />
          {review.chapter_read ? (
            <span className="text-[10px] font-medium text-[var(--color-muted)] opacity-80 uppercase tracking-wider">
              {review.chapter_read}
            </span>
          ) : null}
        </div>
        <p className="mt-3 line-clamp-3 text-sm leading-6 font-medium text-[var(--color-foreground)]">
          {review.content}
        </p>
        {review.tag ? (
          <span className="mt-3 inline-block rounded-full bg-[color-mix(in_srgb,var(--color-brand)_8%,transparent)] px-2.5 py-0.5 text-[10px] font-semibold text-[var(--color-brand-strong)]">
            {review.tag}
          </span>
        ) : null}
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-[var(--color-border)]/50 pt-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-brand)] text-[10px] font-bold text-white shadow-inner">
            {review.avatar}
          </div>
          <div>
            <p className="text-xs font-bold leading-none">{review.username}</p>
            <p className="mt-1 text-[9px] text-[var(--color-muted)]">
              {new Date(review.created_at).toLocaleDateString("th-TH", {
                day: "numeric",
                month: "short",
              })}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onToggleLike(review.id)}
          className={`flex items-center gap-1.5 rounded-full px-2 py-1 text-[10px] font-semibold transition ${
            review.liked
              ? "bg-rose-50 text-rose-500"
              : "text-[var(--color-muted)] hover:bg-[var(--color-surface-muted)]"
          }`}
        >
          {review.liked ? <FaHeart /> : <FaRegHeart />}
          {review.likes > 0 ? review.likes : ""}
        </button>
      </div>
    </div>
  );
}

// ─── Full Review Modal ────────────────────────────────────────────────────────
function AllReviewsModal({
  open,
  onClose,
  reviews,
  rating,
  count,
  novelId,
  onNewReview,
}: {
  open: boolean;
  onClose: () => void;
  reviews: MockReview[];
  rating: number;
  count: number;
  novelId: string;
  onNewReview: (score: number, text: string) => void;
}) {
  const { token, requireAuth, user } = useApp();
  const [selectedTag, setSelectedTag] = useState("ทั้งหมด");
  const [score, setScore] = useState<number | null>(null);
  const [text, setText] = useState("");
  const [isPending, startTransition] = useTransition();

  function submit() {
    if (!token) { requireAuth("login"); return; }
    if (!score) return;
    startTransition(async () => {
      onNewReview(score, text);
      setScore(null);
      setText("");
    });
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)" }}
      onClick={(e) => { if (e.currentTarget === e.target) onClose(); }}
    >
      <div
        className="relative flex w-full max-w-3xl overflow-hidden rounded-t-[2rem] bg-[var(--color-background)] shadow-2xl sm:max-h-[90vh] sm:rounded-[2rem]"
        style={{ animation: "modal-up 0.25s cubic-bezier(0.34,1.3,0.64,1) both", maxHeight: "92vh" }}
      >
        {/* ── Left panel */}
        <div className="hidden w-60 shrink-0 flex-col gap-4 overflow-y-auto border-r border-[var(--color-border)] p-6 sm:flex">
          <div>
            <p className="text-5xl font-bold">{rating.toFixed(1)}</p>
            <StarRow score={Math.round(rating)} size={16} />
            <p className="mt-1 text-xs text-[var(--color-muted)]">{count.toLocaleString("th-TH")} รีวิว</p>
          </div>

          <button
            type="button"
            onClick={() => { if (!token) { requireAuth("login"); return; } }}
            className="flex items-center justify-center gap-2 rounded-full bg-[var(--color-brand)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-brand-strong)]"
          >
            <FaPen className="text-xs" />
            เขียนรีวิว
          </button>

          <div>
            <p className="mb-2 text-xs font-semibold text-[var(--color-muted)]">รีวิวทั้งหมดบอกว่า:</p>
            <div className="flex flex-wrap gap-1.5">
              {REVIEW_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTag(tag)}
                  className={`rounded-full border px-3 py-1 text-xs transition ${
                    selectedTag === tag
                      ? "border-[var(--color-brand)] bg-[var(--color-brand)] text-white"
                      : "border-[var(--color-border)] hover:border-[var(--color-brand)] hover:text-[var(--color-brand)]"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right panel */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-4">
            <p className="font-semibold">{count} รีวิว</p>
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-surface-muted)] text-[var(--color-muted)] transition hover:bg-[var(--color-border)]"
            >
              <FaTimes className="text-sm" />
            </button>
          </div>

          {/* Write-review strip */}
          <div className="border-b border-[var(--color-border)] px-5 py-3">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-sm text-[var(--color-muted)]">ให้คะแนน</p>
              <StarPicker value={score} onChange={setScore} />
              <p className="ml-auto text-xs text-[var(--color-muted)]">อัปเดตทุกๆ 1 ชั่วโมง</p>
            </div>
            {score ? (
              <div className="mt-2 flex gap-2">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="flex-1 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-4 py-2 text-sm outline-none transition focus:border-[var(--color-brand)]"
                  placeholder="เขียนความคิดเห็น... (ไม่บังคับ)"
                />
                <button
                  type="button"
                  disabled={isPending}
                  onClick={submit}
                  className="shrink-0 rounded-full bg-[var(--color-brand)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--color-brand-strong)] disabled:opacity-50"
                >
                  {isPending ? "..." : "ส่ง"}
                </button>
              </div>
            ) : null}
          </div>

          {/* Review list */}
          <div className="flex-1 overflow-y-auto">
            {reviews.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 px-8 py-16 text-center">
                <span className="text-4xl">🦖</span>
                <p className="font-semibold text-[var(--color-foreground)]">ยังไม่มีรีวิวสำหรับเรื่องนี้</p>
                <p className="text-sm text-[var(--color-muted)] leading-6">
                  เป็นคนแรกที่บอกให้ชาว DinoNovel รู้ว่าเรื่องนี้ดีแค่ไหน!
                </p>
                <button
                  type="button"
                  onClick={() => { if (!token) { requireAuth("login"); return; } }}
                  className="mt-1 flex items-center gap-2 rounded-full bg-[var(--color-brand)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-brand-strong)] active:scale-95"
                >
                  <FaPen className="text-xs" />
                  เขียนรีวิวคนแรก
                </button>
              </div>
            ) : (
              reviews.map((r) => (
                <div
                  key={r.id}
                  className="border-b border-[var(--color-border)] px-5 py-4 last:border-0"
                >
                  <div className="flex items-center gap-2">
                    <StarRow score={r.score} size={13} />
                    {r.chapter_read ? (
                      <span className="text-xs text-[var(--color-muted)]">{r.chapter_read}</span>
                    ) : null}
                  </div>
                  <p className="mt-2 text-sm leading-6">{r.content}</p>
                  {r.tag ? (
                    <span className="mt-1.5 inline-block rounded-full border border-[var(--color-border)] px-2.5 py-1 text-xs text-[var(--color-muted)]">
                      {r.tag}
                    </span>
                  ) : null}
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-brand)] text-xs font-bold text-white">
                        {r.avatar}
                      </div>
                      <div>
                        <p className="text-xs font-semibold">{r.username}</p>
                        <p className="text-[10px] text-[var(--color-muted)]">
                          {new Date(r.created_at).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-[var(--color-muted)]">
                      <FaRegHeart />
                      {r.likes}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes modal-up {
          from { opacity:0; transform: translateY(24px) scale(0.97); }
          to   { opacity:1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

// ─── Main exported component ──────────────────────────────────────────────────
export type NovelReviewSectionProps = {
  novelId: string;
  initialRating: number;
  initialCount: number;
};

export function NovelReviewSection({
  novelId,
  initialRating,
  initialCount,
}: NovelReviewSectionProps) {
  const { token, requireAuth, user } = useApp();
  const [rating, setRating] = useState(initialRating);
  const [count, setCount] = useState(initialCount);
  const [reviews, setReviews] = useState<MockReview[]>(MOCK_REVIEWS);
  const [modalOpen, setModalOpen] = useState(false);
  const [, startTransition] = useTransition();

  function handleOpenWrite() {
    if (!token) { requireAuth("login"); return; }
    setModalOpen(true);
  }

  function handleNewReview(score: number, text: string) {
    startTransition(async () => {
      try {
        const res = await rateNovel(token!, novelId, score);
        setRating(res.rating);
        setCount(res.rating_count);
      } catch { /* optimistic */ }

      if (text.trim()) {
        setReviews((prev) => [
          {
            id: `u-${Date.now()}`,
            username: user?.username ?? "คุณ",
            avatar: (user?.username?.[0] ?? "N").toUpperCase(),
            score,
            content: text.trim(),
            chapter_read: undefined,
            tag: undefined,
            likes: 0,
            liked: false,
            created_at: new Date().toISOString(),
          },
          ...prev,
        ]);
      }
    });
  }

  function toggleLike(id: string) {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, liked: !r.liked, likes: r.liked ? r.likes - 1 : r.likes + 1 }
          : r,
      ),
    );
  }

  return (
    <>
      <AllReviewsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        reviews={reviews}
        rating={rating}
        count={count}
        novelId={novelId}
        onNewReview={handleNewReview}
      />

      {/* ── Enhanced Review Strip (Responsive) ── */}
      <section className="mt-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch">
          
          {/* 1. Score Summary Card (Left on Desktop, Top on Mobile) */}
          <div className="card-surface shrink-0 p-5 sm:w-48 sm:p-6 lg:w-56">
            <div className="flex items-center gap-4 sm:flex-col sm:items-center sm:gap-3 sm:text-center">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-surface-muted)] text-3xl font-black text-[var(--color-brand-strong)] sm:h-16 sm:w-16">
                {rating.toFixed(1)}
              </div>
              <div className="min-w-0">
                <StarRow score={Math.round(rating)} size={14} />
                <p className="mt-1 text-xs font-semibold text-[var(--color-muted)]">
                  {count.toLocaleString("th-TH")} รีวิว
                </p>
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="mt-1 hidden text-[10px] font-bold uppercase tracking-wider text-[var(--color-brand)] hover:underline sm:block"
                >
                  ดูทั้งหมด
                </button>
              </div>
              <button
                type="button"
                onClick={handleOpenWrite}
                className="ml-auto flex shrink-0 items-center gap-1.5 rounded-full bg-[var(--color-brand)] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[var(--color-brand-strong)] active:scale-95 sm:ml-0 sm:w-full sm:justify-center"
              >
                <FaPen className="text-[10px]" />
                เขียนรีวิว
              </button>
            </div>
          </div>

          {/* 2. Horizontal Scrolling Reviews / Empty State */}
          <div className="min-w-0 flex-1">
            <div className="flex w-full items-stretch gap-3 overflow-x-auto pb-4 scrollbar-hide">
              {reviews.length === 0 ? (
                <div className="card-surface flex h-full flex-1 flex-col items-center justify-center gap-3 p-8 text-center sm:min-h-[160px]">
                  <div className="relative">
                    <span className="text-4xl">🦖</span>
                    <span className="absolute -top-1 -right-1 text-lg">✨</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[var(--color-foreground)]">
                      ยังไม่มีรีวิวสำหรับเรื่องนี้
                    </p>
                    <p className="mt-1 text-[11px] leading-relaxed text-[var(--color-muted)]">
                      มาร่วมเขียนรีวิวคนแรกให้เพื่อนๆ ได้รู้กันนะ!
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleOpenWrite}
                    className="mt-2 rounded-full border border-[var(--color-brand)] px-5 py-2 text-xs font-bold text-[var(--color-brand)] transition hover:bg-[var(--color-brand)] hover:text-white active:scale-95"
                  >
                    เริ่มเขียนรีวิวคนแรก
                  </button>
                </div>
              ) : (
                <>
                  {reviews.map((r) => (
                    <ReviewCard key={r.id} review={r} onToggleLike={toggleLike} />
                  ))}
                  {/* Final 'See All' Card UI as suggested in plan */}
                  <div className="flex w-32 shrink-0 items-center justify-center rounded-[1.5rem] bg-[var(--color-surface-muted)]/50 p-4 transition-colors hover:bg-[var(--color-surface-muted)]">
                    <button
                      type="button"
                      onClick={() => setModalOpen(true)}
                      className="flex flex-col items-center gap-3 text-[var(--color-muted)] transition-colors hover:text-[var(--color-brand)]"
                    >
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl font-bold text-[var(--color-brand)] shadow-sm">
                        <FaArrowRight />
                      </span>
                      <span className="text-xs font-bold tracking-wide">ดูรีวิวทั้งหมด</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
