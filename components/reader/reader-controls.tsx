"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";
import { AppIcon } from "@/components/ui/app-icon";
import { useReaderViewport } from "@/components/reader/reader-viewport";

type ReaderControlsProps = {
  children: React.ReactNode;
};

type ReaderTheme = "paper" | "night";

const FONT_SIZES = [16, 18, 20] as const;

export function ReaderControls({ children }: ReaderControlsProps) {
  const { chromeVisible } = useReaderViewport();
  const [fontSize, setFontSize] = useState<(typeof FONT_SIZES)[number]>(18);
  const [theme, setTheme] = useState<ReaderTheme>("paper");

  useEffect(() => {
    const storedFontSize = window.localStorage.getItem("reader_font_size");
    const storedTheme = window.localStorage.getItem("reader_theme") as ReaderTheme | null;

    if (storedFontSize) {
      const parsed = Number(storedFontSize);
      if (FONT_SIZES.includes(parsed as (typeof FONT_SIZES)[number])) {
        setFontSize(parsed as (typeof FONT_SIZES)[number]);
      }
    }

    if (storedTheme === "paper" || storedTheme === "night") {
      setTheme(storedTheme);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("reader_font_size", String(fontSize));
  }, [fontSize]);

  useEffect(() => {
    window.localStorage.setItem("reader_theme", theme);
  }, [theme]);

  const articleClassName = useMemo(() => {
    const themeClassName =
      theme === "night"
        ? "border-slate-800 bg-slate-950 text-slate-100 shadow-[0_24px_70px_rgba(2,6,23,0.45)]"
        : "border-[var(--color-border)] bg-[#fffdf6] text-[var(--color-foreground)]";

    return `rounded-[1.75rem] border ${themeClassName}`;
  }, [theme]);

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
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--color-brand)]">
              Reader Controls
            </p>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              ปรับตัวอักษรและโทนอ่านให้เหมาะกับมือถือ
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] p-1">
              {FONT_SIZES.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setFontSize(size)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                    fontSize === size
                      ? "bg-[var(--color-foreground)] text-[var(--color-background)]"
                      : "text-[var(--color-muted)]"
                  }`}
                >
                  A{size === 20 ? "+" : size === 16 ? "-" : ""}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] p-1">
              <button
                type="button"
                onClick={() => setTheme("paper")}
                className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  theme === "paper"
                    ? "bg-[var(--color-foreground)] text-[var(--color-background)]"
                    : "text-[var(--color-muted)]"
                }`}
              >
                <AppIcon name="sun" className="h-3.5 w-3.5" />
                Paper
              </button>
              <button
                type="button"
                onClick={() => setTheme("night")}
                className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  theme === "night"
                    ? "bg-[var(--color-foreground)] text-[var(--color-background)]"
                    : "text-[var(--color-muted)]"
                }`}
              >
                <AppIcon name="moon" className="h-3.5 w-3.5" />
                Night
              </button>
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
