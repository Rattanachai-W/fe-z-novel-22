"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";
import { useReaderViewport } from "@/components/reader/reader-viewport";

type ReaderControlsProps = {
  children: React.ReactNode;
};

const FONT_SIZES = [16, 18, 20] as const;

export function ReaderControls({ children }: ReaderControlsProps) {
  const { chromeVisible } = useReaderViewport();
  const [fontSize, setFontSize] = useState<(typeof FONT_SIZES)[number]>(18);

  useEffect(() => {
    const storedFontSize = window.localStorage.getItem("reader_font_size");

    if (storedFontSize) {
      const parsed = Number(storedFontSize);
      if (FONT_SIZES.includes(parsed as (typeof FONT_SIZES)[number])) {
        setFontSize(parsed as (typeof FONT_SIZES)[number]);
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("reader_font_size", String(fontSize));
  }, [fontSize]);

  const articleClassName = useMemo(() => {
    return "rounded-[1.75rem] border border-(--color-border) bg-(--color-surface) text-(--color-foreground)";
  }, []);

  return (
    <div className="space-y-4">
      <section
        className={`card-surface sticky top-20 z-20 rounded-[1.3rem] p-3 transition-all duration-300 sm:top-24 sm:p-4 ${
          chromeVisible
            ? "translate-y-0 opacity-100"
            : "-translate-y-6 pointer-events-none opacity-0"
        }`}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-(--color-brand)">
              Reader Controls
            </p>
            <p className="mt-1 text-sm text-(--color-muted)">
              ปรับตัวอักษรให้เหมาะกับมือถือ
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 rounded-full border border-(--color-border) bg-(--color-surface) p-1">
              {FONT_SIZES.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setFontSize(size)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                    fontSize === size
                      ? "bg-(--color-foreground) text-(--color-background)"
                      : "text-(--color-muted)"
                  }`}
                >
                  A{size === 20 ? "+" : size === 16 ? "-" : ""}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div
        className={articleClassName}
        style={
          {
            "--reader-font-size": `${fontSize}px`,
          } as CSSProperties
        }
      >
        {children}
      </div>
    </div>
  );
}
