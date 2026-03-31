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
