"use client";

import { ChangeEvent, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { uploadNovelCover } from "@/lib/api/writer";
import { AppIcon } from "@/components/ui/app-icon";
import type { WriterNovelItem } from "@/lib/writer/dashboard";

type WriterNovelEditorProps = {
  novel: WriterNovelItem;
  onSave: (novel: WriterNovelItem) => Promise<void> | void;
  onClose?: () => void;
  isPage?: boolean;
};

type ContentFormat =
  | "paragraph"
  | "h1"
  | "quote"
  | "bold"
  | "italic"
  | "underline"
  | "accent"
  | "list"
  | "alignLeft"
  | "alignCenter"
  | "alignRight";

export function WriterNovelEditor({ novel, onSave, onClose, isPage = false }: WriterNovelEditorProps) {
  const [tab, setTab] = useState<"details" | "chapters">("details");
  const [contentView, setContentView] = useState<"write" | "preview" | "split">("split");
  const [draft, setDraft] = useState<WriterNovelItem>(novel);
  const [uploadPending, setUploadPending] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [activeChapterIndex, setActiveChapterIndex] = useState<number | null>(null);
  const contentEditorRef = useRef<HTMLDivElement | null>(null);
  const editorSyncKeyRef = useRef<string>("");

  useEffect(() => {
    setDraft(novel);
    setTab("details");
    setContentView("write");
    setUploadPending(false);
    setUploadError(null);
    setActiveChapterIndex(null);
  }, [novel]);

  const totalChapterCount = useMemo(() => draft.chapters.length, [draft.chapters]);

  async function handleCoverUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file || !draft) {
      return;
    }

    setUploadPending(true);
    setUploadError(null);

    try {
      const response = await uploadNovelCover(file);
      setDraft({ ...draft, coverImageUrl: response.url });
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "อัปโหลดรูปปกไม่สำเร็จ");
    } finally {
      setUploadPending(false);
      event.target.value = "";
    }
  }

  function updateChapter(index: number, patch: Partial<WriterNovelItem["chapters"][number]>) {
    setDraft({
      ...draft,
      chapters: draft.chapters.map((chapter, chapterIndex) =>
        chapterIndex === index ? { ...chapter, ...patch } : chapter,
      ),
    });
  }

  function formatActiveChapterContent(format: ContentFormat) {
    if (activeChapterIndex === null || !activeChapter) {
      return;
    }

    if (contentView === "preview") {
      setContentView("split");
      requestAnimationFrame(() => {
        executeEditorCommand(format);
      });
      return;
    }

    executeEditorCommand(format);
  }

  const activeChapter =
    activeChapterIndex !== null ? draft.chapters[activeChapterIndex] ?? null : null;
  const activeChapterEditorKey =
    activeChapter && activeChapterIndex !== null
      ? `${activeChapter.id}:${activeChapterIndex}:${tab}`
      : "";
  const activeChapterPreviewHtml = useMemo(
    () => convertLightweightContentToHtml(activeChapter?.content ?? ""),
    [activeChapter?.content],
  );
  const isActiveChapterEmpty = !stripEditorText(activeChapter?.content ?? "");

  useEffect(() => {
    if (!activeChapter || tab !== "chapters") {
      return;
    }

    const editor = contentEditorRef.current;

    if (!editor) {
      return;
    }

    if (editorSyncKeyRef.current === activeChapterEditorKey) {
      return;
    }

    editor.innerHTML = activeChapterPreviewHtml || "<p><br></p>";
    editorSyncKeyRef.current = activeChapterEditorKey;
  }, [activeChapter, activeChapterEditorKey, activeChapterPreviewHtml, tab]);

  function syncEditorContentToDraft() {
    if (activeChapterIndex === null || !contentEditorRef.current) {
      return;
    }

    const serializedContent = convertHtmlToLightweightContent(contentEditorRef.current.innerHTML);
    updateChapter(activeChapterIndex, { content: serializedContent });
  }

  function executeEditorCommand(format: ContentFormat) {
    const editor = contentEditorRef.current;

    if (!editor) {
      return;
    }

    editor.focus();

    switch (format) {
      case "paragraph":
        document.execCommand("formatBlock", false, "p");
        break;
      case "h1":
        document.execCommand("formatBlock", false, "h2");
        break;
      case "quote":
        document.execCommand("formatBlock", false, "blockquote");
        break;
      case "bold":
        document.execCommand("bold");
        break;
      case "italic":
        document.execCommand("italic");
        break;
      case "underline":
        document.execCommand("underline");
        break;
      case "list":
        document.execCommand("insertUnorderedList");
        break;
      case "alignLeft":
        document.execCommand("justifyLeft");
        break;
      case "alignCenter":
        document.execCommand("justifyCenter");
        break;
      case "alignRight":
        document.execCommand("justifyRight");
        break;
      case "accent":
        wrapSelectionWithAccent();
        break;
      default:
        break;
    }

    syncEditorContentToDraft();

    requestAnimationFrame(() => {
      editor.focus();
    });
  }

  function wrapSelectionWithAccent() {
    const selection = window.getSelection();

    if (!selection || selection.rangeCount === 0) {
      return;
    }

    const range = selection.getRangeAt(0);

    if (range.collapsed) {
      const span = document.createElement("span");
      span.setAttribute("data-accent", "true");
      span.className = "writer-accent";
      span.textContent = "ข้อความ";
      range.insertNode(span);
      range.setStart(span.firstChild ?? span, span.textContent?.length ?? 0);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
      return;
    }

    const span = document.createElement("span");
    span.setAttribute("data-accent", "true");
    span.className = "writer-accent";

    try {
      range.surroundContents(span);
    } catch {
      const contents = range.extractContents();
      span.appendChild(contents);
      range.insertNode(span);
      range.setStart(span.firstChild ?? span, span.textContent?.length ?? 0);
    }
  }

  return (
    <div className={`flex flex-col bg-[var(--color-background)] ${isPage ? "min-h-[80vh] rounded-[2rem] border border-[var(--color-border)] shadow-xl" : "h-full"}`}>
      <div className="flex items-center justify-between gap-4 border-b border-[var(--color-border)] px-5 py-4">
        <div>
          <p className="text-sm font-semibold text-[var(--color-brand-strong)]">
            {draft.id.startsWith("draft-") ? "New Novel" : "Edit Novel"}
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight">
            {draft.title || "สร้างนิยายเรื่องใหม่"}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {!isPage && onClose && (
            <button
              title="เปิดในหน้าแยก"
              onClick={() => {
                const url = draft.id.startsWith("draft-")
                  ? "/writer/novels/new"
                  : `/writer/novels/${draft.id}/edit`;
                window.location.href = url;
              }}
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] text-[var(--color-brand-strong)] transition hover:scale-105"
            >
              <AppIcon name="external" />
            </button>
          )}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-4 py-2 text-sm font-semibold transition hover:bg-[var(--color-border)]"
            >
              {isPage ? "กลับไปยังรายการ" : "ปิด"}
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-4 border-b border-[var(--color-border)] px-5 py-3">
        <TabButton active={tab === "details"} onClick={() => setTab("details")}>
          แก้ไขรายละเอียดนิยาย
        </TabButton>
        <TabButton active={tab === "chapters"} onClick={() => setTab("chapters")}>
          แก้ไขรายละเอียดตอน
        </TabButton>
      </div>

      <div className={`overflow-y-auto px-5 py-5 ${isPage ? "min-h-[60vh]" : "max-h-[78vh]"}`}>
        {tab === "details" ? (
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="ชื่อเรื่องนิยาย">
              <input
                value={draft.title}
                onChange={(event) => setDraft({ ...draft, title: event.target.value })}
                className={inputClassName}
              />
            </Field>

            <Field label="ผู้แต่ง">
              <input
                value={draft.authorName}
                onChange={(event) => setDraft({ ...draft, authorName: event.target.value })}
                className={inputClassName}
              />
            </Field>

            <Field label="รูปภาพหน้าปก">
              <div className="space-y-3">
                <label className="flex min-h-[180px] cursor-pointer flex-col items-center justify-center gap-3 rounded-[1.25rem] border border-dashed border-[color:color-mix(in_srgb,var(--color-brand)_40%,white)] bg-[color:color-mix(in_srgb,var(--color-brand)_6%,white)] px-4 py-5 text-center transition hover:border-[var(--color-brand)]">
                  {draft.coverImageUrl ? (
                    <img
                      src={draft.coverImageUrl}
                      alt={draft.title}
                      className="h-36 w-24 rounded-[0.9rem] object-cover shadow-[0_12px_30px_rgba(15,23,42,0.16)]"
                    />
                  ) : (
                    <div className="flex h-36 w-24 items-center justify-center rounded-[0.9rem] border border-[var(--color-border)] bg-[var(--color-surface)] text-xs text-[var(--color-muted)]">
                      ไม่มีรูป
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-brand-strong)]">
                      {uploadPending ? "กำลังอัปโหลด..." : "อัปโหลดรูปปกจากเครื่อง"}
                    </p>
                    <p className="mt-1 text-xs text-[var(--color-muted)]">
                      รองรับ JPG, PNG, WEBP, GIF ขนาดไม่เกิน 5MB
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    onChange={(event) => void handleCoverUpload(event)}
                    className="hidden"
                  />
                </label>

                <input
                  value={draft.coverImageUrl}
                  onChange={(event) => setDraft({ ...draft, coverImageUrl: event.target.value })}
                  className={inputClassName}
                  placeholder="/uploads/novel-covers/... หรือ https://..."
                />

                {uploadError ? (
                  <p className="text-sm text-rose-600 dark:text-rose-300">{uploadError}</p>
                ) : (
                  <p className="text-xs text-[var(--color-muted)]">
                    ตอนนี้เก็บรูปไว้ใน local storage ของโปรเจกต์ก่อน และจะย้ายไป Supabase
                    Storage ตอน production
                  </p>
                )}
              </div>
            </Field>

            <Field label="ประเภท">
              <input
                value={draft.categoryName}
                onChange={(event) => setDraft({ ...draft, categoryName: event.target.value })}
                className={inputClassName}
              />
            </Field>

            <Field label="คำโปรยแบบสั้น">
              <div className="space-y-2">
                <input
                  value={draft.shortDescription}
                  maxLength={200}
                  onChange={(event) =>
                    setDraft({ ...draft, shortDescription: event.target.value.slice(0, 200) })
                  }
                  className={inputClassName}
                />
                <p className="text-right text-xs text-[var(--color-muted)]">
                  {draft.shortDescription.length}/200
                </p>
              </div>
            </Field>

            <Field label="Tag">
              <input
                value={draft.tags.join(", ")}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    tags: event.target.value
                      .split(",")
                      .map((item) => item.trim())
                      .filter(Boolean),
                  })
                }
                className={inputClassName}
                placeholder="แฟนตาซี, ระบบ, โรแมนติก"
              />
            </Field>

            <Field label="เรื่องย่อ">
              <textarea
                value={draft.description}
                onChange={(event) => setDraft({ ...draft, description: event.target.value })}
                rows={6}
                className={`${inputClassName} resize-y md:col-span-2`}
              />
            </Field>

            <Field label="สถานะเรื่อง">
              <select
                value={draft.status}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    status: event.target.value as WriterNovelItem["status"],
                  })
                }
                className={inputClassName}
              >
                <option value="ongoing">กำลังอัปเดต</option>
                <option value="completed">จบแล้ว</option>
                <option value="on_hold">พักอัปเดต</option>
              </select>
            </Field>

            <Field label="สถานะการเผยแพร่">
              <div className="flex h-[50px] items-center rounded-[1rem] border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-4">
                <label className="flex items-center gap-3 text-sm font-medium">
                  <input
                    type="checkbox"
                    checked={draft.published}
                    onChange={(event) => setDraft({ ...draft, published: event.target.checked })}
                  />
                  เปิดเผยแพร่นิยาย
                </label>
              </div>
            </Field>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-[var(--color-brand-strong)]">
                  Chapter Manager
                </p>
                <p className="text-sm text-[var(--color-muted)]">
                  เพิ่ม ลบ และแก้ไขตอนของเรื่องนี้ได้ทันที
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const nextIndex = draft.chapters.length;
                  setDraft({
                    ...draft,
                    chapters: [
                      ...draft.chapters,
                      {
                        id: `draft-${Date.now()}`,
                        chapterNumber: totalChapterCount + 1,
                        title: `ตอนใหม่ ${totalChapterCount + 1}`,
                        content: "",
                        readerNote: "",
                        isFree: true,
                        coinPrice: 0,
                        createdAt: new Date().toISOString(),
                      },
                    ],
                  });
                  setActiveChapterIndex(nextIndex);
                }}
                className="rounded-[1rem] bg-[var(--color-brand)] px-4 py-2.5 text-sm font-semibold text-white"
              >
                + เพิ่มตอน
              </button>
            </div>

            <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
              <div className="rounded-[1.25rem] border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-3">
                <div className="mb-3 flex items-center justify-between gap-3 px-2">
                  <div>
                    <p className="text-sm font-semibold">รายการตอน</p>
                    <p className="text-xs text-[var(--color-muted)]">
                      เลือกตอนเพื่อแก้เนื้อหาและสถานะ
                    </p>
                  </div>
                  <span className="rounded-full bg-[var(--color-surface)] px-2.5 py-1 text-xs font-semibold text-[var(--color-muted)]">
                    {draft.chapters.length} ตอน
                  </span>
                </div>

                <div className="max-h-[29rem] space-y-3 overflow-y-auto pr-1">
                  {draft.chapters.map((chapter, index) => (
                    <button
                      key={chapter.id}
                      type="button"
                      onClick={() => setActiveChapterIndex(index)}
                      className={`w-full rounded-[1.15rem] border p-4 text-left transition ${activeChapterIndex === index
                        ? "border-[var(--color-brand)] bg-[color:color-mix(in_srgb,var(--color-brand)_8%,white)] shadow-[0_12px_30px_rgba(66,185,131,0.12)]"
                        : "border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-brand)]"
                        }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-brand-strong)]">
                            ตอนที่ {chapter.chapterNumber}
                          </p>
                          <h3 className="mt-2 line-clamp-2 text-base font-semibold">
                            {chapter.title || `ตอนใหม่ ${index + 1}`}
                          </h3>
                          <p className="mt-2 line-clamp-2 text-sm text-[var(--color-muted)]">
                            {stripEditorText(chapter.content)
                              ? stripEditorText(chapter.content).slice(0, 100)
                              : "ยังไม่มีเนื้อหา กดเข้ามาเพื่อเริ่มเขียน"}
                          </p>
                        </div>
                        <Badge tone={chapter.isFree ? "soft" : "default"}>
                          {chapter.isFree ? (
                            "ฟรี"
                          ) : (
                            <div className="flex items-center gap-1">
                              <img src="/coin_logo.png" alt="Coin" className="w-3.5 h-3.5 object-contain" />
                              <span>{chapter.coinPrice} Gold</span>
                            </div>
                          )}
                        </Badge>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-[1.25rem] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-5">
                {activeChapter ? (
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--color-border)] pb-4">
                      <div>
                        <p className="text-sm font-semibold text-[var(--color-brand-strong)]">
                          Chapter Editor
                        </p>
                        <h3 className="mt-1 text-xl font-semibold">
                          {activeChapter.title || `ตอนที่ ${activeChapter.chapterNumber}`}
                        </h3>
                        <p className="mt-2 text-sm text-[var(--color-muted)]">
                          แก้ข้อมูลตอนและเขียนเนื้อหา
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const nextChapters = draft.chapters.filter(
                            (_, chapterIndex) => chapterIndex !== activeChapterIndex,
                          );
                          setDraft({
                            ...draft,
                            chapters: nextChapters,
                          });
                          setActiveChapterIndex(
                            nextChapters.length
                              ? Math.max(0, (activeChapterIndex ?? 0) - 1)
                              : null,
                          );
                        }}
                        className="rounded-[1rem] border border-rose-500/25 px-4 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 dark:hover:bg-rose-950/30"
                      >
                        ลบตอนนี้
                      </button>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-[120px_minmax(0,1fr)_180px]">
                      <Field label="ตอน">
                        <input
                          type="number"
                          min="1"
                          value={activeChapter.chapterNumber}
                          onChange={(event) =>
                            updateChapter(activeChapterIndex!, {
                              chapterNumber: Number(event.target.value || "1"),
                            })
                          }
                          className={inputClassName}
                        />
                      </Field>

                      <Field label="ชื่อตอน">
                        <input
                          value={activeChapter.title}
                          onChange={(event) =>
                            updateChapter(activeChapterIndex!, {
                              title: event.target.value,
                            })
                          }
                          className={inputClassName}
                        />
                      </Field>

                      <Field label="ราคาเหรียญ">
                        <input
                          type="number"
                          min="0"
                          step="1"
                          value={activeChapter.coinPrice}
                          onChange={(event) =>
                            updateChapter(activeChapterIndex!, {
                              coinPrice: Number(event.target.value || "0"),
                            })
                          }
                          disabled={activeChapter.isFree}
                          className={inputClassName}
                        />
                      </Field>
                    </div>

                    <div className="grid gap-4 md:grid-cols-[220px_minmax(0,1fr)]">
                      <Field label="สถานะการเข้าถึง">
                        <div className="flex h-[52px] items-center rounded-[1rem] border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-4">
                          <label className="flex items-center gap-3 text-sm font-medium">
                            <input
                              type="checkbox"
                              checked={activeChapter.isFree}
                              onChange={(event) =>
                                updateChapter(activeChapterIndex!, {
                                  isFree: event.target.checked,
                                  coinPrice: event.target.checked
                                    ? 0
                                    : activeChapter.coinPrice,
                                })
                              }
                            />
                            เปิดอ่านฟรี
                          </label>
                        </div>
                      </Field>

                      <div className="rounded-[1rem] border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-4 py-3 text-sm text-[var(--color-muted)]">
                        {activeChapter.isFree ? (
                          "ตอนนี้เปิดอ่านฟรี ผู้อ่านทุกคนเข้าถึงได้ทันที"
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <img src="/coin_logo.png" alt="Coin" className="w-4 h-4 object-contain" />
                            <span>ตอนนี้เป็นตอนล็อก ราคา {activeChapter.coinPrice} Gold</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-[var(--color-brand-strong)]">
                        Text Editor
                      </p>
                    </div>

                    <Field label="เนื้อหาตอน">
                      <div className="overflow-hidden rounded-[1.15rem] border border-[var(--color-border)] bg-[var(--color-surface)]">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3 py-2.5">
                          <div className="flex flex-wrap items-center gap-1">
                            <ToolbarButton label="¶" onClick={() => formatActiveChapterContent("paragraph")} />
                            <ToolbarButton label="H1" onClick={() => formatActiveChapterContent("h1")} />
                            <ToolbarButton label="//" onClick={() => formatActiveChapterContent("quote")} />
                            <ToolbarDivider />
                            <ToolbarButton label="B" onClick={() => formatActiveChapterContent("bold")} />
                            <ToolbarButton label="I" onClick={() => formatActiveChapterContent("italic")} />
                            <ToolbarButton label="U" onClick={() => formatActiveChapterContent("underline")} />
                            <ToolbarButton label="A" onClick={() => formatActiveChapterContent("accent")} />
                            <ToolbarDivider />
                            <ToolbarButton label="≣" onClick={() => formatActiveChapterContent("list")} />
                            <ToolbarButton label="≡" onClick={() => formatActiveChapterContent("alignLeft")} />
                            <ToolbarButton label="☰" onClick={() => formatActiveChapterContent("alignCenter")} />
                            <ToolbarButton label="☷" onClick={() => formatActiveChapterContent("alignRight")} />
                          </div>

                          <div className="flex items-center gap-2">
                            <ViewModeButton
                              active={contentView === "write"}
                              onClick={() => setContentView("write")}
                            >
                              เขียน
                            </ViewModeButton>
                            <ViewModeButton
                              active={contentView === "preview"}
                              onClick={() => setContentView("preview")}
                            >
                              ตัวอย่าง
                            </ViewModeButton>
                            <ViewModeButton
                              active={contentView === "split"}
                              onClick={() => setContentView("split")}
                            >
                              คู่กัน
                            </ViewModeButton>
                          </div>
                        </div>

                        <div
                          className={`grid min-h-[24rem] ${contentView === "split" ? "lg:grid-cols-2" : "grid-cols-1"
                            }`}
                        >
                          {contentView !== "preview" ? (
                            <div
                              className={`${contentView === "split"
                                ? "border-b border-[var(--color-border)] lg:border-b-0 lg:border-r"
                                : ""
                                } border-[var(--color-border)]`}
                            >
                              <div className="relative min-h-[24rem]">
                                {isActiveChapterEmpty ? (
                                  <div className="pointer-events-none absolute left-5 top-5 text-sm text-[var(--color-muted)]">
                                    เริ่มเขียนเนื้อหานิยายตอนนี้ได้เลย...
                                  </div>
                                ) : null}
                                <div
                                  ref={contentEditorRef}
                                  contentEditable
                                  suppressContentEditableWarning
                                  onInput={syncEditorContentToDraft}
                                  className="writer-editor-content min-h-[24rem] px-5 py-5 outline-none"
                                />
                              </div>
                            </div>
                          ) : null}

                          {contentView !== "write" ? (
                            <div className="writer-preview min-h-[24rem] px-6 py-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]">
                              <div className="mb-4 flex items-center justify-between gap-3 border-b border-[color:color-mix(in_srgb,var(--color-brand)_14%,white)] pb-3">
                                <div>
                                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-brand-strong)]">
                                    Reader Preview
                                  </p>
                                  <p className="mt-1 text-sm text-[var(--color-muted)]">
                                    มุมมองนี้จะแสดงผลใกล้เคียงหน้าอ่านจริง
                                  </p>
                                </div>
                              </div>
                              <div
                                className="max-w-none"
                                dangerouslySetInnerHTML={{
                                  __html:
                                    activeChapterPreviewHtml ||
                                    "<p class='writer-preview-empty'>ตัวอย่างการแสดงผลจะขึ้นที่นี่</p>",
                                }}
                              />
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </Field>

                    <Field label="ข้อความถึงนักอ่าน">
                      <textarea
                        value={activeChapter.readerNote}
                        onChange={(event) =>
                          updateChapter(activeChapterIndex!, {
                            readerNote: event.target.value,
                          })
                        }
                        rows={4}
                        className={`${inputClassName} resize-y`}
                        placeholder="ฝากข้อความท้ายตอนถึงนักอ่าน"
                      />
                    </Field>
                  </div>
                ) : (
                  <div className="flex min-h-[24rem] items-center justify-center rounded-[1rem] border border-dashed border-[var(--color-border)] bg-[var(--color-surface-muted)] px-6 text-center text-sm text-[var(--color-muted)]">
                    เลือกตอนจากรายการด้านซ้าย หรือกด `+ เพิ่มตอน` เพื่อเปิด text editor
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-[var(--color-border)] px-5 py-4">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-[1rem] border border-[var(--color-border)] px-4 py-2.5 text-sm font-semibold"
          >
            ยกเลิก
          </button>
        )}
        <button
          type="button"
          onClick={() => void onSave({ ...draft, chapterCount: draft.chapters.length })}
          className="rounded-[1rem] bg-[var(--color-brand)] px-4 py-2.5 text-sm font-semibold text-white transition hover:scale-[1.02]"
        >
          {draft.id.startsWith("draft-") ? "สร้างนิยายใหม่" : "บันทึกการเปลี่ยนแปลง"}
        </button>
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${active
        ? "bg-[var(--color-brand)] text-white"
        : "bg-[var(--color-surface-muted)] text-[var(--color-muted)]"
        }`}
    >
      {children}
    </button>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="space-y-2 text-sm font-medium">
      <span>{label}</span>
      {children}
    </label>
  );
}

function Badge({
  children,
  tone = "default",
}: {
  children: ReactNode;
  tone?: "default" | "soft";
}) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${tone === "soft"
        ? "bg-[color:color-mix(in_srgb,var(--color-brand)_10%,white)] text-[var(--color-brand-strong)]"
        : "bg-[var(--color-surface-muted)] text-[var(--color-muted)]"
        }`}
    >
      {children}
    </span>
  );
}

function ToolbarButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-10 min-w-10 items-center justify-center rounded-[0.85rem] px-3 text-sm font-semibold text-slate-600 transition hover:bg-white hover:text-[var(--color-brand-strong)] dark:text-slate-300 dark:hover:bg-slate-900"
    >
      {label}
    </button>
  );
}

function ToolbarDivider() {
  return <div className="mx-1 h-8 w-px bg-[var(--color-border)]" />;
}

function ViewModeButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${active
        ? "bg-[var(--color-brand)] text-white shadow-[0_8px_20px_rgba(66,185,131,0.22)]"
        : "bg-[var(--color-surface)] text-[var(--color-muted)] hover:text-[var(--color-brand-strong)]"
        }`}
    >
      {children}
    </button>
  );
}

function convertLightweightContentToHtml(content: string) {
  const lines = content.split("\n");
  const htmlParts: string[] = [];
  let currentAlign: "left" | "center" | "right" = "left";
  let currentListItems: string[] = [];

  const flushList = () => {
    if (!currentListItems.length) {
      return;
    }

    htmlParts.push(`<ul>${currentListItems.map((item) => `<li>${item}</li>`).join("")}</ul>`);
    currentListItems = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    if (line === "<left>") {
      flushList();
      currentAlign = "left";
      continue;
    }

    if (line === "<center>") {
      flushList();
      currentAlign = "center";
      continue;
    }

    if (line === "<right>") {
      flushList();
      currentAlign = "right";
      continue;
    }

    if (line === "</left>" || line === "</center>" || line === "</right>") {
      flushList();
      currentAlign = "left";
      continue;
    }

    if (!line.trim()) {
      flushList();
      htmlParts.push("<p><br></p>");
      continue;
    }

    if (line.startsWith("- ")) {
      currentListItems.push(convertInlineMarkupToHtml(line.slice(2)));
      continue;
    }

    flushList();

    const alignStyle = currentAlign === "left" ? "" : ` style="text-align:${currentAlign}"`;

    if (line.startsWith("# ")) {
      htmlParts.push(`<h2${alignStyle}>${convertInlineMarkupToHtml(line.slice(2))}</h2>`);
      continue;
    }

    if (line.startsWith("// ")) {
      htmlParts.push(
        `<blockquote${alignStyle}>${convertInlineMarkupToHtml(line.slice(3))}</blockquote>`,
      );
      continue;
    }

    htmlParts.push(`<p${alignStyle}>${convertInlineMarkupToHtml(line)}</p>`);
  }

  flushList();

  return htmlParts.join("");
}

function convertInlineMarkupToHtml(text: string) {
  const tokens: string[] = [];
  const tokenRegex = /(\*\*[^*]+\*\*|\*[^*]+\*|<u>.*?<\/u>|<accent>.*?<\/accent>)/g;
  let lastIndex = 0;

  for (const match of text.matchAll(tokenRegex)) {
    const value = match[0];
    const index = match.index ?? 0;

    if (index > lastIndex) {
      tokens.push(escapeHtml(text.slice(lastIndex, index)));
    }

    if (value.startsWith("**") && value.endsWith("**")) {
      tokens.push(`<strong>${escapeHtml(value.slice(2, -2))}</strong>`);
    } else if (value.startsWith("*") && value.endsWith("*")) {
      tokens.push(`<em>${escapeHtml(value.slice(1, -1))}</em>`);
    } else if (value.startsWith("<u>") && value.endsWith("</u>")) {
      tokens.push(`<u>${escapeHtml(value.slice(3, -4))}</u>`);
    } else if (value.startsWith("<accent>") && value.endsWith("</accent>")) {
      tokens.push(
        `<span data-accent="true" class="writer-accent">${escapeHtml(value.slice(8, -9))}</span>`,
      );
    }

    lastIndex = index + value.length;
  }

  if (lastIndex < text.length) {
    tokens.push(escapeHtml(text.slice(lastIndex)));
  }

  return tokens.join("");
}

function convertHtmlToLightweightContent(html: string) {
  if (typeof window === "undefined") {
    return "";
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const blocks = Array.from(doc.body.childNodes)
    .map((node) => serializeBlockNode(node))
    .flat()
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return blocks;
}

function serializeBlockNode(node: ChildNode): string[] {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = normalizeWhitespace(node.textContent ?? "");
    return text ? [text] : [];
  }

  if (!(node instanceof HTMLElement)) {
    return [];
  }

  const tagName = node.tagName.toLowerCase();

  if (tagName === "ul" || tagName === "ol") {
    return Array.from(node.children)
      .filter((child) => child.tagName.toLowerCase() === "li")
      .map((child) => `- ${serializeInlineNode(child).trim()}`);
  }

  if (tagName === "h1" || tagName === "h2" || tagName === "h3") {
    return wrapAlignedBlock(`# ${serializeInlineNode(node).trim()}`, readNodeAlignment(node));
  }

  if (tagName === "blockquote") {
    return wrapAlignedBlock(`// ${serializeInlineNode(node).trim()}`, readNodeAlignment(node));
  }

  if (tagName === "div" && node.closest("li")) {
    return [serializeInlineNode(node).trim()];
  }

  if (tagName === "p" || tagName === "div") {
    const text = serializeInlineNode(node).trim();
    return wrapAlignedBlock(text, readNodeAlignment(node));
  }

  return [serializeInlineNode(node).trim()].filter(Boolean);
}

function wrapAlignedBlock(text: string, alignment: "left" | "center" | "right") {
  if (!text) {
    return [];
  }

  if (alignment === "left") {
    return [text];
  }

  const marker = alignment === "center" ? "center" : "right";
  return [`<${marker}>`, text, `</${marker}>`];
}

function serializeInlineNode(node: ChildNode): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return normalizeWhitespace(node.textContent ?? "");
  }

  if (!(node instanceof HTMLElement)) {
    return "";
  }

  const tagName = node.tagName.toLowerCase();

  if (tagName === "br") {
    return "\n";
  }

  const childContent = Array.from(node.childNodes).map((child) => serializeInlineNode(child)).join("");

  if (tagName === "strong" || tagName === "b") {
    return `**${childContent}**`;
  }

  if (tagName === "em" || tagName === "i") {
    return `*${childContent}*`;
  }

  if (tagName === "u") {
    return `<u>${childContent}</u>`;
  }

  if (node.dataset.accent === "true" || node.classList.contains("writer-accent")) {
    return `<accent>${childContent}</accent>`;
  }

  return childContent;
}

function readNodeAlignment(node: HTMLElement): "left" | "center" | "right" {
  const align = (node.style.textAlign || node.getAttribute("align") || "").toLowerCase();

  if (align === "center" || align === "right") {
    return align;
  }

  return "left";
}

function normalizeWhitespace(text: string) {
  return text.replace(/\u00a0/g, " ");
}

function stripEditorText(text: string) {
  return text.replace(/<[^>]+>/g, "").replace(/\*/g, "").trim();
}

function escapeHtml(text: string) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

const inputClassName =
  "w-full rounded-[1rem] border border-[var(--color-border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--color-brand)] dark:bg-slate-950";
