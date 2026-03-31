import { apiFetch } from "@/lib/api/client";
import type { AuthPayload } from "@/lib/types/api";

type Credentials = {
  email: string;
  password: string;
};

type RegisterPayload = Credentials & {
  username: string;
};

export function loginWithCredentials(payload: Credentials) {
  return apiFetch<AuthPayload>("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export function registerWithCredentials(payload: RegisterPayload) {
  return apiFetch<AuthPayload>("/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}
