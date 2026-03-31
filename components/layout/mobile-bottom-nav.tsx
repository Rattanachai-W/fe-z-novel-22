"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useMaybeReaderViewport } from "@/components/reader/reader-viewport";
import { AppIcon } from "@/components/ui/app-icon";

type MobileBottomNavProps = {
  items: Array<{
    href: string;
    label: string;
    icon:
      | "home"
      | "info"
      | "book-open"
      | "pen"
      | "bookmark"
      | "list";
    match?: "exact" | "prefix";
  }>;
};

export function MobileBottomNav({ items }: MobileBottomNavProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const readerViewport = useMaybeReaderViewport();
  const [isHiddenOnScroll, setIsHiddenOnScroll] = useState(false);

  const isReaderPage = pathname.includes("/chapters/");
  const chromeVisible = readerViewport?.chromeVisible ?? true;

  useEffect(() => {
    if (!isReaderPage) {
      setIsHiddenOnScroll(false);
      return;
    }

    let lastScrollY = window.scrollY;

    const onScroll = () => {
      const currentScrollY = window.scrollY;
      const isScrollingDown = currentScrollY > lastScrollY;
      const passedThreshold = currentScrollY > 120;

      setIsHiddenOnScroll(isScrollingDown && passedThreshold);
      if (isScrollingDown && passedThreshold) {
        readerViewport?.setChromeVisible(false);
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, [isReaderPage, readerViewport]);

  return (
    <nav
      className={`fixed inset-x-3 bottom-3 z-30 transition-transform duration-300 md:hidden ${
        isHiddenOnScroll || (isReaderPage && !chromeVisible)
          ? "translate-y-[140%]"
          : "translate-y-0"
      }`}
    >
      <div className="glass-panel grid grid-cols-4 rounded-[1.4rem] px-2 py-2 shadow-[0_18px_45px_rgba(15,23,42,0.22)]">
        {items.map((item) => {
          const isActive =
            item.match === "prefix"
              ? matchesRoute(pathname, searchParams, item.href, "prefix")
              : matchesRoute(pathname, searchParams, item.href, "exact");

          return (
            <Link
              key={`${item.href}-${item.label}`}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 rounded-[1rem] px-2 py-2 text-center text-[11px] font-medium transition ${
                isActive
                  ? "bg-[var(--color-foreground)] text-[var(--color-background)]"
                  : "text-[var(--color-muted)]"
              }`}
            >
              <span className="text-sm">
                <AppIcon name={item.icon} className="h-4 w-4" />
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function matchesRoute(
  pathname: string,
  searchParams: SearchParamsLike,
  href: string,
  match: "exact" | "prefix",
) {
  if (href === "/") {
    return pathname === "/" && !searchParams.size;
  }

  if (href.startsWith("/?")) {
    const hrefSearchParams = new URLSearchParams(href.slice(2));

    return (
      pathname === "/" &&
      Array.from(hrefSearchParams.entries()).every(
        ([key, value]) => searchParams.get(key) === value,
      )
    );
  }

  if (match === "prefix") {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return pathname === href;
}

type SearchParamsLike = {
  size: number;
  get: (name: string) => string | null;
  entries: () => IterableIterator<[string, string]>;
};
