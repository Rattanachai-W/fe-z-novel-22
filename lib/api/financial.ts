import { apiFetch } from "@/lib/api/client";
import { mockWallet } from "@/lib/data/mock";
import type { Wallet } from "@/lib/types/api";

export function getWallet(token: string) {
  return apiFetch<Wallet>("/financial/wallet", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    fallbackData: mockWallet,
  });
}

export interface TopupResponse {
  message: string;
  chargeId?: string;
  status: string;
  authorize_uri?: string;
  qr_code?: string;
  transaction?: any;
}

// API ใหม่ตาม `API-SPACE.md`: POST /financial/topup
export function topupWallet(token: string, payload: { amount_thb: number; payment_method: string }) {
  return apiFetch<TopupResponse>("/financial/topup", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

// API ใหม่: GET /financial/topup/status/:chargeId
export function checkTopupStatus(token: string, chargeId: string) {
  return apiFetch<{ status: string; coins_added?: number }>(`/financial/topup/status/${chargeId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// API ใหม่ตาม `API-SPACE.md`: POST /financial/promo/redeem
export function redeemPromoCode(token: string, payload: { code: string }) {
  return apiFetch<{ message: string }>("/financial/promo/redeem", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    fallbackData: { message: "ใช้โค้ดส่วนลดสำเร็จ" },
  });
}

// API ใหม่ตาม `API-SPACE.md`: POST /financial/writer/withdraw
export function createWriterWithdrawal(token: string, payload: { goldAmount: number }) {
  return apiFetch<{ message: string }>("/financial/writer/withdraw", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    fallbackData: { message: "สร้างคำขอถอนเงินสำเร็จ" },
  });
}

// API ใหม่ตาม `API-SPACE.md`: GET /financial/writer/wallet
export function getWriterWallet(token: string) {
  return apiFetch<any>("/financial/writer/wallet", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    fallbackData: { balance: 0 },
  });
}

// API ใหม่ตาม `API-SPACE.md`: GET /financial/writer/earnings
export function getWriterEarnings(token: string) {
  return apiFetch<any[]>("/financial/writer/earnings", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    fallbackData: [],
  });
}
