"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, ReactNode, useEffect, useMemo, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu } from "@ark-ui/react/menu";
import { useApp } from "@/components/providers/app-provider";
import { AppIcon } from "@/components/ui/app-icon";
import { NovelEditModal } from "@/components/writer/novel-edit-modal";
import { createNovel, deleteNovel, updateNovel, uploadNovelCover } from "@/lib/api/writer";
import type { WriterNovelItem } from "@/lib/writer/dashboard";

type WriterStudioProps = {
  mode: "novels" | "profile" | "earnings";
  novels: WriterNovelItem[];
};

type WithdrawalItem = {
  id: string;
  amount: string;
  status: "pending" | "approved" | "transferred";
  requestedAt: string;
  note: string;
};

const inputClassName =
  "w-full rounded-[1rem] border border-[var(--color-border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--color-brand)] dark:bg-slate-950";

const writerNavItems = [
  { href: "/writer/novels", label: "ผลงานของฉัน", icon: "pen" as const },
  { href: "/writer/profile", label: "ข้อมูลนักเขียน", icon: "info" as const },
  { href: "/writer/earnings", label: "รายได้", icon: "text" as const },
];

const novelsPerPage = 6;

export function WriterStudio({ mode, novels }: WriterStudioProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { openAuthModal, token, user } = useApp();
  const [managedNovels, setManagedNovels] = useState(novels);
  const [segment, setSegment] = useState<"all" | "ongoing" | "completed">("all");
  const [searchValue, setSearchValue] = useState("");
  const [sortValue, setSortValue] = useState<"updated" | "views" | "chapters">("updated");
  const [novelsPage, setNovelsPage] = useState(1);
  const [selectedNovelId, setSelectedNovelId] = useState(novels[0]?.id ?? "");
  const [editingNovelId, setEditingNovelId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [novelPending, startNovelTransition] = useTransition();
  const [novelTitle, setNovelTitle] = useState("");
  const [novelDescription, setNovelDescription] = useState("");
  const [novelCoverUrl, setNovelCoverUrl] = useState("");
  const [novelCategoryId, setNovelCategoryId] = useState("");
  const [novelTags, setNovelTags] = useState("");
  const [coverUploadPending, setCoverUploadPending] = useState(false);
  const [writerDisplayName, setWriterDisplayName] = useState(user?.username ?? "Dino Writer");
  const [legalName, setLegalName] = useState("Dino Writer Studio");
  const [citizenId, setCitizenId] = useState("1103700XXXXXX");
  const [bankName, setBankName] = useState("Kasikornbank");
  const [bankAccountName, setBankAccountName] = useState("Dino Writer Studio");
  const [bankAccountNumber, setBankAccountNumber] = useState("xxx-x-67890-x");
  const [taxId, setTaxId] = useState("0105569XXXXXX");
  const [kycStatus, setKycStatus] = useState<"draft" | "pending" | "verified">("pending");
  const [incomeMonth, setIncomeMonth] = useState(currentMonthValue());
  const [incomeNovelId, setIncomeNovelId] = useState("all");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawNote, setWithdrawNote] = useState("");
  const [withdrawRequests, setWithdrawRequests] = useState<WithdrawalItem[]>([
    { id: "wd-001", amount: "1200.00", status: "pending", requestedAt: new Date().toISOString(), note: "ยอดเดือนนี้รอบแรก" },
    { id: "wd-000", amount: "980.00", status: "transferred", requestedAt: "2026-02-28T09:10:00.000Z", note: "โอนแล้ว" },
  ]);
  const isWriter = user?.role === "author" || user?.role === "admin";

  useEffect(() => setManagedNovels(novels), [novels]);
  useEffect(() => {
    if (user?.username) setWriterDisplayName(user.username);
  }, [user?.username]);
  useEffect(() => {
    setNovelsPage(1);
  }, [searchValue, segment, sortValue]);

  const filteredNovels = useMemo(() => getFilteredNovels(managedNovels, searchValue, segment, sortValue), [managedNovels, searchValue, segment, sortValue]);
  const totalNovelPages = Math.max(1, Math.ceil(filteredNovels.length / novelsPerPage));
  const paginatedNovels = useMemo(
    () => filteredNovels.slice((novelsPage - 1) * novelsPerPage, novelsPage * novelsPerPage),
    [filteredNovels, novelsPage],
  );
  useEffect(() => {
    if (novelsPage > totalNovelPages) setNovelsPage(totalNovelPages);
  }, [novelsPage, totalNovelPages]);
  const selectedNovel = managedNovels.find((novel) => novel.id === selectedNovelId) ?? filteredNovels[0] ?? managedNovels[0];
  const editingNovel = managedNovels.find((novel) => novel.id === editingNovelId) ?? null;
  const summary = useMemo(() => getSummary(managedNovels), [managedNovels]);
  const incomeRows = useMemo(() => getIncomeRows(managedNovels, incomeNovelId), [managedNovels, incomeNovelId]);
  const incomeSummary = useMemo(() => getIncomeSummary(incomeRows, withdrawRequests), [incomeRows, withdrawRequests]);

  function ensureAuthenticated() {
    if (token) return true;
    openAuthModal("login");
    return false;
  }

  async function handleCreateCoverUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setCoverUploadPending(true);
    setError(null);
    try {
      const response = await uploadNovelCover(file);
      setNovelCoverUrl(response.url);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "อัปโหลดรูปปกไม่สำเร็จ");
    } finally {
      setCoverUploadPending(false);
      event.target.value = "";
    }
  }

  async function handleCreateNovel(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!ensureAuthenticated() || !token) return;
    startNovelTransition(async () => {
      setError(null);
      setMessage(null);
      try {
        const response = await createNovel(token, {
          title: novelTitle,
          description: novelDescription,
          cover_image_url: novelCoverUrl || undefined,
          category_id: novelCategoryId || undefined,
          tags: novelTags.split(",").map((item) => item.trim()).filter(Boolean),
        });
        setMessage(response.message);
        setNovelTitle("");
        setNovelDescription("");
        setNovelCoverUrl("");
        setNovelCategoryId("");
        setNovelTags("");
        router.refresh();
      } catch (createError) {
        setError(createError instanceof Error ? createError.message : "สร้างนิยายไม่สำเร็จ");
      }
    });
  }

  async function handleSaveNovelEdit(nextNovel: WriterNovelItem) {
    if (!ensureAuthenticated() || !token) return;
    try {
      const latestChapter = [...nextNovel.chapters].sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())[0];
      const normalizedNovel: WriterNovelItem = { ...nextNovel, chapterCount: nextNovel.chapters.length, latestChapterTitle: latestChapter?.title ?? "ยังไม่มีตอน", updatedLabel: latestChapter ? formatShortDate(latestChapter.createdAt) : "ยังไม่มีการอัปเดต" };
      const response = await updateNovel(token, nextNovel.id, { title: normalizedNovel.title, description: normalizedNovel.description, cover_image_url: normalizedNovel.coverImageUrl || undefined, category_id: undefined, tags: normalizedNovel.tags, status: normalizedNovel.published ? normalizedNovel.status : "on_hold" });
      setManagedNovels((current) => current.map((item) => (item.id === normalizedNovel.id ? normalizedNovel : item)));
      setMessage(response.message);
      setEditingNovelId(null);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "บันทึกการแก้ไขนิยายไม่สำเร็จ");
    }
  }

  async function handleDeleteNovel(novelId: string) {
    if (!ensureAuthenticated() || !token || !window.confirm("ต้องการลบเรื่องนี้ใช่หรือไม่")) return;
    try {
      const response = await deleteNovel(token, novelId);
      setManagedNovels((current) => current.filter((item) => item.id !== novelId));
      setMessage(response.message);
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "ลบเรื่องนี้ไม่สำเร็จ");
    }
  }

  function handleSaveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setKycStatus("pending");
    setMessage("บันทึกข้อมูลนักเขียนและส่ง KYC เข้าตรวจสอบแล้ว");
  }

  function handleWithdraw(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!ensureAuthenticated()) return;
    if (!withdrawAmount || Number(withdrawAmount) <= 0) {
      setError("กรุณาระบุยอดถอนเงินที่มากกว่า 0");
      return;
    }
    setError(null);
    setWithdrawRequests((current) => [
      { id: `wd-${Date.now()}`, amount: Number(withdrawAmount).toFixed(2), status: "pending", requestedAt: new Date().toISOString(), note: withdrawNote || "คำขอใหม่" },
      ...current,
    ]);
    setWithdrawAmount("");
    setWithdrawNote("");
    setMessage("ส่งคำขอถอนเงินแล้ว");
  }

  return (
    <section className="space-y-5 pb-10">
      {renderHeader(summary)}
      {message ? <Alert tone="success">{message}</Alert> : null}
      {error ? <Alert tone="error">{error}</Alert> : null}
      <div className="grid gap-4 xl:grid-cols-[280px_minmax(0,1fr)]">
        {renderSidebar(pathname, user?.username, token, isWriter, () => openAuthModal("login"))}
        <section className="card-surface overflow-hidden p-4 sm:p-5">
          {mode === "novels" ? renderNovelsPanel(paginatedNovels, filteredNovels.length, novelsPage, totalNovelPages, setNovelsPage, segment, setSegment, searchValue, setSearchValue, sortValue, setSortValue, selectedNovel?.id ?? "", setSelectedNovelId, setEditingNovelId, handleDeleteNovel, summary) : null}
          {mode === "profile" ? renderProfilePanel({ writerDisplayName, setWriterDisplayName, legalName, setLegalName, citizenId, setCitizenId, bankName, setBankName, bankAccountName, setBankAccountName, bankAccountNumber, setBankAccountNumber, taxId, setTaxId, kycStatus, onSubmit: handleSaveProfile }) : null}
          {mode === "earnings" ? renderEarningsPanel({ monthValue: incomeMonth, setMonthValue: setIncomeMonth, novelId: incomeNovelId, setNovelId: setIncomeNovelId, novels: managedNovels, rows: incomeRows, summary: incomeSummary, withdrawAmount, setWithdrawAmount, withdrawNote, setWithdrawNote, withdrawRequests, onWithdraw: handleWithdraw }) : null}
        </section>
      </div>
      <NovelEditModal open={Boolean(editingNovel)} novel={editingNovel} onClose={() => setEditingNovelId(null)} onSave={handleSaveNovelEdit} />
    </section>
  );
}

function getFilteredNovels(
  managedNovels: WriterNovelItem[],
  searchValue: string,
  segment: "all" | "ongoing" | "completed",
  sortValue: "updated" | "views" | "chapters",
) {
  const query = searchValue.trim().toLowerCase();
  return [...managedNovels]
    .filter((novel) => {
      const matchesSegment = segment === "all" ? true : segment === "ongoing" ? novel.status === "ongoing" : novel.status === "completed";
      const matchesSearch = query ? `${novel.title} ${novel.categoryName} ${novel.latestChapterTitle}`.toLowerCase().includes(query) : true;
      return matchesSegment && matchesSearch;
    })
    .sort((left, right) => {
      if (sortValue === "views") return right.viewCount - left.viewCount;
      if (sortValue === "chapters") return right.chapterCount - left.chapterCount;
      return right.updatedLabel.localeCompare(left.updatedLabel);
    });
}

function getSummary(managedNovels: WriterNovelItem[]) {
  const totalViews = managedNovels.reduce((sum, novel) => sum + novel.viewCount, 0);
  const totalReviews = managedNovels.reduce((sum, novel) => sum + novel.reviewCount, 0);
  const totalBookmarks = managedNovels.reduce((sum, novel) => sum + novel.bookmarkCount, 0);
  return {
    totalNovels: managedNovels.length,
    totalChapters: managedNovels.reduce((sum, novel) => sum + novel.chapterCount, 0),
    totalViews,
    totalReviews,
    totalBookmarks,
    followers: Math.max(1, Math.round(totalBookmarks / 3)),
    gold: ((totalViews / 1000) * 0.16).toFixed(2),
    support: (Math.max(3, totalBookmarks / 10)).toFixed(2),
  };
}

function getIncomeRows(managedNovels: WriterNovelItem[], incomeNovelId: string) {
  const rows = managedNovels.map((novel, index) => {
    const gross = Number((novel.chapterCount * 14 + novel.viewCount * 0.012 + (index + 1) * 35).toFixed(2));
    return {
      id: novel.id,
      title: novel.title,
      readers: Math.max(24, Math.round(novel.viewCount / 14)),
      unlocks: novel.chapterCount * (18 + index * 3),
      gross,
      net: Number((gross * 0.82).toFixed(2)),
    };
  });
  return incomeNovelId === "all" ? rows : rows.filter((row) => row.id === incomeNovelId);
}

function getIncomeSummary(
  incomeRows: Array<{ gross: number; net: number }>,
  withdrawRequests: WithdrawalItem[],
) {
  const gross = incomeRows.reduce((sum, row) => sum + row.gross, 0);
  const net = incomeRows.reduce((sum, row) => sum + row.net, 0);
  const pending = withdrawRequests.filter((item) => item.status === "pending").reduce((sum, item) => sum + Number(item.amount), 0);
  return { gross: gross.toFixed(2), net: net.toFixed(2), available: Math.max(0, net - pending).toFixed(2) };
}

function renderHeader(summary: { totalNovels: number; totalChapters: number; followers: number; gold: string }) {
  return (
    <div className="rounded-[1.6rem] border border-[color:color-mix(in_srgb,var(--color-brand)_20%,white)] bg-[linear-gradient(135deg,_color-mix(in_srgb,var(--color-brand)_11%,white),_rgba(255,255,255,0.92))] px-4 py-4 sm:px-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-[var(--color-brand-strong)]">Writer Workspace</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">พื้นที่จัดการนิยายของฉัน</h1>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-[var(--color-muted)]">เหลือ 3 แท็บหลักให้ flow ของนักเขียนชัดขึ้น: ผลงานของฉัน, ข้อมูลนักเขียน, และรายได้</p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="เรื่อง" value={String(summary.totalNovels)} />
          <StatCard label="ตอน" value={String(summary.totalChapters)} />
          <StatCard label="ผู้ติดตาม" value={String(summary.followers)} />
          <StatCard label="เหรียญ" value={summary.gold} />
        </div>
      </div>
    </div>
  );
}

function renderSidebar(pathname: string, userLabel: string | undefined, token: string | null | undefined, isWriter: boolean, onLogin: () => void) {
  return (
    <aside className="card-surface h-fit overflow-hidden p-4">
      <div className="rounded-[1.3rem] bg-[linear-gradient(145deg,_rgba(66,185,131,0.15),_rgba(15,23,42,0.04))] p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-brand)] text-lg font-bold text-white">D</div>
          <div>
            <p className="text-xl font-semibold tracking-tight">Dino Writer</p>
            <p className="text-sm text-[var(--color-muted)]">{userLabel ?? "โหมดจัดการสำหรับนักเขียน"}</p>
          </div>
        </div>
      </div>
      <nav className="mt-4 space-y-2">
        {writerNavItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className={`flex items-center gap-3 rounded-[1rem] px-4 py-3 text-sm font-semibold transition ${active ? "bg-[var(--color-brand)] text-white shadow-[0_16px_30px_rgba(66,185,131,0.22)]" : "text-[var(--color-muted)] hover:bg-[var(--color-surface-muted)]"}`}>
              <span className={`flex h-10 w-10 items-center justify-center rounded-2xl ${active ? "bg-white/18 text-white" : "bg-[var(--color-surface-muted)] text-[var(--color-brand-strong)]"}`}><AppIcon name={item.icon} /></span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-4 rounded-[1.25rem] border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-4">
        <p className="text-sm font-semibold">สถานะบัญชี</p>
        <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">{token ? isWriter ? "พร้อมจัดการผลงาน KYC และรายได้" : "บัญชีนี้ยังไม่ใช่ role นักเขียน" : "ล็อกอินเพื่อใช้งาน API ฝั่งนักเขียนจริง"}</p>
        {!token ? <button type="button" onClick={onLogin} className="mt-4 rounded-[1rem] bg-[var(--color-brand)] px-4 py-2.5 text-sm font-semibold text-white">เปิด modal ล็อกอิน</button> : null}
      </div>
    </aside>
  );
}

function renderNovelsPanel(
  novels: WriterNovelItem[],
  totalItems: number,
  currentPage: number,
  totalPages: number,
  setCurrentPage: (value: number) => void,
  segment: "all" | "ongoing" | "completed",
  setSegment: (value: "all" | "ongoing" | "completed") => void,
  searchValue: string,
  setSearchValue: (value: string) => void,
  sortValue: "updated" | "views" | "chapters",
  setSortValue: (value: "updated" | "views" | "chapters") => void,
  selectedNovelId: string,
  onSelectNovel: (id: string) => void,
  onEditNovel: (id: string) => void,
  onDeleteNovel: (id: string) => Promise<void>,
  summary: { totalViews: number; totalReviews: number; totalBookmarks: number; support: string },
) {
  return (
    <div className="space-y-5">
      <SectionHead eyebrow="My Novels" title="ผลงานของฉัน" description="จัดการเรื่องทั้งหมดจากหน้าเดียวได้เลย ทั้งค้นหา แก้ไข เปิดหน้าอ่าน และลบเรื่อง" />
      <div className="flex flex-wrap gap-3">
        <SegmentButton label="นิยายรายตอน" active={segment === "all"} onClick={() => setSegment("all")} />
        <SegmentButton label="กำลังอัปเดต" active={segment === "ongoing"} onClick={() => setSegment("ongoing")} />
        <SegmentButton label="จบแล้ว" active={segment === "completed"} onClick={() => setSegment("completed")} />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="ยอดวิว" value={formatCompactNumber(summary.totalViews)} />
        <StatCard label="รีวิว" value={formatCompactNumber(summary.totalReviews)} />
        <StatCard label="ชั้นหนังสือ" value={formatCompactNumber(summary.totalBookmarks)} />
        <StatCard label="กำลังใจ" value={summary.support} />
      </div>
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px_160px]">
        <input value={searchValue} onChange={(event) => setSearchValue(event.target.value)} placeholder="ค้นหาเรื่องหรือชื่อตอนล่าสุด" className={inputClassName} />
        <select value={sortValue} onChange={(event) => setSortValue(event.target.value as "updated" | "views" | "chapters")} className={inputClassName}>
          <option value="updated">เรียงตามอัปเดตล่าสุด</option>
          <option value="views">เรียงตามยอดวิว</option>
          <option value="chapters">เรียงตามจำนวนตอน</option>
        </select>
        <a href="#create-novel" className="rounded-[1rem] bg-[var(--color-brand)] px-4 py-3 text-center text-sm font-semibold text-white">+ เพิ่มผลงาน</a>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        {novels.map((novel) => renderNovelCard(novel, novel.id === selectedNovelId, onSelectNovel, onEditNovel, onDeleteNovel))}
      </div>
      {totalItems > 0 ? renderNovelPagination(totalItems, currentPage, totalPages, setCurrentPage) : null}
    </div>
  );
}

function renderNovelCard(
  novel: WriterNovelItem,
  selected: boolean,
  onSelectNovel: (id: string) => void,
  onEditNovel: (id: string) => void,
  onDeleteNovel: (id: string) => Promise<void>,
) {
  const readerHref = novel.chapters[0] ? `/novels/${novel.id}/chapters/${novel.chapters[0].id}` : `/novels/${novel.id}`;
  return (
    <article key={novel.id} className={`rounded-[1.5rem] border p-4 transition ${selected ? "border-[var(--color-brand)] bg-[color:color-mix(in_srgb,var(--color-brand)_8%,white)]" : "border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-brand)]"}`}>
      <div className="flex gap-4">
        <button type="button" onClick={() => onSelectNovel(novel.id)} className="flex min-w-0 flex-1 gap-4 text-left">
          {novel.coverImageUrl ? <img src={novel.coverImageUrl} alt={novel.title} className="h-28 w-20 shrink-0 rounded-[1rem] object-cover" /> : <div className={`flex h-28 w-20 shrink-0 items-end rounded-[1rem] bg-gradient-to-br ${novel.coverTone} p-3 text-[11px] font-semibold`}>{novel.categoryName}</div>}
          <div className="min-w-0 flex-1">
            <p className="text-xs text-[var(--color-muted)]">{novel.authorName}</p>
            <h3 className="line-clamp-2 text-lg font-semibold">{novel.title}</h3>
            <p className="mt-1 text-sm text-[var(--color-muted)]">อัปเดตล่าสุด {novel.updatedLabel}</p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
              <MiniMetric label="ยอดวิว" value={formatCompactNumber(novel.viewCount)} />
              <MiniMetric label="รีวิว" value={formatCompactNumber(novel.reviewCount)} />
              <MiniMetric label="ตอน" value={String(novel.chapterCount)} />
              <MiniMetric label="ชั้นหนังสือ" value={formatCompactNumber(novel.bookmarkCount)} />
            </div>
          </div>
        </button>
        <Menu.Root positioning={{ placement: "bottom-end", gutter: 8 }}>
          <Menu.Trigger className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] text-[var(--color-brand-strong)]"><AppIcon name="ellipsis" /></Menu.Trigger>
          <Menu.Positioner>
            <Menu.Content className="z-50 min-w-[12rem] rounded-[1.2rem] border border-[var(--color-border)] bg-[var(--color-surface)] p-2 shadow-[0_24px_60px_rgba(15,23,42,0.18)]">
              <Menu.Item value={`${novel.id}-edit`} onSelect={() => onEditNovel(novel.id)} className="flex cursor-pointer items-center gap-3 rounded-[0.9rem] px-3 py-2.5 text-sm font-medium hover:bg-[var(--color-surface-muted)]"><AppIcon name="pen" className="h-4 w-4" />แก้ไข</Menu.Item>
              <Menu.Item value={`${novel.id}-read`} asChild><Link href={readerHref} className="flex items-center gap-3 rounded-[0.9rem] px-3 py-2.5 text-sm font-medium hover:bg-[var(--color-surface-muted)]"><AppIcon name="eye" className="h-4 w-4" />เปิดหน้าอ่าน</Link></Menu.Item>
              <Menu.Item value={`${novel.id}-delete`} onSelect={() => void onDeleteNovel(novel.id)} className="flex cursor-pointer items-center gap-3 rounded-[0.9rem] px-3 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"><AppIcon name="trash" className="h-4 w-4" />ลบเรื่องนี้</Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Menu.Root>
      </div>
    </article>
  );
}

function renderNovelPagination(
  totalItems: number,
  currentPage: number,
  totalPages: number,
  setCurrentPage: (value: number) => void,
) {
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * novelsPerPage + 1;
  const endItem = Math.min(currentPage * novelsPerPage, totalItems);

  return (
    <div className="flex flex-col gap-3 border-t border-[var(--color-border)] pt-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-[var(--color-muted)]">
        แสดง {startItem}-{endItem} จาก {totalItems} เรื่อง
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="rounded-[0.9rem] border border-[var(--color-border)] px-3 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-45"
        >
          ก่อนหน้า
        </button>
        {pageNumbers.map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            onClick={() => setCurrentPage(pageNumber)}
            className={`min-w-10 rounded-[0.9rem] px-3 py-2 text-sm font-semibold transition ${
              currentPage === pageNumber
                ? "bg-[var(--color-brand)] text-white"
                : "border border-[var(--color-border)] text-[var(--color-muted)]"
            }`}
          >
            {pageNumber}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="rounded-[0.9rem] border border-[var(--color-border)] px-3 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-45"
        >
          ถัดไป
        </button>
      </div>
    </div>
  );
}

function renderProfilePanel(props: { writerDisplayName: string; setWriterDisplayName: (value: string) => void; legalName: string; setLegalName: (value: string) => void; citizenId: string; setCitizenId: (value: string) => void; bankName: string; setBankName: (value: string) => void; bankAccountName: string; setBankAccountName: (value: string) => void; bankAccountNumber: string; setBankAccountNumber: (value: string) => void; taxId: string; setTaxId: (value: string) => void; kycStatus: "draft" | "pending" | "verified"; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return (
    <div className="space-y-5">
      <SectionHead eyebrow="Writer Profile" title="ข้อมูลนักเขียน" description="จัดการข้อมูล KYC และบัญชีรับเงินสำหรับการถอนรายได้" />
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="สถานะ KYC" value={formatKycStatus(props.kycStatus)} />
        <StatCard label="พร้อมรับโอน" value={props.bankAccountNumber ? "พร้อม" : "ยังไม่ครบ"} />
        <StatCard label="ภาษี" value={props.taxId ? "มีข้อมูล" : "ยังไม่ครบ"} />
      </div>
      <form onSubmit={props.onSubmit} className="grid gap-4 lg:grid-cols-2">
        <Field label="ชื่อแสดงบนหน้าเขียน"><input value={props.writerDisplayName} onChange={(event) => props.setWriterDisplayName(event.target.value)} className={inputClassName} /></Field>
        <Field label="ชื่อ-นามสกุล / ชื่อนิติบุคคล"><input value={props.legalName} onChange={(event) => props.setLegalName(event.target.value)} className={inputClassName} /></Field>
        <Field label="เลขบัตรประชาชน / เลขทะเบียน"><input value={props.citizenId} onChange={(event) => props.setCitizenId(event.target.value)} className={inputClassName} /></Field>
        <Field label="เลขประจำตัวผู้เสียภาษี"><input value={props.taxId} onChange={(event) => props.setTaxId(event.target.value)} className={inputClassName} /></Field>
        <Field label="ธนาคาร"><input value={props.bankName} onChange={(event) => props.setBankName(event.target.value)} className={inputClassName} /></Field>
        <Field label="ชื่อบัญชี"><input value={props.bankAccountName} onChange={(event) => props.setBankAccountName(event.target.value)} className={inputClassName} /></Field>
        <Field label="เลขบัญชี"><input value={props.bankAccountNumber} onChange={(event) => props.setBankAccountNumber(event.target.value)} className={inputClassName} /></Field>
        <Field label="สถานะปัจจุบัน"><div className="flex h-[50px] items-center rounded-[1rem] border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-4 text-sm text-[var(--color-muted)]">หลังบันทึก ระบบจะเปลี่ยนเป็นรอตรวจสอบ</div></Field>
        <div className="lg:col-span-2"><button type="submit" className="rounded-[1rem] bg-[var(--color-brand)] px-5 py-3 text-sm font-semibold text-white">บันทึกข้อมูลนักเขียน</button></div>
      </form>
    </div>
  );
}

function renderEarningsPanel(props: { monthValue: string; setMonthValue: (value: string) => void; novelId: string; setNovelId: (value: string) => void; novels: WriterNovelItem[]; rows: Array<{ id: string; title: string; readers: number; unlocks: number; gross: number; net: number }>; summary: { gross: string; net: string; available: string }; withdrawAmount: string; setWithdrawAmount: (value: string) => void; withdrawNote: string; setWithdrawNote: (value: string) => void; withdrawRequests: WithdrawalItem[]; onWithdraw: (event: FormEvent<HTMLFormElement>) => void }) {
  return (
    <div className="space-y-5">
      <SectionHead eyebrow="Revenue" title="รายได้" description="ดูสถิติรายได้รายเดือน ฟิลเตอร์ตามนิยาย และจัดการคำขอถอนเงินจากหน้าเดียว" />
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="รายรับรวม" value={props.summary.gross} />
        <StatCard label="รายรับสุทธิ" value={props.summary.net} />
        <StatCard label="ยอดพร้อมถอน" value={props.summary.available} />
      </div>
      <div className="grid gap-3 lg:grid-cols-[220px_minmax(0,1fr)]">
        <input type="month" value={props.monthValue} onChange={(event) => props.setMonthValue(event.target.value)} className={inputClassName} />
        <select value={props.novelId} onChange={(event) => props.setNovelId(event.target.value)} className={inputClassName}>
          <option value="all">ทุกเรื่อง</option>
          {props.novels.map((novel) => <option key={novel.id} value={novel.id}>{novel.title}</option>)}
        </select>
      </div>
      <div className="overflow-hidden rounded-[1.5rem] border border-[var(--color-border)]">
        <div className="grid grid-cols-[minmax(200px,1.6fr)_120px_120px_140px_140px] gap-4 border-b border-[var(--color-border)] bg-[var(--color-surface-muted)] px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]"><span>นิยาย</span><span>ยอดปลดล็อก</span><span>ผู้อ่าน</span><span>รายรับรวม</span><span>สุทธิ</span></div>
        <div className="divide-y divide-[var(--color-border)]">
          {props.rows.map((row) => <div key={row.id} className="grid grid-cols-[minmax(200px,1.6fr)_120px_120px_140px_140px] gap-4 px-4 py-4 text-sm"><span className="font-semibold">{row.title}</span><span>{formatCompactNumber(row.unlocks)}</span><span>{formatCompactNumber(row.readers)}</span><span>{row.gross.toFixed(2)} Gold</span><span className="font-semibold text-[var(--color-brand-strong)]">{row.net.toFixed(2)} Gold</span></div>)}
        </div>
      </div>
      <div className="grid gap-4 xl:grid-cols-[1fr_1.15fr]">
        <form onSubmit={props.onWithdraw} className="rounded-[1.5rem] border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-4">
          <h3 className="text-lg font-semibold">ขอถอนเงิน</h3>
          <div className="mt-4 space-y-3">
            <Field label="ยอดถอนเงิน"><input type="number" min="0" step="0.01" value={props.withdrawAmount} onChange={(event) => props.setWithdrawAmount(event.target.value)} className={inputClassName} placeholder="1000.00" /></Field>
            <Field label="หมายเหตุ"><textarea value={props.withdrawNote} onChange={(event) => props.setWithdrawNote(event.target.value)} rows={4} className={`${inputClassName} resize-y`} placeholder="หมายเหตุถึงทีมบัญชี" /></Field>
            <button type="submit" className="rounded-[1rem] bg-[var(--color-brand)] px-5 py-3 text-sm font-semibold text-white">ขอถอนเงิน</button>
          </div>
        </form>
        <div className="rounded-[1.5rem] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <h3 className="text-lg font-semibold">ประวัติขอถอนเงิน</h3>
          <div className="mt-4 space-y-3">
            {props.withdrawRequests.map((item) => <div key={item.id} className="rounded-[1.1rem] border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-4 py-3"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm font-semibold">{item.amount} Gold</p><p className="mt-1 text-xs text-[var(--color-muted)]">{formatShortDate(item.requestedAt)} · {item.note}</p></div><Badge>{formatWithdrawalStatus(item.status)}</Badge></div></div>)}
          </div>
        </div>
      </div>
    </div>
  );
}

function Alert({ tone, children }: { tone: "success" | "error"; children: ReactNode }) {
  return <div className={`rounded-[1.25rem] px-5 py-4 text-sm ${tone === "success" ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "border border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-300"}`}>{children}</div>;
}

function SectionHead({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <div><p className="text-sm font-semibold text-[var(--color-brand-strong)]">{eyebrow}</p><h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2><p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">{description}</p></div>;
}

function StatCard({ label, value }: { label: string; value: string }) {
  return <div className="rounded-[1.25rem] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-4"><p className="text-sm text-[var(--color-muted)]">{label}</p><p className="mt-2 text-2xl font-semibold text-[var(--color-brand-strong)]">{value}</p></div>;
}

function SegmentButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return <button type="button" onClick={onClick} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${active ? "bg-[var(--color-brand)] text-white" : "bg-[var(--color-surface-muted)] text-[var(--color-muted)]"}`}>{label}</button>;
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-[1rem] border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3 py-2"><p className="text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted)]">{label}</p><p className="mt-1 font-semibold">{value}</p></div>;
}

function Badge({ children }: { children: ReactNode }) {
  return <span className="inline-flex rounded-full bg-[color:color-mix(in_srgb,var(--color-brand)_10%,white)] px-2.5 py-1 text-[11px] font-semibold text-[var(--color-brand-strong)]">{children}</span>;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="space-y-2 text-sm font-medium"><span>{label}</span>{children}</label>;
}

function formatCompactNumber(value: number) {
  return new Intl.NumberFormat("th-TH", { notation: "compact" }).format(value);
}

function formatShortDate(value: string) {
  return new Intl.DateTimeFormat("th-TH", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value));
}

function formatKycStatus(status: "draft" | "pending" | "verified") {
  if (status === "verified") return "ยืนยันแล้ว";
  if (status === "pending") return "รอตรวจสอบ";
  return "ยังไม่ส่ง";
}

function formatStatus(status: WriterNovelItem["status"]) {
  if (status === "completed") return "Completed";
  if (status === "on_hold") return "Paused";
  return "Ongoing";
}

function formatWithdrawalStatus(status: WithdrawalItem["status"]) {
  if (status === "approved") return "อนุมัติแล้ว";
  if (status === "transferred") return "โอนแล้ว";
  return "รอดำเนินการ";
}

function currentMonthValue() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}
