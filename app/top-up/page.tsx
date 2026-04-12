"use client";

import { useState, useTransition, useEffect } from "react";
import { SiteHeader } from "@/components/layout/site-header";
import { useApp } from "@/components/providers/app-provider";
import { topupWallet, redeemPromoCode, checkTopupStatus } from "@/lib/api/financial";
import { toast } from "sonner";

export default function TopUpPage() {
  const { wallet, token, requireAuth, refreshWallet } = useApp();
  const [selectedPackage, setSelectedPackage] = useState<number | "custom" | null>(null);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<"promptpay" | "credit" | null>(null);
  const [isPending, startTransition] = useTransition();
  const [promoCode, setPromoCode] = useState("");
  const [promoMessage, setPromoMessage] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [currentChargeId, setCurrentChargeId] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(600); // 10 minutes in seconds

  const packages = [
    { id: 1, price: 50, tag: "" },
    { id: 2, price: 100, tag: "" },
    { id: 3, price: 250, tag: "ยอดนิยม" },
    { id: 4, price: 500, tag: "" },
    { id: 5, price: 1000, tag: "" },
    // { id: 6, price: 2500, tag: "DINO PRO" },
  ];

  const goldRate = paymentMethod === "promptpay" ? 1 : 0.95;

  const getSelectedPrice = () => {
    if (selectedPackage === "custom") return parseInt(customAmount) || 0;
    const pkg = packages.find(p => p.id === selectedPackage);
    return pkg ? pkg.price : 0;
  };

  const currentPrice = getSelectedPrice();
  const currentGold = Math.floor(currentPrice * goldRate);

  function handleCheckout() {
    if (!requireAuth()) return;

    startTransition(async () => {
      try {
        if (currentPrice < 20) {
          toast.error("ขั้นต่ำการเติมเงินคือ 20 บาท");
          return;
        }
        const res = await topupWallet(token!, { amount_thb: currentPrice, payment_method: paymentMethod! });

        if (res.qr_code && res.chargeId) {
          setQrCodeUrl(res.qr_code);
          setCurrentChargeId(res.chargeId);
          setTimeLeft(600);
          toast.success("สร้างรายการชำระเงินสำเร็จ กรุณาสแกน QR Code");
        } else if (res.authorize_uri) {
          window.location.href = res.authorize_uri;
        } else {
          await refreshWallet();
          toast.success("สร้างรายการชำระเงินสำเร็จ");
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "การเติมเงินล้มเหลว");
      }
    });
  }

  useEffect(() => {
    let interval: number;

    if (qrCodeUrl && currentChargeId && token) {
      interval = window.setInterval(async () => {
        try {
          const statusRes = await checkTopupStatus(token, currentChargeId);
          if (statusRes.status === "success" || statusRes.status === "successful") {
            window.clearInterval(interval);
            setQrCodeUrl(null);
            setCurrentChargeId(null);
            await refreshWallet();
            toast.success(`ชำระเงินเรียบร้อย! ได้รับเหรียญเพิ่ม ${statusRes.coins_added || currentGold} Gold`);
          } else if (statusRes.status === "failed" || statusRes.status === "expired") {
            window.clearInterval(interval);
            setQrCodeUrl(null);
            setCurrentChargeId(null);
            toast.error("การทำรายการไม่สำเร็จ หรือหมดเวลาการทำรายการ");
          }
        } catch (err) {
          // Ignore polling errors
        }
      }, 5000);
    }

    return () => {
      if (interval) window.clearInterval(interval);
    };
  }, [qrCodeUrl, currentChargeId, token, refreshWallet, currentGold]);

  // Timer Effect
  useEffect(() => {
    let timer: number;
    if (qrCodeUrl && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && qrCodeUrl) {
      setQrCodeUrl(null);
      setCurrentChargeId(null);
      toast.error("หมดเวลาทำรายการ กรุณาเริ่มทำรายการใหม่");
    }

    return () => {
      if (timer) window.clearInterval(timer);
    };
  }, [qrCodeUrl, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  function handleRedeemPromo(e: React.FormEvent) {
    e.preventDefault();
    if (!requireAuth()) return;
    if (!promoCode.trim()) return;

    startTransition(async () => {
      try {
        setPromoMessage("กำลังประมวลผล...");
        const res = await redeemPromoCode(token!, { code: promoCode });
        setPromoMessage(res.message);
        setPromoCode("");
        await refreshWallet();
      } catch (error) {
        setPromoMessage(error instanceof Error ? error.message : "โค้ดยอดไม่ถูกต้องหรืออัปเดตไม่สำเร็จ");
      }
    });
  }

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
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">ยอดคงเหลือ</span>
              <div className="flex items-center gap-2">
                <img src="/coin_logo.png" alt="Coin" className="w-7 h-7 object-contain" />
                <span className="font-mono text-2xl font-bold text-[#f7b940] drop-shadow-sm">{wallet?.gold?.toLocaleString() ?? 0}</span>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Gold</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            {/* Step 1: Payment Method */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-brand)] font-bold text-white">1</div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">เลือกช่องทางการชำระเงิน</h2>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:max-w-2xl">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("promptpay")}
                  className={`flex items-center gap-4 rounded-2xl border-2 p-5 transition-all ${paymentMethod === "promptpay"
                      ? "border-[var(--color-brand)] bg-[var(--color-brand)]/5 shadow-md"
                      : "border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[#86d7b2] opacity-70 hover:opacity-100"
                    }`}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white p-2 shadow-sm">
                    <img src="/Thai_QR_Logo.svg" alt="PromptPay" className="h-full w-full object-contain" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-slate-900 dark:text-slate-100">พร้อมเพย์ (PromptPay)</p>
                    {/* <p className="text-xs text-emerald-600 font-medium">เรตสูงสุด 1:1</p> */}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("credit")}
                  className={`flex items-center gap-4 rounded-2xl border-2 p-5 transition-all ${paymentMethod === "credit"
                      ? "border-[var(--color-brand)] bg-[var(--color-brand)]/5 shadow-md"
                      : "border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[#86d7b2] opacity-70 hover:opacity-100"
                    }`}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white p-1 shadow-sm">
                    <img src="/visa_mastercard_logo.png" alt="Credit Card" className="h-full w-full object-contain" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-slate-900 dark:text-slate-100">บัตรเครดิต / เดบิต</p>
                    {/* <p className="text-xs text-amber-600 font-medium">เรต 1:0.95</p> */}
                  </div>
                </button>
              </div>
            </div>

            {paymentMethod && (
              <div className="grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 lg:grid-cols-[1.5fr_1fr] lg:gap-8 xl:gap-10">
                {/* Step 2: Package Selection */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-brand)] font-bold text-white">2</div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">เลือกแพ็กเกจสุดคุ้ม</h2>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
                    {packages.map((pkg) => (
                      <button
                        type="button"
                        key={pkg.id}
                        onClick={() => setSelectedPackage(pkg.id)}
                        className={`group relative flex flex-col overflow-hidden rounded-2xl border-2 bg-[var(--color-surface)] p-4 text-left transition-all hover:-translate-y-1 ${selectedPackage === pkg.id
                            ? "border-[var(--color-brand)] shadow-[0_12px_30px_rgba(66,185,131,0.2)]"
                            : "border-[var(--color-border)] hover:border-[#86d7b2] hover:shadow-md"
                          }`}
                      >
                        {pkg.tag && (
                          <div className={`absolute right-0 top-0 rounded-bl-xl px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white ${pkg.tag === "POPULAR" ? "bg-rose-500" : "bg-[var(--color-brand)]"
                            }`}>
                            {pkg.tag}
                          </div>
                        )}

                        <div className="flex items-center gap-1.5">
                          <img src="/coin_logo.png" alt="Coin" className="h-6 w-6 object-contain" />
                          <span className={`text-xl font-bold tracking-tight ${selectedPackage === pkg.id ? 'text-[var(--color-brand)]' : 'text-slate-800 dark:text-slate-100'}`}>
                            {Math.floor(pkg.price * goldRate)} Gold
                          </span>
                        </div>

                        {/* <p className="mt-1 text-xs font-medium text-[var(--color-muted)]">
                          {(paymentMethod === "promptpay" ? "เรต 1:1" : "เรต 1:0.95")}
                        </p> */}

                        <div className="mt-auto pt-4">
                          <div className={`flex w-full items-center justify-center rounded-xl py-2 text-sm font-semibold transition-colors ${selectedPackage === pkg.id
                              ? "bg-[var(--color-brand)] text-white"
                              : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                            }`}>
                            ฿ {pkg.price}
                          </div>
                        </div>
                      </button>
                    ))}

                    {/* Custom Amount */}
                    <button
                      type="button"
                      onClick={() => setSelectedPackage("custom")}
                      className={`group relative flex flex-col overflow-hidden rounded-2xl border-2 bg-[var(--color-surface)] p-4 text-left transition-all hover:-translate-y-1 ${selectedPackage === "custom"
                          ? "border-[var(--color-brand)] shadow-[0_12px_30px_rgba(66,185,131,0.2)]"
                          : "border-[var(--color-border)] border-dashed hover:border-[#86d7b2] hover:shadow-md"
                        }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="text-2xl">✏️</span>
                        <span className={`text-sm font-bold tracking-tight ${selectedPackage === "custom" ? 'text-[var(--color-brand)]' : 'text-slate-800 dark:text-slate-100'}`}>
                          กำหนดเอง
                        </span>
                      </div>

                      {selectedPackage === "custom" ? (
                        <div className="mt-2">
                          <input
                            type="number"
                            value={customAmount}
                            onChange={(e) => setCustomAmount(e.target.value)}
                            placeholder="ระบุจำนวนเงิน..."
                            className="w-full bg-transparent border-b border-[var(--color-brand)] text-sm outline-none font-bold py-1"
                            autoFocus
                          />
                        </div>
                      ) : (
                        <p className="mt-1 text-xs font-medium text-[var(--color-muted)]">ระบุจำนวนเงินเอง</p>
                      )}

                      <div className="mt-auto pt-4">
                        <div className={`flex w-full items-center justify-center rounded-xl py-2 text-sm font-semibold transition-colors ${selectedPackage === "custom"
                            ? "bg-[var(--color-brand)] text-white"
                            : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                          }`}>
                          {selectedPackage === "custom" && customAmount ? `฿ ${customAmount}` : "ระบุเอง"}
                        </div>
                      </div>
                    </button>
                  </div>

                  {/* Promo Code Section moved here to be part of selections */}
                  <div className="mt-6 rounded-[1.5rem] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm sm:p-6">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">มีโค้ดส่วนลดไหม?</h3>
                    <form onSubmit={handleRedeemPromo} className="mt-4 flex flex-col gap-3 sm:flex-row">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="กรอกโค้ดที่นี่..."
                        className="w-full rounded-xl border border-[var(--color-border)] px-4 py-3 text-sm outline-none transition focus:border-[var(--color-brand)] dark:bg-slate-900"
                        disabled={isPending}
                      />
                      <button
                        type="submit"
                        disabled={isPending || !promoCode.trim()}
                        className="shrink-0 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
                      >
                        ใช้สิทธิ์
                      </button>
                    </form>
                    {promoMessage && (
                      <p className={`mt-3 text-sm font-semibold ${promoMessage.includes("สำเร็จ") ? "text-emerald-500" : "text-rose-500"}`}>
                        {promoMessage}
                      </p>
                    )}
                  </div>
                </div>

                {/* Summary Section */}
                <div className="flex flex-col gap-4">
                  <div className="sticky top-6 rounded-[1.5rem] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm sm:p-6 lg:p-7">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">สรุปคำสั่งซื้อ</h3>

                    <div className="mt-5 space-y-3 border-y border-[var(--color-border)] py-5 text-sm">
                      <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <img src="/coin_logo.png" alt="Coin" className="h-4 w-4 object-contain" />
                          <span>เหรียญทองที่จะได้รับ (Gold)</span>
                        </div>
                        <span className="font-bold text-slate-900 dark:text-slate-100">
                          {selectedPackage ? `${currentGold.toLocaleString()} Gold` : "-"}
                        </span>
                      </div>
                      {/* <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                        <span>เรตปัจจุบัน</span>
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          {paymentMethod === "promptpay" ? "1:1 (สูงสุด)" : "1:0.95"}
                        </span>
                      </div> */}
                    </div>

                    <div className="mt-5 flex items-end justify-between">
                      <span className="text-base font-semibold text-slate-900 dark:text-slate-100">ยอดชำระสุทธิ</span>
                      <div className="text-right">
                        <span className="text-3xl font-bold tracking-tight text-[var(--color-brand)]">฿ {currentPrice.toLocaleString()}</span>
                        <p className="mt-1 text-[11px] text-[var(--color-muted)]">รวมภาษีมูลค่าเพิ่มแล้ว</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleCheckout}
                      disabled={isPending || !selectedPackage || currentPrice < 20}
                      className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-brand)] py-4 text-base font-bold text-white shadow-[0_8px_20px_rgba(66,185,131,0.35)] transition-all hover:-translate-y-1 hover:bg-[#3ba273] hover:shadow-[0_12px_24px_rgba(66,185,131,0.45)] active:translate-y-0 active:shadow-none disabled:opacity-50 disabled:hover:translate-y-0"
                    >
                      {isPending ? "กำลังทำรายการ..." : `ชำระเงิน ${currentPrice.toLocaleString()} บาท`}
                    </button>

                    <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[var(--color-muted)]">
                      <span>🔒 Secured Checkout by Omise</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {qrCodeUrl && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm overflow-hidden rounded-[2rem] bg-white text-center shadow-2xl dark:bg-slate-900">
            <div className="bg-[#113566] p-6 text-white">
              <h2 className="text-xl font-bold">สแกนเพื่อชำระเงิน</h2>
              <p className="mt-1 text-sm opacity-80">พร้อมเพย์ (PromptPay)</p>
            </div>
            <div className="flex justify-center bg-white p-8">
              <img src={qrCodeUrl} alt="QR Code PromptPay" className="h-64 w-64 object-contain sm:h-72 sm:w-72" />
            </div>
            <div className="p-6 pt-0">
              <div className="mb-6 flex flex-col items-center justify-center rounded-xl bg-slate-50 py-3 dark:bg-slate-800/50">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">หมดอายุใน</span>
                <span className={`font-mono text-2xl font-bold ${timeLeft < 60 ? 'text-rose-500 animate-pulse' : 'text-slate-700 dark:text-slate-200'}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
              <p className="text-[13px] text-slate-500">
                เมื่อสแกนชำระเงินเรียบร้อยแล้ว ระบบจะทำการเติมเหรียญให้อัตโนมัติในไม่กี่วินาที
              </p>
              <button
                type="button"
                onClick={() => {
                  setQrCodeUrl(null);
                  setCurrentChargeId(null);
                  refreshWallet();
                }}
                className="mt-6 w-full rounded-xl bg-slate-100 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                ปิดหน้าต่างนี้
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
