"use client";

import {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useEffectEvent,
  useState,
} from "react";
import { loginWithCredentials, registerWithCredentials } from "@/lib/api/auth";
import { unlockChapter } from "@/lib/api/chapters";
import { getWallet } from "@/lib/api/financial";
import { toggleBookmark as toggleBookmarkRequest, getBookmarks } from "@/lib/api/user-library";
import type { UserBase, Wallet } from "@/lib/types/api";

type AuthMode = "login" | "register";

type ThemeMode = "light" | "dark";

type AppContextValue = {
  authModalOpen: boolean;
  authMode: AuthMode;
  authPending: boolean;
  authError: string | null;
  user: UserBase | null;
  token: string | null;
  wallet: Wallet | null;
  walletPending: boolean;
  bookmarks: string[];
  globalMessage: string | null;
  theme: ThemeMode;
  toggleTheme: () => void;
  openAuthModal: (mode?: AuthMode) => void;
  closeAuthModal: () => void;
  login: (payload: { email: string; password: string }) => Promise<boolean>;
  register: (payload: {
    username: string;
    email: string;
    password: string;
  }) => Promise<boolean>;
  loginWithFacebook: () => void;
  logout: () => void;
  requireAuth: (mode?: AuthMode) => boolean;
  isBookmarked: (novelId: string) => boolean;
  toggleBookmark: (novelId: string) => Promise<boolean | null>;
  refreshWallet: () => Promise<void>;
  refreshBookmarks: () => Promise<string[]>;
  unlockChapter: (chapterId: string) => Promise<boolean>;
};

const AppContext = createContext<AppContextValue | null>(null);

const STORAGE_KEYS = {
  token: "dino_token",
  user: "dino_user",
  theme: "dino_theme",
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [authPending, setAuthPending] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [user, setUser] = useState<UserBase | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [walletPending, setWalletPending] = useState(false);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [globalMessage, setGlobalMessage] = useState<string | null>(null);
  const [theme, setTheme] = useState<ThemeMode>("light");

  const syncSession = useEffectEvent(async (sessionToken: string, nextUser: UserBase) => {
    persistSession(sessionToken, nextUser);
    setToken(sessionToken);
    setUser(nextUser);
    setAuthError(null);
    setAuthModalOpen(false);
    setGlobalMessage(`ยินดีต้อนรับ ${nextUser.username}`);

    await Promise.all([refreshWalletInternal(sessionToken), refreshBookmarksInternal(sessionToken)]);
  });

  useEffect(() => {
    const storedToken = window.localStorage.getItem(STORAGE_KEYS.token);
    const rawUser = window.localStorage.getItem(STORAGE_KEYS.user);
    const storedTheme = window.localStorage.getItem(STORAGE_KEYS.theme) as ThemeMode | null;

    const nextTheme: ThemeMode =
      storedTheme === "light" || storedTheme === "dark"
        ? storedTheme
        : window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";

    setTheme(nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    document.documentElement.classList.toggle("light", nextTheme === "light");

    if (!storedToken || !rawUser) {
      return;
    }

    try {
      const parsedUser = JSON.parse(rawUser) as UserBase;
      setToken(storedToken);
      setUser(parsedUser);
      startTransition(() => {
        void refreshWalletInternal(storedToken);
        void refreshBookmarksInternal(storedToken);
      });
    } catch {
      clearSession();
    }
  }, []);

  useEffect(() => {
    if (!globalMessage) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setGlobalMessage(null);
    }, 3600);

    return () => window.clearTimeout(timeout);
  }, [globalMessage]);

  async function login(payload: { email: string; password: string }) {
    setAuthPending(true);
    setAuthError(null);

    try {
      const response = await loginWithCredentials(payload);
      await syncSession(response.token, response.user);
      return true;
    } catch (error) {
      setAuthError(getErrorMessage(error, "ล็อกอินไม่สำเร็จ"));
      return false;
    } finally {
      setAuthPending(false);
    }
  }

  async function register(payload: {
    username: string;
    email: string;
    password: string;
  }) {
    setAuthPending(true);
    setAuthError(null);

    try {
      const response = await registerWithCredentials(payload);
      await syncSession(response.token, response.user);
      return true;
    } catch (error) {
      setAuthError(getErrorMessage(error, "สมัครสมาชิกไม่สำเร็จ"));
      return false;
    } finally {
      setAuthPending(false);
    }
  }

  function loginWithFacebookEntry() {
    const facebookUrl =
      process.env.NEXT_PUBLIC_FACEBOOK_LOGIN_URL || "http://localhost:3000/api/auth/facebook";

    window.location.href = facebookUrl;
  }

  function logout() {
    clearSession();
    setAuthModalOpen(false);
    setAuthError(null);
    setWallet(null);
    setBookmarks([]);
    setGlobalMessage("ออกจากระบบแล้ว");
  }

  function openAuthModal(mode: AuthMode = "login") {
    setAuthMode(mode);
    setAuthError(null);
    setAuthModalOpen(true);
  }

  function closeAuthModal() {
    setAuthModalOpen(false);
    setAuthError(null);
  }

  function requireAuth(mode: AuthMode = "login") {
    if (token) {
      return true;
    }

    openAuthModal(mode);
    return false;
  }

  function isBookmarked(novelId: string) {
    return bookmarks.includes(novelId);
  }

  async function toggleBookmark(novelId: string) {
    if (!token) {
      openAuthModal("login");
      return null;
    }

    try {
      const response = await toggleBookmarkRequest(token, novelId);
      setBookmarks((current) =>
        response.bookmarked
          ? Array.from(new Set([...current, novelId]))
          : current.filter((item) => item !== novelId),
      );
      setGlobalMessage(response.message);
      return response.bookmarked;
    } catch (error) {
      const nextBookmarked = !bookmarks.includes(novelId);
      setBookmarks((current) =>
        nextBookmarked
          ? Array.from(new Set([...current, novelId]))
          : current.filter((item) => item !== novelId),
      );
      setGlobalMessage(
        `${getErrorMessage(error, "เชื่อม API ไม่สำเร็จ")} จึงอัปเดตเฉพาะฝั่งเครื่องชั่วคราว`,
      );
      return nextBookmarked;
    }
  }

  async function refreshWallet() {
    if (!token) {
      return;
    }

    await refreshWalletInternal(token);
  }

  async function refreshBookmarks() {
    if (!token) {
      return [];
    }

    return refreshBookmarksInternal(token);
  }

  async function unlockChapterForUser(chapterId: string) {
    if (!token) {
      openAuthModal("login");
      return false;
    }

    try {
      const response = await unlockChapter(token, chapterId);
      setGlobalMessage(response.message);
      await refreshWalletInternal(token);
      return true;
    } catch (error) {
      setGlobalMessage(getErrorMessage(error, "ปลดล็อกตอนไม่สำเร็จ"));
      return false;
    }
  }

  async function refreshWalletInternal(sessionToken: string) {
    setWalletPending(true);

    try {
      const nextWallet = await getWallet(sessionToken);
      setWallet(nextWallet);
    } catch (error) {
      setGlobalMessage(getErrorMessage(error, "โหลดกระเป๋าเงินไม่สำเร็จ"));
    } finally {
      setWalletPending(false);
    }
  }

  async function refreshBookmarksInternal(sessionToken: string) {
    try {
      const ids = await getBookmarks(sessionToken);
      setBookmarks(ids);
      return ids;
    } catch (error) {
      setGlobalMessage(getErrorMessage(error, "โหลดชั้นหนังสือไม่สำเร็จ"));
      return [];
    }
  }

  function persistSession(sessionToken: string, nextUser: UserBase) {
    window.localStorage.setItem(STORAGE_KEYS.token, sessionToken);
    window.localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(nextUser));
  }

  function clearSession() {
    window.localStorage.removeItem(STORAGE_KEYS.token);
    window.localStorage.removeItem(STORAGE_KEYS.user);
    setToken(null);
    setUser(null);
  }

  function toggleTheme() {
    const nextTheme: ThemeMode = theme === "dark" ? "light" : "dark";
    window.localStorage.setItem(STORAGE_KEYS.theme, nextTheme);
    setTheme(nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    document.documentElement.classList.toggle("light", nextTheme === "light");
  }

  const value: AppContextValue = {
    authModalOpen,
    authMode,
    authPending,
    authError,
    user,
    token,
    wallet,
    walletPending,
    bookmarks,
    globalMessage,
    theme,
    toggleTheme,
    openAuthModal,
    closeAuthModal,
    login,
    register,
    loginWithFacebook: loginWithFacebookEntry,
    logout,
    requireAuth,
    isBookmarked,
    toggleBookmark,
    refreshWallet,
    refreshBookmarks,
    unlockChapter: unlockChapterForUser,
  };

  return <AppContext value={value}>{children}</AppContext>;
}

export function useApp() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }

  return context;
}

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}
