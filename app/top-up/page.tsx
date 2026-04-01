"use client";

import { useState } from "react";
import { SiteHeader } from "@/components/layout/site-header";
import { useApp } from "@/components/providers/app-provider";

export default function TopUpPage() {
  const { wallet } = useApp();
  const [selectedPackage, setSelectedPackage] = useState<number>(3);
  const [paymentMethod, setPaymentMethod] = useState<"promptpay" | "credit">("promptpay");

  const packages = [
    { id: 1, gold: 100, bonus: 0, price: 29, egg: 0, ticket: 0, tag: "" },
    { id: 2, gold: 300, bonus: 20, price: 89, egg: 0, ticket: 0, tag: "" },
    { id: 3, gold: 500, bonus: 50, price: 149, egg: 0, ticket: 1, tag: "POPULAR" },
    { id: 4, gold: 1000, bonus: 150, price: 299, egg: 1, ticket: 3, tag: "BEST VALUE" },
    { id: 5, gold: 3000, bonus: 500, price: 899, egg: 3, ticket: 10, tag: "" },
    { id: 6, gold: 5000, bonus: 1000, price: 1490, egg: 10, ticket: 20, tag: "DINO PRO" },
  ];

  const currentPkg = packages.find((p) => p.id === selectedPackage) || packages[2];

  return (
    <main className="relative min-h-screen">
      <div className="absolute inset-x-0 top-0 -z-10 h-[30rem] bg-[radial-gradient(circle_at_top_left,_rgba(66,185,131,0.2),_transparent_40%),radial-gradient(circle_at_top_right,_rgba(247,185,64,0.1),_transparent_32%),linear-gradient(180deg,_rgba(241,245,249,0.96),_rgba(240,235,255,0.9),_rgba(255,255,255,1))] dark:bg-[radial-gradient(circle_at_top_left,_rgba(66,185,131,0.15),_transparent_40%),radial-gradient(circle_at_top_right,_rgba(247,185,64,0.06),_transparent_28%),linear-gradient(180deg,_rgba(15,23,42,1),_rgba(2,6,23,1))]" />

      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-3 pb-16 pt-4 sm:px-4 sm:pt-6 lg:px-6">
        <SiteHeader />

        <div className="mx-auto mt-6 w-full max-w-5xl lg:mt-10">
          <div className="mb-8 flex flex-col justify-between gap-4 text-center sm:flex-row sm:items-end sm:text-left">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl dark:text-slate-50">
                เติมเหรียญ (Top-Up)
              </h1>
              <p className="mt-2 text-sm text-[var(--color-muted)] sm:text-base">
                สนับสนุนนักเขียนและปลดล็อกตอนใหม่ด้วยเหรียญทอง
              </p>
            </div>
            
            <div className="inline-flex flex-col items-center rounded-2xl bg-white/60 px-5 py-3 shadow-sm backdrop-blur-md sm:items-end dark:bg-slate-900/40">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">ยอดยกมา (Balance)</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-2xl font-bold text-[#f7b940] drop-shadow-sm">{wallet?.gold?.toLocaleString() ?? 0}</span>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Gold</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.5fr_1fr] lg:gap-8 xl:gap-10">
            {/* Packages Grid */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">เลือกแพ็กเกจสุดคุ้ม</h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
                {packages.map((pkg) => (
                  <button
                    type="button"
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg.id)}
                    className={`group relative flex flex-col overflow-hidden rounded-2xl border-2 bg-[var(--color-surface)] p-4 text-left transition-all hover:-translate-y-1 ${
                      selectedPackage === pkg.id
                        ? "border-[var(--color-brand)] shadow-[0_12px_30px_rgba(66,185,131,0.2)]"
                        : "border-[var(--color-border)] hover:border-[#86d7b2] hover:shadow-md"
                    }`}
                  >
                    {pkg.tag && (
                      <div className={`absolute right-0 top-0 rounded-bl-xl px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white ${
                        pkg.tag === "POPULAR" ? "bg-rose-500" : "bg-[var(--color-brand)]"
                      }`}>
                        {pkg.tag}
                      </div>
                    )}
                    
                    <div className="flex items-center gap-1.5">
                      <span className="text-2xl">🪙</span>
                      <span className={`text-xl font-bold tracking-tight ${selectedPackage === pkg.id ? 'text-[var(--color-brand)]' : 'text-slate-800 dark:text-slate-100'}`}>
                        {pkg.gold}
                      </span>
                    </div>
                    
                    {pkg.bonus > 0 ? (
                      <p className="mt-1 text-xs font-medium text-emerald-500">
                        + โบนัส {pkg.bonus}
                      </p>
                    ) : (
                      <p className="mt-1 text-xs font-medium text-[var(--color-muted)]">ไม่มีโบนัส</p>
                    )}

                    {(pkg.egg > 0 || pkg.ticket > 0) && (
                      <div className="mt-3 flex flex-wrap gap-1.5 border-t border-[var(--color-border)] pt-3">
                        {pkg.egg > 0 && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-[#ebe2ff] px-1.5 py-0.5 text-[10px] font-bold text-slate-800">
                            🥚 {pkg.egg} ยูนิต
                          </span>
                        )}
                        {pkg.ticket > 0 && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-[#e8f6ee] px-1.5 py-0.5 text-[10px] font-bold text-slate-800">
                            🎟️ {pkg.ticket} ตั๋ว
                          </span>
                        )}
                      </div>
                    )}

                    <div className="mt-auto pt-4">
                      <div className={`flex w-full items-center justify-center rounded-xl py-2 text-sm font-semibold transition-colors ${
                        selectedPackage === pkg.id 
                          ? "bg-[var(--color-brand)] text-white" 
                          : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                      }`}>
                        ฿ {pkg.price}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Method & Checkout */}
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">ช่องทางการชำระเงิน</h2>
              
              <div className="rounded-[1.25rem] border border-[var(--color-border)] bg-[var(--color-surface)] p-1">
                <div className="grid grid-cols-2 gap-1">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("promptpay")}
                    className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                      paymentMethod === "promptpay"
                        ? "bg-[var(--color-foreground)] text-[var(--color-background)] shadow-sm"
                        : "text-[var(--color-muted)] hover:bg-[var(--color-surface-muted)] hover:text-slate-900 dark:hover:text-slate-100"
                    }`}
                  >
                    สแกนโอนจ่าย (PromptPay)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("credit")}
                    className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                      paymentMethod === "credit"
                        ? "bg-[var(--color-foreground)] text-[var(--color-background)] shadow-sm"
                        : "text-[var(--color-muted)] hover:bg-[var(--color-surface-muted)] hover:text-slate-900 dark:hover:text-slate-100"
                    }`}
                  >
                    บัตรเครดิต / เดบิต
                  </button>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm sm:p-6 lg:p-7">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">สรุปคำสั่งซื้อ</h3>
                
                <div className="mt-5 space-y-3 border-y border-[var(--color-border)] py-5 text-sm">
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span>เหรียญทอง (Gold)</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">{currentPkg.gold}</span>
                  </div>
                  {currentPkg.bonus > 0 && (
                    <div className="flex items-center justify-between text-emerald-500">
                      <span>โบนัสพิเศษ (Bonus)</span>
                      <span className="font-semibold">+{currentPkg.bonus}</span>
                    </div>
                  )}
                  {currentPkg.egg > 0 && (
                    <div className="flex items-center justify-between text-[#8b5cf6]">
                      <span>Dino Egg</span>
                      <span className="font-semibold">+{currentPkg.egg}</span>
                    </div>
                  )}
                  {currentPkg.ticket > 0 && (
                    <div className="flex items-center justify-between text-rose-500">
                      <span>Gacha Ticket</span>
                      <span className="font-semibold">+{currentPkg.ticket}</span>
                    </div>
                  )}
                </div>

                <div className="mt-5 flex items-end justify-between">
                  <span className="text-base font-semibold text-slate-900 dark:text-slate-100">ยอดชำระสุทธิ</span>
                  <div className="text-right">
                    <span className="text-3xl font-bold tracking-tight text-[var(--color-brand)]">฿ {currentPkg.price.toLocaleString()}</span>
                    <p className="mt-1 text-[11px] text-[var(--color-muted)]">รวมภาษีมูลค่าเพิ่มแล้ว</p>
                  </div>
                </div>

                <button
                  type="button"
                  className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-brand)] py-4 text-base font-bold text-white shadow-[0_8px_20px_rgba(66,185,131,0.35)] transition-all hover:-translate-y-1 hover:bg-[#3ba273] hover:shadow-[0_12px_24px_rgba(66,185,131,0.45)] active:translate-y-0 active:shadow-none"
                >
                  ชำระเงิน {currentPkg.price} บาท
                </button>
                
                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[var(--color-muted)]">
                  <span>🔒 Secured Checkout by Omise</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
