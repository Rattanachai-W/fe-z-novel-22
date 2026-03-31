"use client";

import { FormEvent, useState } from "react";
import { useApp } from "@/components/providers/app-provider";

export function AuthModal() {
  const {
    authError,
    authModalOpen,
    authMode,
    authPending,
    closeAuthModal,
    login,
    loginWithFacebook,
    openAuthModal,
    register,
  } = useApp();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!authModalOpen) {
    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const success =
      authMode === "login"
        ? await login({ email, password })
        : await register({ username, email, password });

    if (success) {
      setUsername("");
      setEmail("");
      setPassword("");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm">
      <div className="card-surface w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-5">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--color-brand)]">
              Dino Access
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              {authMode === "login" ? "ล็อกอินเข้าสู่ระบบ" : "สมัครสมาชิก"}
            </h2>
          </div>
          <button
            type="button"
            onClick={closeAuthModal}
            className="rounded-full border border-[var(--color-border)] px-3 py-2 text-sm"
          >
            ปิด
          </button>
        </div>

        <div className="px-6 pb-6 pt-5">
          <div className="grid grid-cols-2 gap-2 rounded-2xl bg-[var(--color-surface-muted)] p-1">
            <button
              type="button"
              onClick={() => openAuthModal("login")}
              className={`rounded-[1rem] px-3 py-2 text-sm font-medium ${
                authMode === "login"
                  ? "bg-[var(--color-foreground)] text-[var(--color-background)]"
                  : "text-[var(--color-muted)]"
              }`}
            >
              ล็อกอิน
            </button>
            <button
              type="button"
              onClick={() => openAuthModal("register")}
              className={`rounded-[1rem] px-3 py-2 text-sm font-medium ${
                authMode === "register"
                  ? "bg-[var(--color-foreground)] text-[var(--color-background)]"
                  : "text-[var(--color-muted)]"
              }`}
            >
              สมัครสมาชิก
            </button>
          </div>

          <button
            type="button"
            onClick={loginWithFacebook}
            className="mt-5 flex w-full items-center justify-center rounded-[1.2rem] border border-[#1877f2]/30 bg-[#1877f2] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            ล็อกอินด้วย Facebook
          </button>

          <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-[var(--color-muted)]">
            <span className="h-px flex-1 bg-[var(--color-border)]" />
            <span>System Login</span>
            <span className="h-px flex-1 bg-[var(--color-border)]" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {authMode === "register" ? (
              <label className="block">
                <span className="mb-2 block text-sm font-medium">ชื่อผู้ใช้</span>
                <input
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  className="w-full rounded-[1rem] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 outline-none transition focus:border-[var(--color-brand)]"
                  placeholder="DinoReader"
                  required
                />
              </label>
            ) : null}

            <label className="block">
              <span className="mb-2 block text-sm font-medium">อีเมล</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-[1rem] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 outline-none transition focus:border-[var(--color-brand)]"
                placeholder="reader@dinonovel.app"
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium">รหัสผ่าน</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-[1rem] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 outline-none transition focus:border-[var(--color-brand)]"
                placeholder="••••••••"
                required
              />
            </label>

            {authError ? (
              <div className="rounded-[1rem] border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-700 dark:text-rose-300">
                {authError}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={authPending}
              className="w-full rounded-[1rem] bg-[var(--color-brand)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-brand-strong)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {authPending
                ? "กำลังดำเนินการ..."
                : authMode === "login"
                  ? "ล็อกอิน"
                  : "สร้างบัญชี"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
