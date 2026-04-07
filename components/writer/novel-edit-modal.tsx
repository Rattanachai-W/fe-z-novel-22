"use client";

import { WriterNovelEditor } from "@/components/writer/writer-novel-editor";
import type { WriterNovelItem } from "@/lib/writer/dashboard";

type NovelEditModalProps = {
  novel: WriterNovelItem | null;
  open: boolean;
  onClose: () => void;
  onSave: (novel: WriterNovelItem) => Promise<void> | void;
};

export function NovelEditModal({ novel, open, onClose, onSave }: NovelEditModalProps) {
  if (!open || !novel) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 pb-10 pt-12 backdrop-blur-[2px] md:px-5 lg:px-6">
      <div className="max-h-[95vh] w-full max-w-7xl overflow-hidden rounded-[1.75rem] border border-[var(--color-border)] bg-[var(--color-background)] shadow-[0_30px_80px_rgba(15,23,42,0.28)] lg:border-2">
        <WriterNovelEditor novel={novel} onSave={onSave} onClose={onClose} />
      </div>
    </div>
  );
}
