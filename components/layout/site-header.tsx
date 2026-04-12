"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Menu } from "@ark-ui/react/menu";
import { useMaybeReaderViewport } from "@/components/reader/reader-viewport";
import { useApp } from "@/components/providers/app-provider";
import { AppIcon } from "@/components/ui/app-icon";

type SiteHeaderProps = {
  primaryHref?: string;
  primaryLabel?: string;
};

const navItems = [
  { href: "/", label: "หน้าหลัก" },
  { href: "/?tag=tag-readlist", label: "ชั้นหนังสือ" },
  { href: "/writer", label: "นักเขียน" },
];

const quickActions = [
  { icon: "search" as const, title: "ค้นหา", href: "/#discover" },
  { icon: "bell" as const, title: "แจ้งเตือน", href: "/notifications" },
  { icon: "bookmark" as const, title: "ชั้นหนังสือ", href: "/bookshelf" },
];

export function SiteHeader({
  primaryHref = "/novels/demo-001",
  primaryLabel = "ทดลองหน้ารายเรื่อง",
}: SiteHeaderProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { globalMessage, openAuthModal, logout, user, wallet, walletPending, theme, toggleTheme } = useApp();

  const isReaderPage = pathname.includes("/chapters/");

  return (
    <>
      <header className="glass-panel z-30 rounded-[1.35rem] px-3 py-3 sm:rounded-[1.6rem] sm:px-4">
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(180deg,_#7c4dff,_#5d52ff)] text-lg font-bold text-white">
              n
            </div>
            <div className="min-w-0">
              <p className="truncate text-base font-semibold tracking-tight text-slate-900 sm:text-lg dark:text-slate-50">
                DinoNovel
              </p>
              {/* <p className="truncate text-xs text-[var(--color-muted)]">
                mobile-first reading platform
              </p> */}
            </div>
          </Link>

          <nav className="hidden items-center gap-2 xl:flex">
            {navItems.map((item, index) => {
              const isActive = matchesRoute(pathname, searchParams, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                    isActive || (index === 0 && pathname === "/" && !searchParams.size)
                      ? "bg-[#f7b940] text-slate-950"
                      : "text-slate-800 hover:bg-[var(--color-surface-muted)] dark:text-slate-100"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <Link
              href={primaryHref}
              className="hidden rounded-xl bg-[var(--color-brand)] px-4 py-2.5 text-sm font-semibold text-white lg:inline-flex"
            >
              {primaryLabel}
            </Link>

            <div className="hidden items-center gap-2 lg:flex">
              {quickActions.map((action) => (
                <Link
                  key={action.title}
                  href={action.href}
                  aria-label={action.title}
                  title={action.title}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-surface-muted)] text-sm font-semibold text-slate-700 transition hover:bg-slate-200 dark:text-slate-100 dark:hover:bg-slate-700"
                >
                  <AppIcon name={action.icon} />
                </Link>
              ))}
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={theme === "dark" ? "Switch to day mode" : "Switch to dark mode"}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-surface-muted)] text-sm font-semibold text-slate-700 transition hover:bg-slate-200 dark:text-slate-100 dark:hover:bg-slate-700"
              >
                <AppIcon name={theme === "dark" ? "sun" : "moon"} />
              </button>
            </div>

            <Menu.Root positioning={{ placement: "bottom-end", gutter: 10 }}>
              <Menu.Trigger className="flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1.5 shadow-sm transition hover:border-[var(--color-brand)] sm:px-2.5 sm:py-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[linear-gradient(180deg,_#8fc4ff,_#3f68ff)] text-sm font-semibold text-white">
                  {user?.username?.[0]?.toUpperCase() ?? "U"}
                </span>
                <span className="hidden text-sm font-semibold text-slate-800 dark:text-slate-100 sm:block">
                  {user?.username ?? "เมนู"}
                </span>
                <span className="flex flex-col gap-1">
                  <span className="block h-0.5 w-4 rounded-full bg-slate-700 dark:bg-slate-200" />
                  <span className="block h-0.5 w-4 rounded-full bg-slate-700 dark:bg-slate-200" />
                  <span className="block h-0.5 w-4 rounded-full bg-slate-700 dark:bg-slate-200" />
                </span>
              </Menu.Trigger>

              <Menu.Positioner>
                <Menu.Content className="z-50 w-[min(92vw,22rem)] rounded-[1.25rem] border border-[var(--color-border)] bg-[var(--color-surface)] p-2 shadow-[0_24px_60px_rgba(15,23,42,0.18)] backdrop-blur-xl">
                  <div className="rounded-[1rem] bg-white/70 px-4 py-3 dark:bg-slate-900/65">
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[linear-gradient(180deg,_#8fc4ff,_#3f68ff)] text-base font-semibold text-white">
                        {user?.username?.[0]?.toUpperCase() ?? "U"}
                      </span>
                      <div>
                        <p className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                          {user?.username ?? "Guest"}
                        </p>
                        <p className="text-sm text-[var(--color-muted)]">
                          {user ? "พร้อมเก็บเหรียญและอ่านต่อ" : "สำหรับนักอ่านมือใหม่"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 space-y-2">
                      {[
                        { label: "Gold", value: walletPending ? "..." : `${wallet?.gold ?? 0}` },
                        // { label: "Egg", value: walletPending ? "..." : `${wallet?.egg ?? 0}` },
                        // {
                        //   label: "Ticket",
                        //   value: walletPending ? "..." : `${wallet?.ticket ?? 0}`,
                        // },
                      ].map((item, index) => (
                        <div
                          key={item.label}
                          className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm ${
                            index === 0
                              ? "bg-[#ffefb4] text-slate-900"
                              : index === 1
                                ? "bg-[#ebe2ff] text-slate-900"
                                : "bg-[#e8f6ee] text-slate-900"
                          }`}
                        >
                          <span className="font-medium">{item.label}</span>
                          <span className="font-semibold">{item.value}</span>
                        </div>
                      ))}
                    </div>

                    <Menu.Item value="top-up" asChild>
                      <Link
                        href="/top-up"
                        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-brand)] px-3 py-2.5 text-sm font-bold text-white shadow-[0_4px_10px_rgba(66,185,131,0.3)] transition hover:-translate-y-0.5 hover:bg-[#3ba273]"
                      >
                        <div className="flex items-center gap-2">
                          <img src="/coin_logo.png" alt="Coin" className="w-5 h-5 object-contain" />
                          <span>เติมเหรียญ</span>
                        </div>
                      </Link>
                    </Menu.Item>
                  </div>

                  <div className="px-1 py-2 xl:hidden">
                    {navItems.map((item) => (
                      <Menu.Item key={item.href} value={item.href} asChild>
                        <Link
                          href={item.href}
                          className={`flex w-full items-center rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                            matchesRoute(pathname, searchParams, item.href)
                              ? "bg-[#f7b940] text-slate-950"
                              : "text-slate-800 hover:bg-[var(--color-surface-muted)] dark:text-slate-100"
                          }`}
                        >
                          {item.label}
                        </Link>
                      </Menu.Item>
                    ))}
                  </div>
                  <Menu.Item value="primary" asChild>
                    <Link
                      href={primaryHref}
                      className="flex w-full items-center rounded-xl px-3 py-2.5 text-sm font-medium text-slate-800 transition hover:bg-[var(--color-surface-muted)] dark:text-slate-100"
                    >
                      {primaryLabel}
                    </Link>
                  </Menu.Item>

                  <Menu.Separator className="my-2 h-px bg-[var(--color-border)]" />

                  {user ? (
                    <Menu.Item
                      value="logout"
                      onSelect={logout}
                      className="flex cursor-pointer items-center rounded-xl px-3 py-2.5 text-sm font-medium text-rose-600 transition hover:bg-rose-50 dark:hover:bg-rose-950/30"
                    >
                      ออกจากระบบ
                    </Menu.Item>
                  ) : (
                    <Menu.Item
                      value="login"
                      onSelect={() => openAuthModal("login")}
                      className="flex cursor-pointer items-center rounded-xl px-3 py-2.5 text-sm font-medium text-slate-800 transition hover:bg-[var(--color-surface-muted)] dark:text-slate-100"
                    >
                      ล็อกอิน / สมัครสมาชิก
                    </Menu.Item>
                  )}
                </Menu.Content>
              </Menu.Positioner>
            </Menu.Root>
          </div>
        </div>

        <div className="mt-3 flex gap-2 lg:hidden">
          <Link
            href={primaryHref}
            className="flex-1 rounded-xl bg-[var(--color-brand)] px-4 py-2.5 text-center text-sm font-semibold text-white"
          >
            {primaryLabel}
          </Link>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to day mode" : "Switch to dark mode"}
            className="flex h-10 min-w-[3rem] items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-sm font-semibold text-slate-700 transition hover:bg-[var(--color-surface-muted)] dark:text-slate-100 dark:hover:bg-slate-700"
          >
            <AppIcon name={theme === "dark" ? "sun" : "moon"} />
          </button>
          {!user ? (
            <button
              type="button"
              onClick={() => openAuthModal("login")}
              className="rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm font-semibold"
            >
              เข้าสู่ระบบ
            </button>
          ) : null}
        </div>
      </header>

      {globalMessage ? (
        <div className="mb-4 mt-3 rounded-[1.2rem] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-muted)]">
          {globalMessage}
        </div>
      ) : null}
    </>
  );
}

function matchesRoute(
  pathname: string,
  searchParams: SearchParamsLike,
  href: string,
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

  return pathname === href || pathname.startsWith(`${href}/`);
}

type SearchParamsLike = {
  size: number;
  get: (name: string) => string | null;
  entries: () => IterableIterator<[string, string]>;
};
