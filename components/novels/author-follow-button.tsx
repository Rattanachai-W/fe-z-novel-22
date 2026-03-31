"use client";

import { useEffect, useState, useTransition } from "react";
import { useApp } from "@/components/providers/app-provider";
import { getAuthorFollowStatus, toggleAuthorFollow } from "@/lib/api/novels";

type AuthorFollowButtonProps = {
  authorId: string;
  authorName: string;
};

export function AuthorFollowButton({
  authorId,
  authorName,
}: AuthorFollowButtonProps) {
  const { token, requireAuth } = useApp();
  const [followed, setFollowed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!token) {
      setLoaded(true);
      setFollowed(false);
      return;
    }

    let cancelled = false;

    void getAuthorFollowStatus(token, authorId)
      .then((response) => {
        if (!cancelled) {
          setFollowed(response.followed);
          setLoaded(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLoaded(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [authorId, token]);

  return (
    <button
      type="button"
      onClick={() => {
        if (!token && !requireAuth("login")) {
          return;
        }

        if (!token) {
          return;
        }

        startTransition(async () => {
          try {
            const response = await toggleAuthorFollow(token, authorId);
            setFollowed(response.followed);
          } catch {
            setFollowed((current) => !current);
          }
        });
      }}
      className="rounded-full border border-[var(--color-border)] px-5 py-3 text-sm font-semibold"
    >
      {isPending
        ? "กำลังอัปเดต..."
        : loaded && followed
          ? `ติดตาม ${authorName} แล้ว`
          : `ติดตาม ${authorName}`}
    </button>
  );
}
